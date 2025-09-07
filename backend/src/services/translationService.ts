import { v2 } from '@google-cloud/translate';
import { logger } from '../utils/logger';

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
  private translate: v2.Translate;
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
    this.translate = new v2.Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
  }

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    try {
      logger.info(`Translating text to ${targetLanguage}`);

      const [translation, metadata] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage,
        format: 'text',
      });

      const confidence = this.calculateConfidence(text, translation, metadata);

      return {
        language: targetLanguage,
        languageName: this.languageNames[targetLanguage] || targetLanguage,
        translatedText: Array.isArray(translation) ? translation[0] : translation,
        confidence,
        detectedSourceLanguage: metadata?.detectedSourceLanguage || sourceLanguage,
      };
    } catch (error) {
      logger.error(`Translation to ${targetLanguage} failed:`, error);
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
    if (original.toLowerCase() === translated.toLowerCase()) {
      return true;
    }

    const words = translated.split(' ');
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    if (words.length > 10 && uniqueWords.size / words.length < 0.5) {
      return true;
    }

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
