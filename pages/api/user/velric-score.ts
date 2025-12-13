import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/apiAuth";

function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
}

type VelricScoreResponse =
  | {
      success: true;
      overallVelricScore: number | null;
    }
  | {
      success: false;
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VelricScoreResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    // Authenticate using token
    const user = await withAuth(req, res);
    if (!user) {
      // Error response already sent by withAuth
      return;
    }

    const supabase = createServerSupabaseClient();

    // Fetch overall_velric_score from user_stats table using authenticated user's ID
    const { data, error } = await supabase
      .from("user_stats")
      .select("overall_velric_score")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" - that's okay, just means no record yet
      throw error;
    }

    const overallVelricScore = data?.overall_velric_score || null;

    return res.status(200).json({
      success: true,
      overallVelricScore,
    });
  } catch (err: any) {
    console.error("[Velric Score API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}
