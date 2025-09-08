import { Translate } from '@google-cloud/translate/build/src/v2';
// Alternative import if above doesn't work:
// import { v2 } from '@google-cloud/translate';

// Create a simple logger if it doesn't exist
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
};

export interface TranslationResult {
  language: string;
  languageName: string;
  translatedText: string;
  confidence: number;
  detectedSourceLanguage?: string;
}

export interface BatchTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguages: string[];
}

export class TranslationService {
  private translate: Translate;
  private languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    bn: 'Bengali',
    ur: 'Urdu',
    tr: 'Turkish',
    pl: 'Polish',
    nl: 'Dutch',
    sv: 'Swedish',
    da: 'Danish',
    no: 'Norwegian',
  };

  constructor() {
    try {
      // Debug: Check environment variables
      logger.info('=== Translation Service Initialization ===');
      logger.info('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID ? 'SET' : 'NOT SET');
      logger.info('GOOGLE_CLOUD_KEY_FILE:', process.env.GOOGLE_CLOUD_KEY_FILE ? 'SET' : 'NOT SET');
      logger.info('GOOGLE_CLOUD_KEY_JSON:', process.env.GOOGLE_CLOUD_KEY_JSON ? 'SET' : 'NOT SET');

      // Validate required environment variables
      if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID is not set in environment variables');
      }

      // Initialize with different credential approaches
      let credentials: any = undefined;
      
      if (process.env.GOOGLE_CLOUD_KEY_JSON) {
        try {
          credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
          logger.info('Using JSON credentials from environment variable');
          
          this.translate = new Translate({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            credentials: credentials
          });
        } catch (parseError) {
          logger.error('Error parsing GOOGLE_CLOUD_KEY_JSON:', parseError);
          throw new Error('Invalid GOOGLE_CLOUD_KEY_JSON format');
        }
      } else if (process.env.GOOGLE_CLOUD_KEY_FILE) {
        logger.info('Using key file from environment variable');
        
        this.translate = new Translate({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
        });
      } else {
        // Try using Application Default Credentials (ADC)
        logger.info('No explicit credentials found, trying Application Default Credentials');
        
        this.translate = new Translate({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        });
      }
      
      // Log successful initialization
      logger.info('Translation service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize translation service:', error);
      throw error;
    }
  }

  // Add a test method to verify the service is working
  async testConnection(): Promise<boolean> {
    try {
      logger.info('Testing Google Translate connection...');
      
      // Test with a simple translation
      const [translation] = await this.translate.translate('Hello', 'es');
      logger.info('Test translation successful:', translation);
      return true;
    } catch (error) {
      logger.error('Connection test failed:', error);
      return false;
    }
  }

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    try {
      logger.info(`Translating text to ${targetLanguage}`);

      // Validate that the service is properly initialized
      if (!this.translate) {
        throw new Error('Translation service not properly initialized');
      }

      const options: any = {
        to: targetLanguage,
        format: 'text',
      };

      if (sourceLanguage && sourceLanguage !== 'auto') {
        options.from = sourceLanguage;
      }

      const [translation, metadata] = await this.translate.translate(text, options);
      
      logger.info(`Translation successful: "${text}" -> "${translation}"`);

      const confidence = this.calculateConfidence(text, translation as string, metadata);

      return {
        language: targetLanguage,
        languageName: this.languageNames[targetLanguage] || targetLanguage,
        translatedText: Array.isArray(translation) ? translation[0] : translation,
        confidence,
        detectedSourceLanguage: metadata?.detectedSourceLanguage || sourceLanguage,
      };
    } catch (error) {
      logger.error(`Translation to ${targetLanguage} failed:`, error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          throw new Error(
            `Translation API access denied. Please ensure:\n` +
            `1. Cloud Translation API is enabled in your Google Cloud project\n` +
            `2. Your service account has the necessary permissions\n` +
            `3. Billing is enabled for your project`
          );
        } else if (error.message.includes('401')) {
          throw new Error(
            `Authentication failed. Please check your Google Cloud credentials.`
          );
        } else if (error.message.includes('400')) {
          throw new Error(
            `Invalid request. Please check the text and language codes.`
          );
        }
      }

      throw new Error(
        `Translation to ${targetLanguage} failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async batchTranslate(
    request: BatchTranslationRequest
  ): Promise<TranslationResult[]> {
    const { text, sourceLanguage, targetLanguages } = request;

    logger.info(`Starting batch translation to ${targetLanguages.length} languages`);

    const results: TranslationResult[] = [];
    const errors: string[] = [];

    const batchSize = 5; // Process 5 translations at a time

    for (let i = 0; i < targetLanguages.length; i += batchSize) {
      const batch = targetLanguages.slice(i, i + batchSize);

      const batchPromises = batch.map(async (targetLang) => {
        try {
          return await this.translateText(text, targetLang, sourceLanguage);
        } catch (error) {
          errors.push(
            `${targetLang}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(
        ...(batchResults.filter((result) => result !== null) as TranslationResult[])
      );

      // Rate limiting - wait between batches
      if (i + batchSize < targetLanguages.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    if (errors.length > 0) {
      logger.warn(`Some translations failed: ${errors.join(', ')}`);
    }

    logger.info(
      `Batch translation completed. ${results.length}/${targetLanguages.length} successful`
    );

    return results;
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      logger.info('Detecting language for text');

      const [detections] = await this.translate.detect(text);
      const detection = Array.isArray(detections) ? detections[0] : detections;

      if (!detection || !detection.language) {
        throw new Error('Could not detect language');
      }

      logger.info(
        `Detected language: ${detection.language} (confidence: ${detection.confidence})`
      );

      return detection.language;
    } catch (error) {
      logger.error('Language detection failed:', error);
      return 'en'; // fallback
    }
  }

  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const [languages] = await this.translate.getLanguages();

      return (languages as Array<{ code: string; name: string }>).map((lang) => ({
        code: lang.code,
        name: lang.name,
      }));
    } catch (error) {
      logger.error('Failed to get supported languages:', error);
      // Return fallback languages if API call fails
      return Object.entries(this.languageNames).map(([code, name]) => ({
        code,
        name,
      }));
    }
  }

  private calculateConfidence(
    originalText: string,
    translatedText: string,
    metadata?: any
  ): number {
    let confidence = 0.85;

    const textLength = originalText.length;
    if (textLength > 500) {
      confidence += 0.05;
    } else if (textLength < 50) {
      confidence -= 0.1;
    }

    const lengthRatio = translatedText.length / originalText.length;
    if (lengthRatio < 0.3 || lengthRatio > 3) {
      confidence -= 0.15;
    }

    if (this.hasTranslationIssues(originalText, translatedText)) {
      confidence -= 0.1;
    }

    return Math.max(0.1, Math.min(1, confidence));
  }

  private hasTranslationIssues(original: string, translated: string): boolean {
    // Check if translation is the same as original (might indicate no translation occurred)
    if (original.toLowerCase() === translated.toLowerCase()) {
      return true;
    }

    // Check for repetitive words (might indicate poor translation)
    const words = translated.split(' ');
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    if (words.length > 10 && uniqueWords.size / words.length < 0.5) {
      return true;
    }

    // Check for HTML entities (might indicate encoding issues)
    if (
      translated.includes('&lt;') ||
      translated.includes('&gt;') ||
      translated.includes('&#')
    ) {
      return true;
    }

    return false;
  }

  async validateTextForTranslation(
    text: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!text || text.trim().length === 0) {
      errors.push('Text cannot be empty');
    }

    if (text.length > 30000) {
      errors.push('Text exceeds maximum length of 30,000 characters');
    }

    if (text.length < 3) {
      errors.push('Text is too short for reliable translation');
    }

    const specialCharRatio =
      (text.match(/[^\w\s.,!?;:-]/g) || []).length / text.length;
    if (specialCharRatio > 0.3) {
      errors.push('Text contains too many special characters or markup');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async getTranslationQuota(): Promise<{
    used: number;
    limit: number;
    remaining: number;
  }> {
    // This is a mock implementation since Google Cloud doesn't provide real-time quota info
    // You would need to implement actual quota tracking based on your usage
    return {
      used: 1250,
      limit: 10000,
      remaining: 8750,
    };
  }

  getCulturalAdaptationSuggestions(
    text: string,
    targetLanguage: string
  ): string[] {
    const suggestions: string[] = [];

    if (text.includes('pottery') && targetLanguage === 'ja') {
      suggestions.push('Consider using "陶芸" (tōgei) for pottery in Japanese context');
    }

    if (text.includes('weaving') && targetLanguage === 'es') {
      suggestions.push(
        'Consider regional variations: "tejeduría" (formal) vs "tejido" (general)'
      );
    }

    if (targetLanguage === 'ar' && text.includes('tradition')) {
      suggestions.push(
        'Consider emphasizing cultural heritage and family traditions'
      );
    }

    if (targetLanguage === 'zh' && text.includes('handmade')) {
      suggestions.push(
        'Emphasize the skill and artistry aspect, which is highly valued in Chinese culture'
      );
    }

    return suggestions;
  }
}