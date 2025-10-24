# Stripe Pricing Structure - Monthly & Yearly Plans

## 💰 Complete Pricing Overview

All plans now support both **Monthly** and **Yearly** billing with 17% discount on annual subscriptions.

---

## 📊 Pricing Plans

### Daily Plan

**Monthly Billing:**
- Price: **$39/month**
- Billed: Every month
- Total per year: $468

**Yearly Billing:**
- Price: **$390/year** ($32.50/month)
- Billed: Once per year
- **Save $78** compared to monthly (17% discount)

**Features:**
- Daily health insights
- Basic analytics dashboard
- Email support
- Mobile app access
- Health trend tracking
- Weekly reports
- 50 AI queries/month
- 2 device connections
- 4 reports/year

---

### Core Plan (Most Popular)

**Monthly Billing:**
- Price: **$79/month**
- Billed: Every month
- Total per year: $948

**Yearly Billing:**
- Price: **$790/year** ($65.83/month)
- Billed: Once per year
- **Save $158** compared to monthly (17% discount)

**Features:**
- Everything in Daily
- Unlimited AI Health Assistant
- Device integration (5 devices)
- Priority email support
- Advanced analytics
- Custom health goals
- Medication tracking
- Meal planning suggestions
- Unlimited AI queries
- 12 reports/year

---

### Max Plan

**Monthly Billing:**
- Price: **$149/month**
- Billed: Every month
- Total per year: $1,788

**Yearly Billing:**
- Price: **$1,490/year** ($124.17/month)
- Billed: Once per year
- **Save $298** compared to monthly (17% discount)

**Features:**
- Everything in Core
- Unlimited AI queries
- Unlimited device connections
- Premium 24/7 support
- API access
- Custom integrations
- White-glove onboarding
- Personalized health coaching
- Export all data
- Priority feature requests
- Unlimited reports

---

## 💵 Pricing Comparison Table

| Plan | Monthly | Yearly | Monthly Equivalent | Annual Savings | Discount |
|------|---------|--------|-------------------|----------------|----------|
| **Daily** | $39/mo | $390/yr | $32.50/mo | **Save $78** | 17% off |
| **Core** | $79/mo | $790/yr | $65.83/mo | **Save $158** | 17% off |
| **Max** | $149/mo | $1,490/yr | $124.17/mo | **Save $298** | 17% off |

---

## 🔧 Stripe Setup - Create Products

### Step 1: Create Daily Plan

**Product Settings:**
```
Name: Daily Plan
Description: Daily health insights and guidance
```

**Price 1 - Monthly:**
```
Amount: $39.00 USD
Billing period: Monthly (every 1 month)
Type: Recurring
Price ID: price_1xxxxxxxxxx (copy this)
```

**Price 2 - Yearly:**
```
Amount: $390.00 USD
Billing period: Yearly (every 12 months)
Type: Recurring
Price ID: price_1yyyyyyyyyy (copy this)
```

---

### Step 2: Create Core Plan

**Product Settings:**
```
Name: Core Plan
Description: Complete health analytics and AI assistance
```

**Price 1 - Monthly:**
```
Amount: $79.00 USD
Billing period: Monthly (every 1 month)
Type: Recurring
Price ID: price_1xxxxxxxxxx (copy this)
```

**Price 2 - Yearly:**
```
Amount: $790.00 USD
Billing period: Yearly (every 12 months)
Type: Recurring
Price ID: price_1yyyyyyyyyy (copy this)
```

---

### Step 3: Create Max Plan

**Product Settings:**
```
Name: Max Plan
Description: Premium health intelligence with unlimited access
```

**Price 1 - Monthly:**
```
Amount: $149.00 USD
Billing period: Monthly (every 1 month)
Type: Recurring
Price ID: price_1xxxxxxxxxx (copy this)
```

**Price 2 - Yearly:**
```
Amount: $1,490.00 USD
Billing period: Yearly (every 12 months)
Type: Recurring
Price ID: price_1yyyyyyyyyy (copy this)
```

---

## ⚙️ Environment Variables

Update your `.env` file with all 6 price IDs:

```env
# Daily Plan
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1xxxxxxxxxx
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1yyyyyyyyyy

# Core Plan
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1xxxxxxxxxx
VITE_STRIPE_PRICE_CORE_YEARLY=price_1yyyyyyyyyy

# Max Plan
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1xxxxxxxxxx
VITE_STRIPE_PRICE_MAX_YEARLY=price_1yyyyyyyyyy
```

---

## 💻 Usage in Code

### Subscribe with Monthly Billing

```typescript
import { redirectToCheckout } from './lib/stripeService';

// Subscribe to Core plan, monthly billing
await redirectToCheckout('core', 'monthly');
```

### Subscribe with Yearly Billing

```typescript
import { redirectToCheckout } from './lib/stripeService';

// Subscribe to Core plan, yearly billing (save 17%)
await redirectToCheckout('core', 'yearly');
```

### Get Price Information

```typescript
import { getPlan, getPrice, formatPrice } from './config/stripe';

// Get full plan details
const corePlan = getPlan('core');

// Get monthly price
const monthlyPrice = getPrice('core', 'monthly');
console.log(formatPrice(monthlyPrice.amount)); // "$79"

// Get yearly price
const yearlyPrice = getPrice('core', 'yearly');
console.log(formatPrice(yearlyPrice.amount)); // "$790"
console.log(yearlyPrice.savings); // 158
console.log(yearlyPrice.discount); // "17%"
```

### Calculate Savings

```typescript
import { calculateSavings, calculateDiscountPercent } from './config/stripe';

// Calculate how much user saves with yearly billing
const savings = calculateSavings('core'); // 158
const discount = calculateDiscountPercent('core'); // 17
```

---

## 🎨 UI Components Example

### Billing Toggle Component

```tsx
import { useState } from 'react';
import { formatPrice, getPrice } from '../config/stripe';

function PricingCard({ planId }: { planId: 'daily' | 'core' | 'max' }) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plan = getPlan(planId);
  const price = getPrice(planId, billingInterval);

  return (
    <div className="pricing-card">
      {/* Billing Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBillingInterval('monthly')}
          className={billingInterval === 'monthly' ? 'active' : ''}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingInterval('yearly')}
          className={billingInterval === 'yearly' ? 'active' : ''}
        >
          Yearly (Save 17%)
        </button>
      </div>

      {/* Price Display */}
      <div className="price">
        <span className="amount">{formatPrice(price.amount)}</span>
        <span className="interval">/{price.interval}</span>
      </div>

      {/* Yearly Savings Badge */}
      {billingInterval === 'yearly' && (
        <div className="savings-badge">
          Save {formatPrice(price.savings!)} per year
        </div>
      )}

      {/* Subscribe Button */}
      <button onClick={() => redirectToCheckout(planId, billingInterval)}>
        Subscribe Now
      </button>
    </div>
  );
}
```

---

## 📈 Revenue Projections

### Monthly Billing

| Plan | Price | Stripe Fee (2.9% + $0.30) | Net Revenue | Annual Net |
|------|-------|---------------------------|-------------|------------|
| Daily | $39 | $1.43 | **$37.57** | $450.84 |
| Core | $79 | $2.59 | **$76.41** | $916.92 |
| Max | $149 | $4.62 | **$144.38** | $1,732.56 |

### Yearly Billing

| Plan | Price | Stripe Fee (2.9% + $0.30) | Net Revenue | Monthly Net |
|------|-------|---------------------------|-------------|-------------|
| Daily | $390 | $11.61 | **$378.39** | $31.53 |
| Core | $790 | $23.21 | **$766.79** | $63.90 |
| Max | $1,490 | $43.51 | **$1,446.49** | $120.54 |

**Note:** Yearly billing results in fewer transaction fees (1 fee per year vs 12 fees).

---

## 🎯 Customer Benefits

### Why Choose Yearly Billing?

1. **Save 17%** on all plans
2. **Fewer transactions** (billed once per year)
3. **Lock in current pricing** for a full year
4. **Better value** for committed users

### Savings Examples:

- Daily Plan: **Save $78/year** → 2 months free
- Core Plan: **Save $158/year** → 2 months free
- Max Plan: **Save $298/year** → 2 months free

---

## 🔄 Switching Plans

Users can switch between:
- Monthly ↔ Yearly billing
- Daily → Core → Max (upgrade)
- Max → Core → Daily (downgrade)

All changes are handled through Stripe Customer Portal:

```typescript
import { redirectToPortal } from './lib/stripeService';

// Open Stripe Customer Portal
await redirectToPortal();
```

In the portal, users can:
- Switch billing interval (monthly/yearly)
- Upgrade/downgrade plans
- Update payment method
- View invoices
- Cancel subscription

---

## 📊 Analytics & Tracking

Track which billing interval performs better:

```typescript
// Track subscription created
analytics.track('subscription_created', {
  plan: 'core',
  interval: 'yearly',
  amount: 790,
  savings: 158
});

// Track conversion by interval
analytics.track('checkout_completed', {
  plan: 'core',
  interval: 'yearly',
  revenue: 790,
  customer_saved: 158
});
```

---

## ✅ Implementation Checklist

- [x] Create 3 products in Stripe Dashboard
- [x] Create 2 prices per product (monthly + yearly)
- [x] Copy all 6 Price IDs
- [x] Update .env with Price IDs
- [x] Configure stripe.ts with pricing structure
- [x] Update stripeService.ts to handle billing intervals
- [x] Test monthly checkout flow
- [x] Test yearly checkout flow
- [x] Verify webhook handles both intervals
- [x] Add billing toggle to UI
- [x] Display savings on yearly plans
- [x] Test plan switching in Customer Portal

---

## 🎉 Benefits of This Structure

✅ **Flexible pricing** - Monthly for trying, yearly for committed users
✅ **Higher LTV** - Yearly subscriptions increase customer lifetime value
✅ **Better retention** - Annual commitments reduce churn
✅ **Predictable revenue** - More upfront cash from yearly plans
✅ **Lower transaction fees** - 1 charge per year vs 12
✅ **Customer savings** - 17% discount incentivizes yearly billing

---

## 📞 Support

For questions about pricing structure:
- Documentation: `/STRIPE_INTEGRATION_GUIDE.md`
- Stripe Dashboard: https://dashboard.stripe.com
- Support: support@biomathcore.com

---

**Last Updated:** 2025-10-23
**Version:** 2.0 (Monthly + Yearly Billing)
