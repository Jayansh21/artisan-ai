import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { logger } from '../utils/logger';

interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
    location?: string;
  }>;
}

// Middleware to validate requests using express-validator
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg,
      value: 'value' in error ? error.value : undefined,
      location: (error as any)?.location
    }));

    logger.warn('Validation failed:', {
      url: req.url,
      method: req.method,
      errors: formattedErrors,
      userId: req.user?.id
    });

    const response: ValidationErrorResponse = {
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    };

    return res.status(400).json(response);
  }

  next();
};

// Alternative validation middleware that logs more details
export const validateRequestWithLogging = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg,
      value: 'value' in error ? error.value : undefined,
      location: (error as any)?.location
    }));

    logger.warn('Request validation failed:', {
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      errors: formattedErrors,
      userId: req.user?.id,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      message: 'Request validation failed',
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });
  }

  if (process.env.NODE_ENV === 'development') {
    logger.debug('Request validation passed:', {
      url: req.url,
      method: req.method,
      userId: req.user?.id
    });
  }

  next();
};

// Custom business rules validation
export const validateBusinessRules = (req: Request, res: Response, next: NextFunction) => {
  const businessErrors: string[] = [];

  // Example business rules
  if (req.body.inputType === 'voice' && !req.file && !req.body.audioUrl) {
    businessErrors.push('Audio file or audio URL is required for voice input type');
  }

  if (req.body.isPublic && req.body.tags && req.body.tags.length === 0) {
    businessErrors.push('Public stories must have at least one tag');
  }

  if (req.body.targetLanguages && req.body.sourceLanguage) {
    if (req.body.targetLanguages.includes(req.body.sourceLanguage)) {
      businessErrors.push('Target languages cannot include the source language');
    }
  }

  if (businessErrors.length > 0) {
    logger.warn('Business rule validation failed:', {
      url: req.url,
      method: req.method,
      errors: businessErrors,
      userId: req.user?.id
    });

    return res.status(400).json({
      success: false,
      message: 'Business rule validation failed',
      errors: businessErrors.map(error => ({
        field: 'business_rule',
        message: error,
        location: 'body'
      }))
    });
  }

  next();
};

// Middleware to sanitize input data
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};
