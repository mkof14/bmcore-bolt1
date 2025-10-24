import { stripeConfig, validateStripeConfig, type PlanId, type BillingInterval } from '../config/stripe';
import { supabase } from './supabase';

let stripe: any = null;

export function initStripe() {
  if (!validateStripeConfig()) {
    throw new Error('Stripe configuration is invalid');
  }

  if (typeof window !== 'undefined' && (window as any).Stripe) {
    stripe = (window as any).Stripe(stripeConfig.publishableKey);
  } else {
    throw new Error('Stripe.js not loaded. Make sure Stripe script is included in index.html');
  }

  return stripe;
}

export function getStripe() {
  if (!stripe) {
    stripe = initStripe();
  }
  return stripe;
}

export async function createCheckoutSession(
  priceId: string,
  userId: string
): Promise<{ sessionId: string; url: string }> {
  try {
    console.log('[Stripe Service] Creating checkout session:', {
      priceId,
      userId,
      successUrl: stripeConfig.successUrl,
      cancelUrl: stripeConfig.cancelUrl
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    console.log('[Stripe Service] Calling edge function...');

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId,
        successUrl: stripeConfig.successUrl,
        cancelUrl: stripeConfig.cancelUrl
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    console.log('[Stripe Service] Edge function response:', { data, error });

    if (error) {
      console.error('[Stripe Service] Edge function error:', {
        message: error.message,
        status: error.status,
        details: error
      });
      throw new Error(`Edge Function Error: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('No data returned from Edge Function');
    }

    if (!data.sessionId && !data.url) {
      console.error('[Stripe Service] Invalid response from Edge Function:', data);
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }

    console.log('[Stripe Service] Checkout session created successfully:', {
      hasSessionId: !!data.sessionId,
      hasUrl: !!data.url
    });

    return {
      sessionId: data.sessionId,
      url: data.url
    };
  } catch (error: any) {
    console.error('[Stripe Service] Error creating checkout session:', {
      message: error.message,
      error: error
    });
    throw error;
  }
}

export async function redirectToCheckout(planId: PlanId, interval: BillingInterval = 'monthly') {
  try {
    console.log('[Stripe] Starting checkout:', { planId, interval });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('[Stripe] User authenticated:', user.id);

    const plan = stripeConfig.prices[planId];
    if (!plan) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    const priceId = plan[interval].priceId;
    console.log('[Stripe] Using price ID:', priceId);

    const stripe = getStripe();
    console.log('[Stripe] Creating checkout session...');

    const { sessionId, url } = await createCheckoutSession(priceId, user.id);
    console.log('[Stripe] Session created:', { sessionId, url });

    if (url) {
      // Direct redirect using URL (more reliable)
      console.log('[Stripe] Redirecting to:', url);
      window.location.href = url;
      return;
    }

    // Fallback to redirectToCheckout
    console.log('[Stripe] Using redirectToCheckout with sessionId:', sessionId);
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('[Stripe] Redirect error:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('[Stripe] Checkout error:', error);

    // More detailed error message
    if (error.message?.includes('Missing authorization')) {
      throw new Error('Authentication required. Please sign in and try again.');
    } else if (error.message?.includes('Missing required environment variables')) {
      throw new Error('Payment system not configured. Please contact support.');
    } else {
      throw new Error(error.message || 'Failed to start checkout. Please try again.');
    }
  }
}

export async function createPortalSession(): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) throw error;

    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export async function redirectToPortal() {
  try {
    const url = await createPortalSession();
    window.location.href = url;
  } catch (error) {
    console.error('Portal redirect error:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await getSubscriptionStatus(userId);

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    await redirectToPortal();

    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionStatus(userId);
  return subscription?.status === 'active';
}

export async function getSubscriptionTier(userId: string): Promise<string> {
  const subscription = await getSubscriptionStatus(userId);
  return subscription?.plan_id || 'free';
}

export function isSubscriptionActive(status: string | undefined): boolean {
  return status === 'active' || status === 'trialing';
}

export function isSubscriptionCanceled(status: string | undefined): boolean {
  return status === 'canceled' || status === 'unpaid';
}

export function getPlanFromPriceId(priceId: string): { planId: PlanId; interval: BillingInterval } | null {
  for (const [key, plan] of Object.entries(stripeConfig.prices)) {
    if (plan.monthly.priceId === priceId) {
      return { planId: key as PlanId, interval: 'monthly' };
    }
    if (plan.yearly.priceId === priceId) {
      return { planId: key as PlanId, interval: 'yearly' };
    }
  }
  return null;
}
