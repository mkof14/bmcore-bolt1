import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

serve(async (req) => {
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

    let stripeSecretKey: string | undefined = undefined;

    try {
      console.log('[Stripe] Attempting to load config from database...');

      const { data: apiKeyConfig, error: apiError } = await supabaseAdmin
        .from('api_keys_configuration')
        .select('key_value')
        .eq('key_name', 'stripe_secret')
        .maybeSingle();

      if (!apiError && apiKeyConfig?.key_value && apiKeyConfig.key_value.startsWith('sk_')) {
        stripeSecretKey = apiKeyConfig.key_value;
        console.log('[Stripe] ✅ Using secret key from api_keys_configuration');
      } else {
        const { data: secretKeyConfig } = await supabaseAdmin
          .from('stripe_config')
          .select('value')
          .eq('key', 'secret_key_live')
          .maybeSingle();

        if (secretKeyConfig?.value && secretKeyConfig.value.startsWith('sk_')) {
          stripeSecretKey = secretKeyConfig.value;
          console.log('[Stripe] ✅ Using secret key from stripe_config');
        }
      }
    } catch (error) {
      console.warn('[Stripe] Exception loading from database:', error);
    }

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured. Please configure in Admin Panel.');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = supabaseAdmin;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No subscription found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${supabaseUrl}/member-zone`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error creating portal session:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
