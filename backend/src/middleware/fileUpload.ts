import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Extend Express namespace for multer types
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

// Define multer file type interface for better type safety
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Audio file upload configuration
export const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
    fieldNameSize: 100,
    fieldSize: 1024 * 1024, // 1MB for other fields
  },
  fileFilter: (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
    // Allowed MIME types for audio
    const allowedMimeTypes = [
      'audio/webm',
      'audio/wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/ogg',
      'audio/m4a',
      'audio/aac',
      'audio/flac'
    ];

    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const error = new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`);
      (error as any).code = 'INVALID_FILE_TYPE';
      return cb(error);
    }

    // Check file extension (additional security)
    const allowedExtensions = ['.webm', '.wav', '.mp3', '.ogg', '.m4a', '.aac', '.flac'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      const error = new Error(`Invalid file extension: ${fileExtension}. Allowed extensions: ${allowedExtensions.join(', ')}`);
      (error as any).code = 'INVALID_FILE_EXTENSION';
      return cb(error);
    }

    // Additional security: Check if filename contains suspicious patterns
    if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
      const error = new Error('Invalid filename');
      (error as any).code = 'INVALID_FILENAME';
      return cb(error);
    }

    cb(null, true);
  }
});

// Document file upload configuration (for future use)
export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  fileFilter: (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid document type: ${file.mimetype}`);
      (error as any).code = 'INVALID_DOCUMENT_TYPE';
      cb(error);
    }
  }
});

// Image upload configuration (for future use - user avatars, story images)
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid image type: ${file.mimetype}`);
      (error as any).code = 'INVALID_IMAGE_TYPE';
      cb(error);
    }
  }
});

// Define custom error codes type
type MulterErrorCode = 
  | 'LIMIT_PART_COUNT'
  | 'LIMIT_FILE_SIZE'
  | 'LIMIT_FILE_COUNT'
  | 'LIMIT_FIELD_KEY'
  | 'LIMIT_FIELD_VALUE'
  | 'LIMIT_FIELD_COUNT'
  | 'LIMIT_UNEXPECTED_FILE'
  | 'MISSING_FIELD_NAME';

// Error handling middleware for file uploads
export const handleUploadErrors = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    logger.error('Multer upload error:', error);

    // Type assertion to handle the error code properly
    const errorCode = error.code as MulterErrorCode;

    switch (errorCode) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File is too large',
          details: 'Maximum file size exceeded'
        });

      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files',
          details: 'Only one file can be uploaded at a time'
        });

      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many fields in form',
          details: 'Form has too many fields'
        });

      case 'LIMIT_FIELD_VALUE':
        return res.status(400).json({
          success: false,
          message: 'Field value too large',
          details: 'One of the form fields is too large'
        });

      case 'LIMIT_FIELD_KEY':
        return res.status(400).json({
          success: false,
          message: 'Field name too long',
          details: 'Field name exceeds maximum length'
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file',
          details: 'File field name does not match expected field name'
        });

      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many parts',
          details: 'Too many parts in multipart form'
        });

      case 'MISSING_FIELD_NAME':
        return res.status(400).json({
          success: false,
          message: 'Missing field name',
          details: 'Field name is missing'
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          details: error.message || 'Unknown upload error'
        });
    }
  }

  // Handle custom file validation errors
  if (error && error.code) {
    logger.error('File validation error:', error);

    switch (error.code) {
      case 'INVALID_FILE_TYPE':
      case 'INVALID_FILE_EXTENSION':
      case 'INVALID_FILENAME':
      case 'INVALID_DOCUMENT_TYPE':
      case 'INVALID_IMAGE_TYPE':
        return res.status(400).json({
          success: false,
          message: 'Invalid file',
          details: error.message
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          details: error.message
        });
    }
  }

  // Pass to next error handler if not a file upload error
  next(error);
};

// File validation utilities
export const validateAudioFile = (file: MulterFile | undefined): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Check file size (redundant with multer but good for explicit validation)
  if (file.size > 50 * 1024 * 1024) {
    errors.push('File size exceeds 50MB limit');
  }

  // Check minimum file size (empty files or too small to be valid audio)
  if (file.size < 1000) {
    errors.push('File is too small to be valid audio');
  }

  // Validate buffer content
  if (!file.buffer || file.buffer.length === 0) {
    errors.push('File has no content');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Get human-readable file size
export const getFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

// Audio file metadata extraction (basic)
export const getAudioMetadata = (file: MulterFile) => {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    sizeFormatted: getFileSize(file.size),
    uploadedAt: new Date().toISOString()
  };
};

// Middleware factory for single file upload with custom field name
export const createSingleFileUpload = (fieldName: string, uploadConfig: multer.Multer) => {
  return uploadConfig.single(fieldName);
};

// Middleware factory for multiple files upload
export const createMultipleFilesUpload = (fieldName: string, maxCount: number, uploadConfig: multer.Multer) => {
  return uploadConfig.array(fieldName, maxCount);
};

// Common upload middleware configurations
export const uploadMiddleware = {
  audio: audioUpload.single('audio'),
  document: documentUpload.single('document'),
  image: imageUpload.single('image'),
  
  // For multiple file uploads (if needed)
  multipleAudio: audioUpload.array('audio', 5),
  multipleImages: imageUpload.array('images', 10)
};