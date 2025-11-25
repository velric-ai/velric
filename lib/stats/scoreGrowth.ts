import { SupabaseClient } from "@supabase/supabase-js";

export interface ScoreGrowthResult {
  currentAverage: number;
  previousAverage: number;
  growthPercentage: number;
  hasBaseline: boolean;
  samples: {
    current: number;
    previous: number;
  };
}

export async function calculateScoreGrowth(
  supabase: SupabaseClient,
  userId: string
): Promise<ScoreGrowthResult> {
  const now = new Date();
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);

  const previousPeriodStart = new Date(currentPeriodStart);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const { data, error } = await supabase
    .from("user_mission")
    .select("velric_score, created_at")
    .eq("user_id", userId)
    .not("velric_score", "is", null)
    .gte("created_at", previousPeriodStart.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load score history");
  }

  const currentScores: number[] = [];
  const previousScores: number[] = [];

  (data || []).forEach((mission) => {
    const createdAt = new Date(mission.created_at);
    const score =
      typeof mission.velric_score === "number"
        ? mission.velric_score
        : Number(mission.velric_score);

    if (Number.isNaN(score)) return;

    if (createdAt >= currentPeriodStart) {
      currentScores.push(score);
    } else {
      previousScores.push(score);
    }
  });

  const average = (scores: number[]) =>
    scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : null;

  const currentAverage = average(currentScores);
  const previousAverage = average(previousScores);

  const safeCurrent = currentAverage ?? 0;
  const safePrevious = previousAverage ?? 0;

  const hasBaseline =
    previousAverage !== null && Math.abs(previousAverage) > 0.0001;

  let growthPercentage = 0;
  if (hasBaseline) {
    growthPercentage =
      ((safeCurrent - safePrevious) / Math.abs(safePrevious)) * 100;
  } else if (safeCurrent > 0) {
    growthPercentage = (safeCurrent / 10) * 100;
  }

  return {
    currentAverage: Number(safeCurrent.toFixed(2)),
    previousAverage: Number(safePrevious.toFixed(2)),
    growthPercentage: Number(growthPercentage.toFixed(1)),
    hasBaseline,
    samples: {
      current: currentScores.length,
      previous: previousScores.length,
    },
  };
}


