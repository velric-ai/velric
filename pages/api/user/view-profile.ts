import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type ViewProfileResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ViewProfileResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { candidateId, recruiterId } = req.body;

  if (!candidateId || typeof candidateId !== "string") {
    return res.status(400).json({
      success: false,
      error: "candidateId is required",
    });
  }

  try {
    const supabase = createServerSupabaseClient();

    // Insert view record
    const { error } = await supabase.from("profile_views").insert({
      viewed_user_id: candidateId,
      viewer_user_id: recruiterId || null,
      viewed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[View Profile API] Error inserting view:", error);
      throw new Error(error.message || "Failed to record profile view");
    }

    return res.status(200).json({
      success: true,
      message: "Profile view recorded",
    });
  } catch (err: any) {
    console.error("[View Profile API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

