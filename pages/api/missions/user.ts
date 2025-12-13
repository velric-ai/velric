import { NextApiRequest, NextApiResponse } from "next";
import { getMissionsByUserId } from "@/lib/supabaseClient";
import { withAuth } from "@/lib/apiAuth";

/**
 * GET /api/missions/user
 * Returns the authenticated user's missions based on the token
 * No userId parameter needed - user is identified from the token
 * 
 * Headers:
 *   Authorization: Bearer <token>
 */
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
    // Authenticate using token
    const user = await withAuth(req, res);
    if (!user) {
      // Error response already sent by withAuth
      return;
    }

    const userId = user.id;

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
