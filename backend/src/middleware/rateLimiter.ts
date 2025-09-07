import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Note: Express.Request.user is declared in storytellingController.ts
// Only extending with rateLimit property here
declare global {
  namespace Express {
    interface Request {
      rateLimit?: {
        limit: number;
        current: number;
        remaining: number;
        resetTime: number | Date;
      };
    }
  }
}

// Custom key generator for authenticated users
const authKeyGenerator = (req: Request): string => {
  // Ensure we always return a string by providing a fallback
  return req.user?.id ?? req.ip ?? 'anonymous';
};

// Generic rate limit handler
const rateLimitHandler = (req: Request, res: Response) => {
  const timeWindow = req.rateLimit?.resetTime
    ? new Date(req.rateLimit.resetTime)
    : new Date();

  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    details: {
      limit: req.rateLimit?.limit ?? 0,
      current: req.rateLimit?.current ?? 0,
      remaining: req.rateLimit?.remaining ?? 0,
      resetTime: timeWindow.toISOString(),
    },
  });
};

// Speech-to-text rate limiter (CPU intensive)
const speechToText: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each user to 20 requests per windowMs
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many speech-to-text requests. Please try again in 15 minutes.',
  },
});

// Translation rate limiter (API cost intensive)
const translation: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each user to 100 translation requests per hour
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

// Language detection (lighter operation)
const languageDetection: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each user to 50 requests per windowMs
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

// Story save operations
const storySave: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // limit each user to 30 story saves per hour
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

// Story update operations
const storyUpdate: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 updates per hour
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

// Translation save operations
const translationSave: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // limit each user to 200 translation saves per hour
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (for public endpoints)
const general: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler as any,
});

// Strict rate limiter for sensitive operations
const strict: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // very restrictive
  keyGenerator: authKeyGenerator,
  handler: rateLimitHandler as any,
  standardHeaders: true,
  legacyHeaders: false,
});

export const rateLimiters = {
  speechToText,
  translation,
  languageDetection,
  storySave,
  storyUpdate,
  translationSave,
  general,
  strict,
};

// Skip rate limiting for specific conditions (e.g., premium users)
export const createConditionalRateLimit = (
  baseRateLimit: RateLimitRequestHandler,
  skipCondition: (req: Request) => boolean
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (skipCondition(req)) {
      return next();
    }
    return baseRateLimit(req, res, next);
  };
};