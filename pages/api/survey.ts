import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { demoCandidates } from "@/data/demoCandidates";
import { withAuth } from "@/lib/apiAuth";

type GetSurveyResponse =
  | {
      success: true;
      surveyData: {
        full_name: string;
        education_level: string;
        industry: string;
        mission_focus: string[];
        strength_areas: string[];
        learning_preference: string;
        portfolio: any;
        resume_json: any; // Supports JSONB format
        experience_summary: string | null;
        platform_connections: any;
        metadata: any;
        created_at: string;
      } | null;
    }
  | { success: false; error: string };

/**
 * GET /api/survey
 * Returns the authenticated user's survey data based on the token
 * No userId parameter needed - user is identified from the token
 * 
 * Headers:
 *   Authorization: Bearer <token>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSurveyResponse>
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

    // Handle dummy mode - check for demo candidates
    if (USE_DUMMY) {
      // Check if this is a demo candidate
      if (userId.startsWith("demo_")) {
        const demoCandidate = demoCandidates.find(c => c.id === userId);
        if (demoCandidate) {
          return res.status(200).json({
            success: true,
            surveyData: {
              full_name: demoCandidate.name,
              education_level: demoCandidate.education_level || "Bachelor's Degree",
              industry: demoCandidate.industry || "Technology & Software",
              mission_focus: demoCandidate.mission_focus || [],
              strength_areas: demoCandidate.strength_areas || [],
              learning_preference: demoCandidate.learning_preference || "Hands-on Projects",
              portfolio: null,
              resume_json: null,
              experience_summary: demoCandidate.experience_summary || null,
              platform_connections: {},
              metadata: {},
              created_at: new Date().toISOString(),
            },
          });
        }
      }
      
      // Fallback for other dummy requests
      const mockSurveyData = {
        full_name: "Demo User",
        education_level: "Bachelor's Degree",
        industry: "Technology",
        mission_focus: ["Backend Development", "Data Analytics"],
        strength_areas: ["Problem Solving", "Technical Implementation"],
        learning_preference: "Hands-on Projects",
        portfolio: null,
        resume_json: null,
        experience_summary: null,
        platform_connections: {},
        metadata: {},
        created_at: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        surveyData: mockSurveyData,
      });
    }

    // Fetch survey data from survey_responses table
    const { data: surveyData, error: dbError } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbError) {
      console.error("Supabase survey_responses fetch error:", dbError);
      
      // Handle not found error - return null instead of error
      if (dbError.code === "PGRST116") {
        return res.status(200).json({
          success: true,
          surveyData: null,
        });
      }

      return res.status(500).json({
        success: false,
        error: dbError.message || "Failed to fetch survey data",
      });
    }

    // Return survey data (can be null if no survey found)
    return res.status(200).json({
      success: true,
      surveyData: surveyData || null,
    });
  } catch (err: any) {
    console.error("/api/survey error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

