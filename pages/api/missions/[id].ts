// pages/api/missions/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getMissionById, StaticMission } from '@/data/staticMissions';

interface ApiResponse {
  mission?: StaticMission;
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
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid mission ID'
      });
    }
    
    const mission = getMissionById(id);
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      mission
    });
  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mission'
    });
  }
}