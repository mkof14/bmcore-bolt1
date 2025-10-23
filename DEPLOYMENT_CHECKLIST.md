# Deployment Checklist

Complete checklist for deploying BioMath Core to production.

## Pre-Deployment

### Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Configure all required environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set up CDN URLs
- [ ] Configure production API endpoints

### Database
- [ ] Run all migrations: `supabase db push`
- [ ] Verify RLS policies are enabled on all tables
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Test database performance
- [ ] Set up monitoring and alerts

### API Keys & Secrets
- [ ] Generate production API keys
- [ ] Configure Stripe live keys
- [ ] Set up SendGrid/Resend for email
- [ ] Configure OpenAI/Gemini/Claude keys
- [ ] Set up Sentry DSN for error tracking
- [ ] Generate VAPID keys for push notifications
- [ ] Configure OAuth credentials for health devices

### Security
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS policies
- [ ] Set up rate limiting
- [ ] Enable CSP headers
- [ ] Configure secure cookies
- [ ] Set up API key rotation schedule
- [ ] Enable 2FA for admin accounts
- [ ] Review and update RLS policies

### Build & Optimization
- [ ] Run production build: `npm run build`
- [ ] Check bundle size (<500KB gzipped)
- [ ] Optimize images and assets
- [ ] Enable gzip compression
- [ ] Configure CDN caching
- [ ] Test build locally

### Testing
- [ ] Run all tests: `npm test`
- [ ] Test authentication flows
- [ ] Test payment processing (Stripe test mode)
- [ ] Test email delivery
- [ ] Test device integrations
- [ ] Test AI assistant features
- [ ] Load testing
- [ ] Security scanning

## Deployment

### Platform Setup (Vercel/Netlify)
- [ ] Connect repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Configure custom domain
- [ ] Set up SSL/TLS
- [ ] Configure redirects and rewrites

### DNS & Domain
- [ ] Point domain to hosting provider
- [ ] Configure SSL certificate
- [ ] Set up www redirect
- [ ] Configure SPF/DKIM for email
- [ ] Test DNS propagation

### CDN & Storage
- [ ] Configure Cloudinary/S3
- [ ] Set up image optimization
- [ ] Configure CORS for storage
- [ ] Test file uploads
- [ ] Set up backup storage

### Monitoring Setup
- [ ] Configure Sentry error tracking
- [ ] Set up Google Analytics
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting (email/Slack)

## Post-Deployment

### Verification
- [ ] Test homepage loads
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test payment flow (test mode)
- [ ] Test email delivery
- [ ] Test AI assistant
- [ ] Test device integrations
- [ ] Test all critical user flows

### Performance
- [ ] Check Lighthouse scores (>90)
- [ ] Test Core Web Vitals
- [ ] Verify page load times (<3s)
- [ ] Test on mobile devices
- [ ] Test on slow connections
- [ ] Verify PWA functionality

### SEO & Analytics
- [ ] Submit sitemap to Google
- [ ] Verify meta tags
- [ ] Test social media previews
- [ ] Configure Google Search Console
- [ ] Verify analytics tracking
- [ ] Test conversion tracking

### Documentation
- [ ] Update README
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document rollback procedure
- [ ] Update API documentation
- [ ] Create user guides

### Compliance
- [ ] Verify GDPR compliance
- [ ] Check HIPAA requirements
- [ ] Review privacy policy
- [ ] Update terms of service
- [ ] Configure cookie banner
- [ ] Set up data export/deletion

## Go-Live

### Final Checks
- [ ] Switch Stripe to live mode
- [ ] Update email provider to production
- [ ] Enable production AI keys
- [ ] Disable debug logging
- [ ] Remove console.log statements
- [ ] Update error pages
- [ ] Test error handling

### Communication
- [ ] Notify team of deployment
- [ ] Send launch announcement
- [ ] Update status page
- [ ] Prepare support team
- [ ] Monitor social media
- [ ] Prepare incident response plan

### Monitoring (First 24 Hours)
- [ ] Monitor error rates
- [ ] Watch server resources
- [ ] Check database performance
- [ ] Monitor API usage
- [ ] Track user signups
- [ ] Monitor payment processing
- [ ] Check email delivery rates

## Post-Launch

### Week 1
- [ ] Daily monitoring of all metrics
- [ ] Address critical bugs immediately
- [ ] Collect user feedback
- [ ] Monitor conversion rates
- [ ] Review performance metrics
- [ ] Check security logs
- [ ] Plan first update

### Week 2-4
- [ ] Analyze user behavior
- [ ] Optimize conversion funnels
- [ ] Address user feedback
- [ ] Plan feature improvements
- [ ] Review API costs
- [ ] Optimize database queries
- [ ] Update documentation

## Rollback Plan

If issues occur:
1. **Immediate:** Revert to previous deployment
2. **Database:** Keep migrations, roll back code only
3. **API Keys:** Don't rotate during rollback
4. **Communication:** Notify users of temporary issues
5. **Investigation:** Identify and fix issue
6. **Redeploy:** Once fixed, redeploy with tests

## Maintenance Schedule

### Daily
- Monitor error rates
- Check server health
- Review security logs

### Weekly
- Review analytics
- Check API costs
- Database maintenance
- Security updates

### Monthly
- Full security audit
- Performance review
- Dependency updates
- Backup verification
- Cost optimization review

## Emergency Contacts

**Platform Issues:**
- Vercel/Netlify support
- Database provider support

**API Providers:**
- Stripe: https://support.stripe.com/
- OpenAI: support@openai.com
- Supabase: support@supabase.io

**Internal:**
- DevOps: devops@biomathcore.com
- Security: security@biomathcore.com
- Support: support@biomathcore.com

## Success Criteria

✅ **Deployment successful if:**
- All tests passing
- Error rate <1%
- Page load time <3s
- Uptime >99.9%
- No critical security issues
- All integrations working
- Payment processing functional

---

**Last Updated:** 2025-10-23
**Version:** 1.0.0
