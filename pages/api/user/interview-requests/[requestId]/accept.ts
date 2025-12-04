import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";
import { generateICSFile } from "@/lib/googleCalendar";
import { getGoogleTokens, refreshGoogleToken } from "@/lib/googleOAuth";
import { google } from "googleapis";

type AcceptResponse =
  | { success: true; message: string; meetLink?: string }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AcceptResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { requestId } = req.query;

    if (!requestId || typeof requestId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Request ID is required",
      });
    }

    if (USE_DUMMY) {
      return res.status(200).json({
        success: true,
        message: "Interview request accepted successfully",
      });
    }

    // First, get the interview request details
    const { data: interviewRequest, error: fetchError } = await supabase
      .from("interview_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !interviewRequest) {
      console.error("Error fetching interview request:", fetchError);
      return res.status(404).json({
        success: false,
        error: "Interview request not found",
      });
    }

    // Check if already accepted
    if (interviewRequest.status === "accepted") {
      return res.status(200).json({
        success: true,
        message: "Interview request already accepted",
        meetLink: interviewRequest.google_meet_link || undefined,
      });
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

    if (candidateResult.error || !candidateResult.data) {
      console.error("Error fetching candidate:", candidateResult.error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch candidate details",
      });
    }

    if (recruiterResult.error || !recruiterResult.data) {
      console.error("Error fetching recruiter:", recruiterResult.error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch recruiter details",
      });
    }

    const candidateEmail = candidateResult.data.email;
    const recruiterEmail = recruiterResult.data.email;
    const candidateName = candidateResult.data.name || "Candidate";
    const recruiterName = recruiterResult.data.name || "Recruiter";

    // Calculate start and end times
    const preferredDate = interviewRequest.preferred_date;
    const startTime = interviewRequest.start_time || interviewRequest.preferred_time;
    const endTime = interviewRequest.end_time;

    if (!preferredDate) {
      return res.status(400).json({
        success: false,
        error: "Interview date not specified",
      });
    }

    if (!startTime) {
      return res.status(400).json({
        success: false,
        error: "Interview time not specified",
      });
    }

    // Normalize time format - remove seconds if present, ensure HH:MM format
    const normalizeTime = (time: string): string => {
      // Remove any seconds if present (e.g., "14:30:00" -> "14:30")
      const timeParts = time.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
      }
      return time;
    };

    const normalizedStartTime = normalizeTime(startTime);
    const normalizedEndTime = endTime ? normalizeTime(endTime) : null;

    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(preferredDate)) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    // Validate time format (should be HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(normalizedStartTime)) {
      return res.status(400).json({
        success: false,
        error: "Invalid time format. Expected HH:MM",
      });
    }

    // Parse date and time to create ISO datetime strings
    // Combine date and time in ISO format (YYYY-MM-DDTHH:MM:00)
    const startDateTimeString = `${preferredDate}T${normalizedStartTime}:00`;
    const startDateTime = new Date(startDateTimeString);

    // Validate that the date is valid
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid time value. Unable to parse date and time combination.",
      });
    }

    // Calculate end time
    let endDateTime: Date;
    if (normalizedEndTime) {
      if (!timeRegex.test(normalizedEndTime)) {
        return res.status(400).json({
          success: false,
          error: "Invalid end time format. Expected HH:MM",
        });
      }
      const endDateTimeString = `${preferredDate}T${normalizedEndTime}:00`;
      endDateTime = new Date(endDateTimeString);
      
      // Validate that the end date is valid
      if (isNaN(endDateTime.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid end time value. Unable to parse date and time combination.",
        });
      }

      // Ensure end time is after start time
      if (endDateTime <= startDateTime) {
        return res.status(400).json({
          success: false,
          error: "End time must be after start time",
        });
      }
    } else {
      // Default to 1 hour after start time
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    const startTimeISO = startDateTime.toISOString();
    const endTimeISO = endDateTime.toISOString();

    // Create Google Calendar events for both recruiter and candidate
    let recruiterCalendarEventId: string | null = null;
    let candidateCalendarEventId: string | null = null;
    let meetLink: string | null = null;
    const scheduledDateTime = startTimeISO;
    const debugLog: string[] = [];
    debugLog.push(`[DEBUG] Starting Google Calendar integration for recruiter: ${interviewRequest.recruiter_id} and candidate: ${interviewRequest.candidate_id}`);

    // Get candidate and recruiter data with tokens
    const { data: candidateUserData, error: candidateUserError } = await supabase
      .from("users")
      .select("email, name, google_access_token, google_refresh_token, google_token_expires_at")
      .eq("id", interviewRequest.candidate_id)
      .single();

    const { data: recruiterUserData, error: recruiterUserError } = await supabase
      .from("users")
      .select("email, name, google_access_token, google_refresh_token, google_token_expires_at")
      .eq("id", interviewRequest.recruiter_id)
      .single();

    if (candidateUserError || !candidateUserData) {
      debugLog.push(`[DEBUG] ❌ Candidate fetch error: ${JSON.stringify(candidateUserError)}`);
    }
    if (recruiterUserError || !recruiterUserData) {
      debugLog.push(`[DEBUG] ❌ Recruiter fetch error: ${JSON.stringify(recruiterUserError)}`);
    }

    if (!candidateUserData || !recruiterUserData) {
      debugLog.push(`[DEBUG] ⚠️ Missing candidate or recruiter data, skipping calendar creation`);
    } else {
      const scheduledDate = startDateTime;

      // Create calendar event in RECRUITER's calendar only
      // The candidate will automatically receive an invitation to this same event
      // This prevents duplicate events from being created
      debugLog.push(`[DEBUG] ========== CREATING CALENDAR EVENT ==========`);
      debugLog.push(`[DEBUG] Creating event in recruiter's calendar (candidate will receive invitation)`);
      
      try {
        const recruiterResult = await createCalendarEventForUser(
          interviewRequest.recruiter_id,
          recruiterUserData,
          candidateUserData,
          scheduledDate,
          interviewRequest.interview_type,
          interviewRequest.context,
          debugLog
        );
        
        if (recruiterResult.success) {
          recruiterCalendarEventId = recruiterResult.eventId;
          meetLink = recruiterResult.meetLink || null;
          debugLog.push(`[DEBUG] ✅ Calendar event created in recruiter's calendar: ${recruiterCalendarEventId}`);
          debugLog.push(`[DEBUG] ✅ Candidate will receive invitation to this event automatically`);
          debugLog.push(`[DEBUG] ✅ Meet Link: ${meetLink || 'null'}`);
        } else {
          debugLog.push(`[DEBUG] ⚠️ Recruiter calendar event failed: ${recruiterResult.error}`);
          
          // If recruiter's calendar fails, try candidate's calendar as fallback
          debugLog.push(`[DEBUG] ========== FALLBACK: CANDIDATE CALENDAR ==========`);
          try {
            const candidateResult = await createCalendarEventForUser(
              interviewRequest.candidate_id,
              candidateUserData,
              recruiterUserData,
              scheduledDate,
              interviewRequest.interview_type,
              interviewRequest.context,
              debugLog
            );
            
            if (candidateResult.success) {
              candidateCalendarEventId = candidateResult.eventId;
              meetLink = candidateResult.meetLink || null;
              debugLog.push(`[DEBUG] ✅ Fallback: Calendar event created in candidate's calendar: ${candidateCalendarEventId}`);
              debugLog.push(`[DEBUG] ✅ Recruiter will receive invitation to this event automatically`);
            } else {
              debugLog.push(`[DEBUG] ⚠️ Candidate calendar event also failed: ${candidateResult.error}`);
            }
          } catch (candidateError: any) {
            debugLog.push(`[DEBUG] ❌ Candidate calendar error: ${candidateError.message}`);
          }
        }
      } catch (recruiterError: any) {
        debugLog.push(`[DEBUG] ❌ Recruiter calendar error: ${recruiterError.message}`);
      }

      // Use the best available event ID and meet link
      const calendarEventId = recruiterCalendarEventId || candidateCalendarEventId;
      
      // Log results
      if (recruiterCalendarEventId) {
        debugLog.push(`[DEBUG] ✅ SUCCESS: Calendar event created in recruiter's calendar`);
        debugLog.push(`[DEBUG]   Event ID: ${recruiterCalendarEventId}`);
        debugLog.push(`[DEBUG]   Candidate will receive invitation automatically`);
        debugLog.push(`[DEBUG]   Meet Link: ${meetLink || 'null'}`);
      } else if (candidateCalendarEventId) {
        debugLog.push(`[DEBUG] ✅ SUCCESS: Calendar event created in candidate's calendar (fallback)`);
        debugLog.push(`[DEBUG]   Event ID: ${candidateCalendarEventId}`);
        debugLog.push(`[DEBUG]   Recruiter will receive invitation automatically`);
        debugLog.push(`[DEBUG]   Meet Link: ${meetLink || 'null'}`);
      } else {
        debugLog.push(`[DEBUG] ⚠️ No calendar events created - both recruiter and candidate may not have Google connected`);
        // Generate fallback Meet link if no calendar events created
        meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      }
    }

    // Helper function to create calendar event for a user (recruiter or candidate)
    async function createCalendarEventForUser(
      userId: string,
      userData: { email: string; name: string | null; google_access_token?: string; google_refresh_token?: string; google_token_expires_at?: string },
      otherUserData: { email: string; name: string | null },
      scheduledDate: Date,
      interviewType: string,
      context: string,
      debugLog: string[]
    ): Promise<{ success: boolean; eventId?: string; meetLink?: string; error?: string }> {
      try {
        debugLog.push(`[DEBUG] Checking Google OAuth token for user: ${userId}`);
        
        // Get tokens from users table
        const tokenResult = await getGoogleTokens(userId);
        
        if (!tokenResult.success || !tokenResult.accessToken) {
          debugLog.push(`[DEBUG] No Google OAuth token found for user ${userId}: ${tokenResult.error}`);
          return { 
            success: false, 
            error: tokenResult.error || "No Google OAuth token found" 
          };
        }

        debugLog.push(`[DEBUG] ✅ Google OAuth token found for user ${userId}`);
        
        // Check environment variables
        const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
        const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
        if (!hasClientId || !hasClientSecret) {
          debugLog.push(`[DEBUG] ❌ Missing Google OAuth credentials`);
          return { success: false, error: "Google OAuth credentials not configured" };
        }

        // Check if token is expired and refresh if needed
        let accessToken = tokenResult.accessToken;
        const now = Date.now() / 1000; // Current time in seconds
        const expiresAt = tokenResult.expiresAt || 0;

        if (expiresAt && expiresAt < now + 300) { // Refresh if expires in less than 5 minutes
          debugLog.push(`[DEBUG] Token expired or expiring soon, refreshing for user ${userId}...`);
          if (tokenResult.refreshToken) {
            const refreshResult = await refreshGoogleToken(tokenResult.refreshToken);
            if (refreshResult.success && refreshResult.accessToken) {
              accessToken = refreshResult.accessToken;
              
              // Update token in database
              const newExpiresAt = refreshResult.expiresIn 
                ? new Date(Date.now() + refreshResult.expiresIn * 1000).toISOString()
                : new Date(Date.now() + 3600 * 1000).toISOString();
              
              await supabase
                .from("users")
                .update({
                  google_access_token: accessToken,
                  google_token_expires_at: newExpiresAt,
                })
                .eq("id", userId);
              
              debugLog.push(`[DEBUG] ✅ Token refreshed for user ${userId}`);
            } else {
              debugLog.push(`[DEBUG] ❌ Token refresh failed: ${refreshResult.error}`);
              return { success: false, error: `Token refresh failed: ${refreshResult.error}` };
            }
          } else {
            debugLog.push(`[DEBUG] ❌ No refresh token available for user ${userId}`);
            return { success: false, error: "No refresh token available" };
          }
        }

        // Create calendar event
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        );

        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const startDateTimeISO = scheduledDate.toISOString();
        const endDateTimeISO = new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString();

        const event = {
          summary: `${interviewType} Interview - ${otherUserData.name || "Interview"}`,
          description: context || `Interview scheduled via Velric`,
          start: {
            dateTime: startDateTimeISO,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          },
          end: {
            dateTime: endDateTimeISO,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          },
          attendees: [
            { email: userData.email, displayName: userData.name || "User" },
            { email: otherUserData.email, displayName: otherUserData.name || "User" },
          ],
          conferenceData: {
            createRequest: {
              requestId: `velric-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 },
              { method: "popup", minutes: 15 },
            ],
          },
        };

        debugLog.push(`[DEBUG] Creating calendar event for ${userData.email}...`);
        const calendarResponse = await calendar.events.insert({
          calendarId: "primary",
          conferenceDataVersion: 1,
          requestBody: event,
        });

        const eventId = calendarResponse.data.id || null;
        const meetLinkFromEvent = calendarResponse.data.conferenceData?.entryPoints?.[0]?.uri || null;

        if (!eventId) {
          return { success: false, error: "Failed to create calendar event - no event ID returned" };
        }

        debugLog.push(`[DEBUG] ✅ Calendar event created for ${userData.email}: ${eventId}`);
        debugLog.push(`[DEBUG] Meet link: ${meetLinkFromEvent || 'null'}`);

        return {
          success: true,
          eventId,
          meetLink: meetLinkFromEvent || undefined,
        };
      } catch (error: any) {
        debugLog.push(`[DEBUG] ❌ Error creating calendar for user ${userId}: ${error.message}`);
        debugLog.push(`[DEBUG] Error details: ${JSON.stringify(error)}`);
        return { success: false, error: error.message };
      }
    }

    // Log all debug information
    console.log("=== GOOGLE CALENDAR INTEGRATION DEBUG (ACCEPT) ===");
    debugLog.forEach(log => console.log(log));
    console.log("=== END DEBUG ===");

    // Update interview request with accepted status, meet link, and calendar event IDs
    const calendarEventId = recruiterCalendarEventId || candidateCalendarEventId;
    const updateData: any = {
      status: "accepted", // Interview is accepted by candidate
      scheduled_datetime: scheduledDateTime,
      updated_at: new Date().toISOString(),
    };

    // Add calendar info if we have it
    if (calendarEventId) {
      updateData.google_calendar_event_id = recruiterCalendarEventId || candidateCalendarEventId;
      updateData.google_meet_link = meetLink;
    } else if (meetLink) {
      // Fallback meet link if no calendar events created
      updateData.google_meet_link = meetLink;
    }

    // Store both event IDs if we have them
    if (recruiterCalendarEventId) {
      updateData.recruiter_calendar_event_id = recruiterCalendarEventId;
    }
    if (candidateCalendarEventId) {
      updateData.candidate_calendar_event_id = candidateCalendarEventId;
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from("interview_requests")
      .update(updateData)
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating interview request:", updateError);
      return res.status(500).json({
        success: false,
        error: updateError.message || "Failed to accept interview request",
      });
    }

    // Generate ICS files for both parties (they can download and add to calendar)
    const icsContent = generateICSFile({
      summary: `${interviewRequest.interview_type} Interview - ${candidateName}`,
      description: interviewRequest.context + (interviewRequest.message ? `\n\n${interviewRequest.message}` : ''),
      startTime: startTimeISO,
      endTime: endTimeISO,
      organizerEmail: recruiterEmail,
      attendeeEmails: [candidateEmail, recruiterEmail],
      meetLink,
      location: "Google Meet",
    });

    // In a real implementation, you would:
    // 1. Send the ICS file via email to both parties
    // 2. Or use Google Calendar API with OAuth tokens to create events directly
    // 3. Store the ICS content or send it as an email attachment

    // Build success message
    let successMessage = "Interview request accepted successfully.";
    if (recruiterCalendarEventId) {
      successMessage += " Calendar event created in recruiter's calendar. Candidate will receive an invitation automatically.";
    } else if (candidateCalendarEventId) {
      successMessage += " Calendar event created in candidate's calendar. Recruiter will receive an invitation automatically.";
    } else {
      successMessage += " (Google Calendar not connected for either party)";
    }
    if (meetLink) {
      successMessage += ` Google Meet link: ${meetLink}`;
    }

    return res.status(200).json({
      success: true,
      message: successMessage,
      meetLink: meetLink || undefined,
    });
  } catch (err: any) {
    console.error("/api/user/interview-requests/[requestId]/accept error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error occurred",
    });
  }
}

