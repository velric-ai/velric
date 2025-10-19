// Get all completed/graded submissions for a user
export async function getCompletedSubmissionsByUser(userId: string) {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Treat status 'graded' as completed
    return mockStore.submissions.filter(
      (s) => s.user_id === userId && s.status === "graded"
    );
  }
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "graded");
  if (error) throw error;
  return data || [];
}
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { MissionTemplate, UserMission, Project, ProjectDoc, UserMissionActionRequest } from '@/types';
import { MockDataStore, mockMissionTemplates } from '@/data/mockMissions';

// Supabase configuration
const supabaseUrl = 'https://yzszgcnuxpkvxueivbyx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Toggle between dummy data and real Supabase
export const USE_DUMMY = !supabaseKey || process.env.USE_DUMMY_DATA === 'true';

if (USE_DUMMY) {
  console.warn('Using dummy data mode. Set SUPABASE_KEY environment variable to use real database.');
} else {
  console.log('Connected to Supabase database.');
}

const mockStore = MockDataStore.getInstance();

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
  let query = supabase.from('mission_templates').select('*');
  if (status) {
    // Join with user_missions table to filter by status
    query = query.eq('user_missions.status', status);
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
    .from("user_missions")
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
    .from("user_missions")
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
    .from("user_missions")
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
export async function getPersonalizedMissions(userId: string): Promise<MissionTemplate[]> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockStore.missionTemplates;
  }

  // Get user survey data for personalization
  const { data: surveyData } = await supabase
    .from('user_surveys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get existing user missions to filter out already assigned ones
  const { data: existingMissions } = await supabase
    .from('user_missions')
    .select('mission_id')
    .eq('user_id', userId);

  const existingMissionIds = existingMissions?.map((um: any) => um.mission_id) || [];

  // Query for missions that match user preferences
  let query = supabase
    .from('mission_templates')
    .select('*')
    .not('id', 'in', `(${existingMissionIds.join(',')})`)
    .limit(20);

  if (surveyData?.difficulty_level) {
    query = query.eq('difficulty', surveyData.difficulty_level);
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
    await new Promise(resolve => setTimeout(resolve, 50));
    // Return mock company projects data
    return [
      {
        id: '1',
        company_name: 'Netflix',
        project_title: 'Content Recommendation Engine',
        project_description: 'Build a machine learning system that analyzes user viewing history and preferences to recommend personalized content',
        technologies_used: ['Python', 'TensorFlow', 'Redis', 'FastAPI', 'PostgreSQL'],
        industry: 'Media',
        difficulty_level: 'Advanced',
        project_type: 'Data Science',
        estimated_time: '6-8 hours',
        learning_objectives: ['Machine Learning algorithms', 'Collaborative filtering', 'Content-based filtering', 'Real-time recommendations'],
        business_context: 'Netflix uses sophisticated recommendation algorithms to keep users engaged and reduce churn'
      },
      {
        id: '2', 
        company_name: 'Stripe',
        project_title: 'Payment Processing System',
        project_description: 'Create a secure payment processing system with fraud detection and multi-currency support',
        technologies_used: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
        industry: 'Finance',
        difficulty_level: 'Advanced',
        project_type: 'Backend',
        estimated_time: '5-7 hours',
        learning_objectives: ['Payment processing', 'Security best practices', 'Fraud detection', 'API design'],
        business_context: 'Stripe processes billions of dollars in transactions and needs robust systems'
      }
    ];
  }

  let query = supabase
    .from('company_projects')
    .select('*')
    .eq('is_active', true);

  if (filters?.industry) {
    query = query.eq('industry', filters.industry);
  }
  if (filters?.difficulty) {
    query = query.eq('difficulty_level', filters.difficulty);
  }
  if (filters?.projectType) {
    query = query.eq('project_type', filters.projectType);
  }

  query = query.limit(filters?.limit || 10);

  const { data, error } = await query;
  if (error) throw error;

  return data || [];
}

// Save user survey data
export async function saveUserSurvey(userId: string, surveyData: {
  experienceLevel?: string;
  programmingLanguages?: string[];
  interests?: string[];
  careerGoals?: string[];
  industryPreferences?: string[];
  availabilityHoursPerWeek?: number;
  preferredProjectTypes?: string[];
  resumeText?: string;
}): Promise<void> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return;
  }

  const { error } = await supabase
    .from('user_surveys')
    .upsert({
      user_id: userId,
      experience_level: surveyData.experienceLevel,
      programming_languages: surveyData.programmingLanguages,
      interests: surveyData.interests,
      career_goals: surveyData.careerGoals,
      industry_preferences: surveyData.industryPreferences,
      availability_hours_per_week: surveyData.availabilityHoursPerWeek,
      preferred_project_types: surveyData.preferredProjectTypes,
      resume_text: surveyData.resumeText,
      completed_at: new Date().toISOString()
    });

  if (error) throw error;
}

// Get user survey data
export async function getUserSurvey(userId: string): Promise<any> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      experience_level: 'intermediate',
      programming_languages: ['JavaScript', 'Python', 'React'],
      interests: ['Full-Stack Development', 'AI/ML', 'Web Development'],
      career_goals: ['Senior Software Engineer'],
      industry_preferences: ['Technology', 'E-commerce'],
      availability_hours_per_week: 10,
      preferred_project_types: ['Full-Stack', 'Backend'],
      resume_text: 'Sample resume text...'
    };
  }

  const { data, error } = await supabase
    .from('user_surveys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}

// Get user's mission status
export async function getUserMissionStatus(userId: string, missionId: string): Promise<any> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Check if mission exists in mock data
    const userMission = mockStore.userMissions.find(
      um => um.user_id === userId && um.mission_id === missionId
    );
    
    return userMission || null;
  }

  const { data, error } = await supabase
    .from('user_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}
