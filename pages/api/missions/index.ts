// pages/api/missions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllMissions, StaticMission } from '@/data/staticMissions';

interface ApiResponse {
  missions?: StaticMission[];
  error?: string;
  success: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const missions = getAllMissions();
    
    res.status(200).json({
      success: true,
      missions
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch missions'
    });
  }
}