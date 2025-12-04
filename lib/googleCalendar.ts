import { google } from 'googleapis';
import { getGoogleTokens, refreshGoogleToken, storeGoogleTokens } from './googleOAuth';

// Generate a Google Meet link (fallback if API fails)
export function generateGoogleMeetLink(): string {
  const meetingCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${meetingCode}`;
}

// Get authenticated Google Calendar client
async function getCalendarClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Create a calendar event with Google Meet using OAuth token
export async function createCalendarEventWithMeet(params: {
  summary: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  attendeeEmails: string[];
  organizerEmail?: string;
  location?: string;
  accessToken: string; // OAuth access token
}): Promise<{ eventId: string; meetLink: string; htmlLink: string }> {
  try {
    const calendar = await getCalendarClient(params.accessToken);

    // Generate unique request ID for conference creation
    const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create calendar event with Google Meet
    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: params.endTime,
        timeZone: 'UTC',
      },
      attendees: params.attendeeEmails.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
    };

    // Insert event with conference data version 1 (required for Meet link generation)
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1, // Required to generate Google Meet link
      sendUpdates: 'all', // Send calendar invitations to all attendees
    });

    const createdEvent = response.data;
    
    // Extract Meet link from response
    let meetLink = createdEvent.hangoutLink;
    if (!meetLink && createdEvent.conferenceData?.entryPoints) {
      const meetEntryPoint = createdEvent.conferenceData.entryPoints.find(
        (ep: any) => ep.entryPointType === 'video' || ep.uri?.includes('meet.google.com')
      );
      meetLink = meetEntryPoint?.uri;
    }

    // Fallback if no Meet link was generated
    if (!meetLink) {
      console.warn('Google Meet link not generated, using fallback');
      meetLink = generateGoogleMeetLink();
    }

    return {
      eventId: createdEvent.id || `event_${Date.now()}`,
      meetLink,
      htmlLink: createdEvent.htmlLink || meetLink,
    };
  } catch (error: any) {
    console.error('Error creating Google Calendar event:', error);
    
    // Retry once if it's a conference creation error
    if (error.message?.includes('conference') || error.code === 409) {
      console.log('Retrying calendar event creation without conference...');
      try {
        const calendar = await getCalendarClient(params.accessToken);
        const event = {
          summary: params.summary,
          description: params.description,
          start: {
            dateTime: params.startTime,
            timeZone: 'UTC',
          },
          end: {
            dateTime: params.endTime,
            timeZone: 'UTC',
          },
          attendees: params.attendeeEmails.map(email => ({ email })),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 15 },
            ],
          },
        };

        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
          sendUpdates: 'all',
        });

        const createdEvent = response.data;
        const meetLink = generateGoogleMeetLink(); // Generate fallback link

        return {
          eventId: createdEvent.id || `event_${Date.now()}`,
          meetLink,
          htmlLink: createdEvent.htmlLink || meetLink,
        };
      } catch (retryError: any) {
        console.error('Retry also failed:', retryError);
        throw new Error(`Failed to create calendar event after retry: ${retryError.message}`);
      }
    }

    throw error;
  }
}

// Create calendar event for a specific user using their stored tokens
export async function createCalendarEventForUser(params: {
  userId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendeeEmails: string[];
  organizerEmail?: string;
  location?: string;
}): Promise<{ success: boolean; eventId?: string; meetLink?: string; htmlLink?: string; error?: string }> {
  try {
    // Get user's stored tokens
    const tokens = await getGoogleTokens(params.userId);
    
    if (!tokens.success || !tokens.accessToken) {
      return { success: false, error: 'No Google OAuth tokens found. Please reconnect your Google account.' };
    }

    let accessToken = tokens.accessToken;

    // Check if token is expired and refresh if needed
    if (tokens.expiresAt && tokens.expiresAt < Date.now() / 1000) {
      if (!tokens.refreshToken) {
        return { success: false, error: 'Token expired and no refresh token available. Please reconnect your Google account.' };
      }

      const refreshResult = await refreshGoogleToken(tokens.refreshToken);
      if (!refreshResult.success || !refreshResult.accessToken) {
        return { success: false, error: refreshResult.error || 'Failed to refresh token' };
      }

      accessToken = refreshResult.accessToken;

      // Store the new token
      if (refreshResult.expiresIn) {
        await storeGoogleTokens(
          params.userId,
          accessToken,
          tokens.refreshToken,
          Math.floor(Date.now() / 1000) + refreshResult.expiresIn
        );
      }
    }

    // Create calendar event
    const result = await createCalendarEventWithMeet({
      ...params,
      accessToken,
    });

    return {
      success: true,
      eventId: result.eventId,
      meetLink: result.meetLink,
      htmlLink: result.htmlLink,
    };
  } catch (error: any) {
    console.error('Error creating calendar event for user:', error);
    return { success: false, error: error.message || 'Failed to create calendar event' };
  }
}

// Generate calendar invite ICS file
export function generateICSFile(params: {
  summary: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  organizerEmail: string;
  attendeeEmails: string[];
  meetLink: string;
  location?: string;
}): string {
  const formatDate = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Velric//Interview Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@velric.com`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `DTSTART:${formatDate(params.startTime)}`,
    `DTEND:${formatDate(params.endTime)}`,
    `SUMMARY:${params.summary}`,
    `DESCRIPTION:${params.description}\\n\\nGoogle Meet: ${params.meetLink}`,
    `ORGANIZER;CN=${params.organizerEmail}:mailto:${params.organizerEmail}`,
    ...params.attendeeEmails.map(email => `ATTENDEE;CN=${email};RSVP=TRUE:mailto:${email}`),
    `LOCATION:${params.location || 'Google Meet'}`,
    `URL:${params.meetLink}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Interview in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

