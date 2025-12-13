import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateMissionNumber } from "@/utils/missionNumber";
import { withAuth } from "@/lib/apiAuth";

function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
}

type Data = {
  success: boolean;
  activities?: any[];
  averageVelricScore?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // Authenticate using token
    const user = await withAuth(req, res);
    if (!user) {
      // Error response already sent by withAuth
      return;
    }

    const supabaseClient = createServerSupabaseClient();

    // Get today's start and end timestamps
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const todayEndISO = todayEnd.toISOString();

    // Query user_mission table for ALL missions to calculate average Velric score
    const { data: allUserMissions, error: allError } = await supabaseClient
      .from("user_mission")
      .select("velric_score")
      .eq("user_id", user.id)
      .not("velric_score", "is", null);

    // Query user_mission table for today's activities
    const { data: userMissions, error } = await supabaseClient
      .from("user_mission")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", todayStart)
      .lte("created_at", todayEndISO)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Recent Activity API] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Calculate average Velric score from ALL missions (not just today)
    const velricScores = (allUserMissions || [])
      .map((m: any) => m.velric_score)
      .filter((score: any) => score !== null && score !== undefined && typeof score === 'number');
    
    const averageVelricScore = velricScores.length > 0
      ? velricScores.reduce((sum: number, score: number) => sum + score, 0) / velricScores.length
      : 0;

    // Format activities to match dashboard structure
    const activities = (userMissions || []).map((mission: any) => {
      // Generate unique mission number - handle null/undefined mission_id
      const missionId = mission.mission_id ? String(mission.mission_id) : null;
      const missionNumber = generateMissionNumber(missionId);
      const missionTitle = missionNumber;
      const createdDate = new Date(mission.created_at);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      let timeAgo = "";
      if (diffHours > 0) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
      } else {
        timeAgo = "Just now";
      }

      // Determine activity name based on status
      let activityName = "";
      if (mission.status === "graded" || mission.status === "completed") {
        activityName = `Completed: ${missionTitle}`;
      } else if (mission.status === "submitted") {
        activityName = `Submitted: ${missionTitle}`;
      } else if (mission.status === "in_progress") {
        activityName = `Started: ${missionTitle}`;
      } else {
        activityName = missionTitle;
      }

      return {
        id: mission.id,
        name: activityName,
        score: mission.velric_score || null,
        timeAgo: timeAgo,
        status: mission.status,
        mission_id: mission.mission_id,
        mission_number: missionNumber,
      };
    });

    return res.status(200).json({ 
      success: true, 
      activities,
      averageVelricScore: Math.round(averageVelricScore * 10) / 10 // Round to 1 decimal place
    });
  } catch (err: any) {
    console.error("[Recent Activity API] Unexpected error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}

