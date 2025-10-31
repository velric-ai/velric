// pages/api/user/missions/start.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserMissionStatus } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { userId, missionId } = req.body;

    if (!userId || !missionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and Mission ID are required' 
      });
    }

    // Update mission status to 'in_progress'
    const userMission = await updateUserMissionStatus(userId, missionId, 'start');

    res.status(200).json({ 
      success: true, 
      userMission,
      message: 'Mission started successfully' 
    });
  } catch (error) {
    console.error('Error starting mission:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to start mission' 
    });
  }
}