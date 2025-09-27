// types/index.ts
export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  skills: string[];
  industries: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time_estimate: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  // Extended fields for detailed mission view
  tags?: string[];
  timeLimit?: string;
  submissions?: number;
  details?: {
    overview: string;
    requirements: string[];
    technologies: string[];
    learningOutcomes: string[];
  };
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  status: 'suggested' | 'starred' | 'in_progress' | 'completed' | 'submitted';
  started_at?: string;
  completed_at?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  user_id: string;
  mission_id?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ProjectDoc {
  id: string;
  project_id: string;
  title: string;
  content: string;
  doc_type: 'readme' | 'spec' | 'design' | 'notes' | 'other';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface IndustryTag {
  id: string;
  name: string;
  created_at: string;
}

export interface ProjectIndustryTag {
  project_id: string;
  industry_tag_id: string;
}

export interface TargetRole {
  id: string;
  name: string;
  created_at: string;
}

export interface ProjectTargetRole {
  project_id: string;
  target_role_id: string;
}

// API Request/Response types
export interface GenerateMissionsRequest {
  resumeText?: string;
  resumeUrl?: string;
  interests?: string[];
}

export interface GenerateMissionsResponse {
  missions: MissionTemplate[];
  success: boolean;
  error?: string;
}

export interface UserMissionActionRequest {
  userId: string;
  missionId: string;
  action: 'star' | 'start' | 'submit' | 'complete';
}

export interface UserMissionActionResponse {
  userMission: UserMission;
  success: boolean;
  error?: string;
}

// Legacy Mission type for backward compatibility
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skills: string[];
  tags: string[];
}