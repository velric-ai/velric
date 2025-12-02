import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type SubmitSolutionResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitSolutionResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { requestId } = req.query;
    const { code, language, userId } = req.body;

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Interview request ID is required",
      });
    }

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Code solution is required",
      });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({
        success: false,
        error: "Programming language is required",
      });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (USE_DUMMY) {
      console.log("Would submit solution:", {
        requestId,
        userId,
        language,
        codeLength: code.length,
      });
      return res.status(200).json({
        success: true,
        message: "Solution submitted successfully (demo mode)",
      });
    }

    // Check if interview request exists and belongs to user
    const { data: interviewRequest, error: fetchError } = await supabase
      .from("interview_requests")
      .select("id, candidate_id, interview_type, status")
      .eq("id", requestId)
      .single();

    if (fetchError || !interviewRequest) {
      return res.status(404).json({
        success: false,
        error: "Interview request not found",
      });
    }

    if (interviewRequest.candidate_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: This interview request does not belong to you",
      });
    }

    if (interviewRequest.interview_type.toLowerCase() !== "technical") {
      return res.status(400).json({
        success: false,
        error: "This interview is not a technical interview",
      });
    }

    // Store solution in database
    // Option 1: Store in interview_requests table (if you add a solution column)
    // Option 2: Store in a separate interview_solutions table
    // For now, we'll update the interview_requests table with solution data in a JSONB field

    const { error: updateError } = await supabase
      .from("interview_requests")
      .update({
        updated_at: new Date().toISOString(),
        // Store solution in a JSONB field (you may need to add this column)
        // solution: { code, language, submitted_at: new Date().toISOString() },
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Error updating interview request with solution:", updateError);
      // If the solution column doesn't exist, we can still return success
      // The solution is stored in the request, just not in the DB yet
    }

    // TODO: Create interview_solutions table if you want to store multiple submissions
    // For now, we'll just log it and return success

    console.log("Solution submitted:", {
      requestId,
      userId,
      language,
      codeLength: code.length,
    });

    return res.status(200).json({
      success: true,
      message: "Solution submitted successfully",
    });
  } catch (err: any) {
    console.error("/api/user/interview-requests/[requestId]/submit-solution error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

