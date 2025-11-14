import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, USE_DUMMY } from '@/lib/supabaseClient';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 3600000): boolean {
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

// Validation schemas
const VALID_EDUCATION_LEVELS = [
  'High School',
  'Some College',
  'Bachelors Degree',
  'Masters Degree',
  'PhD',
  'Self-Taught',
  'Other'
];

const VALID_INDUSTRIES = [
  'Technology & Software',
  'Artificial Intelligence & ML',
  'Finance & Banking',
  'Healthcare & Medical',
  'E-commerce & Retail',
  'Education & Learning',
  'Product Management',
  'Consulting & Services',
  'Marketing & Advertising',
  'Operations & Supply Chain',
  'Data Science & Analytics',
  'Design & Creative',
  'Startup Founder',
  'Government & Public Sector',
  'Non-profit',
  'Transportation & Logistics',
  'Real Estate & Property',
  'Manufacturing',
  'Agriculture & Food',
  'Media & Entertainment',
  'Legal Services',
  'Hospitality & Tourism',
  'Human Resources',
  'Sales & Business Development',
  'Research & Development',
  'Quality Assurance',
  'Customer Support',
  'IT Infrastructure',
  'Other'
];

const VALID_STRENGTHS = [
  'Leadership & Management',
  'Problem Solving',
  'Coding & Development',
  'Design Thinking',
  'Storytelling & Communication',
  'Data Analysis',
  'Marketing Strategy',
  'Technical Communication',
  'Teamwork & Collaboration'
];

const VALID_LEARNING_PREFERENCES = ['trial-error', 'reading', 'both'];

// Validation functions
function validateFullName(name: string): string | null {
  if (!name || typeof name !== 'string') return 'Name is required';
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 50) return 'Name must be under 50 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Name contains invalid characters';
  return null;
}

function validateEducationLevel(level: string): string | null {
  if (!level || !VALID_EDUCATION_LEVELS.includes(level)) {
    return 'Invalid education level';
  }
  return null;
}

function validateIndustry(industry: string): string | null {
  if (!industry || !VALID_INDUSTRIES.includes(industry)) {
    return 'Invalid industry';
  }
  return null;
}

function validateMissionFocus(focus: string[], industry: string): string | null {
  if (!Array.isArray(focus) || focus.length === 0) {
    return 'Please select at least 1 mission focus';
  }
  
  // In a real implementation, validate against industry-specific options
  if (focus.some(item => typeof item !== 'string' || item.length > 100)) {
    return 'Invalid mission focus options';
  }
  
  return null;
}

function validateStrengthAreas(strengths: string[]): string | null {
  if (!Array.isArray(strengths)) return 'Invalid strengths format';
  if (strengths.length < 3) return 'Please select at least 3 strengths';
  if (strengths.length > 9) return 'Please select no more than 9 strengths';
  
  const invalidStrengths = strengths.filter(s => !VALID_STRENGTHS.includes(s));
  if (invalidStrengths.length > 0) {
    return 'Invalid strength selections';
  }
  
  return null;
}

function validateLearningPreference(preference: string): string | null {
  if (!preference || !VALID_LEARNING_PREFERENCES.includes(preference)) {
    return 'Invalid learning preference';
  }
  return null;
}

function validatePortfolioFile(file: any): string | null {
  if (!file) return null; // Optional
  
  if (typeof file !== 'object') return 'Invalid file format';
  
  const { filename, size, type } = file;
  
  if (!filename || typeof filename !== 'string') return 'Invalid filename';
  if (!size || typeof size !== 'number' || size > 10 * 1024 * 1024) {
    return 'File too large (max 10MB)';
  }
  
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (type && !allowedTypes.includes(type)) {
    return 'Invalid file type';
  }
  
  return null;
}

function validatePortfolioUrl(url: string): string | null {
  if (!url) return null; // Optional
  
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must use HTTP or HTTPS';
    }
    return null;
  } catch {
    return 'Invalid URL format';
  }
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 1000); // Prevent extremely long inputs
}

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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
    
    if (!checkRateLimit(identifier, 10, 3600000)) { // 10 requests per hour
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.'
      });
    }

    // Authentication check (simplified for demo)
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

    // Parse and validate request body
    const {
      fullName,
      educationLevel,
      industry,
      missionFocus,
      strengthAreas,
      learningPreference,
      portfolioFile,
      portfolioUrl,
      platformConnections,
      metadata
    } = req.body;

    // Validation errors collection
    const errors: { [key: string]: string } = {};

    // Validate required fields
    const nameError = validateFullName(fullName);
    if (nameError) errors.fullName = nameError;

    const educationError = validateEducationLevel(educationLevel);
    if (educationError) errors.educationLevel = educationError;

    const industryError = validateIndustry(industry);
    if (industryError) errors.industry = industryError;

    const missionError = validateMissionFocus(missionFocus, industry);
    if (missionError) errors.missionFocus = missionError;

    const strengthError = validateStrengthAreas(strengthAreas);
    if (strengthError) errors.strengthAreas = strengthError;

    const learningError = validateLearningPreference(learningPreference);
    if (learningError) errors.learningPreference = learningError;

    // Validate optional fields
    const fileError = validatePortfolioFile(portfolioFile);
    if (fileError) errors.portfolioFile = fileError;

    const urlError = validatePortfolioUrl(portfolioUrl);
    if (urlError) errors.portfolioUrl = urlError;

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName),
      educationLevel: sanitizeInput(educationLevel),
      industry: sanitizeInput(industry),
      missionFocus: Array.isArray(missionFocus) ? missionFocus.map(sanitizeInput) : [],
      strengthAreas: Array.isArray(strengthAreas) ? strengthAreas.map(sanitizeInput) : [],
      learningPreference: sanitizeInput(learningPreference),
      portfolioFile,
      portfolioUrl: portfolioUrl ? sanitizeInput(portfolioUrl) : null,
      platformConnections: platformConnections || {},
      metadata: metadata || {}
    };

    // Get user ID from token (token is the user ID from localStorage)
    const userId = token;

    // Handle dummy mode
    if (USE_DUMMY) {
      const completedAt = new Date().toISOString();
      return res.status(200).json({
        success: true,
        userId,
        message: 'Survey submitted successfully (demo mode - not persisted)',
        profile: {
          onboarded: true,
          completedAt,
          surveyData: sanitizedData
        },
        redirectUrl: '/dashboard',
        completedAt: Date.now()
      });
    }

    // Prepare payload for Supabase
    const payload = {
      user_id: userId,
      full_name: sanitizedData.fullName,
      education_level: sanitizedData.educationLevel,
      industry: sanitizedData.industry,
      mission_focus: sanitizedData.missionFocus,
      strength_areas: sanitizedData.strengthAreas,
      learning_preference: sanitizedData.learningPreference,
      portfolio: {
        file: sanitizedData.portfolioFile,
        url: sanitizedData.portfolioUrl,
      },
      experience_summary: sanitizedData.metadata?.experienceSummary || null,
      platform_connections: sanitizedData.platformConnections,
      metadata: sanitizedData.metadata,
      created_at: new Date().toISOString(),
    };

    // Insert into Supabase survey_responses table
    const { data: surveyData, error: dbError } = await supabase
      .from("survey_responses")
      .insert([payload])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return res.status(500).json({
        success: false,
        code: 'DATABASE_ERROR',
        message: dbError.message || 'Failed to save survey data to database'
      });
    }

    // Update user's onboarded status in users table
    const { error: updateError } = await supabase
      .from("users")
      .update({
        onboarded: true,
        survey_completed_at: new Date().toISOString(),
        profile_complete: true,
      })
      .eq("id", userId);

    if (updateError) {
      console.warn('Failed to update user onboarded status:', updateError);
      // Don't fail the request if user update fails, survey is already saved
    }

    const completedAt = new Date().toISOString();

    // Success response
    return res.status(200).json({
      success: true,
      userId,
      message: 'Survey submitted successfully',
      profile: {
        onboarded: true,
        completedAt,
        surveyData: surveyData || sanitizedData
      },
      redirectUrl: '/dashboard',
      completedAt: Date.now()
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
}