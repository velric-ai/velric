// pages/api/survey-based-missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import {
  generateComprehensiveMission,
  fetchFileFromSupabase,
  parseResumeWithOpenAI,
} from '@/lib/ai';
import type { StaticMission } from '@/data/staticMissions';

interface SurveyBasedMissionsRequest {
  userId: string;
  count?: number;
}

interface SurveyBasedMissionsResponse {
  missions: any[];
  success: boolean;
  error?: string;
  surveyData?: any;
  resumeData?: any;
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
      learningPreference: surveyData.learning_preference,
      hasResumeJson: !!surveyData.resume_json
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

    // Build resume-enhanced background/context
    const resumeContext = await buildResumeContextFromPortfolio(
      surveyData.survey_json
    );

    // Build a detailed user background combining survey + resume signals
    const userBackground = buildUserBackground(surveyData, resumeContext);

    // Get mission focus areas, including skills from resume_json
    const missionFocus = mergeMissionFocusAreas(
      surveyData.mission_focus,
      extractSkillsFromResumeJson(surveyData.resume_json),
      resumeContext.resumeSkills
    );

    // Determine difficulty based on education level
    const difficulty = mapEducationToDifficulty(surveyData.education_level);

    const safeCount = Math.min(Math.max(count, 1), 5);
    const generatedMissions = [];

    for (let i = 0; i < safeCount; i++) {
      try {
        console.log(`[Survey-Based Missions] Generating mission ${i + 1}/${safeCount} for industry: ${surveyData.industry}`);

        // Generate a mission tailored to the user's industry and preferences, enriched with resume context and resume_json data
        const mission = await generateComprehensiveMission(
          userBackground,
          missionFocus,
          surveyData.industry,
          difficulty,
          `${3 + i}-${7 + i} hours`,
          surveyData.resume_json // Pass the resume_json data to OpenAI
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
      },
      resumeData: resumeContext.parsedResume || null
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
 * Build a detailed user background string from survey data and resume_json
 */
function buildUserBackground(
  surveyData: any,
  resumeContext?: ResumeContext
): string {
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

  // Extract and include resume_json data if available
  if (surveyData.resume_json) {
    try {
      const resumeJson = typeof surveyData.resume_json === 'string'
        ? JSON.parse(surveyData.resume_json)
        : surveyData.resume_json;

      // Extract structured data from resume_json
      if (resumeJson.summary) {
        parts.push(`Resume summary: ${resumeJson.summary}`);
      }

      if (resumeJson.skills && Array.isArray(resumeJson.skills)) {
        const skills = resumeJson.skills.slice(0, 10).join(', ');
        parts.push(`Key skills: ${skills}`);
      }

      if (resumeJson.experiences && Array.isArray(resumeJson.experiences)) {
        const highlights = resumeJson.experiences.slice(0, 3).map((exp: any) => {
          const title = exp.title || 'Role';
          const company = exp.company || 'Company';
          const duration = [exp.startDate, exp.endDate || 'Present']
            .filter(Boolean)
            .join(' - ');
          return `${title} at ${company}${duration ? ` (${duration})` : ''}`;
        });
        parts.push(`Experience highlights: ${highlights.join('; ')}`);
      }

      if (resumeJson.projects && Array.isArray(resumeJson.projects)) {
        const projectTitles = resumeJson.projects.slice(0, 2).map((p: any) => p.name || 'Project').join(', ');
        parts.push(`Notable projects: ${projectTitles}`);
      }

      if (resumeJson.education && Array.isArray(resumeJson.education)) {
        const edList = resumeJson.education.map((ed: any) =>
          `${ed.degree || 'Degree'} in ${ed.field || 'Field'} from ${ed.institution || 'Institution'}`
        ).join(', ');
        parts.push(`Education: ${edList}`);
      }
    } catch (e) {
      console.warn('[Survey-Based Missions] Failed to parse resume_json:', e);
    }
  }

  if (resumeContext?.resumeSummary) {
    parts.push(`Resume summary: ${resumeContext.resumeSummary}`);
  }

  if (resumeContext?.experienceHighlights?.length) {
    parts.push(
      `Resume highlights: ${resumeContext.experienceHighlights.join('; ')}`
    );
  }

  if (resumeContext?.resumeSkills?.length) {
    parts.push(
      `Key skills from resume: ${resumeContext.resumeSkills.join(', ')}`
    );
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

type ResumeContext = {
  resumeSummary?: string;
  experienceHighlights?: string[];
  resumeSkills: string[];
  parsedResume?: any;
};

async function buildResumeContextFromPortfolio(
  portfolio?: { file?: string | null; url?: string | null }
): Promise<ResumeContext> {
  if (!portfolio?.file && !portfolio?.url) {
    return {
      resumeSkills: [],
      experienceHighlights: [],
    };
  }

  const storageKey = extractStorageKey(portfolio);
  let resumeFile: Awaited<ReturnType<typeof fetchFileFromSupabase>> | null = null;

  if (storageKey) {
    try {
      resumeFile = await fetchFileFromSupabase(
        'portfolio_uploads',
        storageKey.replace(/^\/+/, '')
      );
    } catch (error) {
      console.warn(
        '[Survey-Based Missions] Failed to fetch resume via storage key, will try direct URL:',
        error
      );
    }
  }

  if (!resumeFile && portfolio.url) {
    resumeFile = await downloadResumeFromUrl(portfolio.url);
  }

  if (!resumeFile) {
    return {
      resumeSkills: [],
      experienceHighlights: [],
    };
  }

  try {
    const parsedResume = await parseResumeWithOpenAI(resumeFile, {
      filename: storageKey || portfolio.file || 'uploaded_resume',
    });

    let resumeSummary: string | undefined;
    const experienceHighlights: string[] = [];
    let resumeSkills: string[] = [];

    if (parsedResume) {
      resumeSummary = parsedResume.summary || undefined;

      if (Array.isArray(parsedResume.experiences)) {
        parsedResume.experiences.slice(0, 3).forEach((exp: any) => {
          const title = exp?.title || 'Role';
          const company = exp?.company || 'Company';
          const duration = [exp?.startDate, exp?.endDate || 'Present']
            .filter(Boolean)
            .join(' - ');
          experienceHighlights.push(
            `${title} at ${company}${duration ? ` (${duration})` : ''}`
          );
        });
      }

      if (Array.isArray(parsedResume.skills)) {
        resumeSkills = parsedResume.skills.slice(0, 12);
      }
    } else if (resumeFile.text) {
      resumeSummary = resumeFile.text.slice(0, 600);
    }

    return {
      resumeSummary,
      experienceHighlights,
      resumeSkills,
      parsedResume: parsedResume || null,
    };
  } catch (error) {
    console.error('[Survey-Based Missions] Failed to parse resume with OpenAI:', error);
    return {
      resumeSkills: [],
      experienceHighlights: [],
    };
  }
}

function extractStorageKey(portfolio?: { file?: string | null; url?: string | null }) {
  if (!portfolio) return null;

  const existingFile = portfolio.file || '';
  if (existingFile.includes('portfolio_uploads/')) {
    return existingFile.substring(existingFile.indexOf('portfolio_uploads/'));
  }

  if (existingFile && existingFile.includes('-') && existingFile.includes('.')) {
    // Already looks like a storage key (timestamp_filename.ext)
    return existingFile;
  }

  if (portfolio.url) {
    try {
      const parsed = new URL(portfolio.url);
      const marker = '/portfolio_uploads/';
      const idx = parsed.pathname.indexOf(marker);
      if (idx !== -1) {
        return parsed.pathname.substring(idx + marker.length);
      }
    } catch (error) {
      console.warn('[Survey-Based Missions] Failed to parse portfolio URL for storage key', error);
    }
  }

  return null;
}

async function downloadResumeFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('[Survey-Based Missions] Failed to download resume via URL:', response.status);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const textPreview = buffer.toString('utf8');
    const isLikelyText = /[\x00-\x08\x0E-\x1F]/.test(textPreview.slice(0, 200)) === false;

    if (isLikelyText) {
      return { text: buffer.toString('utf8') };
    }

    return { base64: buffer.toString('base64') };
  } catch (error) {
    console.error('[Survey-Based Missions] Error downloading resume from URL:', error);
    return null;
  }
}

function mergeMissionFocusAreas(
  surveyMissionFocus: string[] | string,
  resumeJsonSkills: string[] = [],
  resumeSkills: string[] = []
): string[] {
  const missionFocusArray = Array.isArray(surveyMissionFocus)
    ? surveyMissionFocus
    : surveyMissionFocus
      ? [surveyMissionFocus]
      : [];

  const combined = [...missionFocusArray, ...resumeJsonSkills, ...resumeSkills];
  const seen = new Set<string>();
  return combined.filter((item) => {
    if (!item || typeof item !== 'string') return false;
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Extract skills from resume_json column data
 */
function extractSkillsFromResumeJson(resumeJson: any): string[] {
  if (!resumeJson) return [];

  try {
    const parsed = typeof resumeJson === 'string'
      ? JSON.parse(resumeJson)
      : resumeJson;

    if (parsed.skills && Array.isArray(parsed.skills)) {
      // Return skills as an array
      return parsed.skills.filter((s: any) => typeof s === 'string' && s.length > 0);
    }

    return [];
  } catch (e) {
    console.warn('[Survey-Based Missions] Failed to parse skills from resume_json:', e);
    return [];
  }
}
