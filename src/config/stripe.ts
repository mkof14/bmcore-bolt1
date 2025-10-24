export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  currency: import.meta.env.VITE_STRIPE_CURRENCY || 'usd',

  prices: {
    daily: {
      monthly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_DAILY_MONTHLY || 'price_1xxxxxxxxxx',
        amount: 39,
        interval: 'month',
      },
      yearly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_DAILY_YEARLY || 'price_1xxxxxxxxxx',
        amount: 390,
        interval: 'year',
        savings: 78,
        discount: '17%'
      },
      name: 'Daily Plan',
      description: 'Daily health insights and guidance',
      features: [
        'Daily health insights',
        'Basic analytics dashboard',
        'Email support',
        'Mobile app access',
        'Health trend tracking',
        'Weekly reports'
      ],
      limits: {
        aiQueries: 50,
        devices: 2,
        reports: 4
      }
    },
    core: {
      monthly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_CORE_MONTHLY || 'price_1xxxxxxxxxx',
        amount: 79,
        interval: 'month',
      },
      yearly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_CORE_YEARLY || 'price_1xxxxxxxxxx',
        amount: 790,
        interval: 'year',
        savings: 158,
        discount: '17%'
      },
      name: 'Core Plan',
      description: 'Complete health analytics and AI assistance',
      popular: true,
      features: [
        'Everything in Daily',
        'AI Health Assistant (unlimited)',
        'Device integration (5 devices)',
        'Priority email support',
        'Advanced analytics',
        'Custom health goals',
        'Medication tracking',
        'Meal planning suggestions'
      ],
      limits: {
        aiQueries: -1,
        devices: 5,
        reports: 12
      }
    },
    max: {
      monthly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_MAX_MONTHLY || 'price_1xxxxxxxxxx',
        amount: 149,
        interval: 'month',
      },
      yearly: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_MAX_YEARLY || 'price_1xxxxxxxxxx',
        amount: 1490,
        interval: 'year',
        savings: 298,
        discount: '17%'
      },
      name: 'Max Plan',
      description: 'Premium health intelligence with unlimited access',
      features: [
        'Everything in Core',
        'Unlimited AI queries',
        'Unlimited device connections',
        'Premium 24/7 support',
        'API access',
        'Custom integrations',
        'White-glove onboarding',
        'Personalized health coaching',
        'Export all data',
        'Priority feature requests'
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
