# Testing Guide

Complete testing guide for BioMath Core application.

## Test Setup

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run type checking
npm run typecheck
```

### Test Structure

```
src/
├── components/
│   └── __tests__/
│       ├── ErrorMessage.test.tsx
│       └── LoadingSpinner.test.tsx
├── hooks/
│   └── __tests__/
│       └── useAsync.test.ts
└── lib/
    └── __tests__/
        └── analytics.test.ts
```

## Unit Testing

### Component Testing

**Example: Testing ErrorMessage Component**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ErrorMessage message="Error" title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
```

### Hook Testing

**Example: Testing useAsync Hook**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useAsync from '../useAsync';

describe('useAsync', () => {
  it('handles successful async operation', async () => {
    const asyncFn = async () => 'success';
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('success');
      expect(result.current.error).toBe(null);
    });
  });

  it('handles async errors', async () => {
    const asyncFn = async () => {
      throw new Error('Test error');
    };
    const { result } = renderHook(() => useAsync(asyncFn));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Test error');
    });
  });
});
```

### Utility Testing

**Example: Testing Analytics**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { analytics } from '../analytics';

describe('Analytics', () => {
  it('tracks page views', () => {
    const spy = vi.spyOn(window.gtag, 'event');
    analytics.track('page_view', { page_path: '/test' });
    expect(spy).toHaveBeenCalledWith('page_view', { page_path: '/test' });
  });
});
```

## Integration Testing

### Authentication Flow

```typescript
describe('Authentication Flow', () => {
  it('allows user to sign up', async () => {
    const { user } = renderWithAuth(<SignUp />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });
  });

  it('allows user to sign in', async () => {
    const { user } = renderWithAuth(<SignIn />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

### Database Operations

```typescript
describe('Profile Operations', () => {
  it('creates user profile', async () => {
    const profile = await createProfile({
      email: 'test@example.com',
      full_name: 'Test User',
    });

    expect(profile).toBeDefined();
    expect(profile.email).toBe('test@example.com');
  });

  it('updates user profile', async () => {
    const updated = await updateProfile(userId, {
      full_name: 'Updated Name',
    });

    expect(updated.full_name).toBe('Updated Name');
  });
});
```

### API Integration

```typescript
describe('OpenAI Integration', () => {
  it('generates health insights', async () => {
    const response = await askHealthQuestion('How to improve sleep?');

    expect(response).toBeDefined();
    expect(response.content).toContain('sleep');
  });

  it('handles API errors gracefully', async () => {
    const invalidKey = 'invalid-key';
    await expect(
      askHealthQuestion('test', { apiKey: invalidKey })
    ).rejects.toThrow('API key invalid');
  });
});
```

## E2E Testing

### User Journeys

**Journey 1: New User Registration**

```typescript
describe('User Registration Journey', () => {
  it('completes full registration flow', async () => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page.getByText('Get Started')).toBeVisible();

    // 2. Click sign up
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/signup');

    // 3. Fill form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');

    // 4. Submit
    await page.click('button[type="submit"]');

    // 5. Verify redirect to onboarding
    await expect(page).toHaveURL('/onboarding');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

**Journey 2: Subscription Purchase**

```typescript
describe('Subscription Purchase Journey', () => {
  it('completes payment flow', async () => {
    // 1. Sign in
    await signIn('user@example.com', 'password');

    // 2. Go to pricing
    await page.goto('/pricing');

    // 3. Select plan
    await page.click('text=Subscribe to Premium');

    // 4. Enter payment details (Stripe test mode)
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.fill('[name="cardExpiry"]', '12/25');
    await page.fill('[name="cardCvc"]', '123');

    // 5. Submit payment
    await page.click('text=Pay Now');

    // 6. Verify success
    await expect(page.getByText('Payment Successful')).toBeVisible();
    await expect(page).toHaveURL('/member/dashboard');
  });
});
```

**Journey 3: Device Connection**

```typescript
describe('Device Connection Journey', () => {
  it('connects Fitbit device', async () => {
    await signIn('user@example.com', 'password');
    await page.goto('/member/devices');

    // Click connect Fitbit
    await page.click('text=Connect Fitbit');

    // OAuth flow (mocked in test)
    await page.waitForNavigation();
    await page.click('text=Authorize');

    // Verify connection
    await expect(page.getByText('Fitbit Connected')).toBeVisible();
  });
});
```

## Performance Testing

### Lighthouse Audits

```bash
# Run Lighthouse
npm run lighthouse

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95
```

### Load Testing

```typescript
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function() {
  let response = http.get('https://biomathcore.com');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });
}
```

### Bundle Size Analysis

```bash
# Analyze bundle
npm run build -- --analyze

# Check sizes
npx vite-bundle-visualizer
```

## Security Testing

### Authentication Tests

```typescript
describe('Security Tests', () => {
  it('prevents unauthorized access', async () => {
    const response = await fetch('/api/admin/users', {
      headers: { Authorization: 'Bearer invalid-token' },
    });
    expect(response.status).toBe(401);
  });

  it('enforces rate limiting', async () => {
    const requests = Array(100).fill(null).map(() =>
      fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'wrong' }),
      })
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('sanitizes user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const response = await updateProfile({
      bio: maliciousInput,
    });

    expect(response.bio).not.toContain('<script>');
  });
});
```

### RLS Policy Tests

```sql
-- Test RLS policies
BEGIN;

-- Set up test user
SET LOCAL "request.jwt.claims" = '{"sub": "test-user-id"}';

-- Test: User can read own profile
SELECT * FROM profiles WHERE id = 'test-user-id';
-- Should return 1 row

-- Test: User cannot read other profiles
SELECT * FROM profiles WHERE id = 'other-user-id';
-- Should return 0 rows

-- Test: User can update own profile
UPDATE profiles SET full_name = 'New Name' WHERE id = 'test-user-id';
-- Should succeed

-- Test: User cannot update other profiles
UPDATE profiles SET full_name = 'Hacked' WHERE id = 'other-user-id';
-- Should fail

ROLLBACK;
```

## Accessibility Testing

### Automated Tests

```typescript
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    render(<Navigation />);

    // Tab through navigation
    await user.tab();
    expect(screen.getByText('Home')).toHaveFocus();

    await user.tab();
    expect(screen.getByText('Services')).toHaveFocus();
  });

  it('has proper ARIA labels', () => {
    render(<Button onClick={() => {}}>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
```

### Manual Testing Checklist

- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Test keyboard-only navigation
- [ ] Test with high contrast mode
- [ ] Test with 200% zoom
- [ ] Verify color contrast ratios
- [ ] Check focus indicators
- [ ] Test form validation announcements

## Browser Compatibility

### Supported Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

### Cross-Browser Testing

```bash
# Use BrowserStack or Sauce Labs
npm run test:browsers
```

## Mobile Testing

### Responsive Design Tests

```typescript
describe('Mobile Responsiveness', () => {
  it('renders correctly on mobile', () => {
    viewport(375, 667); // iPhone SE
    render(<Home />);
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('shows mobile menu', () => {
    viewport(375, 667);
    render(<Header />);
    expect(screen.getByLabelText('Menu')).toBeVisible();
  });
});
```

### Touch Interaction Tests

```typescript
it('handles touch gestures', async () => {
  render(<Swipeable />);

  await user.touch(screen.getByTestId('swipe-area'));
  await user.swipe('left');

  expect(screen.getByText('Next')).toBeVisible();
});
```

## Continuous Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run typecheck
```

## Test Coverage Goals

### Target Coverage
- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Critical Paths (100% Coverage Required)
- Authentication flows
- Payment processing
- Data export/import
- RLS policies
- API integrations

## Debugging Tests

### Debug Commands

```bash
# Debug single test
npm test -- --reporter=verbose ErrorMessage.test.tsx

# Debug with breakpoints
npm test -- --inspect-brk

# Show console logs
npm test -- --reporter=verbose --silent=false
```

### Common Issues

**Issue: Tests timeout**
```typescript
// Increase timeout
it('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

**Issue: Flaky tests**
```typescript
// Use waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

## Pre-Deployment Testing

### Checklist
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] E2E tests pass
- [ ] Performance tests meet targets
- [ ] Security tests pass
- [ ] Accessibility tests pass
- [ ] Cross-browser tests pass
- [ ] Mobile tests pass
- [ ] Manual smoke tests complete

---

**Last Updated:** 2025-10-23
**Test Framework:** Vitest + React Testing Library
**Coverage Tool:** Vitest Coverage (c8)
