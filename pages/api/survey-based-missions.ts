// pages/api/survey-based-missions.ts
/**
 * Mission Generation from Survey Data Only
 * This endpoint generates missions by reading EXCLUSIVELY from survey_responses table
 * and using OpenAI to create 3 missions in parallel
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { generateMissionsFromSurvey, fetchSurveyDataFromTable } from '@/lib/ai';
import type { StaticMission } from '@/data/staticMissions';

interface SurveyBasedMissionsRequest {
  userId: string;
  count?: number;
}

interface SurveyBasedMissionsResponse {
  missions: StaticMission[];
  success: boolean;
  error?: string;
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

    console.log('[Survey-Based Missions] Fetching survey data for userId:', userId);

    // Fetch survey data EXCLUSIVELY from survey_responses table
    const surveyData = await fetchSurveyDataFromTable(userId);

    if (!surveyData) {
      console.error('[Survey-Based Missions] Error fetching survey data from survey_responses table');
      return res.status(400).json({
        success: false,
        error: 'User survey data not found. Please complete the survey first.',
        missions: []
      });
    }

    console.log('[Survey-Based Missions] ✅ Survey data retrieved from survey_responses table:', {
      userId,
      fullName: surveyData.full_name,
      educationLevel: surveyData.education_level,
      industry: surveyData.industry,
      level: surveyData.level,
      missionFocus: Array.isArray(surveyData.mission_focus)
        ? surveyData.mission_focus.join(', ')
        : surveyData.mission_focus,
      strengthAreas: Array.isArray(surveyData.strength_areas)
        ? surveyData.strength_areas.join(', ')
        : surveyData.strength_areas,
      hasResumeJson: !!surveyData.resume_json,
    });

    const safeCount = Math.min(Math.max(count, 1), 5);

    console.log(
      `[Survey-Based Missions] Starting parallel generation of ${safeCount} missions using survey_responses data`
    );

    // Generate missions in parallel using ONLY survey_responses data
    const generatedMissions = await generateMissionsFromSurvey(
      surveyData,
      safeCount
    );

    if (generatedMissions.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate missions. Please try again.',
        missions: []
      });
    }

    console.log(
      `[Survey-Based Missions] ✅ Successfully generated ${generatedMissions.length} missions in parallel`
    );

    // Store missions in database
    for (const mission of generatedMissions) {
      try {
        const { error: insertError } = await supabase.from('missions').insert({
          title: mission.title,
          description: mission.description,
          field: mission.field,
          difficulty: mission.difficulty,
          time_estimate: mission.timeEstimate,
          category: mission.category,
          company: mission.company,
          context: mission.context,
          type: mission.type,
          language: mission.language,
          is_ai_generated: true,
          generated_by: 'openai',
          generated_for_user_id: userId,
          status: 'active'
        });

        if (insertError) {
          console.warn('[Survey-Based Missions] Failed to store mission:', insertError);
        } else {
          console.log('[Survey-Based Missions] ✅ Stored mission:', mission.title);
        }
      } catch (error) {
        console.error('[Survey-Based Missions] Error storing mission:', error);
      }
    }

    res.status(200).json({
      success: true,
      missions: generatedMissions
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
