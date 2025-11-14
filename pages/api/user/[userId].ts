import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type GetUserResponse =
  | {
      success: true;
      user: {
        id: string;
        email: string;
        name: string;
        onboarded: boolean;
        created_at: string;
        survey_completed_at: string | null;
        profile_complete: boolean;
      };
    }
  | { success: false; error: string };

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
      const mockUser = {
        id: userId,
        email: "demo@example.com",
        name: "Demo User",
        onboarded: false,
        created_at: new Date().toISOString(),
        survey_completed_at: null,
        profile_complete: false,
      };

      return res.status(200).json({
        success: true,
        user: mockUser,
      });
    }

    // Fetch user from users table
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (dbError) {
      console.error("Supabase users table fetch error:", dbError);
      
      // Handle not found error
      if (dbError.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      return res.status(500).json({
        success: false,
        error: dbError.message || "Failed to fetch user data",
      });
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name || "",
        onboarded: userData.onboarded || false,
        created_at: userData.created_at,
        survey_completed_at: userData.survey_completed_at || null,
        profile_complete: userData.profile_complete || false,
      },
    });
  } catch (err: any) {
    console.error("/api/user/[userId] error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

