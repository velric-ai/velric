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

type GoogleCallbackResponse = {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoogleCallbackResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { action, code } = req.body;

    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase is not configured",
      });
    }

    // This endpoint receives the OAuth code from Supabase after user authenticates with Google
    // The actual OAuth flow is handled by Supabase, this just handles post-authentication logic

    return res.status(200).json({
      success: true,
      message: "OAuth flow initiated. Supabase will handle the redirect.",
    });
  } catch (err: any) {
    console.error("/api/auth/google-callback error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}
