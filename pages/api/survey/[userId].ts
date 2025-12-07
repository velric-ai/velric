import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

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
    const { userId } = req.query;

    // Validation
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    // Handle dummy mode
    if (USE_DUMMY) {
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
    console.error("/api/survey/[userId] error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

