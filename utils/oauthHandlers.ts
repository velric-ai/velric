import { generateRandomToken } from "./surveyValidation";

// OAuth Configuration
const OAUTH_CONFIG = {
  github: {
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'demo_github_client_id',
    authUrl: 'https://github.com/login/oauth/authorize',
    scope: 'user:email,public_repo'
  },
  codesignal: {
    clientId: process.env.NEXT_PUBLIC_CODESIGNAL_CLIENT_ID || 'demo_codesignal_client_id',
    authUrl: 'https://app.codesignal.com/oauth/authorize',
    scope: 'profile,scores'
  },
  hackerrank: {
    clientId: process.env.NEXT_PUBLIC_HACKERRANK_CLIENT_ID || 'demo_hackerrank_client_id',
    authUrl: 'https://www.hackerrank.com/oauth/authorize',
    scope: 'profile,badges'
  }
};

export interface OAuthError extends Error {
  code: string;
  platform: string;
}

export class OAuthTimeoutError extends Error {
  constructor(platform: string) {
    super(`OAuth timeout: Authorization took too long for ${platform}`);
    this.name = 'OAuthTimeoutError';
  }
}

export class OAuthUserRejectedError extends Error {
  constructor(platform: string) {
    super(`User declined authorization for ${platform}`);
    this.name = 'OAuthUserRejectedError';
  }
}

export class OAuthCSRFError extends Error {
  constructor() {
    super('CSRF token mismatch - possible security issue');
    this.name = 'OAuthCSRFError';
  }
}

export async function initiateOAuthFlow(platform: string): Promise<string> {
  // Validate platform
  const validPlatforms = ['github', 'codesignal', 'hackerrank'];
  if (!validPlatforms.includes(platform)) {
    throw new Error(`Invalid platform: ${platform}`);
  }

  const config = OAUTH_CONFIG[platform as keyof typeof OAUTH_CONFIG];
  if (!config) {
    throw new Error(`OAuth configuration not found for ${platform}`);
  }

  // Generate CSRF token (prevent attacks)
  const csrfToken = generateRandomToken();
  sessionStorage.setItem(`oauth_csrf_${platform}`, csrfToken);

  // Build OAuth URL
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${window.location.origin}/oauth/callback`,
    response_type: 'code',
    scope: config.scope,
    state: csrfToken,
    prompt: 'consent'
  });

  const oauthUrl = `${config.authUrl}?${params.toString()}`;

  // For demo purposes, simulate OAuth flow
  if (config.clientId.startsWith('demo_')) {
    return simulateOAuthFlow(platform, csrfToken);
  }

  // Open popup with timeout
  const popup = window.open(
    oauthUrl, 
    `${platform}_oauth`, 
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );

  if (!popup) {
    throw new Error('Popup blocked. Please allow popups for this site and try again.');
  }

  return new Promise((resolve, reject) => {
    // Timeout after 5 minutes
    const timeoutId = setTimeout(() => {
      popup?.close();
      reject(new OAuthTimeoutError(platform));
    }, 5 * 60 * 1000);

    // Listen for callback
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      clearTimeout(timeoutId);
      window.removeEventListener('message', messageHandler);

      if (event.data.type === 'OAUTH_SUCCESS') {
        // Verify CSRF token
        const storedToken = sessionStorage.getItem(`oauth_csrf_${platform}`);
        if (storedToken !== event.data.state) {
          reject(new OAuthCSRFError());
          return;
        }

        // Clean up
        sessionStorage.removeItem(`oauth_csrf_${platform}`);
        popup.close();

        resolve(event.data.code);
      } else if (event.data.type === 'OAUTH_ERROR') {
        popup.close();
        
        if (event.data.error === 'access_denied') {
          reject(new OAuthUserRejectedError(platform));
        } else {
          const error = new Error(`OAuth error: ${event.data.message}`) as OAuthError;
          error.code = event.data.error || 'OAUTH_ERROR';
          error.platform = platform;
          reject(error);
        }
      }
    };

    window.addEventListener('message', messageHandler);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);
        reject(new OAuthUserRejectedError(platform));
      }
    }, 1000);
  });
}

// Simulate OAuth flow for demo purposes
async function simulateOAuthFlow(platform: string, csrfToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Show a mock authorization dialog
    const confirmed = window.confirm(
      `Demo Mode: Authorize Velric to access your ${platform} account?\n\n` +
      `This is a simulation for demonstration purposes.`
    );

    setTimeout(() => {
      if (confirmed) {
        // Simulate successful authorization
        resolve(`demo_auth_code_${platform}_${Date.now()}`);
      } else {
        reject(new OAuthUserRejectedError(platform));
      }
    }, 1000); // Simulate network delay
  });
}

export async function connectOAuthPlatform(
  platform: string, 
  authCode: string
): Promise<{
  success: boolean;
  platform: string;
  username: string;
  userId: string;
  avatar: string;
  profile: any;
  connectedAt: string;
}> {
  try {
    // Validate inputs
    if (!platform || !authCode) {
      throw new Error('Platform and authorization code are required');
    }

    // For demo purposes, return mock data
    if (authCode.startsWith('demo_auth_code_')) {
      const mockData = {
        github: {
          username: 'johndoe',
          userId: '12345',
          avatar: 'https://github.com/johndoe.png',
          profile: {
            name: 'John Doe',
            followers: 150,
            following: 75,
            public_repos: 42,
            total_stars: 1200,
            languages: ['JavaScript', 'TypeScript', 'Python', 'Go'],
            contributions_last_year: 1247
          }
        },
        codesignal: {
          username: 'johndoe',
          userId: '67890',
          avatar: '',
          profile: {
            name: 'John Doe',
            score: 1500,
            tier: 'Expert',
            completed_challenges: 85,
            skills: ['Algorithms', 'Data Structures', 'System Design'],
            percentile: 95
          }
        },
        hackerrank: {
          username: 'johndoe',
          userId: '54321',
          avatar: '',
          profile: {
            name: 'John Doe',
            rank: '5-star',
            badges: 12,
            problems_solved: 200,
            skills: ['Problem Solving', 'Algorithms', 'Data Structures'],
            global_rank: 1250
          }
        }
      };

      const userData = mockData[platform as keyof typeof mockData];
      
      return {
        success: true,
        platform,
        ...userData,
        connectedAt: new Date().toISOString()
      };
    }

    // In real implementation, this would call your backend API
    const response = await fetch(`/api/auth/connect/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        code: authCode,
        state: sessionStorage.getItem(`oauth_csrf_${platform}`)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Connection failed');
    }

    return data;

  } catch (error) {
    console.error(`${platform} connection error:`, error);
    throw error;
  }
}

export async function disconnectOAuthPlatform(platform: string): Promise<{
  success: boolean;
  platform: string;
  message: string;
}> {
  try {
    // In real implementation, this would call your backend API
    const response = await fetch(`/api/auth/disconnect/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Disconnection failed');
    }

    return data;

  } catch (error) {
    console.error(`${platform} disconnection error:`, error);
    throw error;
  }
}

// Helper function to get auth token
function getAuthToken(): string {
  try {
    const userData = localStorage.getItem("velric_user");
    if (!userData) {
      throw new Error("No authentication token found");
    }
    
    const user = JSON.parse(userData);
    return user.token || user.id || "demo_token";
  } catch (error) {
    throw new Error("Invalid authentication data");
  }
}

// OAuth callback handler (for the callback page)
export function handleOAuthCallback() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      // Send error to parent window
      window.opener?.postMessage({
        type: 'OAUTH_ERROR',
        error,
        message: errorDescription || error
      }, window.location.origin);
    } else if (code && state) {
      // Send success to parent window
      window.opener?.postMessage({
        type: 'OAUTH_SUCCESS',
        code,
        state
      }, window.location.origin);
    } else {
      // Invalid callback
      window.opener?.postMessage({
        type: 'OAUTH_ERROR',
        error: 'invalid_callback',
        message: 'Invalid OAuth callback parameters'
      }, window.location.origin);
    }

    // Close popup
    window.close();
  } catch (error) {
    console.error('OAuth callback error:', error);
    window.opener?.postMessage({
      type: 'OAUTH_ERROR',
      error: 'callback_error',
      message: 'Failed to process OAuth callback'
    }, window.location.origin);
    window.close();
  }
}