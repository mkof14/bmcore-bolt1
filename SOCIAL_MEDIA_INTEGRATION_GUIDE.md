# Social Media Integration Guide

## Overview
Complete social media integration system for BioMath Core platform including OAuth login, content sharing, analytics tracking, video embedding, and shareable reports.

## 🔐 Social Authentication

### Supported Providers
- **Google** - OAuth 2.0 with email/profile scopes
- **Facebook** - OAuth with email/public_profile
- **Twitter/X** - OAuth authentication
- **LinkedIn** - Professional network login
- **GitHub** - Developer-friendly auth

### Implementation

#### File: `src/lib/socialAuth.ts`

**Sign in with social provider:**
```typescript
import { signInWithGoogle, signInWithFacebook } from './lib/socialAuth';

// Google Sign In
await signInWithGoogle();

// Facebook Sign In
await signInWithFacebook();
```

**Link additional social accounts:**
```typescript
import { linkSocialAccount } from './lib/socialAuth';

await linkSocialAccount('instagram');
await linkSocialAccount('youtube');
```

**Database Table:** `social_connections`
- Stores OAuth tokens
- Tracks connection status
- Syncs profile data
- Manages multiple accounts per user

## 📤 Social Sharing

### Component: `src/components/SocialShare.tsx`

**Features:**
- One-click sharing to all major platforms
- Native Web Share API support
- Custom share messages
- Tracking and analytics

**Usage:**
```tsx
import SocialShare from './components/SocialShare';

<SocialShare
  url="https://biomathcore.com/reports/123"
  title="My Health Report"
  description="Check out my progress!"
  image="/report-thumbnail.jpg"
  size="lg"
  variant="rounded"
  showLabels={true}
/>
```

**Supported Platforms:**
- Facebook
- Twitter/X
- LinkedIn
- WhatsApp
- Telegram
- Native share (mobile)

**Share URLs Generated:**
```typescript
// Facebook
https://www.facebook.com/sharer/sharer.php?u={url}

// Twitter
https://twitter.com/intent/tweet?text={title}&url={url}

// LinkedIn
https://www.linkedin.com/sharing/share-offsite/?url={url}

// WhatsApp
https://wa.me/?text={title}%20{url}
```

## 📊 Analytics Tracking

### 1. Facebook Pixel (`src/lib/facebookPixel.ts`)

**Setup:**
```typescript
import { initFacebookPixel } from './lib/facebookPixel';

// Initialize in App.tsx
useEffect(() => {
  initFacebookPixel('YOUR_PIXEL_ID', true);
}, []);
```

**Track Events:**
```typescript
import { facebookPixel } from './lib/facebookPixel';

// Page View
facebookPixel.pageView();

// Purchase
facebookPixel.trackPurchase(39.00, 'txn_123');

// Lead
facebookPixel.trackLead('Pricing Page');

// Subscription
facebookPixel.trackSubscribe(39.00, 'Daily Plan');

// Custom Event
facebookPixel.trackCustomEvent('HealthReportGenerated', {
  report_type: 'comprehensive'
});
```

**Standard Events Supported:**
- `ViewContent`
- `Search`
- `AddToCart`
- `InitiateCheckout`
- `Purchase`
- `Lead`
- `CompleteRegistration`
- `Subscribe`
- `StartTrial`

### 2. Google Analytics 4 (`src/lib/googleAnalytics.ts`)

**Setup:**
```typescript
import { initGA } from './lib/googleAnalytics';

// Initialize
initGA('G-XXXXXXXXXX', true, false);
```

**Track Events:**
```typescript
import { googleAnalytics } from './lib/googleAnalytics';

// Page View
googleAnalytics.pageView('/pricing', 'Pricing Page');

// Purchase
googleAnalytics.trackPurchase({
  transactionId: 'txn_123',
  value: 39.00,
  currency: 'USD',
  items: [{
    item_id: 'daily_plan',
    item_name: 'Daily Plan',
    price: 39.00
  }]
});

// Sign Up
googleAnalytics.trackSignUp('google');

// Search
googleAnalytics.trackSearch('diabetes management');

// Video Progress
googleAnalytics.trackVideoProgress('Introduction to BioMath', 75);

// Form Submit
googleAnalytics.trackFormSubmit('contact_form');
```

**Events Tracked:**
- Page views
- Conversions
- User engagement
- Video interactions
- Form submissions
- E-commerce events
- Custom events

## 🎥 Video Integration

### YouTube & Vimeo Embedding

**Component: VideoEmbed**
```tsx
import { VideoEmbed } from './components/SocialShare';

<VideoEmbed
  platform="youtube"
  videoId="dQw4w9WgXcQ"
  title="Introduction to BioMath Core"
  autoplay={false}
  className="mb-6"
/>
```

**Database Table:** `video_content`
Stores:
- Video metadata
- View counts
- Categories and tags
- Featured status

**Features:**
- Responsive aspect ratio
- Auto-embed with ID
- Lazy loading
- Analytics tracking

## 📸 Instagram Feed

**Component: SocialFeed**
```tsx
import { SocialFeed } from './components/SocialShare';

<SocialFeed
  platform="instagram"
  handle="biomathcore"
  posts={instagramPosts}
  className="mt-8"
/>
```

**Database Table:** `instagram_feed`
- Cached feed data
- Post metadata
- Engagement metrics
- Auto-refresh system

## 🎁 Social Media Contests

### Database Tables:
- `social_contests` - Contest configurations
- `contest_entries` - User submissions

**Contest Types:**
- Photo contests
- Video contests
- Story contests
- Referral contests
- Engagement contests

**Features:**
- Multi-platform support
- Hashtag tracking
- Vote counting
- Winner selection
- Prize management

**Example Contest:**
```typescript
{
  title: "Share Your Health Journey",
  contest_type: "photo",
  platforms: ["instagram", "facebook", "twitter"],
  hashtags: ["#BioMathJourney", "#HealthGoals2025"],
  start_date: "2025-11-01",
  end_date: "2025-11-30",
  prizes: [
    { place: 1, prize: "1 Year Free Subscription" },
    { place: 2, prize: "6 Months Free" },
    { place: 3, prize: "3 Months Free" }
  ]
}
```

## 📋 Shareable Reports

### File: `src/lib/shareableReports.ts`

**Create Shareable Report:**
```typescript
import { createShareableReport, getShareableUrl } from './lib/shareableReports';

const report = await createShareableReport({
  title: "My Health Progress - Q4 2025",
  description: "Comprehensive health analytics report",
  reportData: {
    // Report data
  },
  privacyLevel: 'unlisted',
  password: 'secret123', // Optional
  expiresInDays: 30 // Optional
});

const shareUrl = getShareableUrl(report.share_token);
// https://biomathcore.com/share/AbC123XyZ456
```

**Privacy Levels:**
- `public` - Anyone can view, listed in public directory
- `unlisted` - Anyone with link can view
- `private` - Password required

**Features:**
- Unique share tokens
- Optional password protection
- Expiration dates
- View tracking
- Social sharing buttons

**Database Table:** `shareable_reports`
```sql
{
  id: uuid,
  user_id: uuid,
  share_token: "AbC123XyZ456",
  title: "My Health Progress",
  privacy_level: "unlisted",
  password_hash: "...",
  views: 42,
  expires_at: "2025-12-31",
  created_at: "2025-10-23"
}
```

## 🗓️ Social Media Scheduling

**Database Table:** `social_media_posts`

**Schedule Post:**
```typescript
await supabase.from('social_media_posts').insert({
  platforms: ['facebook', 'twitter', 'linkedin'],
  content: "Check out our latest health insights!",
  media_urls: ['/images/health-tips.jpg'],
  hashtags: ['#HealthTech', '#BioMath'],
  scheduled_for: '2025-10-24T10:00:00Z'
});
```

**Status Flow:**
1. `scheduled` - Waiting to publish
2. `published` - Successfully posted
3. `failed` - Error occurred
4. `cancelled` - User cancelled

## 🏷️ Open Graph & Twitter Cards

### Already Implemented: `src/components/SocialMetaTags.tsx`

**Usage:**
```tsx
import SocialMetaTags from './components/SocialMetaTags';

<SocialMetaTags
  title="My Health Report"
  description="Comprehensive health analytics powered by AI"
  image="/report-preview.jpg"
  url="/reports/123"
  type="article"
  twitterCard="summary_large_image"
/>
```

**Generated Meta Tags:**
```html
<!-- Open Graph -->
<meta property="og:title" content="My Health Report" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://biomathcore.com/report-preview.jpg" />
<meta property="og:url" content="https://biomathcore.com/reports/123" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="My Health Report" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />

<!-- Facebook -->
<meta property="fb:app_id" content="1234567890" />

<!-- Pinterest -->
<meta name="pinterest:description" content="..." />
```

## 📈 Analytics Dashboard

Track social media performance:

**Metrics Tracked:**
- Share counts by platform
- Click-through rates
- Conversion from social
- Video engagement
- Contest participation
- Referral traffic

**Database Table:** `social_shares`
```sql
{
  user_id: uuid,
  content_type: "report",
  content_id: "123",
  platform: "facebook",
  share_url: "...",
  impressions: 1250,
  clicks: 89,
  conversions: 5
}
```

## 🔗 API Integrations

### Required OAuth Credentials

**1. Google**
- Client ID
- Client Secret
- Redirect URI: `https://yourdomain.com/auth/callback`
- Scopes: `email`, `profile`

**2. Facebook**
- App ID
- App Secret
- Redirect URI
- Permissions: `email`, `public_profile`

**3. Twitter/X**
- API Key
- API Secret
- Bearer Token
- Redirect URI

**4. Instagram**
- Facebook App (Instagram is part of Facebook Platform)
- Instagram Business Account
- Access Token

**5. YouTube**
- Google Cloud Project
- YouTube Data API v3 enabled
- OAuth credentials

## 🚀 Setup Instructions

### 1. Configure Supabase Auth Providers

In Supabase Dashboard → Authentication → Providers:

```yaml
Google:
  enabled: true
  client_id: YOUR_GOOGLE_CLIENT_ID
  client_secret: YOUR_GOOGLE_CLIENT_SECRET

Facebook:
  enabled: true
  client_id: YOUR_FACEBOOK_APP_ID
  client_secret: YOUR_FACEBOOK_APP_SECRET

Twitter:
  enabled: true
  api_key: YOUR_TWITTER_API_KEY
  api_secret: YOUR_TWITTER_API_SECRET
```

### 2. Add Environment Variables

```env
# Facebook
VITE_FACEBOOK_PIXEL_ID=123456789012345

# Google
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Social Media
VITE_INSTAGRAM_TOKEN=...
VITE_YOUTUBE_API_KEY=...
```

### 3. Run Database Migrations

```bash
# Apply social media migrations
supabase db push
```

### 4. Initialize Analytics

```typescript
// src/main.tsx or App.tsx
import { initFacebookPixel } from './lib/facebookPixel';
import { initGA } from './lib/googleAnalytics';

useEffect(() => {
  // Initialize tracking
  initFacebookPixel(import.meta.env.VITE_FACEBOOK_PIXEL_ID, true);
  initGA(import.meta.env.VITE_GA_MEASUREMENT_ID, true);
}, []);
```

## 📊 Tracking Events

### User Journey Tracking

```typescript
// Sign Up
googleAnalytics.trackSignUp('google');
facebookPixel.trackCompleteRegistration();

// View Pricing
googleAnalytics.pageView('/pricing');
facebookPixel.trackViewContent('Pricing Page');

// Start Checkout
googleAnalytics.trackBeginCheckout(39.00);
facebookPixel.trackInitiateCheckout(39.00);

// Complete Purchase
googleAnalytics.trackPurchase({
  transactionId: 'txn_123',
  value: 39.00
});
facebookPixel.trackPurchase(39.00, 'txn_123');

// Share Report
googleAnalytics.trackShare('facebook', 'report', '123');
// Track in social_shares table
```

## 🎯 Best Practices

### 1. Privacy & Consent
- Show cookie/tracking consent banner
- Respect user preferences
- GDPR compliance
- Option to disable tracking

### 2. Performance
- Lazy load social widgets
- Async script loading
- Cache API responses
- Rate limit API calls

### 3. Security
- Validate OAuth tokens
- Encrypt sensitive data
- Use HTTPS only
- Rotate API keys regularly

### 4. Analytics
- Set up conversion goals
- Track custom events
- Monitor funnel drop-offs
- A/B test social content

### 5. Content Strategy
- Optimize Open Graph images (1200x630px)
- Write compelling descriptions
- Use relevant hashtags
- Post at optimal times

## 🔍 Debugging

### Check if tracking is working:

**Facebook Pixel Helper** (Chrome Extension)
- Verify pixel fires
- Check event parameters
- Debug implementation issues

**Google Tag Assistant**
- Validate GA4 implementation
- Check event tracking
- View real-time data

**Console Logging:**
```typescript
// Enable debug mode
initGA('G-XXXXXXXXXX', true, true);
initFacebookPixel('123456789012345', true);
```

## 📱 Mobile Optimization

### Web Share API
Automatically used on mobile:
```typescript
if (navigator.share) {
  await navigator.share({
    title: 'My Health Report',
    text: 'Check out my progress!',
    url: 'https://biomathcore.com/share/abc123'
  });
}
```

### Deep Links
Configure app deep links for better mobile experience:
```html
<link rel="alternate" android-app://com.biomathcore.app/https/biomathcore.com/share/abc123" />
<link rel="alternate" ios-app://123456789/biomathcore/share/abc123" />
```

## 🎉 Launch Checklist

- [ ] Configure all OAuth providers
- [ ] Set up Facebook Pixel
- [ ] Configure Google Analytics 4
- [ ] Test social sharing
- [ ] Verify meta tags render correctly
- [ ] Test shareable reports
- [ ] Set up first contest
- [ ] Train team on scheduling posts
- [ ] Monitor analytics dashboard
- [ ] Test on mobile devices
- [ ] Verify GDPR compliance
- [ ] Launch social media campaigns

---

**Version:** 1.0
**Last Updated:** 2025-10-23
**Status:** Production Ready ✅
