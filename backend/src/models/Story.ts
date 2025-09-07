import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation {
  id: string;
  language: string;
  languageName: string;
  translatedText: string;
  confidence: number;
  createdAt: Date;
}

export interface IStory extends Document {
  userId: string;
  title: string;
  originalText: string;
  originalLanguage: string;
  translations: ITranslation[];
  audioUrl?: string;
  audioMetadata?: {
    duration: number;
    format: string;
    size: number;
  };
  inputType: 'voice' | 'text';
  tags: string[];
  isPublic: boolean;
  metadata: {
    wordCount: number;
    characterCount: number;
    readingTime: number; // in minutes
  };
  engagement: {
    views: number;
    likes: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TranslationSchema = new Schema<ITranslation>({
  id: { type: String, required: true },
  language: { type: String, required: true },
  languageName: { type: String, required: true },
  translatedText: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  createdAt: { type: Date, default: Date.now }
});

const StorySchema = new Schema<IStory>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true
    },
    originalText: {
      type: String,
      required: true,
      maxlength: 10000,
      trim: true
    },
    originalLanguage: {
      type: String,
      required: true,
      default: 'en'
    },
    translations: [TranslationSchema],
    audioUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || v.startsWith('https://');
        },
        message: 'Audio URL must be a valid HTTPS URL'
      }
    },
    audioMetadata: {
      duration: { type: Number },
      format: { type: String },
      size: { type: Number }
    },
    inputType: {
      type: String,
      enum: ['voice', 'text'],
      required: true
    },
    tags: [
      {
        type: String,
        maxlength: 50,
        trim: true
      }
    ],
    isPublic: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      wordCount: { type: Number, default: 0 },
      characterCount: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 }
    },
    engagement: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
StorySchema.index({ userId: 1, createdAt: -1 });
StorySchema.index({ isPublic: 1, createdAt: -1 });
StorySchema.index({ tags: 1 });
StorySchema.index({ 'translations.language': 1 });

// Virtual for translation count
StorySchema.virtual('translationCount').get(function () {
  return this.translations.length;
});

// Pre-save middleware to calculate metadata
StorySchema.pre<IStory>('save', function (next) {
  if (this.isModified('originalText')) {
    const text = this.originalText.trim();
    this.metadata.characterCount = text.length;
    this.metadata.wordCount = text ? text.split(/\s+/).length : 0;
    // Rough estimate: 200 words per minute reading speed
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200);
  }
  next();
});

// Static methods
StorySchema.statics = {
  // Find public stories with pagination
  findPublicStories(page: number = 1, limit: number = 10, filters?: any) {
    const skip = (page - 1) * limit;
    const query = { isPublic: true, ...filters };

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar');
  },

  // Find stories by user
  findByUser(userId: string, includePrivate: boolean = false) {
    const query = includePrivate ? { userId } : { userId, isPublic: true };
    return this.find(query).sort({ createdAt: -1 });
  },

  // Search stories
  searchStories(searchTerm: string, languages?: string[]) {
    const searchRegex = new RegExp(searchTerm, 'i');
    const query: any = {
      isPublic: true,
      $or: [
        { title: searchRegex },
        { originalText: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    };

    if (languages && languages.length > 0) {
      query['translations.language'] = { $in: languages };
    }

    return this.find(query).sort({ createdAt: -1 });
  }
};

// Instance methods
StorySchema.methods = {
  // Add translation
  addTranslation(this: IStory, translation: Omit<ITranslation, 'id' | 'createdAt'>) {
    const newTranslation: ITranslation = {
      ...translation,
      id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date()
    };
    this.translations.push(newTranslation);
    return this.save();
  },

  // Remove translation
  removeTranslation(this: IStory, translationId: string) {
    this.translations = this.translations.filter((t: ITranslation) => t.id !== translationId);
    return this.save();
  },

  // Update translation
  updateTranslation(this: IStory, translationId: string, newText: string) {
    const translation = this.translations.find((t: ITranslation) => t.id === translationId);
    if (translation) {
      translation.translatedText = newText;
      return this.save();
    }
    throw new Error('Translation not found');
  },

  // Increment view count
  incrementViews(this: IStory) {
    this.engagement.views += 1;
    return this.save();
  },

  // Toggle like
  toggleLike(this: IStory) {
    this.engagement.likes += 1;
    return this.save();
  },

  // Increment share count
  incrementShares(this: IStory) {
    this.engagement.shares += 1;
    return this.save();
  }
};

export const Story = mongoose.model<IStory>('Story', StorySchema);
