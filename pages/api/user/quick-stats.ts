import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { calculateScoreGrowth } from "@/lib/stats/scoreGrowth";

type QuickStatsResponse =
  | {
      success: true;
      stats: {
        scoreGrowth: {
          currentAverage: number;
          previousAverage: number;
          growthPercentage: number;
          hasBaseline: boolean;
          samples: {
            current: number;
            previous: number;
          };
        };
        profileCompleteness: {
          percentage: number;
          completedSteps: number;
          totalSteps: number;
          pendingSteps: string[];
        };
        profileViews: {
          count: number;
        };
      };
    }
  | {
      success: false;
      error: string;
    };

const TOTAL_SURVEY_STEPS = 7;
const SURVEY_TABLE = "survey_responses";

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
  res: NextApiResponse<QuickStatsResponse>
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

    const [scoreGrowth, profileCompleteness, profileViews] = await Promise.all([
      calculateScoreGrowth(supabase, userId),
      calculateProfileCompleteness(supabase, userId),
      calculateProfileViews(supabase, userId),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        scoreGrowth,
        profileCompleteness,
        profileViews,
      },
    });
  } catch (err: any) {
    console.error("[Quick Stats API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

async function calculateProfileCompleteness(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  userId: string
) {
  const { data: surveyData, error } = await supabase
    .from(SURVEY_TABLE)
    .select(
      "full_name, education_level, industry, mission_focus, strength_areas, learning_preference, portfolio, experience_summary, platform_connections"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to load survey data");
  }

  const steps = [
    {
      id: "basic_info",
      completed: Boolean(
        surveyData?.full_name && surveyData?.industry && surveyData?.education_level
      ),
    },
    {
      id: "mission_focus",
      completed:
        Array.isArray(surveyData?.mission_focus) &&
        surveyData.mission_focus.length > 0,
    },
    {
      id: "strength_areas",
      completed:
        Array.isArray(surveyData?.strength_areas) &&
        surveyData.strength_areas.length > 0,
    },
    {
      id: "learning_preference",
      completed: Boolean(surveyData?.learning_preference),
    },
    {
      id: "portfolio",
      completed: Boolean(
        surveyData?.portfolio &&
          (surveyData.portfolio.url || surveyData.portfolio.file)
      ),
    },
    {
      id: "platform_connections",
      completed: hasConnectedPlatforms(surveyData?.platform_connections),
    },
    {
      id: "experience_summary",
      completed: Boolean(surveyData?.experience_summary),
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const pendingSteps = steps
    .filter((step) => !step.completed)
    .map((step) => step.id);

  const percentage = Math.round(
    (completedSteps / TOTAL_SURVEY_STEPS) * 100
  );

  return {
    percentage,
    completedSteps,
    totalSteps: TOTAL_SURVEY_STEPS,
    pendingSteps,
  };
}

function hasConnectedPlatforms(platformConnections: any): boolean {
  if (!platformConnections || typeof platformConnections !== "object") {
    return false;
  }

  const platforms = Object.values(platformConnections);
  return platforms.some((platform: any) => platform?.connected);
}

async function calculateProfileViews(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  userId: string
) {
  // Get the start of the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("viewed_user_id", userId)
    .gte("viewed_at", startOfMonth.toISOString());

  if (error) {
    console.error("[Quick Stats API] Error counting profile views:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}


