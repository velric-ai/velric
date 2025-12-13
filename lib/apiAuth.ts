import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  onboarded: boolean;
  is_recruiter: boolean;
  created_at: string;
  survey_completed_at: string | null;
  profile_complete: boolean;
  profile_image: string | null;
};

/**
 * Extract token from request (Authorization header only)
 * Format: Authorization: Bearer <token>
 */
function extractToken(req: NextApiRequest): string | null {

    console.log('[Auth] extractToken called',req.headers);
  // Check Authorization header (Bearer token format)
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token && token.length > 0) {
      return token;
    }
  }

  return null;
}

/**
 * Authenticate request and return user information
 * Supports both Google OAuth tokens and Supabase JWT tokens
 * 
 * @param req Next.js API request
 * @returns Authenticated user or null if authentication fails
 */
export async function authenticateRequest(
  req: NextApiRequest
): Promise<AuthenticatedUser | null> {
  if (!supabase) {
    console.error('[Auth] Supabase not configured');
    return null;
  }

  const token = extractToken(req);
  if (!token) {
    return null;
  }

  try {
    // Strategy 1: Check if token is a Google access token
    // Google access tokens typically start with "ya29." or similar
    const isGoogleToken = token.startsWith('ya29.') || token.length > 100;
    
    if (isGoogleToken) {
      // First, try exact match (in case token hasn't refreshed)
      const { data: userByExactToken } = await supabase
        .from("users")
        .select("*")
        .eq("google_access_token", token)
        .maybeSingle();

      if (userByExactToken) {
        return {
          id: userByExactToken.id,
          email: userByExactToken.email,
          name: userByExactToken.name,
          onboarded: userByExactToken.onboarded ?? false,
          is_recruiter: Boolean(userByExactToken.is_recruiter),
          created_at: userByExactToken.created_at,
          survey_completed_at: userByExactToken.survey_completed_at ?? null,
          profile_complete: userByExactToken.profile_complete ?? false,
          profile_image: userByExactToken.profile_image ?? null,
        };
      }

      // If exact match fails, verify token with Google API to get user email
      // Then look up user by email and update the token in database
      try {
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (googleResponse.ok) {
          const googleUser = await googleResponse.json();
          
          // Look up user by email
          const { data: userByEmail } = await supabase
            .from("users")
            .select("*")
            .eq("email", googleUser.email)
            .maybeSingle();

          if (userByEmail) {
            // Update the token in database to the current one
            await supabase
              .from("users")
              .update({ google_access_token: token })
              .eq("id", userByEmail.id);

            return {
              id: userByEmail.id,
              email: userByEmail.email,
              name: userByEmail.name,
              onboarded: userByEmail.onboarded ?? false,
              is_recruiter: Boolean(userByEmail.is_recruiter),
              created_at: userByEmail.created_at,
              survey_completed_at: userByEmail.survey_completed_at ?? null,
              profile_complete: userByEmail.profile_complete ?? false,
              profile_image: userByEmail.profile_image ?? null,
            };
          }
        }
      } catch (googleError: any) {
        // Continue to next strategy if Google verification fails
      }
    }

    // Strategy 2: Try to verify as Supabase JWT token
    try {
      const { data: { user }, error: jwtError } = await supabase.auth.getUser(token);
      
      if (!jwtError && user) {
        // Token is a valid Supabase JWT, fetch user profile
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError && profileError.code !== "PGRST116") {
          console.error('[Auth] Error fetching user profile:', profileError);
          return null;
        }

        if (userProfile) {
          return {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            onboarded: userProfile.onboarded ?? false,
            is_recruiter: Boolean(userProfile.is_recruiter),
            created_at: userProfile.created_at,
            survey_completed_at: userProfile.survey_completed_at ?? null,
            profile_complete: userProfile.profile_complete ?? false,
            profile_image: userProfile.profile_image ?? null,
          };
        }

        // If user exists in auth but not in users table, return basic info
        return {
          id: user.id,
          email: user.email ?? "",
          name: (user.user_metadata?.name as string | undefined) || null,
          onboarded: false,
          is_recruiter: Boolean(user.user_metadata?.is_recruiter),
          created_at: user.created_at,
          survey_completed_at: null,
          profile_complete: false,
          profile_image: user.user_metadata?.avatar_url || null,
        };
      }
    } catch (jwtVerifyError) {
      // Not a valid Supabase JWT, continue to next strategy
    }

    // Strategy 3: Token might be a user ID (for backward compatibility)
    // Only if token looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(token)) {
      const { data: userById, error: idError } = await supabase
        .from("users")
        .select("*")
        .eq("id", token)
        .maybeSingle();

      if (!idError && userById) {
        return {
          id: userById.id,
          email: userById.email,
          name: userById.name,
          onboarded: userById.onboarded ?? false,
          is_recruiter: Boolean(userById.is_recruiter),
          created_at: userById.created_at,
          survey_completed_at: userById.survey_completed_at ?? null,
          profile_complete: userById.profile_complete ?? false,
          profile_image: userById.profile_image ?? null,
        };
      }
    }

    // Authentication failed
    return null;
  } catch (error: any) {
    return null;
  }
}

/**
 * Middleware function to authenticate API requests
 * Returns authenticated user or sends 401 error response
 * 
 * Usage:
 * ```typescript
 * const user = await withAuth(req, res);
 * if (!user) return; // Error response already sent
 * // Use user.id, user.email, etc.
 * ```
 */
export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthenticatedUser | null> {
  const user = await authenticateRequest(req);
  
  if (!user) {
    res.status(401).json({
      success: false,
      error: "Unauthorized. Please provide a valid authentication token.",
    });
    return null;
  }
  
  return user;
}

