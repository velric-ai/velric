import { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed'
    });
  }

  try {
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const identifier = Array.isArray(clientIp) ? clientIp[0] : clientIp;
    
    if (!checkRateLimit(identifier, 100, 3600000)) { // 100 requests per hour
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.'
      });
    }

    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    const token = authHeader.substring(7);
    if (!token || token === 'undefined') {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      });
    }

    // In a real implementation, query database for user's survey status
    // For demo purposes, return mock data based on token
    
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock survey status - in real app, this would come from database
    const mockSurveyStatus = {
      isCompleted: false,
      onboarded: false,
      lastModified: null,
      data: null
    };

    // Check if user has completed survey (mock logic)
    if (token.includes('completed')) {
      mockSurveyStatus.isCompleted = true;
      mockSurveyStatus.onboarded = true;
      mockSurveyStatus.lastModified = new Date().toISOString();
      mockSurveyStatus.data = {
        fullName: 'John Doe',
        industry: 'Technology & Software',
        completedAt: new Date().toISOString()
      };
    }

    return res.status(200).json({
      success: true,
      userId: token,
      ...mockSurveyStatus
    });

  } catch (error) {
    console.error('Survey status error:', error);
    
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Failed to get survey status. Please try again later.'
    });
  }
}