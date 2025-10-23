# API Integration Guide

Complete guide for integrating all external services with BioMath Core.

## Table of Contents
1. [AI Providers](#ai-providers)
2. [Payment Processing](#payment-processing)
3. [Email Services](#email-services)
4. [Media Storage](#media-storage)
5. [Health Device Integrations](#health-device-integrations)
6. [Analytics & Monitoring](#analytics--monitoring)
7. [Testing & Validation](#testing--validation)

---

## AI Providers

### OpenAI (ChatGPT, GPT-4)

**Use Case:** AI Health Assistant, medical insights, conversation

**Setup:**
1. Sign up: https://platform.openai.com/
2. Generate API key: https://platform.openai.com/api-keys
3. Add to `.env`:
```bash
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-4-turbo-preview
```

**Usage Example:**
```typescript
import { API_KEYS, API_ENDPOINTS } from './lib/apiConfig';

async function askHealthQuestion(question: string) {
  const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.OPENAI}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: question }],
    }),
  });
  return await response.json();
}
```

---

### Google Gemini

**Use Case:** Multi-modal AI analysis, image understanding

**Setup:**
1. Sign up: https://makersuite.google.com/
2. Get API key: https://makersuite.google.com/app/apikey
3. Add to `.env`:
```bash
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxx
VITE_GEMINI_MODEL=gemini-pro
```

**Usage Example:**
```typescript
async function analyzeHealthData(data: any) {
  const response = await fetch(
    `${API_ENDPOINTS.GEMINI}/models/gemini-pro:generateContent?key=${API_KEYS.GEMINI}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: JSON.stringify(data) }] }],
      }),
    }
  );
  return await response.json();
}
```

---

### Anthropic Claude

**Use Case:** Deep medical analysis, research summaries

**Setup:**
1. Sign up: https://console.anthropic.com/
2. Generate API key
3. Add to `.env`:
```bash
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
VITE_ANTHROPIC_MODEL=claude-3-opus-20240229
```

---

### ElevenLabs

**Use Case:** Text-to-speech for health reports, voice AI

**Setup:**
1. Sign up: https://elevenlabs.io/
2. Get API key from dashboard
3. Add to `.env`:
```bash
VITE_ELEVENLABS_API_KEY=xxxxxxxxxxxx
VITE_ELEVENLABS_VOICE_ID=your_voice_id
```

**Usage Example:**
```typescript
async function textToSpeech(text: string) {
  const response = await fetch(
    `${API_ENDPOINTS.ELEVENLABS}/text-to-speech/${API_KEYS.ELEVENLABS}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEYS.ELEVENLABS,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice_settings: { stability: 0.5 } }),
    }
  );
  return await response.blob();
}
```

---

## Payment Processing

### Stripe

**Setup:**
1. Sign up: https://stripe.com/
2. Get keys: https://dashboard.stripe.com/apikeys
3. Add to `.env`:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
VITE_STRIPE_SECRET_KEY=sk_test_xxxx
VITE_STRIPE_WEBHOOK_SECRET=whsec_xxxx
```

**Usage Example:**
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(API_KEYS.STRIPE_PUBLISHABLE);

async function createCheckoutSession(priceId: string) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  const session = await response.json();
  await stripe?.redirectToCheckout({ sessionId: session.id });
}
```

---

## Email Services

### Resend (Recommended)

**Setup:**
1. Sign up: https://resend.com/
2. Get API key: https://resend.com/api-keys
3. Add to `.env`:
```bash
VITE_EMAIL_PROVIDER=resend
VITE_RESEND_API_KEY=re_xxxxxxxxxxxx
```

**Usage Example:**
```typescript
async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch(`${API_ENDPOINTS.RESEND}/emails`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.RESEND}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BioMath Core <no-reply@biomathcore.com>',
      to,
      subject,
      html,
    }),
  });
  return await response.json();
}
```

---

## Media Storage

### Cloudinary

**Setup:**
1. Sign up: https://cloudinary.com/
2. Get credentials from dashboard
3. Add to `.env`:
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=xxxxxxxxxxxx
VITE_CLOUDINARY_API_SECRET=xxxxxxxxxxxx
```

**Usage Example:**
```typescript
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');

  const response = await fetch(
    `${API_ENDPOINTS.CLOUDINARY}/${API_KEYS.CLOUDINARY}/image/upload`,
    { method: 'POST', body: formData }
  );
  return await response.json();
}
```

---

## Health Device Integrations

### Fitbit

**Setup:**
1. Register app: https://dev.fitbit.com/apps
2. Get OAuth credentials
3. Add to `.env`:
```bash
VITE_FITBIT_CLIENT_ID=xxxxxxxxxxxx
VITE_FITBIT_CLIENT_SECRET=xxxxxxxxxxxx
```

**OAuth Flow:**
```typescript
function initiateFitbitAuth() {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
    `client_id=${API_KEYS.FITBIT}&` +
    `response_type=code&` +
    `scope=activity heartrate sleep&` +
    `redirect_uri=${window.location.origin}/fitbit/callback`;

  window.location.href = authUrl;
}
```

---

### Oura Ring

**Setup:**
1. Register: https://cloud.ouraring.com/oauth/applications
2. Get credentials
3. Add to `.env`:
```bash
VITE_OURA_CLIENT_ID=xxxxxxxxxxxx
VITE_OURA_CLIENT_SECRET=xxxxxxxxxxxx
```

**Fetch Sleep Data:**
```typescript
async function getOuraSleepData(accessToken: string, date: string) {
  const response = await fetch(
    `${API_ENDPOINTS.OURA}/usercollection/sleep?start_date=${date}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  return await response.json();
}
```

---

### Apple Health

**Setup:**
1. Requires Apple Developer account
2. Configure HealthKit capabilities
3. Add to `.env`:
```bash
VITE_APPLE_HEALTH_CLIENT_ID=your_bundle_id
VITE_APPLE_HEALTH_TEAM_ID=your_team_id
```

**Note:** Apple Health requires native iOS app integration

---

### WHOOP

**Setup:**
1. Apply for developer access: https://developer.whoop.com/
2. Get OAuth credentials
3. Add to `.env`:
```bash
VITE_WHOOP_CLIENT_ID=xxxxxxxxxxxx
VITE_WHOOP_CLIENT_SECRET=xxxxxxxxxxxx
```

---

## Analytics & Monitoring

### Google Analytics

**Setup:**
1. Create property: https://analytics.google.com/
2. Get Measurement ID
3. Add to `.env`:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Usage Example:**
```typescript
import { analytics } from './lib/analytics';

analytics.track('page_view', {
  page_path: window.location.pathname,
  page_title: document.title,
});
```

---

### Sentry

**Setup:**
1. Sign up: https://sentry.io/
2. Create project
3. Add to `.env`:
```bash
VITE_SENTRY_DSN=https://xxxx@sentry.io/xxxx
VITE_SENTRY_ENVIRONMENT=production
```

**Usage:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: API_KEYS.SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

---

## Testing & Validation

### Test API Keys

```bash
npm run test:api-keys
```

### Validate Integration

```typescript
import { validateAPIKeys, isServiceEnabled } from './lib/apiConfig';

// Check all required keys
const valid = validateAPIKeys();

// Check specific service
if (isServiceEnabled('OPENAI')) {
  console.log('OpenAI is configured');
}
```

---

## Security Best Practices

1. **Never commit `.env` file**
2. **Use different keys for dev/staging/production**
3. **Rotate keys regularly**
4. **Use HTTPS only**
5. **Validate all API responses**
6. **Rate limit API calls**
7. **Monitor API usage and costs**
8. **Use webhook signatures for validation**

---

## Cost Optimization

### AI Providers
- Cache responses when possible
- Use streaming for real-time updates
- Implement request rate limiting
- Monitor token usage

### Storage
- Use CDN for images
- Compress images before upload
- Implement file size limits
- Clean up unused files

### Email
- Batch notifications
- Use transactional email templates
- Implement email preferences
- Monitor bounce rates

---

## Troubleshooting

### Common Issues

**"API Key Invalid"**
- Verify key is correct in `.env`
- Check key hasn't been revoked
- Ensure correct environment (test/live)

**"CORS Error"**
- Use server-side API calls for sensitive operations
- Configure CORS on API endpoints
- Use proxy for development

**"Rate Limited"**
- Implement exponential backoff
- Cache responses
- Reduce request frequency

---

## Support

For integration support:
- Email: support@biomathcore.com
- Docs: https://docs.biomathcore.com
- Discord: https://discord.gg/biomathcore
