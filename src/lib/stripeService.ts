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
      cancelUrl: stripeConfig.cancelUrl,
      currentOrigin: window.location.origin,
      currentHref: window.location.href
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    console.log('[Stripe Service] Calling edge function...');

    const response = await supabase.functions.invoke('create-checkout-session', {
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

    console.log('[Stripe Service] Raw response:', response);
    console.log('[Stripe Service] Response data:', response.data);
    console.log('[Stripe Service] Response error:', response.error);

    const { data, error } = response;

    if (error) {
      console.error('[Stripe Service] Edge function ERROR:', {
        message: error.message,
        status: error.status,
        name: error.name,
        context: error.context,
        fullError: JSON.stringify(error, null, 2)
      });

      // Try to read response body from context
      let errorDetails = '';
      try {
        if (error.context && error.context instanceof Response) {
          const responseClone = error.context.clone();
          const errorText = await responseClone.text();
          console.error('[Stripe Service] Response body:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.error || errorJson.message || errorText;
            console.error('[Stripe Service] Parsed error:', errorJson);
          } catch {
            errorDetails = errorText;
          }
        }
      } catch (e) {
        console.error('[Stripe Service] Failed to read response body:', e);
      }

      // Check if data contains error details
      if (data) {
        console.error('[Stripe Service] Error data from function:', data);
        throw new Error(`Edge Function Error: ${data.error || errorDetails || error.message || 'Unknown error'}`);
      }

      throw new Error(`Edge Function Error: ${errorDetails || error.message || 'Unknown error'}`);
    }

    if (!data) {
      console.error('[Stripe Service] NO DATA returned from Edge Function');
      throw new Error('No data returned from Edge Function');
    }

    console.log('[Stripe Service] Checking response data structure...');
    console.log('[Stripe Service] Data keys:', Object.keys(data));
    console.log('[Stripe Service] Has sessionId?', 'sessionId' in data);
    console.log('[Stripe Service] Has url?', 'url' in data);
    console.log('[Stripe Service] Has error?', 'error' in data);

    // Check if response contains error message
    if (data.error) {
      console.error('[Stripe Service] Error in response data:', data);
      throw new Error(`Edge Function Error: ${data.error}`);
    }

    if (!data.sessionId && !data.url) {
      console.error('[Stripe Service] Invalid response structure:', data);
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
    console.log('[Stripe] Session created:', {
      sessionId,
      url,
      sessionIdType: typeof sessionId,
      urlType: typeof url,
      urlLength: url?.length,
      urlValid: url && url.startsWith('https://')
    });

    console.log('[Stripe] URL value:', url);
    console.log('[Stripe] URL check - truthy?', !!url);
    console.log('[Stripe] URL check - not empty?', url && url.length > 0);

    if (url && url.length > 0) {
      console.log('[Stripe] ✅ URL IS VALID - Starting redirect to:', url);
      console.log('[Stripe] URL first 100 chars:', url.substring(0, 100));
      console.log('[Stripe] Document ready state:', document.readyState);
      console.log('[Stripe] Window location before:', window.location.href);

      // CRITICAL: Use top.location for iframe compatibility
      // This ensures we redirect the entire page, not just the iframe
      console.log('[Stripe] Using top.location.href for redirect...');
      try {
        (window.top || window).location.href = url;
        console.log('[Stripe] Redirect initiated successfully');
      } catch (e) {
        console.error('[Stripe] Direct redirect failed:', e);

        // Fallback: Try with a delay
        setTimeout(() => {
          console.log('[Stripe] Fallback: Attempting window.location.replace');
          window.location.replace(url);
        }, 100);
      }

      // Wait indefinitely to prevent any code execution
      return new Promise(() => {});
    } else {
      console.error('[Stripe] ❌ URL IS INVALID OR EMPTY:', { url, type: typeof url });
    }

    // Fallback if no URL
    console.log('[Stripe] No URL, using redirectToCheckout with sessionId:', sessionId);
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
