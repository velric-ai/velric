// pages/api/admin/generate-missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAndStoreMissions } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userBackground,
      interests,
      industry,
      difficulty,
      count = 3
    } = req.body;

    // Validate required fields
    if (!userBackground || !interests || !industry || !difficulty) {
      return res.status(400).json({
        error: 'Missing required fields: userBackground, interests, industry, difficulty'
      });
    }

    // Validate difficulty
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return res.status(400).json({
        error: 'Difficulty must be one of: Beginner, Intermediate, Advanced'
      });
    }

    // Validate count
    if (count < 1 || count > 10) {
      return res.status(400).json({
        error: 'Count must be between 1 and 10'
      });
    }

    console.log('Generating missions with parameters:', {
      userBackground: userBackground.substring(0, 100) + '...',
      interests,
      industry,
      difficulty,
      count
    });

    // Generate and store missions
    const missionIds = await generateAndStoreMissions(
      userBackground,
      interests,
      industry,
      difficulty,
      count
    );

    res.status(200).json({
      success: true,
      message: `Successfully generated ${missionIds.length} missions`,
      missionIds,
      count: missionIds.length
    });

  } catch (error) {
    console.error('Error generating missions:', error);
    res.status(500).json({
      error: 'Failed to generate missions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}