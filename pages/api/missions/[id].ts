// pages/api/missions/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getMissionById, StaticMission } from '@/data/staticMissions';
import { getMissionByIdFromDB, USE_DUMMY } from '@/lib/supabaseClient';
import { dummyMissionStore } from './generate';

interface ApiResponse {
  mission?: StaticMission;
  error?: string;
  success: boolean;
  source?: 'database' | 'static' | 'dummy';
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
    
    let mission: StaticMission | null = null;
    let source: 'database' | 'static' | 'dummy' = 'database';

    // If in dummy mode, check the in-memory store first
    if (USE_DUMMY && dummyMissionStore.has(id)) {
      mission = dummyMissionStore.get(id) || null;
      source = 'dummy';
    } else if (!USE_DUMMY) {
      // Try to get mission from database first
      try {
        mission = await getMissionByIdFromDB(id);
        source = 'database';
      } catch (dbError) {
        console.warn('Database fetch failed:', dbError);
        mission = null;
      }
    }
    
    // If not found in database or dummy store, try static missions
    if (!mission) {
      mission = getMissionById(id) || null;
      source = 'static';
    }
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      mission,
      source
    });
  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mission'
    });
  }
}