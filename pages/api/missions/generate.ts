// pages/api/missions/generate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { StaticMission } from "@/data/staticMissions";
import {
  generateComprehensiveMission,
  generateFallbackMission,
} from "@/lib/ai";
import { storeAIGeneratedMission, USE_DUMMY } from "@/lib/supabaseClient";

interface GenerateBody {
  userBackground?: string;
  interests?: string[];
  industry?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  count?: number;
}

// In-memory store for dummy-generated missions (persists across hot reloads)
const globalForMissionStore = global as typeof globalThis & {
  missionStore: Map<string, StaticMission>;
};

export const dummyMissionStore: Map<string, StaticMission> =
  globalForMissionStore.missionStore || new Map<string, StaticMission>();

if (process.env.NODE_ENV !== "production") {
  globalForMissionStore.missionStore = dummyMissionStore;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      userBackground = "Motivated developer interested in web and AI, familiar with React/Next.js and Node.js.",
      interests = ["AI", "SaaS", "Productivity"],
      industry = "SaaS",
      difficulty = "Intermediate",
      count = 3,
    } = (req.body || {}) as GenerateBody;

    const safeCount = Math.min(Math.max(count, 1), 5);

    const generated: StaticMission[] = [];
    const storedIds: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      try {
        const mission = await generateComprehensiveMission(
          userBackground,
          interests,
          industry,
          difficulty,
          `${2 + i}-${6 + i} hours`
        );
        generated.push(mission);
      } catch (error) {
        console.error(`Error generating mission ${i + 1}:`, error);
        // Fall back to detailed template-based mission instead of failing
        const fallbackMission = generateFallbackMission(
          userBackground,
          interests,
          industry || "Technology",
          difficulty || "Intermediate",
          `${2 + i}-${6 + i} hours`
        );
        generated.push(fallbackMission);
      }

      // Use the last generated mission (either AI or fallback)
      const current = generated[generated.length - 1];

      // If DB is available, store each mission and replace id with DB id for consistency
      if (!USE_DUMMY) {
        try {
          const dbId = await storeAIGeneratedMission({
            title: current.title,
            description: current.description,
            field: current.field,
            difficulty: current.difficulty,
            timeEstimate: current.timeEstimate,
            category: current.category,
            company: current.company,
            context: current.context,
            skills: current.skills || [],
            industries: current.industries || [],
            tasks: current.tasks || [],
            objectives: current.objectives || [],
            resources: current.resources || [],
            evaluationMetrics: current.evaluationMetrics || [],
          });
          storedIds.push(dbId);
          // Map returned mission id to the DB id so the client can navigate
          current.id = dbId;
        } catch (e) {
          // If storing fails, still return the generated mission with the temporary id
          // Also store in memory so it can be retrieved by ID (prevents 404)
          console.error("Failed to store generated mission:", e);
          console.log(`[Mission ${current.id}] Generated mission has:`, {
            hasDescription: !!current.description,
            hasContext: !!current.context,
            taskCount: current.tasks?.length || 0,
            skillCount: current.skills?.length || 0,
            objectiveCount: current.objectives?.length || 0,
            evaluationMetricsCount: current.evaluationMetrics?.length || 0,
          });
          dummyMissionStore.set(current.id, current);
          storedIds.push(current.id);
          console.log(
            `[Mission Generation] Stored in dummyStore after DB fail: ${current.id}, storeSize: ${dummyMissionStore.size}`
          );
        }
      } else {
        // In dummy mode, store in memory so missions can be retrieved by ID
        dummyMissionStore.set(current.id, current);
        storedIds.push(current.id);
        console.log(
          `[Mission Generation] Stored in dummyStore (dummy mode): ${current.id}, storeSize: ${dummyMissionStore.size}`
        );
      }
    }

    return res.status(200).json({
      success: true,
      missions: generated,
      storedIds,
      usedDatabase: !USE_DUMMY,
    });
  } catch (error) {
    console.error("Error generating missions:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to generate missions" });
  }
}
