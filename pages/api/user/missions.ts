// /pages/api/user/missions.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "userId is required" });
  }

  try {
    // 1. Fetch missions where user has a relationship (starred, in_progress, completed)
    const { data: userMissions, error: userMissionsError } = await supabase
      .from("user_missions")
      .select(
        `
        status,
        grade,
        feedback,
        started_at,
        completed_at,
        missions (*)
      `
      )
      .eq("user_id", userId);

    if (userMissionsError) {
      console.error("Error fetching user missions:", userMissionsError);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch user missions",
      });
    }

    // 2. Fetch all missions for suggested section
    const { data: allMissions, error: allMissionsError } = await supabase
      .from("missions")
      .select("*");

    if (allMissionsError) {
      console.error("Error fetching all missions:", allMissionsError);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch missions",
      });
    }

    // 3. Get IDs of missions user already has
    const userMissionIds = userMissions?.map((um: any) => um.missions.id) || [];

    // 4. Filter out missions user already has (these become suggested)
    console.log("All Missions:", allMissions);
    const suggestedMissions =
      allMissions
        ?.filter((m: any) => !userMissionIds.includes(m.id))
        .map((m: any) => ({
          ...m,
          status: "suggested",
        })) || [];
    console.log("Suggested Missions:", suggestedMissions);
    // 5. Transform user missions to flat structure
    const transformedUserMissions =
      userMissions?.map((um: any) => ({
        id: um.missions.id,
        field: um.missions.field,
        title: um.missions.title,
        description: um.missions.description,
        skills: um.missions.skills,
        industries: um.missions.industries,
        created_at: um.missions.created_at,
        status: um.status,
        grade: um.grade,
        feedback: um.feedback,
        started_at: um.started_at,
        completed_at: um.completed_at,
      })) || [];

    // 6. Combine everything
    const allUserMissions = [...transformedUserMissions, ...suggestedMissions];

    return res.status(200).json({
      success: true,
      missions: allUserMissions,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
