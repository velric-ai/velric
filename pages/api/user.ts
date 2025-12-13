import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/apiAuth";

type GetUserResponse =
  | {
      success: true;
      user: {
        id: string;
        email: string;
        name: string;
        onboarded: boolean;
        created_at: string;
        updated_at: string | null;
        survey_completed_at: string | null;
        profile_complete: boolean;
        profile_image: string | null;
      };
    }
  | { success: false; error: string };

/**
 * GET /api/user
 * Returns the authenticated user's data based on the token
 * No userId parameter needed - user is identified from the token
 * 
 * Headers:
 *   Authorization: Bearer <token>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Authenticate request using token
    const user = await withAuth(req, res);
    if (!user) {
      // Error response already sent by withAuth
      return;
    }

    // Return authenticated user's data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        onboarded: user.onboarded,
        created_at: user.created_at,
        updated_at: user.created_at, // Use created_at as fallback
        survey_completed_at: user.survey_completed_at,
        profile_complete: user.profile_complete,
        profile_image: user.profile_image,
      },
    });
  } catch (err: any) {
    console.error("/api/user error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

