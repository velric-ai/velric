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
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      });
    }

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !authData.user) {
      const message =
        authError?.message || "Invalid email or password. Please try again.";
      return res.status(401).json({
        success: false,
        error: message,
      });
    }

    const authUser = authData.user;

    const { data: profileData, error: profileError } = await supabase
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

    return res.status(200).json({
      success: true,
      user: responseUser,
      message: "Login successful",
      access_token: authData.session?.access_token,
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


