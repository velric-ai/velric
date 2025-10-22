// pages/api/missions/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { StaticMission } from '@/data/staticMissions';
import { generateComprehensiveMission } from '@/lib/ai';
import { storeAIGeneratedMission, USE_DUMMY } from '@/lib/supabaseClient';

interface GenerateBody {
  userBackground?: string;
  interests?: string[];
  industry?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  count?: number;
}

// In-memory store for dummy mode missions (so they can be retrieved later)
const dummyMissionStore = new Map<string, StaticMission>();

export { dummyMissionStore }; // Export for use in [id].ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      userBackground = 'Motivated developer interested in web and AI, familiar with React/Next.js and Node.js.',
      interests = ['AI','SaaS','Productivity'],
      industry = 'SaaS',
      difficulty = 'Intermediate',
      count = 3
    } = (req.body || {}) as GenerateBody;

    const safeCount = Math.min(Math.max(count, 1), 5);

    const generated: StaticMission[] = [];
    const storedIds: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      try {
        const m = await generateComprehensiveMission(userBackground, interests, industry, difficulty, `${2 + i}-${6 + i} hours`);
        generated.push(m);
      } catch (error) {
        console.error(`Error generating mission ${i + 1}:`, error);
        // Fall back to detailed template-based mission instead of failing
        const fallbackMission = generateFallbackMission(industry || 'Technology', difficulty || 'intermediate');
        generated.push(fallbackMission);
      }

      // If DB is available, store each mission and replace id with DB id for consistency
      if (!USE_DUMMY) {
        try {
          const dbId = await storeAIGeneratedMission({
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
          storedIds.push(dbId);
          // Map returned mission id to the DB id so the client can navigate
          m.id = dbId;
        } catch (e) {
          // If storing fails, still return the generated mission with the temporary id
          // Log and continue
          console.error('Failed to store generated mission:', e);
        }
      } else {
        // In dummy mode, store in memory so missions can be retrieved by ID
        dummyMissionStore.set(m.id, m);
        storedIds.push(m.id);
      }
    }

    return res.status(200).json({ success: true, missions: generated, storedIds, usedDatabase: !USE_DUMMY });
  } catch (error) {
    console.error('Error generating missions:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate missions' });
  }
}
