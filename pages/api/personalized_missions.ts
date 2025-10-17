// pages/api/personalized_missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generatePersonalizedMissions } from '@/lib/ai';
import { getCompanyProjects, getUserSurvey, addGeneratedMissions } from '@/lib/supabaseClient';

interface GeneratePersonalizedMissionsRequest {
  userId: string;
  count?: number;
  regenerate?: boolean; // Force regeneration even if user has existing missions
}

interface GeneratePersonalizedMissionsResponse {
  missions: any[];
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratePersonalizedMissionsResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      missions: []
    });
  }

  try {
    const { userId, count = 3, regenerate = false }: GeneratePersonalizedMissionsRequest = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        missions: []
      });
    }
    
    // Get user survey data for personalization
    const userSurveyData = await getUserSurvey(userId);
    
    if (!userSurveyData && !regenerate) {
      return res.status(400).json({
        success: false,
        error: 'User survey data not found. Please complete your profile first.',
        missions: []
      });
    }
    
    // Get relevant company projects based on user preferences
    const companyProjects = await getCompanyProjects({
      industry: userSurveyData?.industry_preferences?.[0],
      difficulty: userSurveyData?.experience_level,
      projectType: userSurveyData?.preferred_project_types?.[0],
      limit: 5
    });
    
    // Generate personalized missions using ChatGPT
    const generatedMissions = await generatePersonalizedMissions(
      userSurveyData,
      companyProjects,
      count
    );
    
    // Mark missions as generated for this user
    const missionsWithMetadata = generatedMissions.map(mission => ({
      ...mission,
      is_generated: true,
      generated_for_user_id: userId
    }));
    
    // Store generated missions
    await addGeneratedMissions(missionsWithMetadata);
    
    res.status(200).json({
      success: true,
      missions: generatedMissions
    });
  } catch (error) {
    console.error('Error generating personalized missions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate personalized missions',
      missions: []
    });
  }
}