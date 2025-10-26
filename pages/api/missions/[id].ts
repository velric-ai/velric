// pages/api/missions/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { getMissionById, StaticMission } from "@/data/staticMissions";
import { getMissionByIdFromDB, USE_DUMMY } from "@/lib/supabaseClient";
import { dummyMissionStore } from "./generate";

interface ApiResponse {
  mission?: StaticMission;
  error?: string;
  success: boolean;
  source?: "database" | "static" | "dummy";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid mission ID",
      });
    }

    let mission: StaticMission | null = null;
    let source: "database" | "static" | "dummy" = "database";

    // Check if ID is numeric (DB id) or string-based (generated/fallback)
    const isNumericId = /^\d+$/.test(id);

    console.log(
      `[Mission Retrieval] ID: ${id}, isNumeric: ${isNumericId}, dummyStoreSize: ${
        dummyMissionStore.size
      }, hasId: ${dummyMissionStore.has(id)}`
    );

    // Try database first when not in dummy mode AND id is numeric
    if (!USE_DUMMY && isNumericId) {
      try {
        mission = await getMissionByIdFromDB(id);
        source = "database";
        console.log(`[Mission Retrieval] Found in database`);
      } catch (dbError) {
        console.warn("Database fetch failed:", dbError);
        mission = null;
      }
    }

    // If still not found, check the in-memory store (even when not in dummy mode)
    if (!mission && dummyMissionStore.has(id)) {
      mission = dummyMissionStore.get(id) || null;
      source = "dummy";
      console.log(`[Mission Retrieval] Found in dummyStore`);
    }

    // If still not found, try static missions
    if (!mission) {
      mission = getMissionById(id) || null;
      source = "static";
    }

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: "Mission not found",
      });
    }

    console.log(`[Mission ${id}] Returning mission:`, {
      title: mission.title,
      hasDescription: !!mission.description,
      descriptionLength: mission.description?.length || 0,
      hasContext: !!mission.context,
      contextLength: mission.context?.length || 0,
      hasTasks: !!mission.tasks?.length,
      taskCount: mission.tasks?.length || 0,
      tasks: mission.tasks,
      hasSkills: !!mission.skills?.length,
      skillCount: mission.skills?.length || 0,
      skills: mission.skills,
      hasObjectives: !!mission.objectives?.length,
      objectiveCount: mission.objectives?.length || 0,
      hasEvaluationMetrics: !!mission.evaluationMetrics?.length,
      evaluationMetricsCount: mission.evaluationMetrics?.length || 0,
      difficulty: mission.difficulty,
      timeEstimate: mission.timeEstimate,
      company: mission.company,
      source,
    });

    res.status(200).json({
      success: true,
      mission,
      source,
    });
  } catch (error) {
    console.error("Error fetching mission:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mission",
    });
  }
}
