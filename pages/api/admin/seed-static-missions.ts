// pages/api/admin/seed-static-missions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { staticMissions } from '@/data/staticMissions';
import { storeStaticMission, USE_DUMMY } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Optional simple auth for local use
    const { adminKey, limit } = req.body || {};
    if (process.env.ADMIN_SECRET_KEY && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (USE_DUMMY) {
      return res.status(200).json({
        success: true,
        message: 'Running in dummy mode. No DB writes performed.',
        inserted: 0
      });
    }

    const toInsert = typeof limit === 'number' && limit > 0 ? staticMissions.slice(0, limit) : staticMissions;

    let inserted = 0;
    for (const m of toInsert) {
      // Store without the id/status fields (server generates id, we set status=active in table)
      await storeStaticMission({
        title: m.title,
        description: m.description,
        field: m.field,
        difficulty: m.difficulty,
        timeEstimate: m.timeEstimate,
        category: m.category,
        company: m.company,
        context: m.context,
        skills: m.skills || [],
        industries: m.industries || [],
        tasks: m.tasks || [],
        objectives: m.objectives || [],
        resources: m.resources || [],
        evaluationMetrics: m.evaluationMetrics || []
      });
      inserted += 1;
    }

    return res.status(200).json({ success: true, message: 'Seeded missions into Supabase', inserted });
  } catch (error) {
    console.error('Error seeding static missions:', error);
    return res.status(500).json({ success: false, error: 'Failed to seed missions' });
  }
}
