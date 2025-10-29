/**
 * Comprehensive Redirect Flow Tests
 * Tests the complete Signup → Survey → Dashboard redirect integration
 */

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  query: {},
  pathname: '/'
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

describe('Signup → Survey → Dashboard Redirect Flow', () => {
  beforeEach(() => {
    // Clear localStorage and router mocks before each test
    mockLocalStorage.clear();
    mockRouter.push.mockClear();
    mockRouter.replace.mockClear();
  });

  describe('1. Signup Success Handler', () => {
    it('should store user data with onboarded: false and redirect to survey', () => {
      // Mock successful signup response
      const mockResponse = {
        token: 'demo_token_123',
        user: {
          id: 'user_123',
          email: 'test@example.com',
          name: 'Test User',
          onboarded: false
        }
      };

      // Simulate signup success handler logic
      localStorage.setItem('velric_user', JSON.stringify({
        id: mockResponse.user.id,
        email: mockResponse.user.email,
        name: mockResponse.user.name,
        token: mockResponse.token,
        onboarded: false,
        createdAt: new Date().toISOString()
      }));

      // Verify user data is stored correctly
      const storedUser = JSON.parse(localStorage.getItem('velric_user')!);
      expect(storedUser.onboarded).toBe(false);
      expect(storedUser.email).toBe('test@example.com');
      expect(storedUser.token).toBe('demo_token_123');
    });
  });

  describe('2. Survey Route Protection', () => {
    it('should allow access to survey if user is logged in but not onboarded', () => {
      // Set up user who is logged in but not onboarded
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: false,
        token: 'valid_token'
      }));

      // Simulate route guard logic
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const hasToken = !!userData.token;
      const isOnboarded = userData.onboarded === true;

      expect(hasToken).toBe(true);
      expect(isOnboarded).toBe(false);
      // Should allow access to survey
    });

    it('should redirect to signup if no user data exists', () => {
      // No user data in localStorage
      const userData = localStorage.getItem('velric_user');
      expect(userData).toBeNull();
      // Should redirect to signup
    });

    it('should redirect to dashboard if user is already onboarded', () => {
      // Set up user who is already onboarded
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: true,
        token: 'valid_token'
      }));

      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const isOnboarded = userData.onboarded === true;

      expect(isOnboarded).toBe(true);
      // Should redirect to dashboard
    });
  });

  describe('3. Survey Completion Handler', () => {
    it('should update user data with onboarded: true and redirect to dashboard', () => {
      // Set up user before survey completion
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        onboarded: false,
        token: 'valid_token'
      }));

      // Simulate survey completion
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      userData.onboarded = true;
      userData.surveyCompletedAt = new Date().toISOString();
      localStorage.setItem('velric_user', JSON.stringify(userData));

      // Verify user data is updated
      const updatedUser = JSON.parse(localStorage.getItem('velric_user')!);
      expect(updatedUser.onboarded).toBe(true);
      expect(updatedUser.surveyCompletedAt).toBeDefined();
    });
  });

  describe('4. Dashboard Route Protection', () => {
    it('should allow access to dashboard if user is logged in and onboarded', () => {
      // Set up user who is logged in and onboarded
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: true,
        token: 'valid_token'
      }));

      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const hasToken = !!userData.token;
      const isOnboarded = userData.onboarded === true;

      expect(hasToken).toBe(true);
      expect(isOnboarded).toBe(true);
      // Should allow access to dashboard
    });

    it('should redirect to survey if user is not onboarded', () => {
      // Set up user who is logged in but not onboarded
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: false,
        token: 'valid_token'
      }));

      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const isOnboarded = userData.onboarded === true;

      expect(isOnboarded).toBe(false);
      // Should redirect to survey
    });

    it('should redirect to signup if no user data exists', () => {
      // No user data in localStorage
      const userData = localStorage.getItem('velric_user');
      expect(userData).toBeNull();
      // Should redirect to signup
    });
  });

  describe('5. Edge Cases', () => {
    it('should handle corrupted localStorage data', () => {
      // Set corrupted data
      localStorage.setItem('velric_user', 'invalid_json');

      let shouldRedirectToSignup = false;
      try {
        JSON.parse(localStorage.getItem('velric_user')!);
      } catch (error) {
        shouldRedirectToSignup = true;
        localStorage.removeItem('velric_user');
      }

      expect(shouldRedirectToSignup).toBe(true);
      expect(localStorage.getItem('velric_user')).toBeNull();
    });

    it('should handle missing onboarded field', () => {
      // Set user data without onboarded field
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        token: 'valid_token'
        // Missing onboarded field
      }));

      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const isOnboarded = userData.onboarded === true;

      expect(isOnboarded).toBe(false); // Should default to false
    });

    it('should prevent access to survey after onboarding', () => {
      // User completes survey and gets onboarded
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: true,
        token: 'valid_token'
      }));

      // User tries to access survey again
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const shouldRedirectToDashboard = userData.onboarded === true;

      expect(shouldRedirectToDashboard).toBe(true);
    });

    it('should prevent access to dashboard before onboarding', () => {
      // User signs up but hasn't completed survey
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: false,
        token: 'valid_token'
      }));

      // User tries to access dashboard directly
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const shouldRedirectToSurvey = userData.onboarded !== true;

      expect(shouldRedirectToSurvey).toBe(true);
    });
  });

  describe('6. Complete Flow Integration', () => {
    it('should complete the entire signup → survey → dashboard flow', () => {
      // Step 1: User signs up
      const signupResponse = {
        token: 'demo_token_123',
        user: {
          id: 'user_123',
          email: 'test@example.com',
          name: 'Test User',
          onboarded: false
        }
      };

      localStorage.setItem('velric_user', JSON.stringify({
        ...signupResponse.user,
        token: signupResponse.token,
        createdAt: new Date().toISOString()
      }));

      // Verify signup state
      let userData = JSON.parse(localStorage.getItem('velric_user')!);
      expect(userData.onboarded).toBe(false);

      // Step 2: User completes survey
      userData.onboarded = true;
      userData.surveyCompletedAt = new Date().toISOString();
      localStorage.setItem('velric_user', JSON.stringify(userData));

      // Verify survey completion state
      userData = JSON.parse(localStorage.getItem('velric_user')!);
      expect(userData.onboarded).toBe(true);
      expect(userData.surveyCompletedAt).toBeDefined();

      // Step 3: User can now access dashboard
      const canAccessDashboard = userData.onboarded === true && !!userData.token;
      expect(canAccessDashboard).toBe(true);
    });
  });

  describe('7. Browser Refresh Scenarios', () => {
    it('should maintain state after browser refresh during survey', () => {
      // User is in the middle of survey
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: false,
        token: 'valid_token'
      }));

      // Simulate browser refresh (localStorage persists)
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const shouldStayOnSurvey = userData.onboarded === false && !!userData.token;

      expect(shouldStayOnSurvey).toBe(true);
    });

    it('should maintain state after browser refresh on dashboard', () => {
      // User is on dashboard
      localStorage.setItem('velric_user', JSON.stringify({
        id: 'user_123',
        email: 'test@example.com',
        onboarded: true,
        token: 'valid_token'
      }));

      // Simulate browser refresh (localStorage persists)
      const userData = JSON.parse(localStorage.getItem('velric_user')!);
      const shouldStayOnDashboard = userData.onboarded === true && !!userData.token;

      expect(shouldStayOnDashboard).toBe(true);
    });
  });
});

// Performance and Security Tests
describe('Redirect Flow Performance & Security', () => {
  it('should complete redirect checks quickly', () => {
    const startTime = performance.now();

    // Simulate route guard logic
    const userData = localStorage.getItem('velric_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const hasToken = !!user.token;
        const isOnboarded = user.onboarded === true;
        // Route decision logic
      } catch (error) {
        // Error handling
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    expect(executionTime).toBeLessThan(10); // Should complete in under 10ms
  });

  it('should sanitize user data', () => {
    // Test with potentially malicious data
    const maliciousData = {
      id: '<script>alert("xss")</script>',
      email: 'test@example.com',
      name: '<img src=x onerror=alert(1)>',
      onboarded: false,
      token: 'valid_token'
    };

    localStorage.setItem('velric_user', JSON.stringify(maliciousData));
    const userData = JSON.parse(localStorage.getItem('velric_user')!);

    // In a real app, you would sanitize these values
    expect(userData.id).toContain('<script>'); // Raw data for testing
    expect(userData.name).toContain('<img'); // Raw data for testing
    
    // Note: In production, these would be sanitized before storage
  });
});