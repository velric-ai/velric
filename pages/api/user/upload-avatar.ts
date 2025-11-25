import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type UploadAvatarResponse =
  | {
      success: true;
      imageUrl: string;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadAvatarResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { userId, imageUrl } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).json({
        success: false,
        error: "imageUrl is required",
      });
    }

    const supabase = createServerSupabaseClient();

    // Update user's profile_image
    const { error } = await supabase
      .from("users")
      .update({ profile_image: imageUrl })
      .eq("id", userId);

    if (error) {
      console.error("[Upload Avatar API] Error updating profile image:", error);
      throw new Error(error.message || "Failed to update profile image");
    }

    return res.status(200).json({
      success: true,
      imageUrl,
      message: "Profile image updated successfully",
    });
  } catch (err: any) {
    console.error("[Upload Avatar API] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

