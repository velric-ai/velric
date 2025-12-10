// Get all completed/graded submissions for a user
export async function getCompletedSubmissionsByUser(userId: string) {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Treat status 'graded' as completed
    return mockStore.submissions.filter(
      (s) => s.user_id === userId && s.status === "graded"
    );
  }
  try {
    const { data, error } = await supabase
      .from("user_mission")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "graded");
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    // Fall back to mockStore if table doesn't exist
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("user_mission table not found, using mockStore fallback");
      return mockStore.submissions.filter(
        (s) => s.user_id === userId && s.status === "graded"
      );
    }
    throw error;
  }
}
// lib/supabaseClient.ts

import {
  MissionTemplate,
  UserMission,
  Project,
  ProjectDoc,
  UserMissionActionRequest,
} from "@/types";
import { MockDataStore, mockMissionTemplates } from "@/data/mockMissions";
import { getDevUserId } from "../utils/devUser";
import { AppError, ValidationError } from "../utils/surveyValidation";
import type { SurveyFormData, SurveySubmissionResponse } from "../types";

import { createClient } from "@supabase/supabase-js";

// Supabase configuration

// Check if we’re in the browser or on the server
const isBrowser = typeof window !== "undefined";

// Load from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseKey =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
console.log("Supabase environment",supabaseUrl, supabaseAnonKey, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Handling the error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!");
}

// Gracefully handle missing keys instead of crashing
if (!supabaseUrl || !supabaseAnonKey) {
  if (isBrowser) {
    console.error(
      "⚠️ Supabase environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  } else {
    console.warn(
      "⚠️ [Server] Missing Supabase env vars — likely misconfigured in Netlify or local build environment."
    );
  }
}

// Create client safely (placeholder fallback prevents validation error)
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: isBrowser, // only persist client-side
      detectSessionInUrl: isBrowser,
      autoRefreshToken: isBrowser,
    },
  }
);

export async function submitSurveyData(
  formData: SurveyFormData
): Promise<SurveySubmissionResponse> {
  try {
    const userId =
      process.env.NODE_ENV === "development"
        ? getDevUserId()
        : (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated");
    }

    if (!formData.fullName || !formData.industry) {
      throw new ValidationError("Missing required fields before submission");
    }

    const { data, error } = await supabase
      .from("survey_responses")
      .insert([
        {
          user_id: userId,
          is_dev: process.env.NODE_ENV === "development",
          ...formData,
        },
      ])
      .select();

    if (error) throw error;

    console.log(data);

    return {
      success: true,
      message: "Survey submitted successfully",
      data: data?.[0],
    };
  } catch (error: any) {
    console.error("Failed to submit survey:", error);
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
}


// Determine if we should use dummy data
const hasValidSupabaseConfig =
  supabaseAnonKey &&
  supabaseAnonKey !== "your_supabase_anon_key_here" &&
  supabaseUrl &&
  supabaseUrl.startsWith("https://");

// Toggle between dummy data and real Supabase
export const USE_DUMMY = process.env.USE_DUMMY_DATA === "true";

if (USE_DUMMY) {
  console.warn("🟡 Using dummy data mode. To enable Supabase:");
  console.warn("   1. Set up Supabase project at https://supabase.com");
  console.warn(
    "   2. Update SUPABASE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local"
  );
  console.warn("   3. Set USE_DUMMY_DATA=false");
  console.warn("   4. See SUPABASE_SETUP_GUIDE.md for detailed instructions");
} else {
  console.log("✅ Connected to Supabase database.");
  console.log(`📊 Database URL: ${supabaseUrl}`);
  console.log(
    "🔄 Missions will be stored persistently and shared across developers"
  );
}

// Make mockStore persistent across hot reloads (like dummyMissionStore)
const globalForMockStore = global as typeof globalThis & {
  mockStore: ReturnType<typeof MockDataStore.getInstance>;
};

const mockStore = globalForMockStore.mockStore || MockDataStore.getInstance();

if (process.env.NODE_ENV !== "production") {
  globalForMockStore.mockStore = mockStore;
}

// Test Supabase connectivity
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  if (USE_DUMMY) {
    return {
      connected: false,
      error: "Using dummy mode - Supabase not configured",
    };
  }

  try {
    const { data, error } = await supabase
      .from("missions")
      .select("count")
      .limit(1);
    if (error) throw error;
    return { connected: true };
  } catch (error) {
    return { connected: false, error: String(error) };
  }
}

// Initialize database schema if needed (for first-time setup)
export async function initializeDatabase(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (USE_DUMMY) {
    return { success: false, error: "Cannot initialize - using dummy mode" };
  }

  try {
    // Test if tables exist by trying to select from missions table
    const { error } = await supabase.from("missions").select("id").limit(1);

    if (error && error.message.includes("does not exist")) {
      // Tables don't exist - they need to be created via Supabase dashboard or migration
      return {
        success: false,
        error:
          "Database tables do not exist. Please run the SQL migration in migrations/create_projects_schema.sql via your Supabase dashboard.",
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Mission Templates
export async function getMissions(status?: string): Promise<MissionTemplate[]> {
  if (USE_DUMMY) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (status) {
      // Filter by status if provided (for user missions)
      const userMissions = mockStore.userMissions.filter(
        (um) => um.status === status
      );
      const missionIds = userMissions.map((um) => um.mission_id);
      return mockStore.missionTemplates.filter((mt) =>
        missionIds.includes(mt.id)
      );
    }

    return mockStore.missionTemplates;
  }

  // Real Supabase implementation
  let query = supabase.from("mission_templates").select("*");
  if (status) {
    // Join with user_mission table to filter by status
    query = query.eq("user_mission.status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getMissionById(
  id: string
): Promise<MissionTemplate | null> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockStore.missionTemplates.find((mt) => mt.id === id) || null;
  }

  const { data, error } = await supabase
    .from("mission_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// User Missions
export async function createUserMission(
  userId: string,
  missionId: string,
  status: UserMission["status"] = "suggested"
): Promise<UserMission> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newUserMission: UserMission = {
      id: `um-${Date.now()}`,
      user_id: userId,
      mission_id: missionId,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(status === "in_progress" && { started_at: new Date().toISOString() }),
      ...(status === "completed" && { completed_at: new Date().toISOString() }),
    };

    mockStore.userMissions.push(newUserMission);
    return newUserMission;
  }

  const { data, error } = await supabase
    .from("user_mission")
    .insert({
      user_id: userId,
      mission_id: missionId,
      status,
      ...(status === "in_progress" && { started_at: new Date().toISOString() }),
      ...(status === "completed" && { completed_at: new Date().toISOString() }),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserMissionStatus(
  userId: string,
  missionId: string,
  action: "star" | "start" | "submit" | "complete"
): Promise<UserMission> {
  const statusMap = {
    star: "starred" as const,
    start: "in_progress" as const,
    submit: "submitted" as const,
    complete: "completed" as const,
  };

  const newStatus = statusMap[action];

  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let userMission = mockStore.userMissions.find(
      (um) => um.user_id === userId && um.mission_id === missionId
    );

    if (!userMission) {
      // Create new user mission if it doesn't exist
      userMission = await createUserMission(userId, missionId, newStatus);
    } else {
      // Update existing user mission
      userMission.status = newStatus;
      userMission.updated_at = new Date().toISOString();

      if (action === "start") {
        userMission.started_at = new Date().toISOString();
      } else if (action === "submit") {
        userMission.submitted_at = new Date().toISOString();
      } else if (action === "complete") {
        userMission.completed_at = new Date().toISOString();
      }
    }

    return userMission;
  }

  // Check if user mission exists
  const { data: existing } = await supabase
    .from("user_mission")
    .select("*")
    .eq("user_id", userId)
    .eq("mission_id", missionId)
    .single();

  if (!existing) {
    // Create new user mission
    return await createUserMission(userId, missionId, newStatus);
  }

  // Update existing user mission
  const updateData: any = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (action === "start") {
    updateData.started_at = new Date().toISOString();
  } else if (action === "submit") {
    updateData.submitted_at = new Date().toISOString();
  } else if (action === "complete") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("user_mission")
    .update(updateData)
    .eq("user_id", userId)
    .eq("mission_id", missionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Projects
export async function insertProjectWithRelations(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
  docs?: Omit<ProjectDoc, "id" | "project_id" | "created_at" | "updated_at">[],
  industryTagIds?: string[],
  targetRoleIds?: string[]
): Promise<Project> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockStore.projects.push(newProject);

    // Add project docs if provided
    if (docs) {
      docs.forEach((doc, index) => {
        const newDoc: ProjectDoc = {
          ...doc,
          id: `pd-${Date.now()}-${index}`,
          project_id: newProject.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockStore.projectDocs.push(newDoc);
      });
    }

    return newProject;
  }

  // Real Supabase implementation would use transactions
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (projectError) throw projectError;

  // Insert related data...
  // (Implementation would continue with docs, tags, roles)

  return projectData;
}

// Add new missions to the store (for AI generation)
export async function addGeneratedMissions(
  missions: MissionTemplate[]
): Promise<void> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    mockStore.missionTemplates.push(...missions);
    return;
  }

  const { error } = await supabase.from("mission_templates").insert(missions);

  if (error) throw error;
}

// Get personalized missions for a user
export async function getPersonalizedMissions(
  userId: string
): Promise<MissionTemplate[]> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockStore.missionTemplates;
  }

  // Get user survey data for personalization
  const { data: surveyData } = await supabase
    .from("user_surveys")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get existing user missions to filter out already assigned ones
  const { data: existingMissions } = await supabase
    .from("user_mission")
    .select("mission_id")
    .eq("user_id", userId);

  const existingMissionIds =
    existingMissions?.map((um: any) => um.mission_id) || [];

  // Query for missions that match user preferences
  let query = supabase
    .from("mission_templates")
    .select("*")
    .not("id", "in", `(${existingMissionIds.join(",")})`)
    .limit(20);

  if (surveyData?.difficulty_level) {
    query = query.eq("difficulty", surveyData.difficulty_level);
  }

  const { data: missions, error } = await query;
  if (error) throw error;

  return missions || [];
}

// Get company projects for mission generation
export async function getCompanyProjects(filters?: {
  industry?: string;
  difficulty?: string;
  projectType?: string;
  limit?: number;
}): Promise<any[]> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Return mock company projects data
    return [
      {
        id: "1",
        company_name: "Netflix",
        project_title: "Content Recommendation Engine",
        project_description:
          "Build a machine learning system that analyzes user viewing history and preferences to recommend personalized content",
        technologies_used: [
          "Python",
          "TensorFlow",
          "Redis",
          "FastAPI",
          "PostgreSQL",
        ],
        industry: "Media",
        difficulty_level: "Advanced",
        project_type: "Data Science",
        estimated_time: "6-8 hours",
        learning_objectives: [
          "Machine Learning algorithms",
          "Collaborative filtering",
          "Content-based filtering",
          "Real-time recommendations",
        ],
        business_context:
          "Netflix uses sophisticated recommendation algorithms to keep users engaged and reduce churn",
      },
      {
        id: "2",
        company_name: "Stripe",
        project_title: "Payment Processing System",
        project_description:
          "Create a secure payment processing system with fraud detection and multi-currency support",
        technologies_used: [
          "Node.js",
          "Express",
          "PostgreSQL",
          "Redis",
          "Docker",
        ],
        industry: "Finance",
        difficulty_level: "Advanced",
        project_type: "Backend",
        estimated_time: "5-7 hours",
        learning_objectives: [
          "Payment processing",
          "Security best practices",
          "Fraud detection",
          "API design",
        ],
        business_context:
          "Stripe processes billions of dollars in transactions and needs robust systems",
      },
    ];
  }

  let query = supabase
    .from("company_projects")
    .select("*")
    .eq("is_active", true);

  if (filters?.industry) {
    query = query.eq("industry", filters.industry);
  }
  if (filters?.difficulty) {
    query = query.eq("difficulty_level", filters.difficulty);
  }
  if (filters?.projectType) {
    query = query.eq("project_type", filters.projectType);
  }

  query = query.limit(filters?.limit || 10);

  const { data, error } = await query;
  if (error) throw error;

  return data || [];
}

// Save user survey data
export async function saveUserSurvey(
  userId: string,
  surveyData: {
    experienceLevel?: string;
    programmingLanguages?: string[];
    interests?: string[];
    careerGoals?: string[];
    industryPreferences?: string[];
    availabilityHoursPerWeek?: number;
    preferredProjectTypes?: string[];
    resume_json?: string;
  }
): Promise<void> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return;
  }

  const { error } = await supabase.from("user_surveys").upsert({
    user_id: userId,
    experience_level: surveyData.experienceLevel,
    programming_languages: surveyData.programmingLanguages,
    interests: surveyData.interests,
    career_goals: surveyData.careerGoals,
    industry_preferences: surveyData.industryPreferences,
    availability_hours_per_week: surveyData.availabilityHoursPerWeek,
    preferred_project_types: surveyData.preferredProjectTypes,
    resume_text: surveyData.resume_json,
    completed_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// Get user survey data
export async function getUserSurvey(userId: string): Promise<any> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      experience_level: "intermediate",
      programming_languages: ["JavaScript", "Python", "React"],
      interests: ["Full-Stack Development", "AI/ML", "Web Development"],
      career_goals: ["Senior Software Engineer"],
      industry_preferences: ["Technology", "E-commerce"],
      availability_hours_per_week: 10,
      preferred_project_types: ["Full-Stack", "Backend"],
      resume_text: "Sample resume text...",
    };
  }

  const { data, error } = await supabase
    .from("user_surveys")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
  return data;
}

// Get user's mission status
export async function getUserMissionStatus(
  userId: string,
  missionId: string
): Promise<any> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if mission exists in mock data
    const userMission = mockStore.userMissions.find(
      (um) => um.user_id === userId && um.mission_id === missionId
    );

    return userMission || null;
  }

  // Skip DB query for non-numeric mission IDs (generated missions)
  if (!/^\d+$/.test(missionId)) {
    // Check mockStore for generated missions
    const userMission = mockStore.userMissions.find(
      (um) => um.user_id === userId && um.mission_id === missionId
    );
    return userMission || null;
  }

  try {
    const { data, error } = await supabase
      .from("user_mission")
      .select("*")
      .eq("user_id", userId)
      .eq("mission_id", missionId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data;
  } catch (error: any) {
    // Gracefully handle missing table
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("User missions table not found, checking mockStore");
      const userMission = mockStore.userMissions.find(
        (um) => um.user_id === userId && um.mission_id === missionId
      );
      return userMission || null;
    }
    throw error;
  }
}

// Get submission by ID
export async function getSubmissionById(submissionId: string): Promise<any> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Return mock submission data
    return {
      id: submissionId,
      user_id: "demo-user-123",
      mission_id: "1",
      submission_text: "This is a mock submission for testing purposes.",
      status: "submitted",
      created_at: new Date().toISOString(),
    };
  }

  try {
    // Convert submissionId to number since id is bigint in the database
    const idAsNumber = parseInt(submissionId, 10);
    if (isNaN(idAsNumber)) {
      console.error(`[getSubmissionById] Invalid ID format: ${submissionId}`);
      return null;
    }

    const { data, error } = await supabase
      .from("user_mission")
      .select("*")
      .eq("id", idAsNumber)
      .single();

    if (error) {
      // Check for RLS policy violation
      if (error.code === "42501" || error.message?.includes("row-level security")) {
        console.error(`[getSubmissionById] RLS policy violation for ID ${submissionId}:`, error.message);
        // Try to get more info about the error
        console.error(`[getSubmissionById] Error details:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw new Error("Access denied: Row-level security policy violation");
      }
      // Check for not found
      if (error.code === "PGRST116") {
        console.log(`[getSubmissionById] Record not found for ID: ${submissionId}`);
        return null;
      }
      throw error;
    }

    // If DB returns null, also check mockStore
    if (!data) {
      console.log(
        `[MockStore] DB returned null for ${submissionId}, checking mockStore...`
      );
      console.log(
        `[MockStore] Total submissions in store: ${mockStore.submissions.length}`
      );
      console.log(
        `[MockStore] Available IDs:`,
        mockStore.submissions.map((s) => s.id)
      );
      const mockSubmission = mockStore.submissions.find(
        (s) => s.id === submissionId
      );
      if (mockSubmission) {
        console.log(
          `[MockStore] Found submission ${submissionId} in mockStore`
        );
        return mockSubmission;
      } else {
        console.warn(
          `[MockStore] Submission ${submissionId} NOT found in mockStore`
        );
      }
    }

    return data;
  } catch (error: any) {
    // Fall back to mockStore if table doesn't exist
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("Submissions table not found, using mockStore fallback");
      return mockStore.submissions.find((s) => s.id === submissionId) || null;
    }
    throw error;
  }
}

// Create a new submission
export async function createSubmission(submissionData: {
  userId: string;
  missionId: string;
  submissionText: string;
  tabSwitchCount?: number;
  code?: string;
  language?: string;
}): Promise<any> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newSubmission = {
      id: `submission-${Date.now()}`,
      user_id: submissionData.userId,
      mission_id: submissionData.missionId,
      submission_text: submissionData.submissionText,
      status: "submitted",
      tab_switch_count: submissionData.tabSwitchCount || 0,
      code_input: submissionData.code || null,
      code_language: submissionData.language || null,
      created_at: new Date().toISOString(),
    } as any;

    mockStore.submissions.push(newSubmission);
    return { success: true, submission: newSubmission };
  }

  try {
    const { data, error } = await supabase
      .from("user_mission")
      .insert({
        user_id: submissionData.userId,
        mission_id: parseInt(submissionData.missionId) || 0,
        status: "submitted",
        submission_text: submissionData.submissionText,
        tab_switch_count: submissionData.tabSwitchCount || 0,
        code_input: submissionData.code || null,
        code_language: submissionData.language || null,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, submission: data };
  } catch (error: any) {
    // Fall back to mockStore if table doesn't exist
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("user_mission table not found, using mockStore fallback");
      const newSubmission = {
        id: `submission-${Date.now()}`,
        user_id: submissionData.userId,
        mission_id: submissionData.missionId,
        submission_text: submissionData.submissionText,
        status: "submitted",
        tab_switch_count: submissionData.tabSwitchCount || 0,
        created_at: new Date().toISOString(),
      } as any;
      console.log(
        `[MockStore] Adding submission ${newSubmission.id} to mockStore...`
      );
      console.log(
        `[MockStore] Current submissions in store: ${mockStore.submissions.length}`
      );
      console.log(
        `[MockStore] Available IDs:`,
        mockStore.submissions.map((s) => s.id)
      );
      mockStore.submissions.push(newSubmission);
      console.log(
        `[MockStore] Added submission ${newSubmission.id}, total count: ${mockStore.submissions.length}`
      );
      console.log(
        `[MockStore] All submission IDs:`,
        mockStore.submissions.map((s) => s.id)
      );
      return { success: true, submission: newSubmission };
    }
    throw error;
  }
}

// Update an existing submission with grading/velric score
export async function updateSubmission(
  submissionId: string,
  updates: Partial<{
    feedback: string | null;
    grades: Record<string, number> | null;
    summary: string | null;
    overall_score: number | null;
    letter_grade: string | null;
    rubric: Record<string, string> | null;
    positiveTemplates: string[] | null;
    improvementTemplates: string[] | null;
    velricScore: number | null;
    status: string;
  }>
): Promise<any> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const idx = mockStore.submissions.findIndex((s) => s.id === submissionId);
    if (idx >= 0) {
      mockStore.submissions[idx] = {
        ...mockStore.submissions[idx],
        ...updates,
      } as any;
      return mockStore.submissions[idx];
    }
    return null;
  }
  try {
    const userMissionUpdate: any = {};
    
    // Build update object - only include defined fields
    if (updates.status !== undefined) userMissionUpdate.status = updates.status;
    if (updates.overall_score !== undefined) userMissionUpdate.grade = updates.overall_score;
    if (updates.velricScore !== undefined) userMissionUpdate.velric_score = updates.velricScore;
    
    // Handle feedback - try both field names (feedback and feedback_text)
    if (updates.feedback !== undefined && updates.feedback !== null) {
      userMissionUpdate.feedback_text = updates.feedback;
    } else if (updates.feedback === null) {
      userMissionUpdate.feedback_text = null;
    }
    
    if (updates.summary !== undefined) userMissionUpdate.summary = updates.summary;
    if (updates.letter_grade !== undefined) userMissionUpdate.letter_grade = updates.letter_grade;
    if (updates.grades !== undefined) userMissionUpdate.grades = updates.grades;
    if (updates.rubric !== undefined) userMissionUpdate.rubric = updates.rubric;
    if (updates.positiveTemplates !== undefined) userMissionUpdate.positive_templates = updates.positiveTemplates;
    if (updates.improvementTemplates !== undefined) userMissionUpdate.improvement_templates = updates.improvementTemplates;
    if (updates.status === "graded" || updates.status === "completed") {
      userMissionUpdate.completed_at = new Date().toISOString();
    }

    console.log(`[updateSubmission] Updating submission ${submissionId} with:`, {
      hasStatus: updates.status !== undefined,
      hasGrade: updates.overall_score !== undefined,
      hasVelricScore: updates.velricScore !== undefined,
      hasFeedback: updates.feedback !== undefined && updates.feedback !== null ? "yes (length: " + updates.feedback.length + ")" : "no",
      hasSummary: updates.summary !== undefined,
      hasLetterGrade: updates.letter_grade !== undefined,
      hasGrades: updates.grades !== undefined,
      hasRubric: updates.rubric !== undefined,
      hasPositiveTemplates: updates.positiveTemplates !== undefined,
      hasImprovementTemplates: updates.improvementTemplates !== undefined,
    });

    const { data, error } = await supabase
      .from("user_mission")
      .update(userMissionUpdate)
      .eq("id", submissionId)
      .select()
      .single();
    
    if (error) {
      console.error(`[updateSubmission] Supabase error for submission ${submissionId}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        updatePayload: userMissionUpdate,
      });
      throw error;
    }
    
    console.log(`[updateSubmission] Successfully updated submission ${submissionId}`);
    return data;
  } catch (error: any) {
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("user_mission table not found, using mockStore fallback");
      const idx = mockStore.submissions.findIndex((s) => s.id === submissionId);
      if (idx >= 0) {
        mockStore.submissions[idx] = {
          ...mockStore.submissions[idx],
          ...updates,
        } as any;
        return mockStore.submissions[idx];
      }
      return null;
    }
    throw error;
  }
}

// ==========================================
// NEW MISSION SYSTEM FUNCTIONS
// ==========================================

import { StaticMission } from "@/data/staticMissions";

// Database types for missions
export interface DatabaseMission {
  id: string;
  title: string;
  description: string;
  field: string;
  difficulty: string;
  time_estimate: string;
  category: string;
  company?: string;
  context?: string;
  is_ai_generated: boolean;
  generated_by: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MissionWithDetails extends DatabaseMission {
  skills: Array<{ id: string; name: string; category?: string }>;
  industries: Array<{ id: string; name: string; description?: string }>;
  tasks: Array<{
    id: string;
    task_description: string;
    task_order: number;
    is_required: boolean;
  }>;
  objectives: Array<{
    id: string;
    objective_description: string;
    objective_order: number;
  }>;
  resources: Array<{
    id: string;
    resource_description: string;
    resource_type?: string;
    resource_order: number;
  }>;
  evaluation_metrics: Array<{
    id: string;
    metric_description: string;
    metric_weight: number;
    metric_order: number;
  }>;
}

// Store AI-generated mission in Supabase
// Internal helper to insert a mission and all its detail tables
async function insertMissionWithDetails(
  missionData: Omit<StaticMission, "id" | "status">,
  options: { aiGenerated: boolean; generatedBy: string; userId?: string }
): Promise<string> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newId = `mission-${Date.now()}`;
    console.log("Would store mission in database:", {
      id: newId,
      userId: options.userId,
      ...missionData,
    });
    return newId;
  }

  try {
    // Insert the main mission record (resilient to missing columns)
    let mission: any = null;
    let missionError: any = null;

    // Attempt 1: full insert with all fields including user_id
    console.log("[Mission Storage] Attempting to store mission:", {
      title: missionData.title,
      userId: options.userId,
      hasDifficulty: !!missionData.difficulty,
      difficulty: missionData.difficulty,
      hasTimeEstimate: !!missionData.timeEstimate,
      timeEstimate: missionData.timeEstimate,
      hasCompany: !!missionData.company,
      company: missionData.company,
      hasContext: !!missionData.context,
      contextLength: missionData.context?.length || 0,
    });

    {
      const res = await supabase
        .from("missions")
        .insert({
          user_id: options.userId || null,
          title: missionData.title,
          description: missionData.description,
          field: missionData.field,
          difficulty: missionData.difficulty,
          time_estimate: missionData.timeEstimate,
          category: missionData.category,
          company: missionData.company,
          context: missionData.context,
          type: missionData.type || null,
          language: missionData.language || null,
          is_ai_generated: options.aiGenerated,
          generated_by: options.generatedBy,
          status: "active",
        })
        .select("id")
        .single();
      mission = res.data;
      missionError = res.error;

      if (!missionError) {
        console.log(
          "[Mission Storage] ✅ Attempt 1 succeeded - stored with all fields including user_id"
        );
      } else {
        console.warn(
          "[Mission Storage] ❌ Attempt 1 failed:",
          missionError.message
        );
      }
    }

    // Attempt 2: retry without optional fields if column missing
    if (
      missionError &&
      (missionError.code === "PGRST204" || missionError.code === "42703")
    ) {
      console.warn(
        "[Mission Storage] Attempt 2: dropping optional fields (context, category, company)"
      );
      const res = await supabase
        .from("missions")
        .insert({
          user_id: options.userId || null,
          title: missionData.title,
          description: missionData.description,
          field: missionData.field,
          difficulty: missionData.difficulty,
          time_estimate: missionData.timeEstimate,
          is_ai_generated: options.aiGenerated,
          generated_by: options.generatedBy,
        })
        .select("id")
        .single();
      mission = res.data;
      missionError = res.error;

      if (!missionError) {
        console.log(
          "[Mission Storage] ✅ Attempt 2 succeeded - stored without context/category/company"
        );
      } else {
        console.warn(
          "[Mission Storage] ❌ Attempt 2 failed:",
          missionError.message
        );
      }
    }

    // Attempt 3: minimal required fields only
    if (
      missionError &&
      (missionError.code === "PGRST204" || missionError.code === "42703")
    ) {
      console.warn("Mission insert attempt 3: minimal fields only");
      const res = await supabase
        .from("missions")
        .insert({
          user_id: options.userId || null,
          title: missionData.title,
          description: missionData.description,
          field: missionData.field,
          difficulty: missionData.difficulty,
        })
        .select("id")
        .single();
      mission = res.data;
      missionError = res.error;

      if (!missionError) {
        console.log(
          "[Mission Storage] ⚠️ Attempt 3 succeeded - stored with minimal fields only (no difficulty/time/company)"
        );
      } else {
        console.warn(
          "[Mission Storage] ❌ Attempt 3 failed:",
          missionError.message
        );
      }
    }

    // Attempt 4: absolute minimum with field (NOT NULL constraint)
    if (
      missionError &&
      (missionError.code === "PGRST204" ||
        missionError.code === "42703" ||
        missionError.code === "23502")
    ) {
      console.warn(
        "Mission insert attempt 4: title, description, and field only"
      );
      const res = await supabase
        .from("missions")
        .insert({
          user_id: options.userId || null,
          title: missionData.title,
          description: missionData.description,
          field: missionData.field || "Technology",
        })
        .select("id")
        .single();
      mission = res.data;
      missionError = res.error;

      if (!missionError) {
        console.log(
          "[Mission Storage] ⚠️⚠️ Attempt 4 succeeded - stored with ONLY title/description/field"
        );
      } else {
        console.warn(
          "[Mission Storage] ❌ Attempt 4 failed:",
          missionError.message
        );
      }
    }

    if (missionError) throw missionError;

    const missionId = mission.id;
    console.log(
      `[Mission Storage] Successfully inserted mission ${missionId} into missions table for user ${options.userId}`
    );

    // Store skills (with error handling)
    if (missionData.skills && missionData.skills.length > 0) {
      try {
        for (const skill of missionData.skills) {
          // Insert or get skill
          const { data: skillData, error: skillError } = await supabase
            .from("skills")
            .upsert({ name: skill, category: "General" })
            .select("id")
            .single();

          if (!skillError && skillData) {
            // Link skill to mission
            await supabase
              .from("mission_skills")
              .insert({ mission_id: missionId, skill_id: skillData.id });
          }
        }
        console.log(
          `[Mission Storage] Stored ${missionData.skills.length} skills for mission ${missionId}`
        );
      } catch (skillError: any) {
        console.warn(
          `[Mission Storage] Failed to store skills (table may not exist):`,
          skillError.message
        );
      }
    }

    // Store industries (with error handling)
    if (missionData.industries && missionData.industries.length > 0) {
      try {
        for (const industry of missionData.industries) {
          // Insert or get industry
          const { data: industryData, error: industryError } = await supabase
            .from("industries")
            .upsert({ name: industry })
            .select("id")
            .single();

          if (!industryError && industryData) {
            // Link industry to mission
            await supabase
              .from("mission_industries")
              .insert({ mission_id: missionId, industry_id: industryData.id });
          }
        }
        console.log(
          `[Mission Storage] Stored ${missionData.industries.length} industries for mission ${missionId}`
        );
      } catch (industryError: any) {
        console.warn(
          `[Mission Storage] Failed to store industries (table may not exist):`,
          industryError.message
        );
      }
    }

    // Store tasks (with error handling)
    if (missionData.tasks && missionData.tasks.length > 0) {
      try {
        const taskInserts = missionData.tasks.map((task, index) => {
          // Ensure task is a string - if it's an object, extract the task property
          let taskStr = task;
          if (typeof task === "object" && (task as any).task) {
            taskStr = (task as any).task;
          }
          return {
            mission_id: missionId,
            task_description: String(taskStr),
            task_order: index + 1,
            is_required: true,
          };
        });

        const { error: taskError } = await supabase
          .from("mission_tasks")
          .insert(taskInserts);
        if (taskError) throw taskError;
        console.log(
          `[Mission Storage] Stored ${missionData.tasks.length} tasks for mission ${missionId}`
        );
      } catch (taskError: any) {
        console.warn(
          `[Mission Storage] Failed to store tasks (table may not exist):`,
          taskError.message
        );
      }
    }

    // Store objectives (with error handling)
    if (missionData.objectives && missionData.objectives.length > 0) {
      try {
        const objectiveInserts = missionData.objectives.map(
          (objective, index) => ({
            mission_id: missionId,
            objective_description: objective,
            objective_order: index + 1,
          })
        );

        const { error: objectiveError } = await supabase
          .from("mission_objectives")
          .insert(objectiveInserts);
        if (objectiveError) throw objectiveError;
        console.log(
          `[Mission Storage] Stored ${missionData.objectives.length} objectives for mission ${missionId}`
        );
      } catch (objectiveError: any) {
        console.warn(
          `[Mission Storage] Failed to store objectives (table may not exist):`,
          objectiveError.message
        );
      }
    }

    // Store resources (with error handling)
    if (missionData.resources && missionData.resources.length > 0) {
      try {
        const resourceInserts = missionData.resources.map(
          (resource, index) => ({
            mission_id: missionId,
            resource_description: resource,
            resource_order: index + 1,
          })
        );

        const { error: resourceError } = await supabase
          .from("mission_resources")
          .insert(resourceInserts);
        if (resourceError) throw resourceError;
        console.log(
          `[Mission Storage] Stored ${missionData.resources.length} resources for mission ${missionId}`
        );
      } catch (resourceError: any) {
        console.warn(
          `[Mission Storage] Failed to store resources (table may not exist):`,
          resourceError.message
        );
      }
    }

    // Store evaluation metrics (with error handling)
    if (
      missionData.evaluationMetrics &&
      missionData.evaluationMetrics.length > 0
    ) {
      try {
        const metricInserts = missionData.evaluationMetrics.map(
          (metric, index) => ({
            mission_id: missionId,
            metric_description: metric,
            metric_weight: 1.0,
            metric_order: index + 1,
          })
        );

        const { error: metricError } = await supabase
          .from("mission_evaluation_metrics")
          .insert(metricInserts);
        if (metricError) throw metricError;
        console.log(
          `[Mission Storage] Stored ${missionData.evaluationMetrics.length} evaluation metrics for mission ${missionId}`
        );
      } catch (metricError: any) {
        console.warn(
          `[Mission Storage] Failed to store evaluation metrics (table may not exist):`,
          metricError.message
        );
      }
    }

    console.log(
      `[Mission Storage] ✅ Successfully stored complete mission ${missionId}`
    );
    return missionId;
  } catch (error) {
    console.error("Error storing AI-generated mission:", error);
    throw error;
  }
}

// Store AI-generated mission in Supabase
export async function storeAIGeneratedMission(
  missionData: Omit<StaticMission, "id" | "status">,
  userId?: string
): Promise<string> {
  return insertMissionWithDetails(missionData, {
    aiGenerated: true,
    generatedBy: "openai",
    userId,
  });
}

// Store a static/seed mission in Supabase (not AI generated)
export async function storeStaticMission(
  missionData: Omit<StaticMission, "id" | "status">
): Promise<string> {
  return insertMissionWithDetails(missionData, {
    aiGenerated: false,
    generatedBy: "seed",
  });
}

// Get all missions from database
export async function getAllMissionsFromDB(): Promise<StaticMission[]> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Return static missions as fallback
    const { getAllMissions } = await import("@/data/staticMissions");
    return getAllMissions();
  }

  try {
    let missions: any = null;
    let error: any = null;

    // Attempt 1: Full query with status filter
    {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });
      missions = res.data;
      error = res.error;
    }

    // Retry without status filter if column missing
    if (error && error.code === "42703") {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .order("created_at", { ascending: false });
      missions = res.data;
      error = res.error;
    }

    // If relationship-based select fails, retry with plain select
    if (error && error.code === "PGRST200") {
      const res2 = await supabase
        .from("missions")
        .select("*")
        .order("created_at", { ascending: false });
      const plain = res2.data;
      const plainErr = res2.error;
      if (plainErr) throw plainErr;
      return (plain || []).map(
        (mission: any): StaticMission => ({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          field: mission.field,
          difficulty: mission.difficulty,
          timeEstimate: mission.time_estimate,
          category: mission.category,
          company: mission.company,
          context: mission.context,
          type: mission.type || undefined,
          language: mission.language || undefined,
          status: "suggested",
          skills: [],
          industries: [],
          tasks: [],
          objectives: [],
          resources: [],
          evaluationMetrics: [],
        })
      );
    }

    if (error) throw error;

    // Transform database format to StaticMission format
    return missions.map(
      (mission: any): StaticMission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        field: mission.field,
        difficulty: mission.difficulty,
        timeEstimate: mission.time_estimate,
        category: mission.category,
        company: mission.company,
        context: mission.context,
        type: mission.type || undefined,
        language: mission.language || undefined,
        status: "suggested",
        skills: mission.mission_skills?.map((ms: any) => ms.skills.name) || [],
        industries:
          mission.mission_industries?.map((mi: any) => mi.industries.name) ||
          [],
        tasks:
          mission.mission_tasks
            ?.sort((a: any, b: any) => a.task_order - b.task_order)
            ?.map((t: any) => t.task_description) || [],
        objectives:
          mission.mission_objectives
            ?.sort((a: any, b: any) => a.objective_order - b.objective_order)
            ?.map((o: any) => o.objective_description) || [],
        resources:
          mission.mission_resources
            ?.sort((a: any, b: any) => a.resource_order - b.resource_order)
            ?.map((r: any) => r.resource_description) || [],
        evaluationMetrics:
          mission.mission_evaluation_metrics
            ?.sort((a: any, b: any) => a.metric_order - b.metric_order)
            ?.map((m: any) => m.metric_description) || [],
      })
    );
  } catch (error) {
    console.error("Error fetching missions from database:", error);
    // Fallback to static missions
    const { getAllMissions } = await import("@/data/staticMissions");
    return getAllMissions();
  }
}

// Get specific mission by ID from database
export async function getMissionByIdFromDB(
  id: string
): Promise<StaticMission | null> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Return static mission as fallback
    const { getMissionById } = await import("@/data/staticMissions");
    return getMissionById(id) || null;
  }

  // If ID is not numeric, skip DB query (DB uses bigint, generated IDs are strings)
  if (!/^\d+$/.test(id)) {
    return null;
  }

  try {
    let mission: any = null;
    let error: any = null;

    // Attempt 1: Full query with status filter
    {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .eq("id", id)
        .eq("status", "active")
        .single();
      mission = res.data;
      error = res.error;
    }

    // Retry without status filter if column missing
    if (error && error.code === "42703") {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .eq("id", id)
        .single();
      mission = res.data;
      error = res.error;
    }

    // If relationship-based select fails, retry with plain select
    if (error && error.code === "PGRST200") {
      const res2 = await supabase
        .from("missions")
        .select("*")
        .eq("id", id)
        .single();
      const plain = res2.data;
      const plainErr = res2.error;
      if (plainErr) throw plainErr;
      if (!plain) return null;
      return {
        id: plain.id,
        title: plain.title,
        description: plain.description,
        field: plain.field,
        difficulty: plain.difficulty,
        timeEstimate: plain.time_estimate,
        category: plain.category,
        company: plain.company,
        context: plain.context,
        status: "suggested",
        skills: [],
        industries: [],
        tasks: [],
        objectives: [],
        resources: [],
        evaluationMetrics: [],
      };
    }

    if (error) throw error;

    // Debug: Log what DB returned
    console.log(`[getMissionByIdFromDB] Raw mission data from DB:`, {
      id: mission.id,
      hasMissionSkills: !!mission.mission_skills,
      missionSkillsCount: mission.mission_skills?.length || 0,
      hasMissionTasks: !!mission.mission_tasks,
      missionTasksCount: mission.mission_tasks?.length || 0,
      missionTasksData: mission.mission_tasks,
      hasDifficulty: !!mission.difficulty,
      hasTimeEstimate: !!mission.time_estimate,
      hasCompany: !!mission.company,
      hasContext: !!mission.context,
    });

    // Transform database format to StaticMission format
    return {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      field: mission.field,
      difficulty: mission.difficulty,
      timeEstimate: mission.time_estimate,
      category: mission.category,
      company: mission.company,
      context: mission.context,
      type: mission.type || undefined,
      language: mission.language || undefined,
      status: "suggested",
      skills: mission.mission_skills?.map((ms: any) => ms.skills.name) || [],
      industries:
        mission.mission_industries?.map((mi: any) => mi.industries.name) || [],
      tasks:
        mission.mission_tasks
          ?.sort((a: any, b: any) => a.task_order - b.task_order)
          ?.map((t: any) => {
            const desc = t.task_description;
            // If task_description is a JSON string, parse it
            if (typeof desc === "string" && desc.startsWith("{")) {
              try {
                const parsed = JSON.parse(desc);
                return parsed.task || desc;
              } catch {
                return desc;
              }
            }
            // If it's already an object, extract task property
            if (typeof desc === "object" && desc.task) {
              return desc.task;
            }
            return desc;
          }) || [],
      objectives:
        mission.mission_objectives
          ?.sort((a: any, b: any) => a.objective_order - b.objective_order)
          ?.map((o: any) => o.objective_description) || [],
      resources:
        mission.mission_resources
          ?.sort((a: any, b: any) => a.resource_order - b.resource_order)
          ?.map((r: any) => r.resource_description) || [],
      evaluationMetrics:
        mission.mission_evaluation_metrics
          ?.sort((a: any, b: any) => a.metric_order - b.metric_order)
          ?.map((m: any) => m.metric_description) || [],
    };
  } catch (error) {
    console.error("Error fetching mission by ID from database:", error);
    // Fallback to static mission
    const { getMissionById } = await import("@/data/staticMissions");
    return getMissionById(id) || null;
  }
}

// Get AI-generated missions for a specific user
export async function getMissionsByUserId(userId: string): Promise<StaticMission[]> {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Return empty or static missions as fallback
    return [];
  }

  try {
    let missions: any = null;
    let error: any = null;

    // Attempt 1: Query missions with all details for specific user, ordered by ID DESC
    {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("id", { ascending: false })
        .limit(3);
      missions = res.data;
      error = res.error;
    }

    // Retry without status filter if column missing
    if (error && error.code === "42703") {
      const res = await supabase
        .from("missions")
        .select(
          `
          *,
          mission_skills (
            skills (id, name, category)
          ),
          mission_industries (
            industries (id, name, description)
          ),
          mission_tasks (id, task_description, task_order, is_required),
          mission_objectives (id, objective_description, objective_order),
          mission_resources (id, resource_description, resource_type, resource_order),
          mission_evaluation_metrics (id, metric_description, metric_weight, metric_order)
        `
        )
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(3);
      missions = res.data;
      error = res.error;
    }

    // If relationship-based select fails, retry with plain select
    if (error && error.code === "PGRST200") {
      const res2 = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(3);
      const plain = res2.data;
      const plainErr = res2.error;
      if (plainErr) throw plainErr;
      return (plain || []).map(
        (mission: any): StaticMission => ({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          field: mission.field,
          difficulty: mission.difficulty,
          timeEstimate: mission.time_estimate,
          category: mission.category,
          company: mission.company,
          context: mission.context,
          status: "suggested",
          skills: [],
          industries: [],
          tasks: [],
          objectives: [],
          resources: [],
          evaluationMetrics: [],
        })
      );
    }

    if (error) throw error;

    console.log(`[getMissionsByUserId] Retrieved ${missions?.length || 0} missions for user ${userId}`);

    // Transform database format to StaticMission format
    const transformedMissions = (missions || []).map(
      (mission: any): StaticMission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        field: mission.field,
        difficulty: mission.difficulty,
        timeEstimate: mission.time_estimate,
        category: mission.category,
        company: mission.company,
        context: mission.context,
        type: mission.type || undefined,
        language: mission.language || undefined,
        status: "suggested",
        skills: mission.mission_skills?.map((ms: any) => ms.skills.name) || [],
        industries:
          mission.mission_industries?.map((mi: any) => mi.industries.name) ||
          [],
        tasks:
          mission.mission_tasks
            ?.sort((a: any, b: any) => a.task_order - b.task_order)
            ?.map((t: any) => t.task_description) || [],
        objectives:
          mission.mission_objectives
            ?.sort((a: any, b: any) => a.objective_order - b.objective_order)
            ?.map((o: any) => o.objective_description) || [],
        resources:
          mission.mission_resources
            ?.sort((a: any, b: any) => a.resource_order - b.resource_order)
            ?.map((r: any) => r.resource_description) || [],
        evaluationMetrics:
          mission.mission_evaluation_metrics
            ?.sort((a: any, b: any) => a.metric_order - b.metric_order)
            ?.map((m: any) => m.metric_description) || [],
      })
    );

    return transformedMissions;
  } catch (error) {
    console.error("Error fetching missions for user from database:", error);
    return [];
  }
}

// Run database migration (for development/admin use)
export async function runMissionMigration(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (USE_DUMMY) {
    console.log("Dummy mode - migration not executed");
    return { success: true };
  }

  try {
    // This would typically be done through Supabase dashboard or CLI
    // For now, we'll just test the connection
    const { data, error } = await supabase
      .from("missions")
      .select("count")
      .limit(1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get user's overall Velric score
export async function getUserVelricScore(userId: string): Promise<number | null> {
  if (USE_DUMMY) {
    // Return mock score in dummy mode
    await new Promise((r) => setTimeout(r, 20));
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("overall_velric_score")
      .eq("user_id", userId)
      .single();
    
    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data?.overall_velric_score || null;
  } catch (error: any) {
    // Gracefully handle missing user_stats table
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("User stats table not found, returning null for Velric score");
      return null;
    }
    throw error;
  }
}

// Persist overall Velric score for a user
export async function updateUserOverallVelricScore(
  userId: string,
  overallScore: number
): Promise<void> {
  if (USE_DUMMY) {
    // No-op in dummy mode
    await new Promise((r) => setTimeout(r, 20));
    return;
  }
  try {
    const { error } = await supabase.from("user_stats").upsert(
      {
        user_id: userId,
        overall_velric_score: overallScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;
  } catch (error: any) {
    // Gracefully handle missing user_stats table
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      console.warn("User stats table not found, skipping Velric score update");
      return;
    }
    throw error;
  }
}
