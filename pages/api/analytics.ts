import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

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
  missions?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "userId is required" });
  }

  try {
    const supabaseClient = createServerSupabaseClient();

    // Query all user_mission data for the user
    const { data: userMissions, error } = await supabaseClient
      .from("user_mission")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Analytics API] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Format missions with all details
    const missions = (userMissions || []).map((mission: any) => {
      const createdDate = new Date(mission.created_at);
      const completedDate = mission.completed_at ? new Date(mission.completed_at) : null;
      const startedDate = mission.started_at ? new Date(mission.started_at) : null;

      return {
        id: mission.id,
        user_id: mission.user_id,
        mission_id: mission.mission_id,
        status: mission.status,
        submission_text: mission.submission_text || null,
        grade: mission.grade || null,
        feedback: mission.feedback || null,
        feedback_text: mission.feedback_text || null,
        summary: mission.summary || null,
        letter_grade: mission.letter_grade || null,
        velric_score: mission.velric_score || null,
        grades: mission.grades || null,
        rubric: mission.rubric || null,
        positive_templates: mission.positive_templates || null,
        improvement_templates: mission.improvement_templates || null,
        started_at: mission.started_at || null,
        completed_at: mission.completed_at || null,
        created_at: mission.created_at,
        created_date: createdDate.toLocaleDateString(),
        created_time: createdDate.toLocaleTimeString(),
        completed_date: completedDate ? completedDate.toLocaleDateString() : null,
        completed_time: completedDate ? completedDate.toLocaleTimeString() : null,
        started_date: startedDate ? startedDate.toLocaleDateString() : null,
        started_time: startedDate ? startedDate.toLocaleTimeString() : null,
      };
    });

    return res.status(200).json({ success: true, missions });
  } catch (err: any) {
    console.error("[Analytics API] Unexpected error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}

