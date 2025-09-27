// pages/api/generate_missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateMissionsFromResume } from '@/lib/ai';
import { addGeneratedMissions } from '@/lib/supabaseClient';
import { GenerateMissionsRequest, GenerateMissionsResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateMissionsResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      missions: []
    });
  }

  try {
    const { resumeText, resumeUrl, interests }: GenerateMissionsRequest = req.body;
    
    // Validation: at least one of resumeText, resumeUrl, or interests is required
    if (!resumeText && !resumeUrl && (!interests || interests.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'At least one of resumeText, resumeUrl, or interests is required',
        missions: []
      });
    }
    
    // For now, we'll focus on resumeText and interests
    // TODO: Implement resumeUrl parsing when file upload is added
    let processedResumeText = resumeText || '';
    
    if (resumeUrl && !resumeText) {
      // TODO: Fetch and parse resume from URL
      processedResumeText = 'Resume content from URL (parsing not implemented yet)';
    }
    
    // Generate missions using AI simulation
    const generatedMissions = generateMissionsFromResume(
      processedResumeText,
      interests || [],
      undefined, // industry - could be extracted from resume/interests
      'Intermediate', // default difficulty
      '3-5 hours' // default time estimate
    );
    
    // Store generated missions (in dummy mode, adds to in-memory store)
    await addGeneratedMissions(generatedMissions);
    
    res.status(200).json({
      success: true,
      missions: generatedMissions
    });
  } catch (error) {
    console.error('Error generating missions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate missions',
      missions: []
    });
  }
}