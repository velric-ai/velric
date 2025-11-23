import { NextApiRequest, NextApiResponse } from "next";
import { getMissionsByUserId } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    console.log(`[User Missions] Fetching missions for user: ${userId}`);

    const missions = await getMissionsByUserId(userId);

    console.log(
      `[User Missions] Retrieved ${missions.length} missions for user ${userId}`
    );

    return res.status(200).json({
      success: true,
      missions,
      count: missions.length,
      userId,
    });
  } catch (error) {
    console.error("Error fetching user missions:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch user missions" });
  }
}
