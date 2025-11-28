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

    // Generate mission number from mission_id if available
    const missionNumber = submission.mission_id 
      ? generateMissionNumber(submission.mission_id) 
      : null;

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
      has_feedback_text: !!submission.feedback_text,
      has_grades: !!submission.grades,
      has_summary: !!submission.summary,
      letter_grade: submission.letter_grade,
    });

    return res.status(200).json({ 
      success: true, 
      submission: {
        ...submission,
        mission_number: missionNumber,
      }
    });
  } catch (err: any) {
    console.error(`[Feedback API] Unexpected error:`, err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
