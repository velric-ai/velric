import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { demoCandidates } from "@/data/demoCandidates";

type CandidateMissionsResponse =
  | {
      success: true;
      count: number;
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CandidateMissionsResponse>
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

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    // Handle dummy mode - check for demo candidates
    if (USE_DUMMY) {
      // Check if this is a demo candidate
      if (userId.startsWith("demo_")) {
        const demoCandidate = demoCandidates.find(c => c.id === userId);
        if (demoCandidate) {
          return res.status(200).json({
            success: true,
            count: demoCandidate.missionsCompleted || 0,
          });
        }
      }
      
      // Fallback for other dummy requests
      return res.status(200).json({
        success: true,
        count: 3,
      });
    }

    // Fetch completed missions count
    const { count, error } = await supabase
      .from("user_mission")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["completed", "graded"]);

    if (error) {
      console.error("Error fetching completed missions:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch mission count",
      });
    }

    return res.status(200).json({
      success: true,
      count: count || 0,
    });
  } catch (err: any) {
    console.error("/api/recruiter/candidate-missions error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

