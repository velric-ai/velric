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

type LoginSuccessUser = {
  id: string;
  email: string;
  name: string;
  onboarded: boolean;
  created_at: string;
  survey_completed_at: string | null;
  profile_complete: boolean;
  is_recruiter: boolean;
};

type LoginResponse =
  | {
      success: true;
      user: LoginSuccessUser;
      message?: string;
      access_token?: string;
      refresh_token?: string;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const body = req.body || {};
    const { email, password, googleAccessToken, googleRefreshToken, googleExpiresAt } = body;

    // Support both email/password and Google OAuth login
    const isGoogleLogin = !!googleAccessToken;

    if (!isGoogleLogin && (!email || !password)) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (isGoogleLogin && !email) {
      return res.status(400).json({
        success: false,
        error: "Email is required for Google login",
      });
    }

    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      });
    }

    let authUser;
    let authData: any = {};
    let profileData: any = null;

    if (isGoogleLogin) {
      // Google OAuth login: fetch user from database
      console.log('[Login API] Google OAuth login for:', email);
      
      const { data: fetchedProfileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim())
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile:", profileError);
        return res.status(500).json({
          success: false,
          error: profileError.message || "Failed to fetch user profile",
        });
      }

      if (!fetchedProfileData) {
        return res.status(401).json({
          success: false,
          error: "User not found. Please sign up first.",
        });
      }

      profileData = fetchedProfileData;

      // Update Google OAuth tokens if provided
      if (googleAccessToken) {
        try {
          const expiresAtISO = googleExpiresAt ? new Date(googleExpiresAt).toISOString() : null;
          
          const updateData: any = {
            google_access_token: googleAccessToken,
            google_refresh_token: googleRefreshToken || null,
            google_token_expires_at: expiresAtISO,
          };
          
          const { error: tokenUpdateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', profileData.id);

          if (tokenUpdateError) {
            // Log but don't fail if columns don't exist
            if (tokenUpdateError.message?.includes('column') || tokenUpdateError.code === '42703') {
              console.warn('[Login API] Google OAuth token columns not found:', tokenUpdateError.message);
            } else {
              console.error('[Login API] Could not store tokens:', tokenUpdateError);
            }
          }
        } catch (tokenError: any) {
          console.error('[Login API] Error storing tokens:', tokenError);
        }
      }

      // Create a mock auth user object for consistency
      authUser = {
        id: profileData.id,
        email: profileData.email,
        user_metadata: {
          name: profileData.name,
          is_recruiter: profileData.is_recruiter,
        },
        created_at: profileData.created_at,
      };

      authData.session = {
        access_token: googleAccessToken, // Use Google access token as velric_token
        refresh_token: googleRefreshToken,
      };
    } else {
      // Email/password login: authenticate with Supabase Auth
      console.log('[Login API] Email/password login for:', email);
      
      const {
        data: authDataResult,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !authDataResult.user) {
        const message =
          authError?.message || "Invalid email or password. Please try again.";
        return res.status(401).json({
          success: false,
          error: message,
        });
      }

      authUser = authDataResult.user;
      authData = authDataResult;

      // Fetch profile data for email/password login
      const { data: fetchedProfileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile:", profileError);
        return res.status(500).json({
          success: false,
          error: profileError.message || "Failed to fetch user profile",
        });
      }

      profileData = fetchedProfileData;
    }

    const responseUser: LoginSuccessUser = {
      id: authUser.id,
      email: authUser.email ?? email.trim(),
      name:
        profileData?.name ||
        (authUser.user_metadata?.name as string | undefined) ||
        authUser.email?.split("@")[0] ||
        "",
      onboarded: profileData?.onboarded ?? false,
      created_at:
        profileData?.created_at || authUser.created_at || new Date().toISOString(),
      survey_completed_at: profileData?.survey_completed_at ?? null,
      profile_complete: profileData?.profile_complete ?? false,
      is_recruiter:
        profileData?.is_recruiter ??
        Boolean(authUser.user_metadata?.is_recruiter) ??
        false,
    };
    
    console.log("Login successful",authData);
    
    return res.status(200).json({
      success: true,
      user: responseUser,
      message: "Login successful",
      access_token: authData.session?.access_token, // For Google: this is googleAccessToken, for email/password: Supabase JWT
      refresh_token: authData.session?.refresh_token,
    });
  } catch (err: any) {
    console.error("/api/auth/login error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}


