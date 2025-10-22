# BioMath Core - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Already configured (txnwvaqzmtlhefcxilfu.supabase.co)

## Deployment Steps

### 1. Connect to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Vite framework
4. Click "Deploy"

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://txnwvaqzmtlhefcxilfu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bnd2YXF6bXRsaGVmY3hpbGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTUxNDEsImV4cCI6MjA3NjM5MTE0MX0.nvfoPz57lwSgiVJDwbZgwvlTJhsnHtk4nM1M-q2_snA

# Email Provider Configuration
VITE_EMAIL_PROVIDER=mock
VITE_EMAIL_FROM=BioMath Core <no-reply@biomathcore.com>
VITE_EMAIL_REPLY_TO=support@biomathcore.com

# When ready for production, configure real email provider:
# VITE_EMAIL_PROVIDER=resend
# VITE_RESEND_API_KEY=your_api_key_here

# Payment Configuration (when ready)
# VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# AI Configuration (when ready)
# VITE_OPENAI_API_KEY=your_openai_key
```

**IMPORTANT**: Set these for **Production**, **Preview**, and **Development** environments.

### 3. Build Settings

Vercel should auto-detect, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (recommended)

### 4. Domain Configuration

**Default Domain**: Your project will get a `.vercel.app` domain

**Custom Domain**:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### 5. Configure Supabase for Production

Update Supabase Authentication URLs:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Authentication → URL Configuration
3. Add your Vercel URLs:
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**:
     - `https://your-domain.vercel.app/**`
     - `https://*.vercel.app/**` (for preview deployments)

### 6. Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify database connection
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Verify email templates (if using real provider)
- [ ] Test payment flow (if Stripe configured)
- [ ] Check console for errors
- [ ] Test AI Assistant (if API configured)

## Continuous Deployment

Every push to `main` branch will trigger automatic deployment.

**Preview Deployments**: Every pull request gets its own preview URL.

## Environment-Specific Configurations

### Development
```bash
npm run dev
```

### Preview (Vercel)
Automatic on PR creation

### Production (Vercel)
Automatic on merge to main

## Monitoring

**Vercel Analytics**: Automatically enabled
- Real-time performance metrics
- Web Vitals tracking
- Deployment logs

**Recommended Additional Tools**:
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics (user tracking)

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
npm run preview
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding new variables
- Check variable names (case-sensitive)

### 404 on Routes
- Verify `vercel.json` rewrites are configured
- Check SPA routing configuration

### Supabase Connection Issues
- Verify environment variables are set
- Check Supabase URL configuration
- Ensure CORS is configured in Supabase

## Rollback

If deployment fails:
```bash
vercel rollback
```

Or use Vercel Dashboard → Deployments → Select previous version → Promote to Production

## Performance Optimization

**Recommendations**:
1. Enable Edge Network (automatic)
2. Use Image Optimization (Vercel Images)
3. Configure caching headers (already in vercel.json)
4. Implement code splitting
5. Lazy load routes

## Security

**Already Configured**:
- Security headers (X-Frame-Options, CSP)
- HTTPS (automatic)
- Environment variable encryption

**TODO Before Production**:
- [ ] Configure rate limiting (Vercel Edge Functions)
- [ ] Set up DDoS protection (Vercel Pro)
- [ ] Implement proper authentication guards
- [ ] Security audit

## Cost Estimation

**Vercel Free Tier**:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Analytics

**Vercel Pro ($20/month)**:
- 1 TB bandwidth
- Password protection
- Custom domains (unlimited)
- Team collaboration
- Advanced analytics

**Recommended**: Start with Free tier, upgrade when needed.

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [Discord](https://vercel.com/discord)

## Next Steps After Deployment

1. **Connect Real Email Provider** (Resend, SendGrid)
2. **Integrate Stripe** for payments
3. **Add AI API Keys** (OpenAI, Anthropic)
4. **Set Up Monitoring** (Sentry)
5. **Configure Analytics** (Google Analytics)
6. **Custom Domain** setup
7. **SSL Certificate** verification
8. **SEO Optimization** (meta tags)
9. **Load Testing**
10. **Security Audit**

---

**Production Ready Checklist**:
- [ ] Vercel deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Supabase URLs updated
- [ ] Authentication tested
- [ ] Payment integration (Stripe)
- [ ] Email provider configured
- [ ] AI API integrated
- [ ] Monitoring enabled
- [ ] Analytics tracking
- [ ] Error logging (Sentry)
- [ ] Security headers verified
- [ ] GDPR compliance
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing complete
- [ ] Load testing passed
- [ ] Backup strategy in place
