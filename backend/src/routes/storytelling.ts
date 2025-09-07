import express from 'express';
import multer from 'multer';
import { storytellingController } from '../controllers/storytellingController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { rateLimiters } from '../middleware/rateLimiter'; // Changed from rateLimiter to rateLimiters
import { body, param, query } from 'express-validator';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format. Supported formats: webm, wav, mp3, ogg, m4a'));
    }
  }
});

// Validation middleware
const speechToTextValidation = [
  body('language').optional().isString().isLength({ min: 2, max: 5 })
];

const translateValidation = [
  body('text').notEmpty().isLength({ min: 3, max: 30000 }).withMessage('Text must be between 3 and 30,000 characters'),
  body('sourceLanguage').optional().isString().isLength({ min: 2, max: 5 }),
  body('targetLanguages').isArray({ min: 1 }).withMessage('At least one target language is required'),
  body('targetLanguages.*').isString().isLength({ min: 2, max: 5 })
];

const saveStoryValidation = [
  body('title').notEmpty().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('originalText').notEmpty().isLength({ min: 10, max: 10000 }).withMessage('Content must be between 10 and 10,000 characters'),
  body('originalLanguage').optional().isString().isLength({ min: 2, max: 5 }),
  body('inputType').isIn(['voice', 'text']).withMessage('Input type must be either voice or text'),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().isLength({ max: 50 }),
  body('isPublic').optional().isBoolean(),
  body('audioUrl').optional().isURL({ protocols: ['https'] })
];

const updateStoryValidation = [
  param('id').isMongoId().withMessage('Invalid story ID'),
  body('title').optional().isLength({ min: 1, max: 200 }),
  body('originalText').optional().isLength({ min: 10, max: 10000 }),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString().isLength({ max: 50 }),
  body('isPublic').optional().isBoolean()
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Speech-to-text endpoint
router.post('/speech-to-text',
  rateLimiters.speechToText, // Changed from rateLimiter to rateLimiters
  upload.single('audio'),
  speechToTextValidation,
  validateRequest,
  storytellingController.speechToText
);

// Translation endpoints
router.post('/translate',
  rateLimiters.translation, // Changed from rateLimiter to rateLimiters
  translateValidation,
  validateRequest,
  storytellingController.translateStory
);

router.post('/detect-language',
  rateLimiters.languageDetection, // Changed from rateLimiter to rateLimiters
  [body('text').notEmpty().isLength({ min: 3, max: 1000 })],
  validateRequest,
  storytellingController.detectLanguage
);

// Story CRUD operations
router.post('/',
  rateLimiters.storySave, // Changed from rateLimiter to rateLimiters
  saveStoryValidation,
  validateRequest,
  storytellingController.saveStory
);

router.get('/my-stories',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('includePrivate').optional().isBoolean()
  ],
  validateRequest,
  storytellingController.getUserStories
);

router.get('/public',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('language').optional().isString().isLength({ min: 2, max: 5 }),
    query('tags').optional().custom((value) => {
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return typeof value === 'string' && value.length <= 50;
    })
  ],
  validateRequest,
  storytellingController.getPublicStories
);

router.get('/search',
  [
    query('q').notEmpty().isLength({ min: 1, max: 200 }).withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('languages').optional().custom((value) => {
      if (Array.isArray(value)) {
        return value.every(lang => typeof lang === 'string' && lang.length >= 2 && lang.length <= 5);
      }
      return typeof value === 'string' && value.length >= 2 && value.length <= 5;
    }),
    query('tags').optional().custom((value) => {
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 50);
      }
      return typeof value === 'string' && value.length <= 50;
    })
  ],
  validateRequest,
  storytellingController.searchStories
);

router.get('/:id',
  [param('id').isMongoId().withMessage('Invalid story ID')],
  validateRequest,
  storytellingController.getStory
);

router.put('/:id',
  rateLimiters.storyUpdate, // Changed from rateLimiter to rateLimiters
  updateStoryValidation,
  validateRequest,
  storytellingController.updateStory
);

router.delete('/:id',
  [param('id').isMongoId().withMessage('Invalid story ID')],
  validateRequest,
  storytellingController.deleteStory
);

// Translation management
router.post('/:id/translations',
  rateLimiters.translationSave, // Changed from rateLimiter to rateLimiters
  [
    param('id').isMongoId().withMessage('Invalid story ID'),
    body('translations').isArray({ min: 1 }).withMessage('At least one translation is required'),
    body('translations.*.language').isString().isLength({ min: 2, max: 5 }),
    body('translations.*.languageName').isString().isLength({ min: 2, max: 100 }),
    body('translations.*.translatedText').isString().isLength({ min: 1, max: 30000 }),
    body('translations.*.confidence').isFloat({ min: 0, max: 1 })
  ],
  validateRequest,
  storytellingController.saveTranslation
);

// Utility endpoints
router.get('/utils/supported-languages',
  storytellingController.getSupportedLanguages
);

router.get('/utils/translation-quota',
  storytellingController.getTranslationQuota
);

// Error handling middleware for this router
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Audio file is too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Only one audio file can be uploaded at a time.'
      });
    }
  }

  if (error.message && error.message.includes('Invalid audio format')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Pass to global error handler
  next(error);
});

export default router;