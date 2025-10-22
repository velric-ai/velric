// pages/api/missions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllMissions, StaticMission } from '@/data/staticMissions';
import { getAllMissionsFromDB } from '@/lib/supabaseClient';

interface ApiResponse {
  missions?: StaticMission[];
  error?: string;
  success: boolean;
  source?: 'database' | 'static';
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
    // Optional query param to force source
    const requestedSource = (req.query.source as string) || 'auto';
    
    // Try to get missions from database first, fallback to static (unless forced)
    let missions: StaticMission[] = [];
    let source: 'database' | 'static' = 'database';

    const tryDB = async () => {
      try {
        const dbMissions = await getAllMissionsFromDB();
        if (Array.isArray(dbMissions) && dbMissions.length > 0) {
          missions = dbMissions;
          source = 'database';
          return true;
        }
        return false;
      } catch (dbError) {
        console.warn('Database fetch failed, attempting fallback to static:', dbError);
        return false;
      }
    };

    if (requestedSource === 'database') {
      const ok = await tryDB();
      if (!ok) {
        return res.status(200).json({ success: true, missions: [], source: 'database' });
      }
    } else {
      const ok = await tryDB();
      if (!ok) {
        missions = getAllMissions();
        source = 'static';
      }
    }
    
    res.status(200).json({
      success: true,
      missions,
      source
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch missions'
    });
  }
}