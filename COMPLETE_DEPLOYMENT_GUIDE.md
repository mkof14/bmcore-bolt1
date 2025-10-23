# Complete Deployment Guide - BioMath Core Platform

## 📋 Table of Contents
1. [Required Services & Accounts](#required-services--accounts)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Database Configuration](#database-configuration)
4. [Authentication Setup](#authentication-setup)
5. [Analytics & Tracking](#analytics--tracking)
6. [Email Service](#email-service)
7. [Hosting Configuration](#hosting-configuration)
8. [Monitoring & Error Tracking](#monitoring--error-tracking)
9. [Payment Processing](#payment-processing)
10. [Social Media Integration](#social-media-integration)
11. [Step-by-Step Deployment](#step-by-step-deployment)

---

## 🔐 Required Services & Accounts

### 1. Core Infrastructure (Required)

#### Supabase (Already Configured ✅)
- **What:** Database, Authentication, Storage
- **Status:** Already set up
- **URL:** https://txnwvaqzmtlhefcxilfu.supabase.co
- **Account:** Sign in at https://supabase.com
- **Cost:** Free tier (up to 500MB database, 50K monthly active users)

#### Vercel (Hosting - Required)
- **What:** Frontend hosting, CDN, serverless functions
- **Sign up:** https://vercel.com/signup
- **Cost:** Free for hobby projects
- **Why:** Zero-config deployments, automatic HTTPS, global CDN

### 2. Analytics & Tracking (Highly Recommended)

#### Google Analytics 4
- **What:** User behavior tracking, conversion tracking
- **Sign up:** https://analytics.google.com
- **Setup time:** 10 minutes
- **Cost:** Free
- **Get:** Measurement ID (format: G-XXXXXXXXXX)

**How to get Measurement ID:**
1. Go to https://analytics.google.com
2. Create account → Create property
3. Property name: "BioMath Core"
4. Select timezone, currency
5. Under "Data Streams" → Add stream → Web
6. Website URL: https://yourdomain.com
7. Copy **Measurement ID** (starts with G-)

#### Facebook Pixel
- **What:** Facebook/Instagram ads tracking, retargeting
- **Sign up:** https://business.facebook.com
- **Setup time:** 10 minutes
- **Cost:** Free
- **Get:** Pixel ID (15-digit number)

**How to get Pixel ID:**
1. Go to https://business.facebook.com/events_manager
2. Click "Connect Data Sources" → Web → Facebook Pixel
3. Name: "BioMath Core"
4. Enter website URL
5. Copy **Pixel ID** (15 digits)

### 3. Email Service (Required for notifications)

#### Option A: Resend (Recommended)
- **What:** Modern email API
- **Sign up:** https://resend.com/signup
- **Cost:** Free (100 emails/day), $20/month (unlimited)
- **Setup time:** 5 minutes
- **Get:** API Key

**How to get API Key:**
1. Sign up at https://resend.com
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name: "BioMath Core Production"
5. Copy key (starts with `re_`)

#### Option B: SendGrid
- **What:** Enterprise email service
- **Sign up:** https://signup.sendgrid.com
- **Cost:** Free (100 emails/day)
- **Get:** API Key

#### Option C: Amazon SES
- **What:** AWS email service
- **Sign up:** Through AWS Console
- **Cost:** $0.10 per 1,000 emails
- **Get:** Access Key ID + Secret Key

### 4. Error Tracking (Highly Recommended)

#### Sentry
- **What:** Error monitoring, performance tracking
- **Sign up:** https://sentry.io/signup
- **Cost:** Free (5K errors/month)
- **Setup time:** 5 minutes
- **Get:** DSN

**How to get DSN:**
1. Sign up at https://sentry.io
2. Create organization → Create project
3. Platform: React
4. Project name: "biomathcore-platform"
5. Copy **DSN** (format: https://xxx@xxx.ingest.sentry.io/xxx)

### 5. Payment Processing (Required for subscriptions)

#### Stripe
- **What:** Payment processing, subscriptions
- **Sign up:** https://dashboard.stripe.com/register
- **Cost:** 2.9% + $0.30 per transaction
- **Setup time:** 20 minutes
- **Get:** Publishable Key + Secret Key

**How to get Stripe Keys:**
1. Sign up at https://stripe.com
2. Activate account (identity verification required)
3. Go to Developers → API Keys
4. Copy **Publishable key** (starts with `pk_`)
5. Copy **Secret key** (starts with `sk_`)
6. **IMPORTANT:** Use Test keys for development!

### 6. Social Authentication (Optional but Recommended)

#### Google OAuth
- **Sign up:** https://console.cloud.google.com
- **Cost:** Free
- **Get:** Client ID + Client Secret

**How to get Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create new project: "BioMath Core"
3. Enable "Google+ API"
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - https://txnwvaqzmtlhefcxilfu.supabase.co/auth/v1/callback
   - https://yourdomain.com/auth/callback
7. Copy **Client ID** and **Client Secret**

#### Facebook Login
- **Sign up:** https://developers.facebook.com
- **Cost:** Free
- **Get:** App ID + App Secret

**How to get Facebook Login:**
1. Go to https://developers.facebook.com
2. My Apps → Create App
3. Type: Consumer
4. App name: "BioMath Core"
5. Add Product → Facebook Login → Web
6. Site URL: https://yourdomain.com
7. Settings → Basic → Copy **App ID** and **App Secret**
8. Add Valid OAuth Redirect URIs:
   - https://txnwvaqzmtlhefcxilfu.supabase.co/auth/v1/callback

#### Twitter/X OAuth (Optional)
- **Sign up:** https://developer.twitter.com
- **Cost:** Free tier available
- **Get:** API Key + API Secret

#### LinkedIn OAuth (Optional)
- **Sign up:** https://www.linkedin.com/developers
- **Cost:** Free
- **Get:** Client ID + Client Secret

---

## 🔧 Environment Variables Setup

### Complete .env File

Create `.env.production` file with all required variables:

```env
################################################################################
# CORE - REQUIRED FOR ALL DEPLOYMENTS
################################################################################

# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://txnwvaqzmtlhefcxilfu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bnd2YXF6bXRsaGVmY3hpbGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTUxNDEsImV4cCI6MjA3NjM5MTE0MX0.nvfoPz57lwSgiVJDwbZgwvlTJhsnHtk4nM1M-q2_snA

# NEVER EXPOSE THIS IN CLIENT CODE - BACKEND ONLY!
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

################################################################################
# ANALYTICS - HIGHLY RECOMMENDED
################################################################################

# Google Analytics 4 (Get from: https://analytics.google.com)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel (Get from: https://business.facebook.com/events_manager)
VITE_FACEBOOK_PIXEL_ID=123456789012345

################################################################################
# EMAIL SERVICE - REQUIRED
################################################################################

# Email Provider Selection
# Options: mock, resend, sendgrid, ses
VITE_EMAIL_PROVIDER=resend

# Email Configuration
VITE_EMAIL_FROM=BioMath Core <no-reply@biomathcore.com>
VITE_EMAIL_REPLY_TO=support@biomathcore.com

# Resend (Recommended - Get from: https://resend.com/api-keys)
VITE_RESEND_API_KEY=re_xxxxxxxxxxxx

# OR SendGrid (Get from: https://app.sendgrid.com/settings/api_keys)
# VITE_SENDGRID_API_KEY=SG.xxxxxxxxxxxx

# OR Amazon SES (Get from: AWS Console → SES)
# VITE_SES_REGION=us-east-1
# VITE_SES_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
# VITE_SES_SECRET_ACCESS_KEY=xxxxxxxxxxxx

################################################################################
# ERROR TRACKING - HIGHLY RECOMMENDED
################################################################################

# Sentry (Get from: https://sentry.io/settings/projects/)
VITE_SENTRY_DSN=https://xxxxxxxxxxxx@xxxx.ingest.sentry.io/xxxxxxx
VITE_SENTRY_ENVIRONMENT=production

################################################################################
# PAYMENT PROCESSING - REQUIRED FOR SUBSCRIPTIONS
################################################################################

# Stripe (Get from: https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
# BACKEND ONLY - DO NOT EXPOSE IN CLIENT!
# STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx

# Stripe Webhook Secret (Get from: https://dashboard.stripe.com/webhooks)
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

################################################################################
# SOCIAL AUTHENTICATION - OPTIONAL BUT RECOMMENDED
################################################################################

# Google OAuth (Get from: https://console.cloud.google.com)
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
# Configure in Supabase Dashboard, not here

# Facebook OAuth (Get from: https://developers.facebook.com)
VITE_FACEBOOK_APP_ID=123456789012345
# Configure in Supabase Dashboard, not here

# Twitter/X OAuth (Get from: https://developer.twitter.com)
# Configure in Supabase Dashboard

# LinkedIn OAuth (Get from: https://www.linkedin.com/developers)
# Configure in Supabase Dashboard

################################################################################
# SOCIAL MEDIA INTEGRATION - OPTIONAL
################################################################################

# Instagram (Get from: Facebook Developer Console)
# VITE_INSTAGRAM_ACCESS_TOKEN=xxxxxxxxxxxx

# YouTube Data API (Get from: Google Cloud Console)
# VITE_YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx

# TikTok (Get from: TikTok Developers)
# VITE_TIKTOK_CLIENT_KEY=xxxxxxxxxxxx

################################################################################
# WEARABLE DEVICE INTEGRATIONS - OPTIONAL
################################################################################

# Apple Health (Handled via HealthKit on iOS)
# No API key needed

# Google Fit (Get from: Google Cloud Console)
# VITE_GOOGLE_FIT_CLIENT_ID=xxxxxxxxxxxx

# Fitbit (Get from: https://dev.fitbit.com)
# VITE_FITBIT_CLIENT_ID=xxxxxxxxxxxx

# Garmin (Get from: https://developer.garmin.com)
# VITE_GARMIN_CONSUMER_KEY=xxxxxxxxxxxx

# Oura Ring (Get from: https://cloud.ouraring.com)
# VITE_OURA_CLIENT_ID=xxxxxxxxxxxx

# WHOOP (Get from: https://developer.whoop.com)
# VITE_WHOOP_CLIENT_ID=xxxxxxxxxxxx

################################################################################
# ADDITIONAL SERVICES - OPTIONAL
################################################################################

# Cloudflare Turnstile (Bot protection - Get from: Cloudflare)
# VITE_TURNSTILE_SITE_KEY=xxxxxxxxxxxx

# reCAPTCHA (Alternative bot protection - Get from: Google)
# VITE_RECAPTCHA_SITE_KEY=xxxxxxxxxxxx

# Mapbox (For location features - Get from: https://mapbox.com)
# VITE_MAPBOX_ACCESS_TOKEN=pk.xxxxxxxxxxxx

# Twilio (For SMS notifications - Get from: https://twilio.com)
# VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
# VITE_TWILIO_AUTH_TOKEN=xxxxxxxxxxxx

################################################################################
# APPLICATION CONFIGURATION
################################################################################

# Application URLs
VITE_APP_URL=https://biomathcore.com
VITE_API_URL=https://biomathcore.com/api

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_PWA=true
VITE_ENABLE_SOCIAL_AUTH=true

# Rate Limiting
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW=60000

# Session Configuration
VITE_SESSION_TIMEOUT=3600000
VITE_REMEMBER_ME_DURATION=2592000000

################################################################################
# DEVELOPMENT ONLY - REMOVE IN PRODUCTION
################################################################################

# Debug Mode (Set to false in production)
VITE_DEBUG_MODE=false

# Mock Services (Set to false in production)
VITE_USE_MOCK_PAYMENTS=false
VITE_USE_MOCK_EMAIL=false

################################################################################
# SECURITY
################################################################################

# CORS Origins (Comma-separated)
VITE_CORS_ORIGINS=https://biomathcore.com,https://www.biomathcore.com

# Content Security Policy
VITE_CSP_ENABLED=true
```

---

## 🗄️ Database Configuration

### 1. Deploy Migrations

**Option A: Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref txnwvaqzmtlhefcxilfu

# Push all migrations
supabase db push

# Verify
supabase db migrations list
```

**Option B: Manual via Dashboard**

1. Go to https://supabase.com/dashboard
2. Select your project
3. SQL Editor → New Query
4. Copy and paste each migration file from `supabase/migrations/`
5. Run in order (by filename timestamp)
6. Total: 42 migrations to run

### 2. Verify Database Setup

```sql
-- Check all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return 50+ tables

-- Verify RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- Should return 0 rows (all tables have RLS)

-- Check migrations
SELECT version
FROM schema_migrations
ORDER BY version DESC
LIMIT 10;
```

### 3. Configure Database Settings

**Supabase Dashboard → Settings → Database:**

- **Connection Pooling:** Enabled (Mode: Transaction)
- **Auto-pause:** Disabled (for production)
- **Daily Backups:** Enabled
- **Point-in-time Recovery:** Enabled (paid plans)

---

## ✅ Quick Reference - All Required Credentials

### Core (Required)
```
✅ Supabase URL: [Already configured]
✅ Supabase Anon Key: [Already configured]
⏱️ Google Analytics ID: G-XXXXXXXXXX
⏱️ Facebook Pixel ID: 123456789012345
⏱️ Resend API Key: re_xxxxxxxxxxxx
⏱️ Sentry DSN: https://xxx@xxx.ingest.sentry.io/xxx
⏱️ Stripe Publishable: pk_live_xxxxxxxxxxxx
```

### Social Auth (Optional)
```
⏱️ Google Client ID: xxxx.apps.googleusercontent.com
⏱️ Facebook App ID: 123456789012345
```

### Advanced (Optional)
```
⏱️ Instagram Token: [For feed integration]
⏱️ YouTube API Key: AIzaSyxxxxxxxxxx
⏱️ Fitbit Client ID: [For wearables]
⏱️ Oura Client ID: [For wearables]
```

---

## 🎯 Deployment Time Estimate

| Phase | Time | Status |
|-------|------|--------|
| Services Setup | 60 min | ⏱️ To Do |
| Database Migrations | 15 min | ⏱️ To Do |
| Vercel Deployment | 15 min | ⏱️ To Do |
| Testing | 30 min | ⏱️ To Do |
| **Total** | **2 hours** | |

---

**Last Updated:** 2025-10-23
**Status:** Ready for Deployment
**Next Step:** Create accounts and gather credentials
