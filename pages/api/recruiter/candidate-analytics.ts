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

interface AnalyticsResponse {
  success: boolean;
  analytics?: {
    missionsCompleted: number;
    averageScore: number;
    skillsAcquired: string[];
    learningPath: string;
    completionRate: number;
    timeSpent: number;
    missionsByDomain: Record<string, number>;
    recentActivity: Array<{
      date: string;
      mission: string;
      score: number;
    }>;
    allMissions: Array<any>;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ success: false, error: "userId is required" });
  }

  try {
    const supabaseClient = createServerSupabaseClient();

    // Fetch user missions with details
    const { data: userMissions, error: missionsError } = await supabaseClient
      .from("user_mission")
      .select(
        `
        *,
        missions(title, field, category)
      `
      )
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (missionsError) {
      console.error("[Candidate Analytics API] Error fetching missions:", missionsError);
      return res.status(500).json({ success: false, error: missionsError.message });
    }

    // Fetch user survey data for learning path and skills
    let surveyData = null;
    try {
      const { data } = await supabaseClient
        .from("survey_responses")
        .select("mission_focus, strength_areas")
        .eq("user_id", userId)
        .single();
      surveyData = data;
    } catch (err) {
      console.warn("Could not fetch survey data:", err);
    }

    // Process mission data
    const missions = userMissions || [];
    const completedMissions = missions.filter((m: any) => m.status === "completed");

    // Calculate metrics
    const missionsCompleted = completedMissions.length;
    
    // Calculate average score from velric_score or grade
    const scores = completedMissions
      .map((m: any) => {
        if (m.velric_score) return parseFloat(m.velric_score);
        if (m.grade) return parseFloat(m.grade);
        return 0;
      })
      .filter((score: number) => score > 0);
    
    const averageScore = scores.length > 0
      ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0;

    // Calculate completion rate
    const totalMissions = missions.length;
    const completionRate = totalMissions > 0 
      ? Math.round((missionsCompleted / totalMissions) * 100) 
      : 0;

    // Calculate time spent (hours) - estimate based on mission data
    let totalTimeSpent = 0;
    completedMissions.forEach((mission: any) => {
      if (mission.started_at && mission.completed_at) {
        const start = new Date(mission.started_at).getTime();
        const end = new Date(mission.completed_at).getTime();
        const hoursSpent = (end - start) / (1000 * 60 * 60);
        totalTimeSpent += hoursSpent;
      }
    });
    const timeSpent = Math.round(totalTimeSpent);

    // Extract skills acquired from strength areas
    const skillsAcquired = surveyData?.strength_areas || [
      "Problem Solving",
      "System Design",
      "Code Quality",
    ];

    // Get learning path from mission focus
    const learningPath = surveyData?.mission_focus?.[0] || "Full Stack Development";

    // Count missions by domain
    const missionsByDomain: Record<string, number> = {};
    completedMissions.forEach((mission: any) => {
      const domain = mission.missions?.field || mission.missions?.category || "General";
      missionsByDomain[domain] = (missionsByDomain[domain] || 0) + 1;
    });

    // Get recent activity (last 5 completed missions)
    const recentActivity = completedMissions.slice(0, 5).map((mission: any) => ({
      date: mission.completed_at
        ? new Date(mission.completed_at).toLocaleDateString()
        : new Date(mission.created_at).toLocaleDateString(),
      mission: mission.missions?.title || `Mission ${mission.mission_id}`,
      score: mission.velric_score 
        ? Math.round(parseFloat(mission.velric_score))
        : mission.grade 
        ? Math.round(parseFloat(mission.grade))
        : 0,
    }));

    const analytics = {
      missionsCompleted,
      averageScore: Math.round(averageScore * 10) / 10,
      skillsAcquired,
      learningPath,
      completionRate,
      timeSpent,
      missionsByDomain,
      recentActivity,
      allMissions: missions.map((mission: any) => ({
        id: mission.id,
        user_id: mission.user_id,
        mission_id: mission.mission_id,
        title: mission.missions?.title || `Mission ${mission.mission_id}`,
        field: mission.missions?.field,
        category: mission.missions?.category,
        status: mission.status,
        grade: mission.grade,
        velric_score: mission.velric_score,
        letter_grade: mission.letter_grade,
        feedback: mission.feedback,
        feedback_text: mission.feedback_text,
        summary: mission.summary,
        submission_text: mission.submission_text,
        tab_switch_count: mission.tab_switch_count,
        started_at: mission.started_at,
        completed_at: mission.completed_at,
        created_at: mission.created_at,
        grades: mission.grades,
        rubric: mission.rubric,
        positive_templates: mission.positive_templates,
        improvement_templates: mission.improvement_templates,
      })),
    };

    return res.status(200).json({ success: true, analytics });
  } catch (err: any) {
    console.error("[Candidate Analytics API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
}
