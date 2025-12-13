/**
 * API Client Utility
 * Automatically adds Authorization header with token from localStorage
 */

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  try {
    // First, try to get velric_token directly
    const token = localStorage.getItem('velric_token');
    if (token) {
      return token;
    }
    
    // Fallback: try to get from user object
    const userData = localStorage.getItem('velric_user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.access_token || user.token || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 * Automatically adds Authorization header with Bearer token
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  
  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the request
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });
  
  return response;
}

/**
 * GET request helper
 */
export async function apiGet(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request helper
 */
export async function apiPost(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 */
export async function apiPut(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request helper
 */
export async function apiPatch(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * API client object with convenience methods
 */
export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  request: apiRequest,
};

