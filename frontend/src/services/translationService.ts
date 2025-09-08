import { TranslationRequest, TranslationResponse, Translation } from '../types/storytelling';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class TranslationService {
  static async translateStory(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      // Simple translation call to match your backend controller
      const response = await fetch(`${API_BASE_URL}/storytelling/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove auth for now since backend doesn't handle it yet
        },
        body: JSON.stringify({
          text: request.text,
          targetLanguage: request.targetLanguages[0] // For now, translate to first language
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Translation failed' }));
        throw new Error(error.error || 'Translation failed');
      }

      const result = await response.json();
      
      // Transform backend response to match frontend expected format
      return {
        success: true,
        translations: [{
          id: `temp-${Date.now()}`, // Temporary ID
          storyId: '', // Empty for now, will be set when saving
          language: result.targetLanguage,
          languageName: this.getLanguageName(result.targetLanguage),
          translatedText: result.translatedText,
          confidence: 0.9, // Default confidence since backend doesn't return it
          createdAt: new Date() // Current timestamp
        }],
        error: undefined
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        success: false,
        translations: [],
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  // Helper method to get language names
  private static getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
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
    };
    return languageNames[code] || code;
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const result = await response.json();
      return result.data?.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  static async getTranslationQuota(): Promise<{ used: number; limit: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/translation-quota`);

      if (!response.ok) {
        throw new Error('Failed to get translation quota');
      }

      const result = await response.json();
      return result.data || { used: 0, limit: 1000 };
    } catch (error) {
      console.error('Error getting translation quota:', error);
      return { used: 0, limit: 1000 }; // Default values
    }
  }

  static async saveTranslations(storyId: string, translations: Translation[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/${storyId}/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ translations })
      });

      if (!response.ok) {
        throw new Error('Failed to save translations');
      }
    } catch (error) {
      console.error('Error saving translations:', error);
      throw error;
    }
  }

  static validateText(text: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!text || text.trim().length === 0) {
      errors.push('Text cannot be empty');
    }
    
    if (text.length > 10000) {
      errors.push('Text is too long (maximum 10,000 characters)');
    }
    
    if (text.length < 10) {
      errors.push('Text is too short (minimum 10 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}