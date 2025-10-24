export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  currency: import.meta.env.VITE_STRIPE_CURRENCY || 'usd',

  prices: {
    daily: {
      priceId: import.meta.env.VITE_STRIPE_PRICE_DAILY || 'price_1xxxxxxxxxx',
      amount: 39,
      name: 'Daily Plan',
      interval: 'month',
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
      priceId: import.meta.env.VITE_STRIPE_PRICE_CORE || 'price_1xxxxxxxxxx',
      amount: 79,
      name: 'Core Plan',
      interval: 'month',
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
      priceId: import.meta.env.VITE_STRIPE_PRICE_MAX || 'price_1xxxxxxxxxx',
      amount: 149,
      name: 'Max Plan',
      interval: 'month',
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

export interface StripePlan {
  priceId: string;
  amount: number;
  name: string;
  interval: string;
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

export function formatPrice(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function isStripeEnabled(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}
