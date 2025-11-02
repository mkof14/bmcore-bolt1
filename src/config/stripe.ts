import { loadStripeConfigFromDB } from '../lib/stripeConfigService';

// Default config (fallback)
export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  currency: import.meta.env.VITE_STRIPE_CURRENCY || 'usd',

  prices: {
    core: {
      monthly: {
        priceId: 'price_core_monthly_default',
        amount: 19,
        interval: 'month',
      },
      yearly: {
        priceId: 'price_core_yearly_default',
        amount: 190,
        interval: 'year',
        savings: 38,
        discount: '17%'
      },
      name: 'Core Plan',
      description: 'Essential health analytics for individuals',
      features: [
        'Basic health dashboard',
        '3 service categories access',
        '10 GB Model Archive storage',
        'Monthly health reports',
        'Email support',
        'Data encryption',
        'Device connectivity (up to 2 devices)'
      ],
      limits: {
        aiQueries: 50,
        devices: 2,
        reports: 4
      }
    },
    daily: {
      monthly: {
        priceId: 'price_daily_monthly_default',
        amount: 39,
        interval: 'month',
      },
      yearly: {
        priceId: 'price_daily_yearly_default',
        amount: 390,
        interval: 'year',
        savings: 78,
        discount: '17%'
      },
      name: 'Daily Plan',
      description: 'Daily insights and comprehensive tracking',
      popular: true,
      features: [
        'Everything in Core',
        '10 Categories',
        '50 GB Model Archive storage',
        'Daily health reports',
        'AI Assistant access',
        'Priority email support',
        'Device connectivity (up to 5 devices)',
        'Lab results integration',
        'Genetic data analysis'
      ],
      limits: {
        aiQueries: -1,
        devices: 5,
        reports: 12
      }
    },
    max: {
      monthly: {
        priceId: 'price_max_monthly_default',
        amount: 79,
        interval: 'month',
      },
      yearly: {
        priceId: 'price_max_yearly_default',
        amount: 790,
        interval: 'year',
        savings: 158,
        discount: '17%'
      },
      name: 'Max Plan',
      description: 'Complete health intelligence platform',
      features: [
        'Everything in Daily',
        'All 20 service categories',
        '200 GB Model Archive storage',
        'Real-time AI insights',
        '24/7 priority support',
        'Unlimited device connectivity',
        'Advanced predictive analytics',
        'Custom report generation',
        'Family accounts (up to 5 members)',
        'API access for developers'
      ],
      limits: {
        aiQueries: -1,
        devices: -1,
        reports: -1
      }
    }
  },

  successUrl: import.meta.env.VITE_STRIPE_SUCCESS_URL || `${window.location.origin}/member-zone?payment=success`,
  cancelUrl: import.meta.env.VITE_STRIPE_CANCEL_URL || `${window.location.origin}/pricing?payment=cancelled`,
};

export type PlanId = 'daily' | 'core' | 'max';
export type BillingInterval = 'monthly' | 'yearly';

export interface PricingPeriod {
  priceId: string;
  amount: number;
  interval: string;
  savings?: number;
  discount?: string;
}

export interface StripePlan {
  monthly: PricingPeriod;
  yearly: PricingPeriod;
  name: string;
  description: string;
  popular?: boolean;
  features: string[];
  limits: {
    aiQueries: number;
    devices: number;
    reports: number;
  };
}

export function validateStripeConfig(): boolean {
  if (!stripeConfig.publishableKey) {
    console.error('Stripe publishable key not configured');
    return false;
  }

  if (!stripeConfig.publishableKey.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format');
    return false;
  }

  return true;
}

export function getPlan(planId: PlanId): StripePlan | undefined {
  return stripeConfig.prices[planId];
}

export function getAllPlans(): StripePlan[] {
  return Object.values(stripeConfig.prices);
}

export function getPriceId(planId: PlanId, interval: BillingInterval): string {
  const plan = stripeConfig.prices[planId];
  return plan[interval].priceId;
}

export function getPrice(planId: PlanId, interval: BillingInterval): PricingPeriod {
  const plan = stripeConfig.prices[planId];
  return plan[interval];
}

export function formatPrice(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getMonthlyEquivalent(amount: number): number {
  return Math.round(amount / 12);
}

export function calculateSavings(planId: PlanId): number {
  const plan = stripeConfig.prices[planId];
  const monthlyTotal = plan.monthly.amount * 12;
  const yearlyPrice = plan.yearly.amount;
  return monthlyTotal - yearlyPrice;
}

export function calculateDiscountPercent(planId: PlanId): number {
  const savings = calculateSavings(planId);
  const monthlyTotal = stripeConfig.prices[planId].monthly.amount * 12;
  return Math.round((savings / monthlyTotal) * 100);
}

export function isStripeEnabled(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

/**
 * Load Stripe configuration from database (Admin Panel)
 * Updates stripeConfig with values from DB
 */
export async function loadStripeConfigFromDatabase() {
  try {
    const dbConfig = await loadStripeConfigFromDB();

    console.log('[Stripe] Loading config from database:', {
      hasPublishableKey: !!dbConfig.publishable_key,
      hasPrices: !!dbConfig.price_core_monthly,
      currency: dbConfig.currency
    });

    // Update publishable key
    if (dbConfig.publishable_key) {
      stripeConfig.publishableKey = dbConfig.publishable_key;
    }

    // Update currency
    if (dbConfig.currency) {
      stripeConfig.currency = dbConfig.currency;
    }

    // Update price IDs
    if (dbConfig.price_daily_monthly) {
      stripeConfig.prices.daily.monthly.priceId = dbConfig.price_daily_monthly;
    }
    if (dbConfig.price_daily_yearly) {
      stripeConfig.prices.daily.yearly.priceId = dbConfig.price_daily_yearly;
    }
    if (dbConfig.price_core_monthly) {
      stripeConfig.prices.core.monthly.priceId = dbConfig.price_core_monthly;
    }
    if (dbConfig.price_core_yearly) {
      stripeConfig.prices.core.yearly.priceId = dbConfig.price_core_yearly;
    }
    if (dbConfig.price_max_monthly) {
      stripeConfig.prices.max.monthly.priceId = dbConfig.price_max_monthly;
    }
    if (dbConfig.price_max_yearly) {
      stripeConfig.prices.max.yearly.priceId = dbConfig.price_max_yearly;
    }

    // Update URLs
    if (dbConfig.success_url) {
      stripeConfig.successUrl = dbConfig.success_url;
    }
    if (dbConfig.cancel_url) {
      stripeConfig.cancelUrl = dbConfig.cancel_url;
    }

    console.log('[Stripe] Config loaded successfully from database');
    return true;
  } catch (error) {
    console.error('[Stripe] Failed to load config from database:', error);
    console.log('[Stripe] Using .env fallback');
    return false;
  }
}
