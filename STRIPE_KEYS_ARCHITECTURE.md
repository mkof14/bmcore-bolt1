# Stripe Keys Architecture

## Problem That Was Fixed

The application had **TWO separate tables** storing Stripe configuration, causing conflicts:

### 1. `stripe_config` Table
- **Location**: Created by migration `20251024012521_create_stripe_configuration_table.sql`
- **Purpose**: Originally intended for Stripe-specific configuration
- **Status**: Was NOT being updated by Admin Panel
- **Issue**: Edge Function was reading from this table but it had placeholder values

### 2. `api_keys_configuration` Table
- **Location**: Created by migration `20251024021649_create_site_configuration_system.sql`
- **Purpose**: Universal API keys management
- **Status**: WAS being updated by Admin Panel (API Keys Management page)
- **Issue**: Had real keys but Edge Function wasn't reading from it

## Root Cause

```
User saves keys in Admin Panel → api_keys_configuration ✅
                                          ↓
Edge Function reads from      →  stripe_config ❌ (empty!)
                                          ↓
                                  Payment FAILS
```

## Solution Implemented

### 1. Edge Function (`create-checkout-session/index.ts`)
Now reads from **BOTH** tables with priority:
```typescript
// Priority 1: api_keys_configuration (Admin Panel saves here)
const { data } = await supabase
  .from('api_keys_configuration')
  .select('key_value')
  .eq('key_name', 'stripe_secret')

// Priority 2: stripe_config (fallback)
// Priority 3: Environment variables (STRIPE_SECRET_KEY)
```

### 2. Frontend Config (`stripeConfigService.ts`)
Same approach - reads from both sources:
```typescript
// 1. Try api_keys_configuration for API keys
// 2. Try stripe_config for price IDs
// 3. Fallback to .env variables
```

## Data Flow (Fixed)

```
┌─────────────────────────────────────────────────────────────┐
│                      USER ACTIONS                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Admin Panel → API Keys Management                           │
│       ↓                                                       │
│  Saves to: api_keys_configuration                           │
│       • stripe_publishable (pk_live_...)                    │
│       • stripe_secret (sk_live_...)                         │
│       • stripe_webhook_secret (whsec_...)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CHECKOUT FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  User clicks "Get Started"                                   │
│       ↓                                                       │
│  Frontend (stripeService.ts)                                │
│       ↓                                                       │
│  Calls Edge Function: create-checkout-session               │
│       ↓                                                       │
│  Edge Function reads:                                        │
│       1. api_keys_configuration (stripe_secret) ✅          │
│       2. stripe_config (price IDs) ✅                       │
│       ↓                                                       │
│  Creates Stripe Checkout Session                            │
│       ↓                                                       │
│  Redirects to Stripe ✅                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Tables Structure

### api_keys_configuration
```sql
CREATE TABLE api_keys_configuration (
  id uuid PRIMARY KEY,
  key_name text UNIQUE NOT NULL,        -- e.g., 'stripe_secret'
  key_value text,                       -- e.g., 'sk_live_...'
  service_name text,                    -- e.g., 'Stripe Secret Key'
  is_secret boolean,
  is_required boolean,
  description text,
  icon text
);
```

**Stripe Keys Stored:**
- `stripe_publishable` → pk_live_... or pk_test_...
- `stripe_secret` → sk_live_... or sk_test_...
- `stripe_webhook_secret` → whsec_...

### stripe_config
```sql
CREATE TABLE stripe_config (
  id uuid PRIMARY KEY,
  key text UNIQUE NOT NULL,              -- e.g., 'price_core_monthly'
  value text,                            -- e.g., 'price_1...'
  description text
);
```

**Data Stored:**
- `price_daily_monthly` → price_1...
- `price_daily_yearly` → price_1...
- `price_core_monthly` → price_1...
- `price_core_yearly` → price_1...
- `price_max_monthly` → price_1...
- `price_max_yearly` → price_1...
- `environment` → 'live' or 'test'
- `currency` → 'usd'

## Environment Variables (.env)

Used as **final fallback** if database has no values:

```bash
# Publishable Key (safe for client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Price IDs (monthly by default)
VITE_STRIPE_PRICE_DAILY=price_1...
VITE_STRIPE_PRICE_CORE=price_1...
VITE_STRIPE_PRICE_MAX=price_1...

# Full price IDs (with billing cycle)
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1...
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1...
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1...
VITE_STRIPE_PRICE_CORE_YEARLY=price_1...
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1...
VITE_STRIPE_PRICE_MAX_YEARLY=price_1...
```

**Note**: Secret keys should NEVER be in .env (client-visible).
They must be in database or server-side environment only.

## Admin Panel Pages

### 1. API Keys Management (`/admin → API Keys Management`)
- **Table**: `api_keys_configuration`
- **Manages**: ALL API keys including Stripe
- **Usage**: Primary interface for setting Stripe keys
- **Location**: `/src/components/admin/AllAPIKeysManager.tsx`

### 2. Stripe Configuration (`/admin → Settings → Stripe`)
- **Table**: `stripe_config`
- **Manages**: Stripe-specific settings (price IDs, environment)
- **Usage**: Optional detailed Stripe configuration
- **Location**: `/src/components/admin/StripeConfigManager.tsx`

## Testing Checklist

✅ Verify keys are saved in database:
```sql
SELECT key_name, LENGTH(key_value) as length
FROM api_keys_configuration
WHERE key_name LIKE 'stripe%';
```

✅ Expected output:
- stripe_publishable: ~107 characters (pk_live_...)
- stripe_secret: ~107 characters (sk_live_...)
- stripe_webhook_secret: ~70 characters (whsec_...)

✅ Test payment flow:
1. Go to Pricing page
2. Click "Get Started" on any plan
3. Should redirect to Stripe Checkout ✅
4. If cancelled, returns to /pricing with yellow banner ✅

## Troubleshooting

### "Missing secrets" error
**Cause**: Keys not in database or .env
**Fix**: Go to Admin Panel → API Keys Management → Add keys → Save

### Returns to home after clicking "Get Started"
**Cause**: Authentication required
**Fix**: Sign in first, then try payment

### Payment system not configured
**Cause**: Edge Function can't find secret key
**Fix**: Verify `stripe_secret` exists in `api_keys_configuration` table

## Migration History

Relevant migrations in order:
1. `20251024000000_create_stripe_configuration.sql` - Created stripe_config
2. `20251024012521_create_stripe_configuration_table.sql` - Enhanced stripe_config
3. `20251024021649_create_site_configuration_system.sql` - Created api_keys_configuration
4. `20251025170916_temporarily_disable_rls_api_keys.sql` - Fixed RLS issues

## Security Notes

- ✅ Secret keys stored in database (server-side)
- ✅ Publishable keys can be in .env (client-safe)
- ✅ Edge Function uses service role (bypasses RLS)
- ✅ Frontend uses anon key (respects RLS)
- ❌ Never commit secret keys to git
- ❌ Never use VITE_ prefix for secret keys
