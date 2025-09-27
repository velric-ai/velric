// pages/api/user_missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserMissionStatus } from '@/lib/supabaseClient';
import { UserMissionActionRequest, UserMissionActionResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserMissionActionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      userMission: {} as any
    });
  }

  try {
    const { userId, missionId, action }: UserMissionActionRequest = req.body;
    
    // Validation
    if (!userId || !missionId || !action) {
      return res.status(400).json({
        success: false,
        error: 'userId, missionId, and action are required',
        userMission: {} as any
      });
    }
    
    if (!['star', 'start', 'submit', 'complete'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be one of: star, start, submit, complete',
        userMission: {} as any
      });
    }
    
    // Update user mission status
    const userMission = await updateUserMissionStatus(userId, missionId, action);
    
    res.status(200).json({
      success: true,
      userMission
    });
  } catch (error) {
    console.error('Error updating user mission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user mission',
      userMission: {} as any
    });
  }
}