import { Request, Response } from 'express';
import { SpeechToTextService } from '../services/speechToTextService';
import { TranslationService } from '../services/translationService';
import { Story } from '../models/Story';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

// Extend Express Request interface to include user (file is already defined by multer types)
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

const speechService = new SpeechToTextService();
const translationService = new TranslationService();

// Add the simple translateText function as required by the step guide
export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const translation = await translationService.translateText(text, targetLanguage);
    
    res.json({ 
      originalText: text,
      translatedText: translation,
      targetLanguage 
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Translation failed' });
  }
};

export const storytellingController = {
  // Convert speech to text
  async speechToText(req: Request, res: Response) {
    try {
      const { language = 'en' } = req.body;
      const audioFile = req.file;

      if (!audioFile) {
        return res.status(400).json({
          success: false,
          message: 'Audio file is required'
        });
      }

      // Validate audio format
      const isValidFormat = await speechService.validateAudioFormat(audioFile.buffer);
      if (!isValidFormat) {
        return res.status(400).json({
          success: false,
          message: 'Invalid audio format or file too large'
        });
      }

      logger.info(`Processing speech-to-text for user ${req.user?.id}`);

      const result = await speechService.convertSpeechToText(
        audioFile.buffer,
        language,
        {
          enableAutomaticPunctuation: true,
          enableWordTimeOffsets: false
        }
      );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      logger.error('Speech-to-text conversion error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Speech processing failed'
      });
    }
  },

  // Translate story text
  async translateStory(req: Request, res: Response) {
    try {
      const { text, sourceLanguage, targetLanguages } = req.body;

      if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
        return res.status(400).json({
          success: false,
          message: 'Text and target languages are required'
        });
      }

      // Validate text
      const validation = await translationService.validateTextForTranslation(text);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.errors.join(', ')
        });
      }

      logger.info(`Translating story for user ${req.user?.id} to ${targetLanguages.length} languages`);

      const translations = await translationService.batchTranslate({
        text,
        sourceLanguage: sourceLanguage || 'en',
        targetLanguages
      });

      res.json({
        success: true,
        translations: translations.map(t => ({
          id: new mongoose.Types.ObjectId().toString(),
          storyId: '', // Will be set when story is saved
          language: t.language,
          languageName: t.languageName,
          translatedText: t.translatedText,
          confidence: t.confidence,
          createdAt: new Date()
        }))
      });

    } catch (error) {
      logger.error('Translation error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Translation failed',
        translations: []
      });
    }
  },

  // Detect text language
  async detectLanguage(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          message: 'Text is required'
        });
      }

      const detectedLanguage = await translationService.detectLanguage(text);

      res.json({
        success: true,
        data: { language: detectedLanguage }
      });

    } catch (error) {
      logger.error('Language detection error:', error);
      res.status(500).json({
        success: false,
        message: 'Language detection failed',
        data: { language: 'en' } // Default fallback
      });
    }
  },

  // Save story
  async saveStory(req: Request, res: Response) {
    try {
      const {
        title,
        originalText,
        originalLanguage,
        translations = [],
        inputType,
        tags = [],
        isPublic = false,
        audioUrl
      } = req.body;

      if (!title || !originalText) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      const story = new Story({
        userId: req.user?.id,
        title,
        originalText,
        originalLanguage: originalLanguage || 'en',
        translations,
        inputType: inputType || 'text',
        tags,
        isPublic,
        audioUrl
      });

      await story.save();

      logger.info(`Story saved for user ${req.user?.id}: ${story._id}`);

      res.status(201).json({
        success: true,
        data: story
      });

    } catch (error) {
      logger.error('Save story error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save story'
      });
    }
  },

  // Get user stories
  async getUserStories(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user?.id;
      const skip = (Number(page) - 1) * Number(limit);

      const query = { userId };

      const stories = await Story.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name avatar');

      const total = await Story.countDocuments(query);

      res.json({
        success: true,
        data: {
          stories,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });

    } catch (error) {
      logger.error('Get user stories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user stories'
      });
    }
  },

  // Get public stories
  async getPublicStories(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, language, tags } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      let query: any = { isPublic: true };

      if (language) {
        query.$or = [
          { originalLanguage: language },
          { 'translations.language': language }
        ];
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      const stories = await Story.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name avatar');

      const total = await Story.countDocuments(query);

      res.json({
        success: true,
        data: {
          stories,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });

    } catch (error) {
      logger.error('Get public stories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch public stories'
      });
    }
  },

  // Get single story
  async getStory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid story ID'
        });
      }

      const story = await Story.findById(id).populate('userId', 'name avatar');

      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }

      // Check if user has permission to view this story
      if (!story.isPublic && story.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Increment view count if viewing someone else's public story
      if (story.isPublic && story.userId.toString() !== userId) {
        // Assuming the Story model has a method to increment views
        await Story.findByIdAndUpdate(id, { $inc: { 'engagement.views': 1 } });
      }

      res.json({
        success: true,
        data: story
      });

    } catch (error) {
      logger.error('Get story error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch story'
      });
    }
  },

  // Update story
  async updateStory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid story ID'
        });
      }

      const story = await Story.findById(id);

      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }

      // Check if user owns this story
      if (story.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Update allowed fields
      const allowedUpdates = ['title', 'originalText', 'tags', 'isPublic', 'translations'];
      const updateData: any = {};

      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      });

      const updatedStory = await Story.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      logger.info(`Story updated by user ${userId}: ${id}`);

      res.json({
        success: true,
        data: updatedStory
      });

    } catch (error) {
      logger.error('Update story error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update story'
      });
    }
  },

  // Delete story
  async deleteStory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid story ID'
        });
      }

      const story = await Story.findById(id);

      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }

      // Check if user owns this story
      if (story.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await Story.findByIdAndDelete(id);

      logger.info(`Story deleted by user ${userId}: ${id}`);

      res.json({
        success: true,
        message: 'Story deleted successfully'
      });

    } catch (error) {
      logger.error('Delete story error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete story'
      });
    }
  },

  // Add/Update translation
  async saveTranslation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { translations } = req.body;
      const userId = req.user?.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid story ID'
        });
      }

      const story = await Story.findById(id);

      if (!story) {
        return res.status(404).json({
          success: false,
          message: 'Story not found'
        });
      }

      // Check if user owns this story
      if (story.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Add translations
      if (Array.isArray(translations)) {
        const updatedStory = await Story.findByIdAndUpdate(
          id,
          { $push: { translations: { $each: translations } } },
          { new: true, runValidators: true }
        );
        
        res.json({
          success: true,
          data: updatedStory
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Translations must be an array'
        });
      }

    } catch (error) {
      logger.error('Save translation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save translation'
      });
    }
  },

  // Get supported languages
  async getSupportedLanguages(req: Request, res: Response) {
    try {
      const languages = await translationService.getSupportedLanguages();

      res.json({
        success: true,
        data: languages
      });

    } catch (error) {
      logger.error('Get supported languages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch supported languages'
      });
    }
  },

  // Get translation quota
  async getTranslationQuota(req: Request, res: Response) {
    try {
      const quota = await translationService.getTranslationQuota();

      res.json({
        success: true,
        data: quota
      });

    } catch (error) {
      logger.error('Get translation quota error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch translation quota'
      });
    }
  },

  // Search stories
  async searchStories(req: Request, res: Response) {
    try {
      const { q, languages, tags, page = 1, limit = 10 } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const searchRegex = new RegExp(q, 'i');
      const skip = (Number(page) - 1) * Number(limit);

      let query: any = {
        isPublic: true,
        $or: [
          { title: searchRegex },
          { originalText: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      };

      // Filter by languages
      if (languages) {
        const langArray = Array.isArray(languages) ? languages : [languages];
        query.$and = [
          query.$or ? { $or: query.$or } : {},
          {
            $or: [
              { originalLanguage: { $in: langArray } },
              { 'translations.language': { $in: langArray } }
            ]
          }
        ];
        delete query.$or;
      }

      // Filter by tags
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      const stories = await Story.find(query)
        .sort({ 
          // Boost stories with more engagement
          'engagement.views': -1,
          'engagement.likes': -1,
          createdAt: -1 
        })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name avatar');

      const total = await Story.countDocuments(query);

      res.json({
        success: true,
        data: {
          stories,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          },
          searchQuery: q
        }
      });

    } catch (error) {
      logger.error('Search stories error:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed'
      });
    }
  }
};