import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

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

// File validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];

function validateFile(file: formidable.File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File is ${(file.size / 1024 / 1024).toFixed(2)}MB but maximum allowed is 10MB`;
  }

  // Check MIME type
  if (file.mimetype && !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return `File type ${file.mimetype} not supported`;
  }

  // Check file extension
  const extension = path.extname(file.originalFilename || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `File extension ${extension} not allowed`;
  }

  return null;
}

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  const sanitizedBaseName = sanitizeFilename(baseName);
  
  return `portfolio_${timestamp}_${random}_${sanitizedBaseName}${extension}`;
}

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
    
    if (!checkRateLimit(identifier, 10, 3600000)) { // 10 uploads per hour
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many upload requests. Please try again later.'
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

    // Parse multipart form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      maxFiles: 1,
      allowEmptyFiles: false,
      filter: ({ mimetype }) => {
        return !mimetype || ALLOWED_MIME_TYPES.includes(mimetype);
      }
    });

    const [fields, files] = await form.parse(req);
    
    // Get the uploaded file
    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_FILE',
        message: validationError,
        allowedTypes: ALLOWED_EXTENSIONS
      });
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.originalFilename || 'portfolio');
    
    // In a real implementation, you would:
    // 1. Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 2. Scan for malware
    // 3. Generate thumbnails for images
    // 4. Store metadata in database
    
    // For demo purposes, simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay

    // Mock successful upload response
    const mockUploadUrl = `https://cdn.velric.com/portfolios/${uniqueFilename}`;
    
    // In production, you would save file metadata to database
    console.log('File upload:', {
      timestamp: new Date().toISOString(),
      userId: token,
      originalName: file.originalFilename,
      filename: uniqueFilename,
      size: file.size,
      type: file.mimetype,
      url: mockUploadUrl
    });

    return res.status(200).json({
      success: true,
      filename: uniqueFilename,
      url: mockUploadUrl,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('File upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('maxFileSize')) {
        return res.status(413).json({
          success: false,
          code: 'FILE_TOO_LARGE',
          message: 'File is too large. Maximum size is 10MB.',
          maxSize: MAX_FILE_SIZE
        });
      }
      
      if (error.message.includes('mimetype')) {
        return res.status(415).json({
          success: false,
          code: 'INVALID_FILE_TYPE',
          message: 'File type not supported',
          allowedTypes: ALLOWED_MIME_TYPES
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      code: 'UPLOAD_ERROR',
      message: 'File upload failed. Please try again.'
    });
  }
}