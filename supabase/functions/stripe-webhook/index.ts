import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Checkout session completed:', session.id);

        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.error('No userId in session metadata');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const { error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            status: subscription.status,
            plan_id: subscription.items.data[0].price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          });

        if (subError) {
          console.error('Error upserting subscription:', subError);
        }

        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            subscription_tier: getPlanTier(subscription.items.data[0].price.id),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription updated:', subscription.id);

        const { data: existingSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (existingSub) {
          const { error } = await supabase
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              plan_id: subscription.items.data[0].price.id,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (error) {
            console.error('Error updating subscription:', error);
          }

          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: subscription.status === 'active'
                ? getPlanTier(subscription.items.data[0].price.id)
                : 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.user_id);

          if (profileError) {
            console.error('Error updating profile tier:', profileError);
          }
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription deleted:', subscription.id);

        const { data: existingSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (existingSub) {
          const { error } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (error) {
            console.error('Error updating canceled subscription:', error);
          }

          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSub.user_id);

          if (profileError) {
            console.error('Error updating profile to free:', profileError);
          }
        }

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('Invoice paid:', invoice.id);

        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', invoice.subscription as string)
          .single();

        if (subscription) {
          const { error } = await supabase
            .from('payment_transactions')
            .insert({
              user_id: subscription.user_id,
              stripe_invoice_id: invoice.id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'succeeded',
              payment_method: 'card',
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error inserting payment transaction:', error);
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('Invoice payment failed:', invoice.id);

        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', invoice.subscription as string)
          .single();

        if (subscription) {
          const { error } = await supabase
            .from('payment_transactions')
            .insert({
              user_id: subscription.user_id,
              stripe_invoice_id: invoice.id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_due / 100,
              currency: invoice.currency,
              status: 'failed',
              payment_method: 'card',
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error inserting failed payment:', error);
          }
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent failed:', paymentIntent.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true, event: event.type }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getPlanTier(priceId: string): string {
  if (priceId.includes('daily') || priceId === Deno.env.get('VITE_STRIPE_PRICE_DAILY')) {
    return 'daily';
  } else if (priceId.includes('core') || priceId === Deno.env.get('VITE_STRIPE_PRICE_CORE')) {
    return 'core';
  } else if (priceId.includes('max') || priceId === Deno.env.get('VITE_STRIPE_PRICE_MAX')) {
    return 'max';
  }
  return 'free';
}
