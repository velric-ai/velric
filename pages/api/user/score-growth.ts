import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { calculateScoreGrowth } from "@/lib/stats/scoreGrowth";

type ScoreGrowthResponse =
  | {
      success: true;
      currentAverage: number;
      previousAverage: number;
      growthPercentage: number;
      hasBaseline: boolean;
      samples: {
        current: number;
        previous: number;
      };
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
  res: NextApiResponse<ScoreGrowthResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const supabase = createServerSupabaseClient();

    const scoreGrowth = await calculateScoreGrowth(supabase, userId);

    return res.status(200).json({
      success: true,
      ...scoreGrowth,
    });
  } catch (err: any) {
    console.error("[Score Growth API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}


