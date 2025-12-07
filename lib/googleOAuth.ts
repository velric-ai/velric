import { supabase } from './supabaseClient';

// Store Google OAuth tokens for a user
export async function storeGoogleTokens(
  userId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: number | null
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build update object without updated_at (may not exist in all schemas)
    const updateData: any = {
      google_access_token: accessToken,
      google_refresh_token: refreshToken,
      // expiresAt parameter is in seconds (from store-google-tokens API)
      // Convert to milliseconds for Date constructor
      google_token_expires_at: expiresAt 
        ? new Date(expiresAt * 1000).toISOString() 
        : null,
    };
    
    // Try to update users table with tokens
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (updateError) {
      // Check if it's a column not found error
      if (updateError.message?.includes('column') || updateError.code === '42703' || updateError.message?.includes('does not exist')) {
        const errorMsg = 'Google OAuth token columns not found in users table. Please run the migration: migrations/add_google_oauth_tokens.sql';
        console.error(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // Check if user doesn't exist
      if (updateError.code === 'PGRST116' || updateError.message?.includes('No rows')) {
        return { success: false, error: `User with ID ${userId} not found in database` };
      }
      
      console.error('Error storing Google tokens:', updateError);
      return { success: false, error: updateError.message || 'Failed to store tokens' };
    }

    console.log(`Successfully stored Google OAuth tokens for user ${userId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error storing Google tokens:', error);
    return { success: false, error: error.message || 'Failed to store tokens' };
  }
}

// Get Google OAuth tokens for a user
export async function getGoogleTokens(
  userId: string
): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; expiresAt?: number; error?: string }> {
  try {
    console.log(`[GoogleOAuth] Retrieving tokens for user ${userId}`);
    
    // Try to get from database
    const { data, error } = await supabase
      .from('users')
      .select('google_access_token, google_refresh_token, google_token_expires_at')
      .eq('id', userId)
      .single();

    if (error) {
      // Check if it's a column not found error
      if (error.message?.includes('column') || error.code === '42703') {
        console.error(`[GoogleOAuth] Token columns not found in database for user ${userId}. Please run migration.`);
        return { success: false, error: 'Token columns not found in database. Please run the migration: migrations/add_google_oauth_tokens.sql' };
      }
      
      // If it's a "not found" error (no row)
      if (error.code === 'PGRST116') {
        console.error(`[GoogleOAuth] User ${userId} not found in database`);
        return { success: false, error: 'User not found in database' };
      }
      
      console.error(`[GoogleOAuth] Error retrieving tokens for user ${userId}:`, error);
      return { success: false, error: error.message || 'Tokens not found' };
    }

    if (!data) {
      console.error(`[GoogleOAuth] No data returned for user ${userId}`);
      return { success: false, error: 'Tokens not found in database. Please sign in again to store tokens.' };
    }

    // Check if we have tokens in database
    if (!data.google_access_token) {
      console.error(`[GoogleOAuth] No access token found for user ${userId}`);
      return { success: false, error: 'No Google OAuth tokens found in database. Please sign in again to grant calendar permissions.' };
    }

    const expiresAt = data.google_token_expires_at 
      ? new Date(data.google_token_expires_at).getTime() / 1000 
      : undefined;

    console.log(`[GoogleOAuth] ✅ Successfully retrieved tokens for user ${userId}`, {
      hasAccessToken: !!data.google_access_token,
      hasRefreshToken: !!data.google_refresh_token,
      expiresAt: expiresAt ? new Date(expiresAt * 1000).toISOString() : 'Not set',
      isExpired: expiresAt ? expiresAt < Date.now() / 1000 : false,
    });

    return {
      success: true,
      accessToken: data.google_access_token,
      refreshToken: data.google_refresh_token || undefined,
      expiresAt: expiresAt,
    };
  } catch (error: any) {
    console.error(`[GoogleOAuth] Exception retrieving tokens for user ${userId}:`, error);
    return { success: false, error: error.message || 'Failed to retrieve tokens' };
  }
}

// Refresh Google OAuth token
export async function refreshGoogleToken(refreshToken: string): Promise<{
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  error?: string;
}> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || 'Failed to refresh token' };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (error: any) {
    console.error('Error refreshing Google token:', error);
    return { success: false, error: error.message || 'Failed to refresh token' };
  }
}

