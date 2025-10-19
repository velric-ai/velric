// pages/api/user/missions/[missionId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserMissionStatus } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { missionId, userId } = req.query;

    if (!missionId || typeof missionId !== 'string') {
      return res.status(400).json({ success: false, error: 'Mission ID is required' });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const userMission = await getUserMissionStatus(userId, missionId);

    res.status(200).json({ 
      success: true, 
      userMission: userMission || null
    });
  } catch (error) {
    console.error('Error fetching user mission status:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch mission status' 
    });
  }
}