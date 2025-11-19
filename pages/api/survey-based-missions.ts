// pages/api/survey-based-missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { generateComprehensiveMission } from '@/lib/ai';

interface SurveyBasedMissionsRequest {
  userId: string;
  count?: number;
}

interface SurveyBasedMissionsResponse {
  missions: any[];
  success: boolean;
  error?: string;
  surveyData?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SurveyBasedMissionsResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      missions: []
    });
  }

  try {
    const { userId, count = 3 }: SurveyBasedMissionsRequest = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        missions: []
      });
    }

    // Fetch the latest survey response for the user
    const { data: surveyData, error: surveyError } = await supabase
      .from('survey_responses_v2')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (surveyError || !surveyData) {
      console.error('Error fetching survey data:', surveyError);
      return res.status(400).json({
        success: false,
        error: 'User survey data not found. Please complete the survey first.',
        missions: []
      });
    }

    console.log('[Survey-Based Missions] Fetched survey data:', {
      userId,
      fullName: surveyData.full_name,
      industry: surveyData.industry,
      education: surveyData.education_level,
      missionFocus: surveyData.mission_focus,
      strengthAreas: surveyData.strength_areas,
      learningPreference: surveyData.learning_preference
    });

    // Check for existing missions generated for this user to avoid duplicates
    const { data: existingMissions, error: existingError } = await supabase
      .from('missions')
      .select('id, title')
      .eq('generated_for_user_id', userId)
      .eq('is_ai_generated', true)
      .order('created_at', { ascending: false })
      .limit(20);

    const existingTitles = existingMissions?.map(m => m.title) || [];
    console.log('[Survey-Based Missions] Found', existingTitles.length, 'existing missions for user');

    // Build a detailed user background from survey data
    const userBackground = buildUserBackground(surveyData);

    // Get mission focus areas
    const missionFocus = Array.isArray(surveyData.mission_focus) 
      ? surveyData.mission_focus 
      : [surveyData.mission_focus];

    // Determine difficulty based on education level
    const difficulty = mapEducationToDifficulty(surveyData.education_level);

    const safeCount = Math.min(Math.max(count, 1), 5);
    const generatedMissions = [];

    for (let i = 0; i < safeCount; i++) {
      try {
        console.log(`[Survey-Based Missions] Generating mission ${i + 1}/${safeCount} for industry: ${surveyData.industry}`);

        // Generate a mission tailored to the user's industry and preferences
        const mission = await generateComprehensiveMission(
          userBackground,
          missionFocus,
          surveyData.industry,
          difficulty,
          `${3 + i}-${7 + i} hours`
        );

        // Check if this mission title already exists
        if (existingTitles.some(title => 
          title.toLowerCase().includes(mission.title.toLowerCase().slice(0, 10)) ||
          mission.title.toLowerCase().includes(title.toLowerCase().slice(0, 10))
        )) {
          console.log('[Survey-Based Missions] Skipping duplicate mission:', mission.title);
          // Regenerate to get a different one
          continue;
        }

        generatedMissions.push(mission);

        // Store in database with user association
        const { error: insertError } = await supabase
          .from('missions')
          .insert({
            title: mission.title,
            description: mission.description,
            field: mission.field,
            difficulty: mission.difficulty,
            time_estimate: mission.timeEstimate,
            category: mission.category,
            company: mission.company,
            context: mission.context,
            is_ai_generated: true,
            generated_by: 'openai',
            generated_for_user_id: userId,
            status: 'active'
          });

        if (insertError) {
          console.warn('[Survey-Based Missions] Failed to store mission:', insertError);
          // Continue anyway - mission was generated even if storage failed
        } else {
          console.log('[Survey-Based Missions] Stored mission:', mission.title);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[Survey-Based Missions] Error generating mission ${i + 1}:`, error);
      }
    }

    if (generatedMissions.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate missions. Please try again.',
        missions: []
      });
    }

    console.log('[Survey-Based Missions] Generated', generatedMissions.length, 'unique missions');

    res.status(200).json({
      success: true,
      missions: generatedMissions,
      surveyData: {
        industry: surveyData.industry,
        missionFocus,
        education: surveyData.education_level
      }
    });
  } catch (error) {
    console.error('[Survey-Based Missions] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate missions based on survey',
      missions: []
    });
  }
}

/**
 * Build a detailed user background string from survey data
 */
function buildUserBackground(surveyData: any): string {
  const parts = [
    `Full name: ${surveyData.full_name}`,
    `Education level: ${surveyData.education_level}`,
    `Industry: ${surveyData.industry}`,
    `Experience summary: ${surveyData.experience_summary || 'Not specified'}`,
  ];

  if (surveyData.platform_connections) {
    const platforms = Object.keys(surveyData.platform_connections || {});
    if (platforms.length > 0) {
      parts.push(`Platform experience: ${platforms.join(', ')}`);
    }
  }

  if (surveyData.portfolio) {
    parts.push(`Has portfolio: Yes`);
  }

  return parts.join('. ');
}

/**
 * Map education level to mission difficulty
 */
function mapEducationToDifficulty(educationLevel: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  const level = educationLevel?.toLowerCase() || 'intermediate';
  
  if (level.includes('high school') || level.includes('diploma')) {
    return 'Beginner';
  }
  if (level.includes('bachelor') || level.includes('associate')) {
    return 'Intermediate';
  }
  if (level.includes('master') || level.includes('phd') || level.includes('doctorate')) {
    return 'Advanced';
  }
  
  return 'Intermediate';
}
