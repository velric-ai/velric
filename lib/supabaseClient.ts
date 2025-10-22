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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yzszgcnuxpkvxueivbyx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Determine if we should use dummy data
const hasValidSupabaseConfig = supabaseKey && 
  supabaseKey !== 'your_supabase_anon_key_here' && 
  supabaseKey !== 'your_openai_api_key_here' &&
  supabaseKey !== 'PUT_YOUR_SERVICE_ROLE_KEY_HERE' &&
  supabaseKey !== 'PUT_YOUR_ANON_KEY_HERE' &&
  supabaseUrl && supabaseUrl.startsWith('https://');

// Toggle between dummy data and real Supabase
export const USE_DUMMY = !hasValidSupabaseConfig || process.env.USE_DUMMY_DATA === 'true';

if (USE_DUMMY) {
  console.warn('🟡 Using dummy data mode. To enable Supabase:');
  console.warn('   1. Set up Supabase project at https://supabase.com');
  console.warn('   2. Update SUPABASE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local');
  console.warn('   3. Set USE_DUMMY_DATA=false');
  console.warn('   4. See SUPABASE_SETUP_GUIDE.md for detailed instructions');
} else {
  console.log('✅ Connected to Supabase database.');
  console.log(`📊 Database URL: ${supabaseUrl}`);
  console.log('🔄 Missions will be stored persistently and shared across developers');
}

const mockStore = MockDataStore.getInstance();

// Test Supabase connectivity
export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  if (USE_DUMMY) {
    return { connected: false, error: 'Using dummy mode - Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.from('missions').select('count').limit(1);
    if (error) throw error;
    return { connected: true };
  } catch (error) {
    return { connected: false, error: String(error) };
  }
}

// Initialize database schema if needed (for first-time setup)
export async function initializeDatabase(): Promise<{ success: boolean; error?: string }> {
  if (USE_DUMMY) {
    return { success: false, error: 'Cannot initialize - using dummy mode' };
  }

  try {
    // Test if tables exist by trying to select from missions table
    const { error } = await supabase.from('missions').select('id').limit(1);
    
    if (error && error.message.includes('does not exist')) {
      // Tables don't exist - they need to be created via Supabase dashboard or migration
      return { 
        success: false, 
        error: 'Database tables do not exist. Please run the SQL migration in migrations/create_projects_schema.sql via your Supabase dashboard.' 
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

// Get submission by ID
export async function getSubmissionById(submissionId: string): Promise<any> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 50));
    
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

  const { data, error } = await supabase
    .from('user_missions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Create a new submission
export async function createSubmission(submissionData: {
  userId: string;
  missionId: string;
  submissionText: string;
}): Promise<any> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newSubmission = {
      id: `submission-${Date.now()}`,
      user_id: submissionData.userId,
      mission_id: submissionData.missionId,
      submission_text: submissionData.submissionText,
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    return { success: true, submission: newSubmission };
  }

  const { data, error } = await supabase
    .from('user_missions')
    .insert({
      user_id: submissionData.userId,
      mission_id: submissionData.missionId,
      submission_text: submissionData.submissionText,
      status: 'submitted'
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, submission: data };
}

// ==========================================
// NEW MISSION SYSTEM FUNCTIONS
// ==========================================

import { StaticMission } from '@/data/staticMissions';

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
  skills: Array<{ id: string; name: string; category?: string; }>;
  industries: Array<{ id: string; name: string; description?: string; }>;
  tasks: Array<{ id: string; task_description: string; task_order: number; is_required: boolean; }>;
  objectives: Array<{ id: string; objective_description: string; objective_order: number; }>;
  resources: Array<{ id: string; resource_description: string; resource_type?: string; resource_order: number; }>;
  evaluation_metrics: Array<{ id: string; metric_description: string; metric_weight: number; metric_order: number; }>;
}

// Store AI-generated mission in Supabase
// Internal helper to insert a mission and all its detail tables
async function insertMissionWithDetails(
  missionData: Omit<StaticMission, 'id' | 'status'>,
  options: { aiGenerated: boolean; generatedBy: string }
): Promise<string> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newId = `mission-${Date.now()}`;
    console.log('Would store mission in database:', { id: newId, ...missionData });
    return newId;
  }

  try {
    // Insert the main mission record
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .insert({
        title: missionData.title,
        description: missionData.description,
        field: missionData.field,
        difficulty: missionData.difficulty,
        time_estimate: missionData.timeEstimate,
        category: missionData.category,
        company: missionData.company,
        context: missionData.context,
        is_ai_generated: options.aiGenerated,
        generated_by: options.generatedBy,
        status: 'active'
      })
      .select('id')
      .single();

    if (missionError) throw missionError;
    
    const missionId = mission.id;

    // Store skills
    if (missionData.skills && missionData.skills.length > 0) {
      for (const skill of missionData.skills) {
        // Insert or get skill
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .upsert({ name: skill, category: 'General' })
          .select('id')
          .single();

        if (!skillError && skillData) {
          // Link skill to mission
          await supabase
            .from('mission_skills')
            .insert({ mission_id: missionId, skill_id: skillData.id });
        }
      }
    }

    // Store industries
    if (missionData.industries && missionData.industries.length > 0) {
      for (const industry of missionData.industries) {
        // Insert or get industry
        const { data: industryData, error: industryError } = await supabase
          .from('industries')
          .upsert({ name: industry })
          .select('id')
          .single();

        if (!industryError && industryData) {
          // Link industry to mission
          await supabase
            .from('mission_industries')
            .insert({ mission_id: missionId, industry_id: industryData.id });
        }
      }
    }

    // Store tasks
    if (missionData.tasks && missionData.tasks.length > 0) {
      const taskInserts = missionData.tasks.map((task, index) => ({
        mission_id: missionId,
        task_description: task,
        task_order: index + 1,
        is_required: true
      }));
      
      await supabase.from('mission_tasks').insert(taskInserts);
    }

    // Store objectives
    if (missionData.objectives && missionData.objectives.length > 0) {
      const objectiveInserts = missionData.objectives.map((objective, index) => ({
        mission_id: missionId,
        objective_description: objective,
        objective_order: index + 1
      }));
      
      await supabase.from('mission_objectives').insert(objectiveInserts);
    }

    // Store resources
    if (missionData.resources && missionData.resources.length > 0) {
      const resourceInserts = missionData.resources.map((resource, index) => ({
        mission_id: missionId,
        resource_description: resource,
        resource_order: index + 1
      }));
      
      await supabase.from('mission_resources').insert(resourceInserts);
    }

    // Store evaluation metrics
    if (missionData.evaluationMetrics && missionData.evaluationMetrics.length > 0) {
      const metricInserts = missionData.evaluationMetrics.map((metric, index) => ({
        mission_id: missionId,
        metric_description: metric,
        metric_weight: 1.0,
        metric_order: index + 1
      }));
      
      await supabase.from('mission_evaluation_metrics').insert(metricInserts);
    }

    return missionId;
  } catch (error) {
    console.error('Error storing AI-generated mission:', error);
    throw error;
  }
}

// Store AI-generated mission in Supabase
export async function storeAIGeneratedMission(
  missionData: Omit<StaticMission, 'id' | 'status'>
): Promise<string> {
  return insertMissionWithDetails(missionData, { aiGenerated: true, generatedBy: 'openai' });
}

// Store a static/seed mission in Supabase (not AI generated)
export async function storeStaticMission(
  missionData: Omit<StaticMission, 'id' | 'status'>
): Promise<string> {
  return insertMissionWithDetails(missionData, { aiGenerated: false, generatedBy: 'seed' });
}

// Get all missions from database
export async function getAllMissionsFromDB(): Promise<StaticMission[]> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return static missions as fallback
    const { getAllMissions } = await import('@/data/staticMissions');
    return getAllMissions();
  }

  try {
    const { data: missions, error } = await supabase
      .from('missions')
      .select(`
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
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform database format to StaticMission format
    return missions.map((mission: any): StaticMission => ({
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
      skills: mission.mission_skills?.map((ms: any) => ms.skills.name) || [],
      industries: mission.mission_industries?.map((mi: any) => mi.industries.name) || [],
      tasks: mission.mission_tasks
        ?.sort((a: any, b: any) => a.task_order - b.task_order)
        ?.map((t: any) => t.task_description) || [],
      objectives: mission.mission_objectives
        ?.sort((a: any, b: any) => a.objective_order - b.objective_order)
        ?.map((o: any) => o.objective_description) || [],
      resources: mission.mission_resources
        ?.sort((a: any, b: any) => a.resource_order - b.resource_order)
        ?.map((r: any) => r.resource_description) || [],
      evaluationMetrics: mission.mission_evaluation_metrics
        ?.sort((a: any, b: any) => a.metric_order - b.metric_order)
        ?.map((m: any) => m.metric_description) || []
    }));
  } catch (error) {
    console.error('Error fetching missions from database:', error);
    // Fallback to static missions
    const { getAllMissions } = await import('@/data/staticMissions');
    return getAllMissions();
  }
}

// Get specific mission by ID from database
export async function getMissionByIdFromDB(id: string): Promise<StaticMission | null> {
  if (USE_DUMMY) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return static mission as fallback
    const { getMissionById } = await import('@/data/staticMissions');
    return getMissionById(id);
  }

  try {
    const { data: mission, error } = await supabase
      .from('missions')
      .select(`
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
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) throw error;

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
      status: "suggested",
      skills: mission.mission_skills?.map((ms: any) => ms.skills.name) || [],
      industries: mission.mission_industries?.map((mi: any) => mi.industries.name) || [],
      tasks: mission.mission_tasks
        ?.sort((a: any, b: any) => a.task_order - b.task_order)
        ?.map((t: any) => t.task_description) || [],
      objectives: mission.mission_objectives
        ?.sort((a: any, b: any) => a.objective_order - b.objective_order)
        ?.map((o: any) => o.objective_description) || [],
      resources: mission.mission_resources
        ?.sort((a: any, b: any) => a.resource_order - b.resource_order)
        ?.map((r: any) => r.resource_description) || [],
      evaluationMetrics: mission.mission_evaluation_metrics
        ?.sort((a: any, b: any) => a.metric_order - b.metric_order)
        ?.map((m: any) => m.metric_description) || []
    };
  } catch (error) {
    console.error('Error fetching mission by ID from database:', error);
    // Fallback to static mission
    const { getMissionById } = await import('@/data/staticMissions');
    return getMissionById(id);
  }
}

// Run database migration (for development/admin use)
export async function runMissionMigration(): Promise<{ success: boolean; error?: string }> {
  if (USE_DUMMY) {
    console.log('Dummy mode - migration not executed');
    return { success: true };
  }

  try {
    // This would typically be done through Supabase dashboard or CLI
    // For now, we'll just test the connection
    const { data, error } = await supabase.from('missions').select('count').limit(1);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
