export const API_KEYS = {
  OPENAI: import.meta.env.VITE_OPENAI_API_KEY || '',
  STRIPE_PUBLISHABLE: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  SENDGRID: import.meta.env.VITE_SENDGRID_API_KEY || '',
  GOOGLE_ANALYTICS: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  VAPID_PUBLIC: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
};

export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1',
  STRIPE: 'https://api.stripe.com/v1',
  SENDGRID: 'https://api.sendgrid.com/v3',
};

export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || '',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export function validateAPIKeys() {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    return false;
  }

  return true;
}

export function isServiceEnabled(service: keyof typeof API_KEYS): boolean {
  return !!API_KEYS[service];
}
