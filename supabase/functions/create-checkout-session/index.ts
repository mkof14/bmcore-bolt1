import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    let stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    try {
      console.log('[Stripe] Attempting to load config from database...');

      const { data: envConfig, error: envError } = await supabaseAdmin
        .from('stripe_configuration')
        .select('value')
        .eq('key', 'environment')
        .maybeSingle();

      if (envError) {
        console.warn('[Stripe] Error reading environment:', envError);
      }

      const environment = envConfig?.value || 'live';
      console.log('[Stripe] Environment:', environment);

      const secretKeyName = environment === 'live' ? 'secret_key_live' : 'secret_key_test';

      const { data: secretKeyConfig, error: secretError } = await supabaseAdmin
        .from('stripe_configuration')
        .select('value')
        .eq('key', secretKeyName)
        .eq('is_secret', true)
        .maybeSingle();

      if (secretError) {
        console.warn('[Stripe] Error reading secret key:', secretError);
      }

      if (secretKeyConfig?.value &&
          secretKeyConfig.value !== 'sk_test_YOUR_KEY_HERE' &&
          secretKeyConfig.value !== 'sk_live_YOUR_KEY_HERE') {
        stripeSecretKey = secretKeyConfig.value;
        console.log('[Stripe] ✅ Using secret key from database (Admin Panel)');
      } else {
        console.log('[Stripe] ⚠️ No valid secret key in database, using environment variable');
      }
    } catch (error) {
      console.warn('[Stripe] Exception loading from database, using env:', error);
    }

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured. Please configure in Admin Panel or set STRIPE_SECRET_KEY environment variable.');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('[Stripe] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Stripe] User authenticated:', user.id);

    const { priceId, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      console.error('[Stripe] Missing priceId');
      return new Response(
        JSON.stringify({ error: 'Missing priceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Stripe] Creating checkout for:', {
      priceId,
      userId: user.id,
      hasSuccessUrl: !!successUrl,
      hasCancelUrl: !!cancelUrl
    });

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .maybeSingle();

    console.log('[Stripe] User profile:', { hasEmail: !!profile?.email, hasName: !!profile?.full_name });

    let customerId: string | undefined;

    const { data: existingSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
      console.log('[Stripe] Using existing customer:', customerId);
    } else {
      console.log('[Stripe] Creating new customer...');
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      console.log('[Stripe] Customer created:', customerId);
    }

    console.log('[Stripe] Creating checkout session...');

    // Use provided URLs or construct proper fallback URLs
    const origin = successUrl
      ? new URL(successUrl).origin
      : (cancelUrl ? new URL(cancelUrl).origin : supabaseUrl);

    const finalSuccessUrl = successUrl || `${origin}/member-zone?payment=success`;
    const finalCancelUrl = cancelUrl || `${origin}/pricing?payment=cancelled`;

    console.log('[Stripe] Redirect URLs:', {
      success: finalSuccessUrl,
      cancel: finalCancelUrl
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    console.log('[Stripe] ✅ Session created successfully:', session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[Stripe] ❌ Error creating checkout session:', {
      message: err.message,
      type: err.type,
      code: err.code,
      stack: err.stack
    });

    return new Response(
      JSON.stringify({
        error: err.message || 'Failed to create checkout session',
        type: err.type,
        code: err.code
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
