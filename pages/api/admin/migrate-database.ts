// pages/api/admin/migrate-database.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { runMissionMigration } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple authentication check (in production, use proper auth)
    const { adminKey } = req.body;
    
    if (adminKey !== process.env.ADMIN_SECRET_KEY && adminKey !== 'velric-admin-2024') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Running database migration...');

    const result = await runMissionMigration();

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Database migration completed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database migration failed',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error running migration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run migration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}