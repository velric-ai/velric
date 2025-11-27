// Custom Error Classes
import { EDUCATION_LEVELS, INDUSTRIES, VALID_STRENGTHS } from '@/data/surveyConstants';

export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class HttpError extends AppError {
  constructor(message: string, public status: number, public data?: any) {
    super(message, 'HTTP_ERROR');
    this.name = 'HttpError';
  }
}

export class TimeoutError extends AppError {
  constructor(message: string) {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

export class ServerError extends AppError {
  constructor(message: string) {
    super(message, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

// Field Validation Functions
// Note: EDUCATION_LEVELS, INDUSTRIES, and VALID_STRENGTHS are imported at the top
export const validateFullName = (value: string): string | null => {
  if (!value) return 'Name is required';
  if (typeof value !== 'string') return 'Invalid input';
  
  const trimmed = value.trim();
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 50) return 'Name must be under 50 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Name contains invalid characters';
  
  return null;
};

export const validateEducationLevel = (value: string): string | null => {
  if (!value) return 'Education level is required';
  if (!EDUCATION_LEVELS.includes(value)) return 'Invalid education level';
  
  return null;
};

export const validateIndustry = (value: string): string | null => {
  if (!value) return 'Industry is required';
  if (!INDUSTRIES.includes(value)) return 'Invalid industry';
  
  return null;
};

export const validateMissionFocus = (value: string[], industry: string): string | null => {
  if (!Array.isArray(value)) return 'Invalid selection';
  if (value.length === 0) return 'Please select at least 1 option';
  
  // Validate options based on industry
  const industryOptions = getIndustryOptions(industry);
  const invalidOptions = value.filter(option => !industryOptions.includes(option));
  
  if (invalidOptions.length > 0) {
    return 'Invalid options selected';
  }
  
  return null;
};

export const validateStrengthAreas = (value: string[]): string | null => {
  if (!Array.isArray(value)) return 'Invalid selection';
  if (value.length < 3) return 'Please select at least 3 strengths';
  if (value.length > 9) return 'Please select no more than 9 strengths';
  
  const invalidStrengths = value.filter(strength => !VALID_STRENGTHS.includes(strength));
  if (invalidStrengths.length > 0) {
    return 'Invalid strengths selected';
  }
  
  return null;
};

export const validateLearningPreference = (value: string): string | null => {
  const validPreferences = ['trial-error', 'reading', 'both'];
  
  if (!value) return 'Please select a learning preference';
  if (!validPreferences.includes(value)) return 'Invalid learning preference';
  
  return null;
};

export const validatePortfolioUrl = (value: string): string | null => {
  if (!value) return null; // Optional field
  
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'URL must use HTTP or HTTPS';
    }
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

export const validatePortfolioFile = (file: File | null): string | null => {
  if (!file) return null; // Optional field
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];
  
  if (file.size > maxSize) {
    return `File too large. Maximum size is 10MB, but you uploaded ${(file.size / 1024 / 1024).toFixed(2)}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Supported types: ${allowedExtensions.join(', ')}`;
  }
  
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return `File extension not allowed: ${extension}`;
  }
  
  return null;
};

// Input Sanitization
export const sanitizeInput = (value: string): string => {
  if (typeof value !== 'string') return '';
  
  return value
    .trim()
    .slice(0, 50)
    .replace(/[<>]/g, ''); // Basic XSS prevention
};

export const sanitizeName = (value: string): string => {
  if (typeof value !== 'string') return '';
  
  return value
    .trim()
    .slice(0, 50)
    .replace(/[^a-zA-Z\s'-]/g, '');
};

// Step Validation
export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateStep = (step: number, formData: any): ValidationResult => {
  const errors: { [key: string]: string } = {};
  
  switch (step) {
    case 1: // Basic Info
      const nameError = validateFullName(formData.fullName?.value || '');
      if (nameError) errors.fullName = nameError;
      
      const educationError = validateEducationLevel(formData.educationLevel?.value || '');
      if (educationError) errors.educationLevel = educationError;
      
      const industryError = validateIndustry(formData.industry?.value || '');
      if (industryError) errors.industry = industryError;
      break;
      
    case 2: // Mission Questions
      const missionError = validateMissionFocus(
        formData.missionFocus?.value || [],
        formData.industry?.value || ''
      );
      if (missionError) errors.missionFocus = missionError;
      break;
      
    case 3: // Strength Areas
      const strengthError = validateStrengthAreas(formData.strengthAreas?.value || []);
      if (strengthError) errors.strengthAreas = strengthError;
      break;
      
    case 4: // Learning Preference
      const learningError = validateLearningPreference(formData.learningPreference?.value || '');
      if (learningError) errors.learningPreference = learningError;
      break;
      
    case 5: // Portfolio (Optional)
      if (formData.portfolio?.url) {
        const urlError = validatePortfolioUrl(formData.portfolio.url);
        if (urlError) errors.portfolioUrl = urlError;
      }
      
      if (formData.portfolio?.file) {
        const fileError = validatePortfolioFile(formData.portfolio.file);
        if (fileError) errors.portfolioFile = fileError;
      }
      break;
      
    case 6: // Platform Connections (Optional)
      // No validation required - all optional
      break;
      
    case 7: // Experience Summary
      if (!formData.experienceSummary?.value?.trim()) {
        errors.experienceSummary = 'Experience summary is required';
      }
      break;
      
    case 8: // Logistics & Interview Preferences
      // Current region is required
      if (!formData.logisticsPreferences?.currentRegion?.value) {
        errors.logisticsPreferences = 'Please select your current region';
      }
      // Note: Other fields are optional, but we validate structure
      break;
        errors.experienceSummary = 'Please share your experience and accomplishments';
      break;
      
    default:
      break;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to get industry-specific options
export const getIndustryOptions = (industry: string): string[] => {
  const industryOptionsMap: { [key: string]: string[] } = {
    'Technology & Software': [
      'Cloud Infrastructure (AWS, Azure, GCP)',
      'AI & Machine Learning',
      'Frontend Development (React, Vue, Angular)',
      'Backend Development (Node, Python, Java)',
      'Full Stack Development',
      'DevOps & Infrastructure',
      'Mobile Development (iOS, Android, React Native)',
      'Web3 & Blockchain',
      'Cybersecurity',
      'Game Development'
    ],
    'Finance & Banking': [
      'Trading & Markets',
      'Risk Management',
      'Wealth Management',
      'Corporate Finance',
      'Investment Banking',
      'Fintech & Innovation',
      'Accounting & Audit',
      'Quantitative Analysis'
    ],
    'Product Management': [
      'Consumer Products',
      'B2B SaaS',
      'Growth & Retention',
      'Analytics & Insights',
      'Marketplace',
      'Mobile Apps',
      'Platform Strategy'
    ],
    'Healthcare & Medical': [
      'Clinical Care',
      'Medical Technology',
      'Healthcare Analytics',
      'Public Health',
      'Biotech & Research',
      'Digital Health',
      'Health Administration'
    ],
    'Marketing & Advertising': [
      'Growth Marketing',
      'Content Marketing',
      'Social Media & Community',
      'Brand Strategy',
      'Performance Marketing',
      'Marketing Analytics',
      'Product Marketing'
    ],
    'Education & Learning': [
      'Curriculum Design',
      'EdTech & Learning Platforms',
      'Student Engagement',
      'Instructional Design',
      'Educational Research',
      'Corporate Training'
    ],
    'Design & Creative': [
      'UI/UX Design',
      'Graphic Design',
      'Motion Design',
      'Product Design',
      'Web Design',
      'Branding',
      'Creative Direction'
    ],
    'E-commerce & Retail': [
      'Store Operations',
      'Customer Experience',
      'Logistics & Fulfillment',
      'Merchandising',
      'Growth & Conversion',
      'Marketplace Management'
    ],
    'Data Science & Analytics': [
      'Business Analytics',
      'Data Engineering',
      'Predictive Analytics',
      'Data Visualization',
      'Statistical Analysis',
      'Database Management'
    ],
    'Startup Founder': [
      'Pre-launch / Idea Stage',
      'Early Stage (0-1M ARR)',
      'Growth Stage (1-10M ARR)',
      'Scale Stage (10M+ ARR)'
    ],
    'Other': [
      'Technical/Engineering',
      'Management/Leadership',
      'Sales & Business Development',
      'Operations',
      'Creative/Design',
      'Analytics/Data',
      'Other (specify)'
    ]
  };
  
  return industryOptionsMap[industry] || industryOptionsMap['Other'];
};

/*
// Generate CSRF token for OAuth
export const generateRandomToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
*/

export const generateRandomToken = (): string => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
  } else {
    // Fallback for SSR (Node)
    const nodeCrypto = require("crypto");
    return nodeCrypto.randomBytes(32).toString("hex");
  }
};
