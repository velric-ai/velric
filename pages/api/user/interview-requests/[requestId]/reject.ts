import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type RejectResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RejectResponse>
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

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Request ID is required",
      });
    }

    if (USE_DUMMY) {
      return res.status(200).json({
        success: true,
        message: "Interview request rejected successfully",
      });
    }

    const { data, error } = await supabase
      .from("interview_requests")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      console.error("Error rejecting interview request:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to reject interview request",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview request rejected successfully",
    });
  } catch (err: any) {
    console.error("/api/user/interview-requests/[requestId]/reject error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

