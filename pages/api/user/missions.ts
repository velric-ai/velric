// pages/api/user/missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getPersonalizedMissions, getMissions } from '@/lib/supabaseClient';

interface GetUserMissionsResponse {
  missions: any[];
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserMissionsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      missions: []
    });
  }

  try {
    const { userId, status } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
        missions: []
      });
    }
    
    let missions;
    
    if (status && typeof status === 'string') {
      // Get missions filtered by status (starred, in_progress, completed, etc.)
      missions = await getMissions(status);
    } else {
      // Get all personalized missions for the user
      missions = await getPersonalizedMissions(userId);
    }
    
    res.status(200).json({
      success: true,
      missions: missions || []
    });
  } catch (error) {
    console.error('Error fetching user missions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch missions',
      missions: []
    });
  }
}