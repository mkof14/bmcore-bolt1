import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analytics, identifyUser, trackEvent } from '../analytics';

describe('Analytics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('identifyUser', () => {
    it('should identify user with correct properties', () => {
      const userId = 'test-user-123';
      const traits = { email: 'test@example.com', name: 'Test User' };
      const identifySpy = vi.spyOn(analytics, 'identify').mockImplementation(() => {});

      identifyUser(userId, traits);

      expect(identifySpy).toHaveBeenCalledWith(userId, traits);
    });

    it('should handle empty traits', () => {
      const userId = 'test-user-123';
      const identifySpy = vi.spyOn(analytics, 'identify').mockImplementation(() => {});

      identifyUser(userId);

      expect(identifySpy).toHaveBeenCalledWith(userId, undefined);
    });
  });

  describe('trackEvent', () => {
    it('should track event with properties', () => {
      const eventName = 'button_clicked';
      const properties = { button_id: 'submit', page: 'home' };
      const trackSpy = vi.spyOn(analytics, 'track').mockImplementation(() => {});

      trackEvent(eventName, properties);

      expect(trackSpy).toHaveBeenCalledWith(eventName, properties);
    });

    it('should track event without properties', () => {
      const eventName = 'page_view';
      const trackSpy = vi.spyOn(analytics, 'track').mockImplementation(() => {});

      trackEvent(eventName);

      expect(trackSpy).toHaveBeenCalledWith(eventName, undefined);
    });
  });
});
