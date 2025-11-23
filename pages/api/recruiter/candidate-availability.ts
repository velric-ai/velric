import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type CandidateAvailabilityResponse =
  | {
      success: true;
      timeSlots: string[];
    }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CandidateAvailabilityResponse>
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

    // Handle dummy mode
    if (USE_DUMMY) {
      const defaultSlots = generateDefaultTimeSlots();
      return res.status(200).json({
        success: true,
        timeSlots: defaultSlots,
      });
    }

    // Fetch user's survey data to get availability preferences
    const { data: surveyData } = await supabase
      .from("survey_responses")
      .select("user_id, metadata")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let timeSlots: string[] = [];

    // Extract availability from survey metadata if available
    if (surveyData?.metadata && typeof surveyData.metadata === "object") {
      const metadata = surveyData.metadata as any;
      if (metadata.availability && Array.isArray(metadata.availability)) {
        timeSlots = metadata.availability;
      } else if (metadata.preferred_times && Array.isArray(metadata.preferred_times)) {
        timeSlots = metadata.preferred_times;
      }
    }

    // If no availability data found, generate default slots
    if (timeSlots.length === 0) {
      timeSlots = generateDefaultTimeSlots();
    }

    return res.status(200).json({
      success: true,
      timeSlots: timeSlots.slice(0, 20), // Limit to 20 slots
    });
  } catch (err: any) {
    console.error("/api/recruiter/candidate-availability error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

function generateDefaultTimeSlots(): string[] {
  const slots: string[] = [];
  const today = new Date();

  // Generate slots for next 7 business days
  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Generate time slots: 9 AM, 11 AM, 2 PM, 4 PM
    const times = ["09:00", "11:00", "14:00", "16:00"];
    times.forEach((time) => {
      const dateStr = date.toISOString().split("T")[0];
      slots.push(`${dateStr} ${time}`);
    });
  }

  return slots;
}

