// pages/api/missions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getMissions } from '@/lib/supabaseClient';
import { MissionTemplate } from '@/types';

interface ApiResponse {
  missions?: MissionTemplate[];
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
    const { status } = req.query;
    const statusFilter = typeof status === 'string' ? status : undefined;
    
    const missions = await getMissions(statusFilter);
    
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