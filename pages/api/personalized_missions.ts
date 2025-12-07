// pages/api/personalized_missions.ts
/**
 * DEPRECATED - Use /api/survey-based-missions instead
 * This endpoint is no longer supported.
 * Mission generation now exclusively uses survey_responses data.
 */
import { NextApiRequest, NextApiResponse } from 'next';

interface GeneratePersonalizedMissionsResponse {
  missions: any[];
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratePersonalizedMissionsResponse>
) {
  console.warn('[DEPRECATED] /api/personalized_missions is deprecated. Use /api/survey-based-missions instead.');
  return res.status(410).json({
    success: false,
    error: 'This endpoint is deprecated',
    missions: []
  });
}
