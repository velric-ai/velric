import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { withAuth } from "@/lib/apiAuth";

type InterviewRequestsResponse =
  | {
      success: true;
      interviewRequests: Array<{
        id: string;
        recruiter_id: string;
        recruiter_name?: string;
        recruiter_email?: string;
        interview_type: string;
        context: string;
        duration?: number; // Optional for backward compatibility
        preferred_date: string;
        preferred_time: string;
        start_time?: string | null;
        end_time?: string | null;
        message: string | null;
        status: string;
        google_meet_link?: string | null;
        created_at: string;
      }>;
      count: number;
    }
  | { success: false; error: string };

/**
 * GET /api/user/interview-requests
 * Returns the authenticated user's interview requests based on the token
 * No userId parameter needed - user is identified from the token
 * 
 * Headers:
 *   Authorization: Bearer <token>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InterviewRequestsResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Authenticate using token
    const user = await withAuth(req, res);
    if (!user) {
      // Error response already sent by withAuth
      return;
    }

    const userId = user.id;

    if (USE_DUMMY) {
      const mockRequests = [
        {
          id: "interview_1",
          recruiter_id: "recruiter_1",
          recruiter_name: "John Doe",
          recruiter_email: "john@example.com",
          interview_type: "Technical",
          context: "Senior Frontend Developer position",
          preferred_date: "2025-01-20",
          preferred_time: "14:00",
          start_time: "14:00",
          end_time: "15:00",
          message: "Looking forward to discussing your experience",
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ];

      return res.status(200).json({
        success: true,
        interviewRequests: mockRequests,
        count: mockRequests.length,
      });
    }

    // Fetch interview requests for the authenticated candidate
    const { data: interviewRequests, error } = await supabase
      .from("interview_requests")
      .select("*")
      .eq("candidate_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching interview requests:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch interview requests",
      });
    }

    // Fetch recruiter details for each request
    const requestsWithRecruiterInfo = await Promise.all(
      (interviewRequests || []).map(async (request) => {
        const { data: recruiterData } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", request.recruiter_id)
          .single();

        return {
          id: request.id,
          recruiter_id: request.recruiter_id,
          recruiter_name: recruiterData?.name || null,
          recruiter_email: recruiterData?.email || null,
          interview_type: request.interview_type,
          context: request.context,
          duration: request.duration || undefined,
          preferred_date: request.preferred_date,
          preferred_time: request.preferred_time,
          start_time: request.start_time || null,
          end_time: request.end_time || null,
          message: request.message,
          status: request.status,
          google_meet_link: request.google_meet_link || null,
          created_at: request.created_at,
        };
      })
    );

    return res.status(200).json({
      success: true,
      interviewRequests: requestsWithRecruiterInfo,
      count: requestsWithRecruiterInfo.length,
    });
  } catch (err: any) {
    console.error("/api/user/interview-requests error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

