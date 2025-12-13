import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { withAuth } from "@/lib/apiAuth";

type InterviewRequestsResponse =
  | {
      success: true;
      interviewRequests: Array<{
        id: string;
        candidate_id: string;
        candidate_name?: string | null;
        candidate_email?: string | null;
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
        updated_at: string;
      }>;
      count: number;
    }
  | { success: false; error: string };

/**
 * GET /api/recruiter/interview-requests
 * Returns the authenticated recruiter's interview requests based on the token
 * No recruiterId parameter needed - recruiter is identified from the token
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

    // Verify user is a recruiter
    if (!user.is_recruiter) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Recruiter access required.",
      });
    }

    const recruiterId = user.id;

    if (USE_DUMMY) {
      const mockRequests = [
        {
          id: "interview_1",
          candidate_id: "candidate_1",
          candidate_name: "John Doe",
          candidate_email: "john@example.com",
          interview_type: "Technical",
          context: "Senior Frontend Developer position",
          preferred_date: "2025-01-20",
          preferred_time: "14:00",
          start_time: "14:00",
          end_time: "15:00",
          message: "Looking forward to discussing your experience",
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "interview_2",
          candidate_id: "candidate_2",
          candidate_name: "Jane Smith",
          candidate_email: "jane@example.com",
          interview_type: "Behavioral",
          context: "Product Manager role",
          preferred_date: "2025-01-22",
          preferred_time: "10:00",
          start_time: "10:00",
          end_time: "10:45",
          message: null,
          status: "accepted",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      return res.status(200).json({
        success: true,
        interviewRequests: mockRequests,
        count: mockRequests.length,
      });
    }

    // Fetch interview requests for the authenticated recruiter
    const { data: interviewRequests, error } = await supabase
      .from("interview_requests")
      .select("*")
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching interview requests:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch interview requests",
      });
    }

    // Fetch candidate details for each request
    const requestsWithCandidateInfo = await Promise.all(
      (interviewRequests || []).map(async (request) => {
        const { data: candidateData } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", request.candidate_id)
          .single();

        return {
          id: request.id,
          candidate_id: request.candidate_id,
          candidate_name: candidateData?.name || null,
          candidate_email: candidateData?.email || null,
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
          updated_at: request.updated_at,
        };
      })
    );

    return res.status(200).json({
      success: true,
      interviewRequests: requestsWithCandidateInfo,
      count: requestsWithCandidateInfo.length,
    });
  } catch (err: any) {
    console.error("/api/recruiter/interview-requests error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

