# Stripe Integration Guide - BioMath Core

## 🎯 Overview

Complete guide to integrating Stripe payment processing for subscription management in BioMath Core platform.

---

## 📋 Prerequisites

1. **Stripe Account** (Required)
   - Sign up: https://dashboard.stripe.com/register
   - Complete business verification
   - Add bank account for payouts

2. **Test Mode First** (Important!)
   - Always start with test keys
   - Test all flows before going live
   - Switch to live keys only after thorough testing

---

## 🔑 Step 1: Get Stripe API Keys

### Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign Up"
3. Enter email, password, country
4. Verify email
5. Complete business information

### Get API Keys

1. Login to Stripe Dashboard
2. Click **Developers** in left sidebar
3. Click **API Keys**
4. You'll see:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

**Test Mode Keys:**
```
Publishable key: pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret key:      sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Live Mode Keys:**
```
Publishable key: pk_live_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret key:      sk_live_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **NEVER commit secret keys to Git!**

---

## ⚙️ Step 2: Environment Configuration

### Update `.env` file:

```env
################################################################################
# STRIPE CONFIGURATION
################################################################################

# Stripe Publishable Key (SAFE for client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Secret Key (BACKEND ONLY - NEVER EXPOSE IN CLIENT!)
# This should be in backend/serverless functions only
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret (for verifying webhook events)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Configuration
VITE_STRIPE_CURRENCY=usd
VITE_STRIPE_SUCCESS_URL=https://yourdomain.com/member-zone?payment=success
VITE_STRIPE_CANCEL_URL=https://yourdomain.com/pricing?payment=cancelled
```

### Update `.env.example`:

```env
# Stripe (Get from: https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
# STRIPE_SECRET_KEY=sk_test_your_secret_key_here (backend only)
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## 💳 Step 3: Create Stripe Products

### Navigate to Products

1. Stripe Dashboard → **Products**
2. Click **Add Product**

### Product 1: Daily Plan

```
Name:        Daily Plan
Description: Daily health insights and guidance
Statement descriptor: BIOMATH DAILY

Pricing:
- Price: $39.00 USD
- Billing period: Monthly
- Type: Recurring

Metadata (optional):
- plan_id: daily
- features: daily_insights,basic_analytics,email_support
```

**Copy the Price ID:** `price_1xxxxxxxxxxxxxxxxxx`

### Product 2: Core Plan (Most Popular)

```
Name:        Core Plan
Description: Complete health analytics and AI assistance
Statement descriptor: BIOMATH CORE

Pricing:
- Price: $79.00 USD
- Billing period: Monthly
- Type: Recurring

Metadata:
- plan_id: core
- features: all_daily,ai_assistant,device_integration,priority_support
- popular: true
```

**Copy the Price ID:** `price_1xxxxxxxxxxxxxxxxxx`

### Product 3: Max Plan

```
Name:        Max Plan
Description: Premium health intelligence with unlimited access
Statement descriptor: BIOMATH MAX

Pricing:
- Price: $149.00 USD
- Billing period: Monthly
- Type: Recurring

Metadata:
- plan_id: max
- features: all_core,unlimited_ai,premium_support,api_access
```

**Copy the Price ID:** `price_1xxxxxxxxxxxxxxxxxx`

---

## 🔧 Step 4: Update Pricing Configuration

Create `src/config/stripe.ts`:

```typescript
// Stripe configuration
export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  currency: 'usd',

  // Product Price IDs (from Stripe Dashboard)
  prices: {
    daily: {
      priceId: 'price_1xxxxxxxxxx', // Replace with your Price ID
      amount: 39,
      name: 'Daily Plan',
      features: [
        'Daily health insights',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ]
    },
    core: {
      priceId: 'price_1xxxxxxxxxx', // Replace with your Price ID
      amount: 79,
      name: 'Core Plan',
      popular: true,
      features: [
        'Everything in Daily',
        'AI Health Assistant',
        'Device integration',
        'Priority support',
        'Advanced analytics'
      ]
    },
    max: {
      priceId: 'price_1xxxxxxxxxx', // Replace with your Price ID
      amount: 149,
      name: 'Max Plan',
      features: [
        'Everything in Core',
        'Unlimited AI queries',
        'Premium support (24/7)',
        'API access',
        'Custom integrations'
      ]
    }
  },

  // Success/Cancel URLs
  successUrl: `${window.location.origin}/member-zone?payment=success`,
  cancelUrl: `${window.location.origin}/pricing?payment=cancelled`
};

// Validate Stripe configuration
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
```

---

## 🛠️ Step 5: Install Stripe JS Library

The Stripe library is already available via CDN in `index.html`. No installation needed!

Verify in `index.html`:

```html
<!-- Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>
```

---

## 💻 Step 6: Create Stripe Service

Create `src/lib/stripeService.ts`:

```typescript
import { stripeConfig, validateStripeConfig } from '../config/stripe';
import { supabase } from './supabase';

// Initialize Stripe
let stripe: any = null;

export function initStripe() {
  if (!validateStripeConfig()) {
    throw new Error('Stripe configuration is invalid');
  }

  if (typeof window !== 'undefined' && (window as any).Stripe) {
    stripe = (window as any).Stripe(stripeConfig.publishableKey);
  } else {
    throw new Error('Stripe.js not loaded');
  }

  return stripe;
}

// Get Stripe instance
export function getStripe() {
  if (!stripe) {
    stripe = initStripe();
  }
  return stripe;
}

// Create checkout session
export async function createCheckoutSession(
  priceId: string,
  userId: string
): Promise<{ sessionId: string; url: string }> {
  try {
    // Call your backend/Supabase Edge Function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId,
        successUrl: stripeConfig.successUrl,
        cancelUrl: stripeConfig.cancelUrl
      }
    });

    if (error) throw error;

    return {
      sessionId: data.sessionId,
      url: data.url
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(priceId: string, userId: string) {
  try {
    const stripe = getStripe();
    const { sessionId } = await createCheckoutSession(priceId, userId);

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

// Create customer portal session
export async function createPortalSession(customerId: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { customerId }
    });

    if (error) throw error;

    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Get subscription status
export async function getSubscriptionStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}
```

---

## 🎨 Step 7: Update Pricing Component

Update `src/pages/Pricing.tsx` to use Stripe:

```typescript
import { stripeConfig } from '../config/stripe';
import { redirectToCheckout } from '../lib/stripeService';
import { supabase } from '../lib/supabase';

// Inside component:
const handleSubscribe = async (planId: string) => {
  try {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to sign up
      onNavigate('signup');
      return;
    }

    // Get price ID for plan
    const priceId = stripeConfig.prices[planId as keyof typeof stripeConfig.prices].priceId;

    // Redirect to Stripe Checkout
    await redirectToCheckout(priceId, user.id);
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Failed to start checkout. Please try again.');
  }
};

// Update buttons:
<button
  onClick={() => handleSubscribe('daily')}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
>
  Subscribe Now
</button>
```

---

## 🔗 Step 8: Create Webhook Handler (Supabase Edge Function)

Create webhook handler to process Stripe events:

### Create Edge Function

Create `supabase/functions/stripe-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = (await import('https://esm.sh/stripe@12.0.0')).default(
  Deno.env.get('STRIPE_SECRET_KEY') || '',
  { apiVersion: '2023-10-16' }
);

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Update user subscription
        await supabase.from('user_subscriptions').upsert({
          user_id: session.metadata?.userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: 'active',
          current_period_start: new Date(session.created * 1000).toISOString(),
          updated_at: new Date().toISOString()
        });

        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        await supabase
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;

        // Log successful payment
        await supabase.from('payment_transactions').insert({
          user_id: invoice.metadata?.userId,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'succeeded',
          created_at: new Date().toISOString()
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        // Log failed payment
        await supabase.from('payment_transactions').insert({
          user_id: invoice.metadata?.userId,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          status: 'failed',
          created_at: new Date().toISOString()
        });

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});
```

### Deploy Edge Function

```bash
supabase functions deploy stripe-webhook
```

---

## 🔔 Step 9: Configure Stripe Webhooks

### Add Webhook Endpoint

1. Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Description: "BioMath Core Webhook"
5. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

6. Click **Add endpoint**
7. Copy **Signing secret** (starts with `whsec_`)
8. Add to your environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Step 10: Testing

### Test Mode Cards

Use these test cards in test mode:

**Success:**
```
Card number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Decline:**
```
Card number: 4000 0000 0000 0002
```

**Requires 3D Secure:**
```
Card number: 4000 0027 6000 3184
```

### Test Checkout Flow

1. Go to pricing page
2. Click "Subscribe Now"
3. Enter test card details
4. Complete checkout
5. Verify redirect to success page
6. Check database for subscription record

### Test Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select event type
5. Click "Send test webhook"
6. Check webhook logs

---

## 📊 Step 11: Customer Portal

Allow users to manage their subscriptions:

### Create Portal Session

```typescript
// In BillingSection.tsx
import { createPortalSession } from '../../lib/stripeService';

const handleManageBilling = async () => {
  try {
    const subscription = await getSubscriptionStatus(user.id);

    if (!subscription) {
      alert('No active subscription found');
      return;
    }

    const portalUrl = await createPortalSession(subscription.stripe_customer_id);
    window.location.href = portalUrl;
  } catch (error) {
    console.error('Portal error:', error);
    alert('Failed to open billing portal');
  }
};
```

### Configure Portal

1. Stripe Dashboard → **Settings** → **Customer portal**
2. Enable customer portal
3. Configure:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to switch plans

---

## 🔒 Security Best Practices

### 1. API Key Security

✅ **DO:**
- Store secret key in environment variables
- Use secret key only in backend/serverless functions
- Rotate keys if compromised
- Use test keys for development

❌ **DON'T:**
- Commit secret keys to Git
- Use secret keys in client-side code
- Share secret keys
- Use live keys for testing

### 2. Webhook Security

✅ **DO:**
- Verify webhook signatures
- Use webhook secret
- Log all webhook events
- Handle webhook retries

❌ **DON'T:**
- Skip signature verification
- Accept webhooks from unknown sources
- Expose webhook endpoint without auth

### 3. Customer Data

✅ **DO:**
- Store minimal customer data
- Use Stripe Customer Portal
- Comply with PCI DSS
- Encrypt sensitive data

❌ **DON'T:**
- Store credit card numbers
- Store CVV codes
- Share customer payment data

---

## 💰 Pricing Summary

### BioMath Core Plans

| Plan | Price | Features |
|------|-------|----------|
| **Daily** | $39/mo | Basic insights, email support |
| **Core** | $79/mo | AI assistant, device integration, priority support |
| **Max** | $149/mo | Unlimited AI, premium support, API access |

### Stripe Fees

- **Per transaction:** 2.9% + $0.30
- **International:** +1.5%
- **Currency conversion:** +1%

**Example:**
```
$79 subscription:
- Stripe fee: $2.60
- Net revenue: $76.40
```

---

## 📈 Monitoring

### Key Metrics to Track

1. **Successful checkouts**
2. **Failed payments**
3. **Subscription cancellations**
4. **Monthly recurring revenue (MRR)**
5. **Churn rate**
6. **Average revenue per user (ARPU)**

### Stripe Dashboard

Monitor in real-time:
- Dashboard → Home (overview)
- Dashboard → Payments
- Dashboard → Subscriptions
- Dashboard → Customers

---

## 🆘 Troubleshooting

### Issue 1: Checkout Not Opening

**Problem:** Button click doesn't redirect to Stripe

**Solution:**
```typescript
// Check Stripe initialization
console.log('Stripe loaded:', !!window.Stripe);
console.log('Publishable key:', stripeConfig.publishableKey);
```

### Issue 2: Webhook Not Receiving Events

**Problem:** Webhook endpoint not getting events

**Solution:**
- Verify webhook URL is correct
- Check webhook is enabled in Stripe
- Verify signing secret is correct
- Check Edge Function logs

### Issue 3: Payment Succeeded but Database Not Updated

**Problem:** Webhook received but DB not updated

**Solution:**
- Check webhook handler logs
- Verify database permissions
- Check RLS policies
- Verify user_id mapping

---

## ✅ Pre-Launch Checklist

### Before Going Live

- [ ] Test complete checkout flow
- [ ] Test subscription cancellation
- [ ] Test payment failure handling
- [ ] Verify webhook signature validation
- [ ] Test customer portal
- [ ] Switch to live API keys
- [ ] Update webhook URL to production
- [ ] Test with real card (small amount)
- [ ] Verify email notifications
- [ ] Set up monitoring/alerts
- [ ] Review Stripe Dashboard settings
- [ ] Configure tax settings (if applicable)
- [ ] Set up billing email templates
- [ ] Test refund process
- [ ] Document customer support procedures

---

## 📞 Support Resources

### Stripe Documentation
- Main docs: https://stripe.com/docs
- API reference: https://stripe.com/docs/api
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

### Stripe Support
- Dashboard: https://dashboard.stripe.com
- Support: https://support.stripe.com
- Status page: https://status.stripe.com

### Community
- Stack Overflow: [stripe] tag
- GitHub: https://github.com/stripe

---

## 🎉 Next Steps

After completing integration:

1. ✅ Test thoroughly in test mode
2. ✅ Switch to live keys
3. ✅ Monitor first transactions
4. ✅ Set up alerts for failed payments
5. ✅ Configure email notifications
6. ✅ Train support team
7. ✅ Create customer documentation

---

**Last Updated:** 2025-10-23
**Status:** Ready for Integration
**Estimated Setup Time:** 2-3 hours
