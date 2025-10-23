# Production Deployment Checklist

## 🚨 CRITICAL - Must Fix Before Launch

### 1. Remove Console Statements
**Priority:** CRITICAL ⚠️
**Status:** ❌ NOT DONE

**Issue:** 199 console.log/error/warn statements found in production code

**Action Required:**
```bash
# Search and remove/replace console statements
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '/console\.log/d'

# OR use proper logging library
npm install loglevel
```

**Why Critical:**
- Exposes sensitive data in browser console
- Performance impact in production
- Debugging information visible to users
- Potential security leak

**Solution:**
```typescript
// src/lib/logger.ts
import log from 'loglevel';

if (import.meta.env.PROD) {
  log.setLevel('error');
} else {
  log.setLevel('debug');
}

export default log;

// Usage:
import log from './lib/logger';
log.debug('Debug info');
log.error('Error occurred');
```

### 2. Environment Variables Validation
**Priority:** CRITICAL ⚠️
**Status:** ❌ NEEDS VALIDATION

**Required Variables:**
```env
# Supabase (REQUIRED)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Analytics (REQUIRED for tracking)
VITE_GA_MEASUREMENT_ID=
VITE_FACEBOOK_PIXEL_ID=

# Email (REQUIRED for notifications)
VITE_EMAIL_PROVIDER=resend
VITE_RESEND_API_KEY=

# Social Auth (Optional but recommended)
VITE_GOOGLE_CLIENT_ID=
VITE_FACEBOOK_APP_ID=
```

**Action:**
```typescript
// src/lib/env-validator.ts
export function validateEnv() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GA_MEASUREMENT_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
```

### 3. Database Security Review
**Priority:** CRITICAL ⚠️
**Status:** ⚠️ NEEDS REVIEW

**Check:**
- [ ] All tables have RLS enabled
- [ ] No SELECT policies with `USING (true)`
- [ ] Admin access properly restricted
- [ ] Sensitive data encrypted
- [ ] API rate limiting configured
- [ ] No exposed service role keys

**Verify RLS:**
```sql
-- Check tables without RLS
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
  SELECT tablename FROM pg_tables t
  WHERE rowsecurity = true
);
```

### 4. API Keys Security
**Priority:** CRITICAL ⚠️
**Status:** ⚠️ NEEDS VERIFICATION

**Never expose in client code:**
- ❌ Service Role Key
- ❌ Secret API keys
- ❌ Database passwords
- ❌ OAuth secrets

**Only use in client:**
- ✅ Anon Key (public)
- ✅ Public API keys
- ✅ OAuth client IDs

**Check for exposed secrets:**
```bash
# Search for potential leaked secrets
rg -i "secret|password|private.*key" src/
```

### 5. CORS Configuration
**Priority:** HIGH ⚠️
**Status:** ⚠️ NEEDS CONFIGURATION

**Supabase Dashboard → Settings → API:**
```
Allowed Origins:
- https://yourdomain.com
- https://www.yourdomain.com
```

**DO NOT USE:**
- `*` (allow all)
- `http://` in production

## 🔒 Security Hardening

### 6. Content Security Policy (CSP)
**Priority:** HIGH
**Status:** ❌ NOT IMPLEMENTED

**Add to index.html or server headers:**
```html
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://txnwvaqzmtlhefcxilfu.supabase.co https://www.google-analytics.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  ">
```

### 7. Security Headers
**Priority:** HIGH
**Status:** ❌ NOT IMPLEMENTED

**Add to vercel.json or server config:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### 8. Rate Limiting
**Priority:** HIGH
**Status:** ⚠️ PARTIAL

**Already implemented:**
- ✅ Basic rate limiter in `src/lib/rateLimiter.ts`

**Needs:**
- [ ] Supabase Edge Functions rate limiting
- [ ] API endpoint protection
- [ ] Login attempt limiting
- [ ] Email sending limits

**Supabase Dashboard → API → Rate Limiting:**
```
Requests per second: 100
Burst: 200
```

### 9. Input Validation
**Priority:** HIGH
**Status:** ⚠️ PARTIAL

**Implemented:**
- ✅ Form validation in `src/lib/formValidation.ts`

**Needs:**
- [ ] Sanitize all user inputs
- [ ] Validate file uploads
- [ ] Check file types and sizes
- [ ] Prevent XSS attacks

**Add:**
```typescript
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

## 📊 Performance Optimization

### 10. Remove Source Maps
**Priority:** MEDIUM
**Status:** ❌ NOT CONFIGURED

**vite.config.ts:**
```typescript
export default defineConfig({
  build: {
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true
      }
    }
  }
});
```

### 11. Code Splitting
**Priority:** MEDIUM
**Status:** ✅ AUTOMATIC

**Current bundle size:** 416KB (117KB gzipped)
- ✅ Acceptable
- Admin panel: 119KB
- Member zone: 174KB

### 12. Image Optimization
**Priority:** MEDIUM
**Status:** ⚠️ NEEDS OPTIMIZATION

**Current issues:**
- PNG files not optimized
- No WebP versions
- Large file sizes

**Action:**
```bash
# Optimize images
npm install -D imagemin-cli imagemin-webp

# Convert to WebP
find public -name "*.png" -o -name "*.jpg" | xargs -I {} imagemin {} --plugin=webp --out-dir=public/optimized
```

### 13. CDN Configuration
**Priority:** MEDIUM
**Status:** ❌ NOT CONFIGURED

**Recommended:**
- Cloudflare CDN
- Asset caching
- Image optimization
- DDoS protection

## 🔍 Monitoring & Observability

### 14. Error Tracking Setup
**Priority:** HIGH
**Status:** ⚠️ READY BUT NOT CONFIGURED

**File ready:** `src/lib/errorTracking.ts`

**Need to configure:**
```typescript
// src/main.tsx
import { initErrorTracking } from './lib/errorTracking';

initErrorTracking({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  enabled: true
});
```

**Get Sentry DSN:**
1. Create account at sentry.io
2. Create new project
3. Copy DSN
4. Add to .env

### 15. Analytics Verification
**Priority:** HIGH
**Status:** ⚠️ NEEDS CONFIGURATION

**Required:**
```typescript
// src/App.tsx
import { initGA } from './lib/googleAnalytics';
import { initFacebookPixel } from './lib/facebookPixel';

useEffect(() => {
  initGA(import.meta.env.VITE_GA_MEASUREMENT_ID, true);
  initFacebookPixel(import.meta.env.VITE_FACEBOOK_PIXEL_ID, true);
}, []);
```

### 16. Uptime Monitoring
**Priority:** MEDIUM
**Status:** ❌ NOT CONFIGURED

**Recommended Services:**
- UptimeRobot (free)
- Pingdom
- StatusCake

**Monitor:**
- Homepage: https://yourdomain.com
- API: https://yourdomain.com/api/health
- Database connectivity

## 📧 Email Configuration

### 17. Email Provider Setup
**Priority:** HIGH
**Status:** ⚠️ MOCK MODE

**Current:** Using mock provider (emails not sent!)

**Action Required:**
```env
# Option 1: Resend (Recommended)
VITE_EMAIL_PROVIDER=resend
VITE_RESEND_API_KEY=re_xxxxx

# Option 2: SendGrid
VITE_EMAIL_PROVIDER=sendgrid
VITE_SENDGRID_API_KEY=SG.xxxxx
```

**Verify:**
1. Test welcome email
2. Test password reset
3. Test notifications
4. Test marketing emails

### 18. Email Templates
**Priority:** MEDIUM
**Status:** ✅ CREATED (38 templates)

**Database:** `email_templates` table populated

**Verify in Supabase:**
```sql
SELECT name, status FROM email_templates;
```

## 🗄️ Database Management

### 19. Database Migrations
**Priority:** CRITICAL ⚠️
**Status:** ⚠️ NEEDS DEPLOYMENT

**Created migrations:** 42 files

**Deploy to production:**
```bash
# If using Supabase CLI
supabase db push --include-seed=false

# OR run migrations manually in Dashboard
```

**Verify:**
```sql
SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 10;
```

### 20. Database Backups
**Priority:** CRITICAL ⚠️
**Status:** ⚠️ NEEDS CONFIGURATION

**Supabase has daily backups (7 days)**

**Additional backup:**
```bash
# Setup automated backups
npm run backup:db  # Uses scripts/backup-database.sh
```

**Schedule:**
- Daily full backup
- Weekly retention (4 weeks)
- Monthly retention (12 months)

### 21. Database Indexes
**Priority:** HIGH
**Status:** ✅ CREATED

**All migrations include proper indexes**

**Verify performance:**
```sql
-- Check slow queries
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🚀 Deployment

### 22. Build Verification
**Priority:** CRITICAL ⚠️
**Status:** ✅ PASSING

**Last build:** Successful (7.20s)

**Pre-deploy checks:**
```bash
npm run typecheck  # TypeScript validation
npm run lint      # ESLint checks
npm run test      # Run tests
npm run build     # Production build
```

### 23. Environment Setup
**Priority:** CRITICAL ⚠️
**Status:** ⚠️ NEEDS PRODUCTION VARS

**Vercel Environment Variables:**
1. Go to Project Settings → Environment Variables
2. Add all from `.env.example`
3. Use Production values (not dev)
4. Separate Preview/Production envs

### 24. Domain Configuration
**Priority:** HIGH
**Status:** ❌ NOT CONFIGURED

**Setup:**
1. Configure custom domain in Vercel
2. Add DNS records
3. Enable SSL/TLS
4. Force HTTPS redirect
5. Update Supabase redirect URLs

**Supabase URLs to update:**
```
Site URL: https://yourdomain.com
Redirect URLs:
- https://yourdomain.com/auth/callback
- https://yourdomain.com/member-zone
```

### 25. Social Auth Configuration
**Priority:** HIGH (if using social login)
**Status:** ⚠️ NEEDS OAUTH CREDENTIALS

**Required for each provider:**

**Google:**
1. Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add authorized origins
4. Add to Supabase Dashboard

**Facebook:**
1. Meta Developer Console
2. Create app
3. Add domains
4. Get App ID & Secret

**Configure in Supabase Dashboard → Authentication → Providers**

## 🧪 Testing

### 26. End-to-End Testing
**Priority:** MEDIUM
**Status:** ❌ NOT IMPLEMENTED

**Add E2E tests:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Critical flows to test:**
- User signup
- User login
- Subscription purchase
- Report generation
- Social sharing

### 27. Load Testing
**Priority:** MEDIUM
**Status:** ❌ NOT DONE

**Recommended:**
- Apache JMeter
- k6.io
- Artillery

**Test scenarios:**
- 100 concurrent users
- 1000 requests/minute
- Database query performance
- API endpoint limits

## 📱 Mobile & PWA

### 28. PWA Testing
**Priority:** MEDIUM
**Status:** ⚠️ NEEDS TESTING

**Files exist:**
- ✅ manifest.json
- ✅ service-worker.js
- ✅ PWA install prompt

**Test on:**
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Chrome Desktop
- [ ] Firefox

### 29. Responsive Design Check
**Priority:** MEDIUM
**Status:** ⚠️ NEEDS TESTING

**Test breakpoints:**
- 320px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1920px (large desktop)

## 📄 Legal & Compliance

### 30. GDPR Compliance
**Priority:** HIGH
**Status:** ✅ IMPLEMENTED

**Completed:**
- ✅ Privacy Policy page
- ✅ Cookie consent banner
- ✅ Data export functionality
- ✅ Data deletion (right to be forgotten)
- ✅ Privacy controls

**Verify:**
- [ ] Cookie banner shows on first visit
- [ ] All forms have consent checkboxes
- [ ] Data export works
- [ ] Account deletion works

### 31. Terms of Service
**Priority:** HIGH
**Status:** ✅ EXISTS

**Review:**
- [ ] Legal team review
- [ ] Update company info
- [ ] Add arbitration clause
- [ ] Liability limitations
- [ ] Update date

### 32. Security Disclosure
**Priority:** MEDIUM
**Status:** ✅ EXISTS

**File:** `public/.well-known/security.txt`

**Update:**
- Contact email
- Security email
- Expiration date

## 🎯 Final Checks

### 33. Functionality Testing
**Priority:** CRITICAL ⚠️
**Status:** ❌ NEEDS TESTING

**Test every feature:**
- [ ] User registration
- [ ] Email verification
- [ ] Password reset
- [ ] Login (email + social)
- [ ] Profile update
- [ ] Subscription purchase
- [ ] Payment processing
- [ ] Report generation
- [ ] AI assistant
- [ ] Device integration
- [ ] Referral system
- [ ] Admin panel
- [ ] All member zone sections

### 34. Browser Compatibility
**Priority:** HIGH
**Status:** ❌ NEEDS TESTING

**Test on:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 35. Accessibility Audit
**Priority:** MEDIUM
**Status:** ❌ NOT DONE

**Tools:**
- Lighthouse (Chrome DevTools)
- axe DevTools
- WAVE

**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast

## 📊 Launch Checklist Summary

### BLOCKERS (Must fix):
1. ❌ Remove console.log statements (199 found)
2. ⚠️ Configure environment variables
3. ⚠️ Review database security (RLS)
4. ❌ Setup error tracking (Sentry)
5. ⚠️ Configure email provider
6. ⚠️ Deploy database migrations
7. ⚠️ Setup monitoring
8. ❌ Remove source maps in production
9. ⚠️ Configure analytics (GA4 + FB Pixel)
10. ❌ Test all critical flows

### HIGH PRIORITY:
11. ⚠️ Add security headers
12. ⚠️ Configure CORS properly
13. ⚠️ Setup rate limiting
14. ⚠️ Configure backups
15. ⚠️ Domain & SSL setup

### RECOMMENDED:
16. Image optimization
17. CDN setup
18. Load testing
19. E2E tests
20. Accessibility audit

---

## Quick Fix Script

```bash
#!/bin/bash
# Quick production fixes

echo "🔧 Applying production fixes..."

# 1. Remove console statements
echo "Removing console.log..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '/console\.log(/d'

# 2. Update vite config
echo "Updating vite.config.ts..."
cat >> vite.config.ts << 'EOF'

  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
EOF

# 3. Build
echo "Building..."
npm run build

echo "✅ Done! Review checklist before deploying."
```

---

**Last Updated:** 2025-10-23
**Status:** READY FOR PRODUCTION (after fixes)
**Estimated Fix Time:** 4-8 hours
