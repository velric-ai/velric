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
import {
  MissionTemplate,
  UserMission,
  Project,
  ProjectDoc,
  UserMissionActionRequest,
} from "@/types";
import { MockDataStore, mockMissionTemplates } from "@/data/mockMissions";

// Toggle between dummy data and real Supabase
export const USE_DUMMY = true;

// TODO: Set these environment variables when switching to real Supabase:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
// or SUPABASE_SERVICE_ROLE_KEY=your_service_role_key for server-side operations

let supabase: any = null;

if (!USE_DUMMY) {
  // Uncomment and configure when ready to use real Supabase:
  // import { createClient } from '@supabase/supabase-js';
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // supabase = createClient(supabaseUrl, supabaseKey);
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
  const query = supabase.from("mission_templates").select("*");
  if (status) {
    // Join with user_missions table to filter by status
    query.eq("user_missions.status", status);
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

// Submissions
export async function createSubmission(
  userId: string,
  missionId: string | null,
  text: string
) {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const newSub = {
      id: `sub-${Date.now()}`,
      user_id: userId,
      mission_id: missionId,
      text,
      feedback: null,
      grades: null,
      status: "submitted",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
    mockStore.submissions.push(newSub);
    return newSub;
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id: userId,
      mission_id: missionId,
      text,
      status: "submitted",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubmissionById(id: string) {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockStore.submissions.find((s) => s.id === id) || null;
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubmission(id: string, updates: Partial<any>) {
  if (USE_DUMMY) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const sub = mockStore.submissions.find((s) => s.id === id);
    if (!sub) return null;
    Object.assign(sub, updates);
    sub.updated_at = new Date().toISOString();
    return sub;
  }

  const { data, error } = await supabase
    .from("submissions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
