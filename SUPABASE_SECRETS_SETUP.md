# Supabase Secrets Setup Guide

## What are Supabase Secrets?

Secrets are environment variables that are securely stored in Supabase and available to your Edge Functions. They are **NOT** exposed to the client-side code.

## Required Secrets for BioMath Core

You need to add these secrets in your Supabase Dashboard under **Project Settings → Secrets**:

### 1. Stripe Keys (Required for Payments)

```bash
# Secret keys (NEVER expose these!)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 2. Stripe Price IDs (Required for Checkout)

These are the Price IDs from your Stripe Products. Add all 6 variants:

```bash
# Monthly Plans
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1Ry1DrFeT62z7zOTWTEuqnQF
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1Ry1B0FeT62z7zOTfpYzRVgK
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1Ry1FRFeT62z7zOTRXDSDvmh

# Yearly Plans (with 17% discount)
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1Ry1ERFeT62z7zOTzqGU2Mb7
VITE_STRIPE_PRICE_CORE_YEARLY=price_1Ry1CeFeT62z7zOTtNyV6TRq
VITE_STRIPE_PRICE_MAX_YEARLY=price_1Ry1FyFeT62z7zOT2XxWrJPA
```

### 3. Supabase Keys (Auto-populated)

These are automatically available in Edge Functions:

```bash
SUPABASE_URL=https://txnwvaqzmtlhefcxilfu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## How to Add Secrets in Supabase Dashboard

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: **txnwvaqzmtlhefcxilfu**
3. Click **Project Settings** (gear icon in left sidebar)

### Step 2: Navigate to Secrets

1. In Project Settings, scroll down to find **Secrets** section
2. Or click directly on **Secrets** in the left menu

### Step 3: Add Each Secret

For each secret:

1. Click **"New secret"** or **"Add new"** button
2. Enter the **Name** (e.g., `STRIPE_SECRET_KEY`)
3. Enter the **Value** (paste your actual key)
4. Click **"Add secret"** or **"Save"**

### Step 4: Verify Secrets

After adding all secrets, you should see them listed like this:

```
✓ STRIPE_SECRET_KEY                    •••••••••••••••••••••••••
✓ STRIPE_WEBHOOK_SECRET                •••••••••••••••••••••••••
✓ VITE_STRIPE_PRICE_DAILY_MONTHLY     price_1Ry1DrFeT62z7zOT...
✓ VITE_STRIPE_PRICE_CORE_MONTHLY      price_1Ry1B0FeT62z7zOT...
✓ VITE_STRIPE_PRICE_MAX_MONTHLY       price_1Ry1FRFeT62z7zOT...
✓ VITE_STRIPE_PRICE_DAILY_YEARLY      price_1Ry1ERFeT62z7zOT...
✓ VITE_STRIPE_PRICE_CORE_YEARLY       price_1Ry1CeFeT62z7zOT...
✓ VITE_STRIPE_PRICE_MAX_YEARLY        price_1Ry1FyFeT62z7zOT...
```

## Getting Your Stripe Keys

### Stripe Secret Key

1. Go to https://dashboard.stripe.com/apikeys
2. Find **"Secret key"** section
3. Click **"Reveal test key"** (for test mode)
4. Copy the key (starts with `sk_test_` or `sk_live_`)
5. Paste into Supabase Secrets as `STRIPE_SECRET_KEY`

### Stripe Webhook Secret

1. Go to https://dashboard.stripe.com/webhooks
2. Click on your webhook endpoint
3. Scroll down to **"Signing secret"**
4. Click **"Reveal"** or **"Click to reveal"**
5. Copy the secret (starts with `whsec_`)
6. Paste into Supabase Secrets as `STRIPE_WEBHOOK_SECRET`

### Stripe Price IDs

The Price IDs are already configured in your database! Here they are:

| Plan | Period | Price ID | Amount |
|------|--------|----------|--------|
| **Daily** | Monthly | `price_1Ry1DrFeT62z7zOTWTEuqnQF` | $39/mo |
| **Daily** | Yearly | `price_1Ry1ERFeT62z7zOTzqGU2Mb7` | $390/yr |
| **Core** | Monthly | `price_1Ry1B0FeT62z7zOTfpYzRVgK` | $79/mo |
| **Core** | Yearly | `price_1Ry1CeFeT62z7zOTtNyV6TRq` | $790/yr |
| **Max** | Monthly | `price_1Ry1FRFeT62z7zOTRXDSDvmh` | $149/mo |
| **Max** | Yearly | `price_1Ry1FyFeT62z7zOT2XxWrJPA` | $1,490/yr |

## Common Issues

### "Missing secrets" Warning

If you see this warning in Supabase Dashboard:

```
Missing secrets
The following secrets are used in the code but don't exist yet:
• STRIPE_SECRET_KEY
• STRIPE_WEBHOOK_SECRET
• VITE_STRIPE_PRICE_DAILY
• VITE_STRIPE_PRICE_CORE
• VITE_STRIPE_PRICE_MAX
```

**Solution:** Click **"Open secrets settings"** and add each secret as described above.

### Edge Functions Can't Access Secrets

**Problem:** Edge Functions return errors like "STRIPE_SECRET_KEY not found"

**Solution:**
1. Verify secrets are added in Supabase Dashboard
2. Redeploy your Edge Functions:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy create-portal-session
   supabase functions deploy stripe-webhook
   ```
3. Wait 1-2 minutes for changes to propagate

### Secrets Not Updating

**Problem:** Changed a secret but Edge Functions still use old value

**Solution:**
1. Secrets are cached - wait 5-10 minutes
2. Or redeploy functions to force refresh
3. Or restart Supabase project (Project Settings → General → Restart project)

## Testing Secrets

### Test in Edge Function

You can test if secrets are loaded by calling this test function:

```typescript
// In any Edge Function
Deno.serve(async (req) => {
  const secrets = {
    stripe_secret: Deno.env.get('STRIPE_SECRET_KEY') ? '✓ SET' : '✗ NOT SET',
    webhook_secret: Deno.env.get('STRIPE_WEBHOOK_SECRET') ? '✓ SET' : '✗ NOT SET',
    price_daily: Deno.env.get('VITE_STRIPE_PRICE_DAILY_MONTHLY') ? '✓ SET' : '✗ NOT SET',
    price_core: Deno.env.get('VITE_STRIPE_PRICE_CORE_MONTHLY') ? '✓ SET' : '✗ NOT SET',
    price_max: Deno.env.get('VITE_STRIPE_PRICE_MAX_MONTHLY') ? '✓ SET' : '✗ NOT SET',
  };

  return new Response(JSON.stringify(secrets, null, 2));
});
```

### Test via SQL

You can check your database configuration:

```sql
-- Check what Price IDs are in the database
SELECT
  key,
  value,
  description
FROM stripe_configuration
WHERE key LIKE 'price_%'
  AND environment = 'test'
ORDER BY key;
```

## Security Best Practices

### ✅ DO:
- Add secrets only in Supabase Dashboard (Project Settings → Secrets)
- Use test keys during development
- Rotate secrets regularly (every 90 days)
- Use different keys for test and live mode
- Store STRIPE_SECRET_KEY as a secret (never in code or .env)

### ❌ DON'T:
- Never commit secrets to Git
- Never expose secret keys in client-side code
- Never share secret keys in screenshots or docs
- Never use live keys in development
- Never hardcode secrets in Edge Functions

## Environment Variables vs Secrets

### Environment Variables (.env file)
- Used by **frontend** (Vite)
- Exposed to client-side
- Safe for: Publishable keys, Price IDs, URLs
- Prefix with `VITE_` to expose to client

### Secrets (Supabase Dashboard)
- Used by **backend** (Edge Functions)
- Never exposed to client
- Safe for: Secret keys, webhook secrets, API keys
- No prefix needed

## Complete Checklist

Before deploying to production:

- [ ] All secrets added in Supabase Dashboard
- [ ] Stripe Secret Key (test mode) working
- [ ] Stripe Webhook Secret configured
- [ ] All 6 Price IDs added (Daily/Core/Max × Monthly/Yearly)
- [ ] Edge Functions deployed and working
- [ ] Payments tested in test mode
- [ ] Switch to live mode keys for production
- [ ] Webhook endpoint updated in Stripe Dashboard

## Need Help?

If secrets are still not working:

1. Check Supabase function logs:
   - Go to **Edge Functions** in dashboard
   - Click on function name
   - View **Logs** tab
   - Look for errors about missing environment variables

2. Verify deployment:
   ```bash
   supabase functions list
   ```

3. Test locally:
   ```bash
   supabase functions serve create-checkout-session
   ```

4. Check this guide again and verify each step

## Summary

**For client-side (frontend):**
- Add to `.env` file (already done)
- Variables with `VITE_` prefix are exposed

**For server-side (Edge Functions):**
- Add to Supabase Dashboard → Secrets
- Use exact names as shown in this guide
- Redeploy functions after adding secrets

All Price IDs are now configured in your `.env` file and ready to use!
