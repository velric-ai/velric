import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateMissionNumber } from "@/utils/missionNumber";

// Create server-side Supabase client with service role key (bypasses RLS)
function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration missing");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || Array.isArray(id))
    return res.status(400).json({ success: false, error: "Invalid id" });

  try {
    // Use server-side client to bypass RLS for API routes
    const supabaseClient = createServerSupabaseClient();
    
    // Convert id to number since user_mission.id is bigint
    const idAsNumber = parseInt(id as string, 10);
    if (isNaN(idAsNumber)) {
      return res.status(400).json({ success: false, error: "Invalid ID format - must be a number" });
    }

    // Query directly with server-side client (bypasses RLS)
    const { data: submission, error } = await supabaseClient
      .from("user_mission")
      .select("*")
      .eq("id", idAsNumber)
      .single();

    if (error) {
      console.error(`[Feedback API] Error fetching submission ${id}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      if (error.code === "PGRST116") {
        return res.status(404).json({ success: false, error: "Submission not found" });
      }
      return res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch submission" 
      });
    }

    if (!submission) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    // Fetch user's overall Velric score
    let userVelricScore = null;
    if (submission.user_id) {
      const { data: userStats } = await supabaseClient
        .from("user_stats")
        .select("overall_velric_score")
        .eq("user_id", submission.user_id)
        .single();
      
      userVelricScore = userStats?.overall_velric_score || null;
    }

    const missionNumber = generateMissionNumber(submission.mission_id);
    
    // Calculate tab switch deduction for display
    const tabSwitchCount = submission.tab_switch_count || 0;
    let tabSwitchDeduction = 0;
    if (tabSwitchCount === 0) {
      tabSwitchDeduction = 0;
    } else if (tabSwitchCount === 1) {
      tabSwitchDeduction = 10;
    } else if (tabSwitchCount === 2) {
      tabSwitchDeduction = 20;
    } else {
      tabSwitchDeduction = 50;
    }
    
    // Parse JSONB fields if needed and rename to camelCase for frontend
    const parsedPositiveTemplates = typeof submission.positive_templates === "string" 
      ? JSON.parse(submission.positive_templates) 
      : submission.positive_templates;
    
    const parsedImprovementTemplates = typeof submission.improvement_templates === "string" 
      ? JSON.parse(submission.improvement_templates) 
      : submission.improvement_templates;
    
    const parsedGrades = typeof submission.grades === "string" 
      ? JSON.parse(submission.grades) 
      : submission.grades;
    
    const parsedRubric = typeof submission.rubric === "string" 
      ? JSON.parse(submission.rubric) 
      : submission.rubric;

    const formattedSubmission = {
      ...submission,
      // Ensure feedback is available (try multiple field names)
      feedback: submission.feedback_text || submission.feedback || "",
      
      // Parse JSONB fields from database
      grades: parsedGrades,
      rubric: parsedRubric,
      positive_templates: parsedPositiveTemplates,
      improvement_templates: parsedImprovementTemplates,
      
      // Camel case versions for frontend
      positiveTemplates: parsedPositiveTemplates,
      improvementTemplates: parsedImprovementTemplates,
      letterGrade: submission.letter_grade,
      velricScore: submission.velric_score,
      feedbackText: submission.feedback_text || submission.feedback,
      userId: submission.user_id,
      missionId: submission.mission_id,
      submissionText: submission.submission_text,
      
      // Tab switch deduction info
      tabSwitchCount,
      tabSwitchDeduction,
    };

    console.log(`[Feedback ${id}] Retrieved submission:`, {
      found: !!submission,
      id: submission.id,
      user_id: submission.user_id,
      mission_id: submission.mission_id,
      mission_number: missionNumber,
      status: submission.status,
      grade: submission.grade,
      feedback: submission.feedback,
      velric_score: submission.velric_score,
      userVelricScore: userVelricScore,
      has_feedback_text: !!submission.feedback_text,
      has_grades: !!submission.grades,
      has_summary: !!submission.summary,
      letter_grade: submission.letter_grade,
      has_positive_templates: !!submission.positive_templates,
      positive_templates_count: Array.isArray(submission.positive_templates) ? submission.positive_templates.length : 0,
      has_improvement_templates: !!submission.improvement_templates,
      improvement_templates_count: Array.isArray(submission.improvement_templates) ? submission.improvement_templates.length : 0,
      tabSwitchCount,
      tabSwitchDeduction: `${tabSwitchDeduction}%`,
    });

    return res.status(200).json({ 
      success: true, 
      submission: {
        ...formattedSubmission,
        userVelricScore,
      }
    });
  } catch (err: any) {
    console.error(`[Feedback API] Unexpected error:`, err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
