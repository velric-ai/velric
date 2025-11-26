import {
  AppError,
  AuthError,
  HttpError,
  TimeoutError,
  ServerError,
  ValidationError,
} from "../utils/surveyValidation";
import { supabase, USE_DUMMY } from "../lib/supabaseClient";
import { getLocalStorageItem } from "../utils/envSafe";

/**
 * =========================
 * TYPE DEFINITIONS
 * =========================
 */
export interface PlatformConnection {
  connected: boolean;
  username: string;
  userId: string | null;
  avatar: string;
  profile: any;
  error: string | null;
  loading: boolean;
  score?: number | null;
  rank?: number | null; // changed to number | null for consistency
}

export interface SurveyFormData {
  fullName: { value: string; error: string | null; touched: boolean };
  educationLevel: { value: string; error: string | null; touched: boolean };
  industry: { value: string; error: string | null; touched: boolean };
  interviewAvailability: {
    value: Array<{ day: string; startTime: string; endTime: string }>;
    timezone: string;
    error: string | null;
    touched: boolean;
  };
  missionFocus: {
    value: string[];
    error: string | null;
    touched: boolean;
    questionText: string;
    options: string[];
  };
  strengthAreas: { value: string[]; error: string | null; touched: boolean };
  learningPreference: { value: string; error: string | null; touched: boolean };
  portfolio: {
    file: File | null;
    filePreview: string | null;
    fileError: string | null;
    fileProgress: number;
    url: string;
    urlError: string | null;
    uploadStatus: "uploading" | "success" | "error" | null;
  };
  platformConnections: {
    github: PlatformConnection;
    codesignal: PlatformConnection;
    hackerrank: PlatformConnection;
  };
  experienceSummary: { value: string; error: string | null; touched: boolean };
  logisticsPreferences: {
    currentRegion: { value: string; error: string | null; touched: boolean };
    legalWorkRegions: { value: string[]; error: string | null; touched: boolean };
    sponsorshipConsideration: { value: string; error: string | null; touched: boolean };
    sponsorshipRegions: { value: string[]; error: string | null; touched: boolean };
    sponsorshipDependsText: { value: string; error: string | null; touched: boolean };
    relocationOpenness: { value: string; error: string | null; touched: boolean };
    relocationRegions: { value: string; error: string | null; touched: boolean };
    remoteWorkInternational: { value: string; error: string | null; touched: boolean };
    error: string | null;
    touched: boolean;
  };
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  submitError: string | null;
  completedAt: number | null;
  savedAt: number | null;
  isDraft: boolean;
  startedAt: number;
  timeSpentPerStep: { [key: number]: number };
  interactions: Array<{
    timestamp: number;
    step: number;
    action: string;
    data?: any;
    timeSpent?: number;
  }>;
}

export interface SurveySubmissionResponse {
  success: boolean;
  userId: string | null;
  message: string;
  profile: {
    onboarded: boolean;
    completedAt: string;
    surveyData: any;
  };
  redirectUrl: string;
  completedAt: number;
}

/**
 * =========================
 * SUPABASE SUBMISSION
 * =========================
 */

export async function submitSurveyData(
  formData: SurveyFormData
): Promise<SurveySubmissionResponse> {
  try {
    const userData = getLocalStorageItem("velric_user");
    const userId = userData ? JSON.parse(userData).id : "guest";

    // Validate minimal required data
    if (!formData.fullName.value || !formData.industry.value) {
      throw new ValidationError("Missing required fields before submission");
    }

    // Prepare payload for Supabase
    const payload = {
      user_id: userId,
      full_name: formData.fullName.value,
      education_level: formData.educationLevel.value,
      industry: formData.industry.value,
      mission_focus: formData.missionFocus.value,
      strength_areas: formData.strengthAreas.value,
      learning_preference: formData.learningPreference.value,
      portfolio: {
        file: formData.portfolio.uploadedFilename || null,
        url: formData.portfolio.uploadedUrl || formData.portfolio.url || null,
      },
      experience_summary: formData.experienceSummary.value,
      interview_availability: formData.interviewAvailability ? {
        timeSlots: formData.interviewAvailability.value,
        timezone: formData.interviewAvailability.timezone,
      } : null,
      platform_connections: formData.platformConnections,
      logistics_preferences: formData.logisticsPreferences ? {
        current_region: formData.logisticsPreferences.currentRegion?.value || null,
        legal_work_regions: formData.logisticsPreferences.legalWorkRegions?.value || [],
        sponsorship_consideration: formData.logisticsPreferences.sponsorshipConsideration?.value || null,
        sponsorship_regions: formData.logisticsPreferences.sponsorshipRegions?.value || [],
        sponsorship_depends_text: formData.logisticsPreferences.sponsorshipDependsText?.value || null,
        relocation_openness: formData.logisticsPreferences.relocationOpenness?.value || null,
        relocation_regions: formData.logisticsPreferences.relocationRegions?.value || null,
        remote_work_international: formData.logisticsPreferences.remoteWorkInternational?.value || null,
      } : null,
      metadata: {
        total_time_spent: Object.values(formData.timeSpentPerStep).reduce(
          (a, b) => a + b,
          0
        ),
        interactions: formData.interactions,
        started_at: formData.startedAt,
        completed_at: Date.now(),
      },
      created_at: new Date().toISOString(),
    };

    // Handle dummy mode or invalid API keys - use API endpoint instead
    if (USE_DUMMY) {
      console.warn("⚠️ Using dummy mode - survey data not persisted");
      // Return mock response for dummy mode
      return {
        success: true,
        userId,
        message: "Survey submitted successfully (demo mode)",
        profile: {
          onboarded: true,
          completedAt: new Date().toISOString(),
          surveyData: payload,
        },
        redirectUrl: "/user-dashboard",
        completedAt: Date.now(),
      };
    }

    // Try to insert into Supabase
    const { data, error } = await supabase
      .from("survey_responses")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      
      // If API key is invalid, fallback to API endpoint
      if (error.message?.includes("Invalid API key") || error.message?.includes("JWT")) {
        console.warn("⚠️ Invalid API key detected, falling back to API endpoint");
        return await submitViaAPIEndpoint(payload, userId);
      }
      
      throw new ServerError(error.message || "Failed to save survey data");
    }

    console.log("✅ Survey saved to Supabase:", data);

    return {
      success: true,
      userId,
      message: "Survey submitted successfully",
      profile: {
        onboarded: true,
        completedAt: new Date().toISOString(),
        surveyData: data,
      },
      redirectUrl: "/user-dashboard",
      completedAt: Date.now(),
    };
  } catch (error: any) {
    console.error("❌ submitSurveyData error:", error);

    if (error instanceof ValidationError) throw error;
    if (error instanceof AuthError) throw error;
    if (error instanceof ServerError) throw error;
    if (error instanceof HttpError) throw error;
    if (error instanceof TimeoutError) throw error;

    throw new AppError(
      error.message || "Failed to submit survey. Please try again."
    );
  }
}

// Fallback function to submit via API endpoint when direct Supabase fails
async function submitViaAPIEndpoint(
  payload: any,
  userId: string
): Promise<SurveySubmissionResponse> {
  try {
    // Transform payload to API format
    const apiPayload = {
      fullName: payload.full_name,
      educationLevel: payload.education_level,
      industry: payload.industry,
      missionFocus: payload.mission_focus,
      strengthAreas: payload.strength_areas,
      learningPreference: payload.learning_preference,
      portfolioFile: payload.portfolio?.file || null,
      portfolioUrl: payload.portfolio?.url || null,
      experienceSummary: payload.experience_summary,
      platformConnections: payload.platform_connections,
      metadata: payload.metadata,
    };

    const response = await fetch("/api/survey/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify(apiPayload),
    });

    const result = await response.json();

    if (!result.success) {
      throw new ServerError(result.message || "Failed to save survey data");
    }

    return {
      success: true,
      userId: result.userId || userId,
      message: result.message || "Survey submitted successfully",
      profile: result.profile || {
        onboarded: true,
        completedAt: new Date().toISOString(),
        surveyData: result.surveyData,
      },
      redirectUrl: result.redirectUrl || "/user-dashboard",
      completedAt: result.completedAt || Date.now(),
    };
  } catch (error: any) {
    throw new ServerError(
      error.message || "Failed to submit survey via API endpoint"
    );
  }
}

/* FILE UPLOAD (Supabase Storage) */

export async function uploadPortfolioFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}> {
  try {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize)
      throw new ValidationError("File too large (max 10MB)");
    if (!allowedTypes.includes(file.type))
      throw new ValidationError("Unsupported file type");

    const fileName = `${Date.now()}_${file.name}`;
    
    console.log("[uploadPortfolioFile] Starting upload:", {
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

    // Add timeout wrapper
    const uploadPromise = supabase.storage
      .from("portfolio_uploads")
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type,
      });

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout after 30 seconds")), 30000)
    );

    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

    if (error) {
      console.error("[uploadPortfolioFile] Supabase error:", error);
      throw new AppError("Upload failed: " + error.message);
    }

    console.log("[uploadPortfolioFile] Upload successful, fetching public URL");

    const { data: urlData } = supabase.storage
      .from("portfolio_uploads")
      .getPublicUrl(fileName);

    console.log("[uploadPortfolioFile] Public URL:", urlData.publicUrl);

    return {
      success: true,
      filename: file.name,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("[uploadPortfolioFile] Upload error:", error);
    throw new AppError(error.message || "Failed to upload file");
  }
}

/**
 * Parse resume text using OpenAI
 * This function expects the PDF to already be parsed into text on the client-side
 * 
 * @param surveyResponseId - The ID of the survey response record
 * @param pdfText - The extracted text from the PDF (parsed on client-side)
 * @returns Promise with resume_json structured data
 */
export async function parseResumeWithAI(
  surveyResponseId: string,
  pdfText: string
): Promise<{
  success: boolean;
  message: string;
  resume_json: any;
}> {
  try {
    if (!surveyResponseId) {
      throw new ValidationError("Survey response ID is required");
    }

    if (!pdfText || typeof pdfText !== "string") {
      throw new ValidationError("PDF text is required and must be a string");
    }

    console.log("[parseResumeWithAI] Sending parsed PDF text to server", {
      surveyResponseId,
      textLength: pdfText.length,
    });

    const response = await fetch("/api/survey/parseResume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        surveyResponseId,
        pdfText,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("[parseResumeWithAI] Error response:", result);
      throw new ServerError(
        result.error || result.message || "Failed to parse resume"
      );
    }

    console.log("[parseResumeWithAI] Resume parsed successfully", {
      resumeJson: result.resume_json,
    });

    return {
      success: true,
      message: result.message || "Resume parsed successfully",
      resume_json: result.resume_json,
    };
  } catch (error: any) {
    console.error("[parseResumeWithAI] Error:", error);

    if (error instanceof ValidationError) throw error;
    if (error instanceof ServerError) throw error;

    throw new AppError(
      error.message || "Failed to parse resume. Please try again."
    );
  }
}

/*
// Type Definitions
export interface SurveyFormData {
  fullName: {
    value: string;
    error: string | null;
    touched: boolean;
  };
  educationLevel: {
    value: string;
    error: string | null;
    touched: boolean;
  };
  industry: {
    value: string;
    error: string | null;
    touched: boolean;
  };
  missionFocus: {
    value: string[];
    error: string | null;
    touched: boolean;
    questionText: string;
    options: string[];
  };
  strengthAreas: {
    value: string[];
    error: string | null;
    touched: boolean;
  };
  learningPreference: {
    value: string;
    error: string | null;
    touched: boolean;
  };
  portfolio: {
    file: File | null;
    filePreview: string | null;
    fileError: string | null;
    fileProgress: number;
    url: string;
    urlError: string | null;
    uploadStatus: 'uploading' | 'success' | 'error' | null;
  };
  platformConnections: {
    github: PlatformConnection;
    codesignal: PlatformConnection;
    hackerrank: PlatformConnection;
  };
  // Step 7: Experience Summary
  experienceSummary: {
    value: string;
    error: string | null;
    touched: boolean;
  };
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  submitError: string | null;
  completedAt: number | null;
  savedAt: number | null;
  isDraft: boolean;
  startedAt: number;
  timeSpentPerStep: { [key: number]: number };
  interactions: Array<{
    timestamp: number;
    step: number;
    action: string;
    data?: any;
    timeSpent?: number;
  }>;
}

export interface PlatformConnection {
  connected: boolean;
  username: string;
  userId: string;
  avatar: string;
  profile: any;
  error: string | null;
  loading: boolean;
  score?: number | null;
  rank?: string | null;
}

export interface SurveySubmissionResponse {
  success: boolean;
  userId: string;
  message: string;
  profile: {
    onboarded: boolean;
    completedAt: string;
    surveyData: any;
  };
  redirectUrl: string;
  completedAt: number;
}

// Utility Functions
const getAuthToken = (): string => {
  try {
    const userData = localStorage.getItem("velric_user");
    if (!userData) {
      throw new AuthError("No authentication token found");
    }
    
    const user = JSON.parse(userData);
    return user.token || user.id || "demo_token"; // Fallback for demo
  } catch (error) {
    throw new AuthError("Invalid authentication data");
  }
};

const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<Response> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      // Don't retry on 4xx errors (except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          `HTTP ${response.status}: ${errorData.message || response.statusText}`,
          response.status,
          errorData
        );
      }

      lastError = new HttpError(`HTTP ${response.status}`, response.status);
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new TimeoutError('Request timed out. Please check your connection and try again.');
      }
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new AppError(`Failed after ${maxRetries} retries: ${lastError.message}`);
};

// API Functions
export async function submitSurveyData(formData: SurveyFormData): Promise<SurveySubmissionResponse> {
  try {
    // Input validation
    if (!formData || typeof formData !== 'object') {
      throw new ValidationError('Invalid form data structure');
    }

    // Prepare submission payload
    const submissionPayload: SurveySubmissionPayload = {
      fullName: formData.fullName.value,
      educationLevel: formData.educationLevel.value,
      industry: formData.industry.value,
      missionFocus: formData.missionFocus.value,
      strengthAreas: formData.strengthAreas.value,
      learningPreference: formData.learningPreference.value,
      portfolioFile: formData.portfolio.uploadedUrl ? {
        filename: formData.portfolio.uploadedFilename || 'resume',
        url: formData.portfolio.uploadedUrl
      } : null,
      portfolioUrl: formData.portfolio.url || null,
      experienceSummary: formData.experienceSummary.value || null,
      platformConnections: {
        github: formData.platformConnections.github.connected ? {
          connected: true,
          username: formData.platformConnections.github.username,
          profile: formData.platformConnections.github.profile
        } : { connected: false },
        codesignal: formData.platformConnections.codesignal.connected ? {
          connected: true,
          username: formData.platformConnections.codesignal.username,
          profile: formData.platformConnections.codesignal.profile
        } : { connected: false },
        hackerrank: formData.platformConnections.hackerrank.connected ? {
          connected: true,
          username: formData.platformConnections.hackerrank.username,
          profile: formData.platformConnections.hackerrank.profile
        } : { connected: false }
      },
      metadata: {
        totalTimeSpent: Object.values(formData.timeSpentPerStep).reduce((sum, time) => sum + time, 0),
        interactions: formData.interactions,
        startedAt: formData.startedAt,
        completedAt: Date.now()
      }
    };

    // Log submission attempt
    console.log('[submitSurvey] Portfolio data from form:', {
      uploadedUrl: formData.portfolio.uploadedUrl,
      uploadedFilename: formData.portfolio.uploadedFilename,
      url: formData.portfolio.url,
      file: formData.portfolio.file?.name,
    });
    
    console.log('[submitSurvey] Creating portfolioFile:', {
      hasUploadedUrl: !!formData.portfolio.uploadedUrl,
      portfolioFile: submissionPayload.portfolioFile,
    });
    
    console.log('[submitSurvey] Full submission payload (portfolio only):', {
      portfolioFile: submissionPayload.portfolioFile,
      portfolioUrl: submissionPayload.portfolioUrl,
    });
    
    console.log('Submitting survey data:', {
      timestamp: new Date().toISOString(),
      userId: getAuthToken(),
      dataSize: JSON.stringify(submissionPayload).length
    });

    const response = await fetchWithRetry('/api/survey/submit', {
      method: 'POST',
      body: JSON.stringify(submissionPayload)
    });

    // Parse and validate response
    const data = await response.json();

    if (!data.success) {
      throw new AppError(data.message || 'Survey submission failed', data.code);
    }

    // Validate response schema
    if (!data.userId || !data.redirectUrl) {
      throw new AppError('Invalid response schema from server');
    }

    return {
      ...data,
      completedAt: Date.now()
    };

  } catch (error) {
    // Log error with context
    console.error('Survey submission error:', {
      error: (error as Error).message,
      code: (error as any).code || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      formDataSummary: {
        step: formData.currentStep,
        hasName: !!formData.fullName.value,
        hasIndustry: !!formData.industry.value,
        strengthCount: formData.strengthAreas.value.length
      }
    });

    // Handle specific error types
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TimeoutError('Request timed out. Please check your connection and try again.');
    }
    
    if (error instanceof HttpError) {
      if (error.status === 401) {
        throw new AuthError('Session expired. Please sign in again.');
      }
      if (error.status === 400) {
        throw new ValidationError(error.message);
      }
      if (error.status >= 500) {
        throw new ServerError('Server error. Please try again later.');
      }
    }

    // Re-throw with user-friendly message
    throw new AppError(
      (error as Error).message || 'Failed to save survey. Please try again.',
      (error as any).code || 'SURVEY_SUBMISSION_FAILED'
    );
  }
}

export async function getSurveyStatus(): Promise<{
  success: boolean;
  userId: string;
  isCompleted: boolean;
  onboarded: boolean;
  lastModified: string | null;
  data: any;
}> {
  try {
    const response = await fetchWithRetry('/api/survey/status');
    const data = await response.json();

    if (!data.success) {
      throw new AppError(data.message || 'Failed to get survey status');
    }

    return data;
  } catch (error) {
    console.error('Survey status error:', error);
    
    if (error instanceof HttpError && error.status === 401) {
      throw new AuthError('Session expired. Please sign in again.');
    }
    
    throw new AppError('Failed to check survey status. Please try again.');
  }
}

export async function updateSurveyData(updates: Partial<SurveyFormData>): Promise<{
  success: boolean;
  message: string;
  updatedAt: string;
  data: any;
}> {
  try {
    if (!updates || typeof updates !== 'object') {
      throw new ValidationError('Invalid update data');
    }

    const response = await fetchWithRetry('/api/survey/update', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });

    const data = await response.json();

    if (!data.success) {
      throw new AppError(data.message || 'Failed to update survey');
    }

    return data;
  } catch (error) {
    console.error('Survey update error:', error);
    
    if (error instanceof HttpError && error.status === 401) {
      throw new AuthError('Session expired. Please sign in again.');
    }
    
    throw new AppError('Failed to update survey. Please try again.');
  }
}

// File Upload Function
export async function uploadPortfolioFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}> {
  return new Promise((resolve, reject) => {
    try {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        throw new ValidationError(
          `File too large. Maximum size is 10MB, but you uploaded ${(file.size / 1024 / 1024).toFixed(2)}MB`
        );
      }

      if (!allowedTypes.includes(file.type)) {
        throw new ValidationError(
          `File type not allowed. Supported types: PDF, PNG, JPG, DOC, DOCX`
        );
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', Date.now().toString());
      formData.append('originalName', file.name);

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      // Track progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress?.(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response);
            } else {
              reject(new AppError(response.message || 'Upload failed'));
            }
          } catch (e) {
            reject(new AppError('Invalid response from server'));
          }
        } else {
          reject(new HttpError(`Upload failed: HTTP ${xhr.status}`, xhr.status));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new AppError('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new AppError('Upload cancelled'));
      });

      // Send request
      xhr.open('POST', '/api/upload/portfolio');
      xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`);
      xhr.send(formData);

    } catch (error) {
      reject(error);
    }
  });

*/
