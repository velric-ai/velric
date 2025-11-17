import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Create server-side Supabase client for auth operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a server-side Supabase client (without session persistence)
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

type SignupSuccessUser = {
  id: string;
  email: string;
  name: string;
  onboarded: boolean;
  created_at: string;
  survey_completed_at: string | null;
  profile_complete: boolean;
  is_recruiter: boolean;
};

type SignupResponse =
  | {
      success: true;
      user: SignupSuccessUser;
      message?: string;
      access_token?: string;
      refresh_token?: string;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
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
    const { name, email, password, isRecruiter } = body;
    const recruiterFlag = Boolean(isRecruiter);

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
      error: "Missing required fields: name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
      error: "Password must be at least 8 characters long",
      });
    }

    // Validate isRecruiter flag presence
    if (typeof isRecruiter === "undefined") {
      return res.status(400).json({
        success: false,
        error: "Missing required field: isRecruiter",
      });
    }

    // Check if Supabase is properly configured
    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      });
    }

    // Check if email already exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.trim())
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" which is fine, other errors are problematic
      console.error("Error checking existing email:", checkError);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists. Please use a different email or try logging in.",
      });
    }

    // Step 1: Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name.trim(),
          is_recruiter: recruiterFlag,
        },
      },
    });

    if (authError) {
      console.error("Supabase Auth signup error:", authError);
      
      // Check if email already exists in Supabase Auth
      if (authError.message?.includes("already registered") || 
          authError.message?.includes("User already registered") ||
          authError.message?.includes("email address is already registered")) {
        return res.status(400).json({
          success: false,
          error: "Email already exists. Please use a different email or try logging in.",
        });
      }
      
      // If API key is invalid, return helpful error message
      if (authError.message?.includes("Invalid API key") || authError.status === 401) {
        return res.status(400).json({
          success: false,
          error: "Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.",
        });
      }
      
      return res.status(400).json({
        success: false,
        error: authError.message || "Failed to create user account",
      });
    }

    if (!authData.user) {
      return res.status(500).json({
        success: false,
        error: "User creation failed - no user data returned",
      });
    }

    // Step 2: Create user record in users table
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: "Supabase client not initialized",
      });
    }

    const userRecord = {
      id: authData.user.id,
      email: email.trim(),
      name: name.trim(),
      onboarded: false,
      is_recruiter: recruiterFlag,
      created_at: new Date().toISOString(),
      survey_completed_at: null,
      profile_complete: false,
    };

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .insert([userRecord])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase users table insert error:", dbError);
      
      // If user already exists in users table, try to fetch it
      if (dbError.code === "23505") {
        // Unique constraint violation - user might already exist
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (existingUser) {
          const existingResponseUser: SignupSuccessUser = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            onboarded: existingUser.onboarded || false,
            created_at: existingUser.created_at,
            survey_completed_at: existingUser.survey_completed_at || null,
            profile_complete: existingUser.profile_complete || false,
            is_recruiter: recruiterFlag,
          };

          return res.status(200).json({
            success: true,
            user: existingResponseUser,
            message: "User already exists",
            access_token: authData.session?.access_token,
            refresh_token: authData.session?.refresh_token,
          });
        }
      }

      return res.status(500).json({
        success: false,
        error: dbError.message || "Failed to create user record",
      });
    }

    const responseUser: SignupSuccessUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      onboarded: userData.onboarded || false,
      created_at: userData.created_at,
      survey_completed_at: userData.survey_completed_at || null,
      profile_complete: userData.profile_complete || false,
      is_recruiter: recruiterFlag,
    };

    // Return success with user data (same structure as login)
    return res.status(201).json({
      success: true,
      user: responseUser,
      message: "User created successfully",
      access_token: authData.session?.access_token,
      refresh_token: authData.session?.refresh_token,
    });
  } catch (err: any) {
    console.error("/api/auth/signup error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

