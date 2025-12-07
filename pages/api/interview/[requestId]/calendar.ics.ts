import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { generateICSFile } from "@/lib/googleCalendar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { requestId } = req.query;

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({ error: "Request ID is required" });
    }

    if (USE_DUMMY) {
      return res.status(404).json({ error: "Not available in dummy mode" });
    }

    // Get interview request
    const { data: interviewRequest, error: fetchError } = await supabase
      .from("interview_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !interviewRequest) {
      return res.status(404).json({ error: "Interview request not found" });
    }

    // Get candidate and recruiter details
    const [candidateResult, recruiterResult] = await Promise.all([
      supabase
        .from("users")
        .select("email, name")
        .eq("id", interviewRequest.candidate_id)
        .single(),
      supabase
        .from("users")
        .select("email, name")
        .eq("id", interviewRequest.recruiter_id)
        .single(),
    ]);

    if (candidateResult.error || !candidateResult.data || recruiterResult.error || !recruiterResult.data) {
      return res.status(500).json({ error: "Failed to fetch user details" });
    }

    const candidateEmail = candidateResult.data.email;
    const recruiterEmail = recruiterResult.data.email;
    const candidateName = candidateResult.data.name || "Candidate";

    // Calculate start and end times
    const preferredDate = interviewRequest.preferred_date;
    const startTime = interviewRequest.start_time || interviewRequest.preferred_time;
    const endTime = interviewRequest.end_time;

    if (!startTime) {
      return res.status(400).json({ error: "Interview time not specified" });
    }

    const startDateTime = new Date(`${preferredDate}T${startTime}:00`);
    const endDateTime = endTime
      ? new Date(`${preferredDate}T${endTime}:00`)
      : new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const meetLink = interviewRequest.google_meet_link || `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;

    // Generate ICS file
    const icsContent = generateICSFile({
      summary: `${interviewRequest.interview_type} Interview - ${candidateName}`,
      description: interviewRequest.context + (interviewRequest.message ? `\n\n${interviewRequest.message}` : ''),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      organizerEmail: recruiterEmail,
      attendeeEmails: [candidateEmail, recruiterEmail],
      meetLink,
      location: "Google Meet",
    });

    // Return ICS file
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="interview-${requestId}.ics"`);
    return res.status(200).send(icsContent);
  } catch (err: any) {
    console.error("/api/interview/[requestId]/calendar.ics error:", err);
    return res.status(500).json({ error: err.message || "Unknown error occurred" });
  }
}

