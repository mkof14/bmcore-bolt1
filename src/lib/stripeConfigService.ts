import { supabase } from './supabase';

interface StripeConfigFromDB {
  publishable_key?: string;
  secret_key?: string;
  webhook_secret?: string;
  price_daily_monthly?: string;
  price_daily_yearly?: string;
  price_core_monthly?: string;
  price_core_yearly?: string;
  price_max_monthly?: string;
  price_max_yearly?: string;
  currency?: string;
  environment?: string;
  success_url?: string;
  cancel_url?: string;
}

let cachedConfig: StripeConfigFromDB | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load Stripe configuration from database (Admin Panel settings)
 * Falls back to .env if database is not configured
 */
export async function loadStripeConfigFromDB(): Promise<StripeConfigFromDB> {
  // Return cached config if still fresh
  const now = Date.now();
  if (cachedConfig && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedConfig;
  }

  try {
    // Fetch all configuration from stripe_config
    const { data: configs, error } = await supabase
      .from('stripe_config')
      .select('key, value');

    if (error) {
      console.error('[Stripe Config] Error loading from database:', error);
      return getFallbackConfig();
    }

    if (!configs || configs.length === 0) {
      console.warn('[Stripe Config] No configuration found in database, using .env fallback');
      return getFallbackConfig();
    }

    // Convert array to object
    const config: StripeConfigFromDB = {};
    configs.forEach(({ key, value }) => {
      config[key as keyof StripeConfigFromDB] = value;
    });

    console.log('[Stripe Config] Loaded from database:', {
      hasPublishableKey: !!config.publishable_key_live,
      hasPriceIds: !!config.price_core_monthly
    });

    // Cache the config
    cachedConfig = config;
    lastFetchTime = now;

    return config;
  } catch (error) {
    console.error('[Stripe Config] Failed to load from database:', error);
    return getFallbackConfig();
  }
}

/**
 * Fallback to .env configuration
 */
function getFallbackConfig(): StripeConfigFromDB {
  console.log('[Stripe Config] Using .env fallback');

  return {
    publishable_key: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    price_daily_monthly: import.meta.env.VITE_STRIPE_PRICE_DAILY_MONTHLY,
    price_daily_yearly: import.meta.env.VITE_STRIPE_PRICE_DAILY_YEARLY,
    price_core_monthly: import.meta.env.VITE_STRIPE_PRICE_CORE_MONTHLY,
    price_core_yearly: import.meta.env.VITE_STRIPE_PRICE_CORE_YEARLY,
    price_max_monthly: import.meta.env.VITE_STRIPE_PRICE_MAX_MONTHLY,
    price_max_yearly: import.meta.env.VITE_STRIPE_PRICE_MAX_YEARLY,
    currency: import.meta.env.VITE_STRIPE_CURRENCY || 'usd',
    success_url: import.meta.env.VITE_STRIPE_SUCCESS_URL,
    cancel_url: import.meta.env.VITE_STRIPE_CANCEL_URL,
  };
}

/**
 * Clear cached configuration (useful after Admin Panel updates)
 */
export function clearStripeConfigCache() {
  cachedConfig = null;
  lastFetchTime = 0;
  console.log('[Stripe Config] Cache cleared');
}

/**
 * Check if Stripe is properly configured (either in DB or .env)
 */
export async function isStripeConfigured(): Promise<boolean> {
  const config = await loadStripeConfigFromDB();
  return !!(
    config.publishable_key &&
    config.price_core_monthly &&
    config.price_daily_monthly &&
    config.price_max_monthly
  );
}
