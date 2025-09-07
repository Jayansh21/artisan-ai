import { TranslationRequest, TranslationResponse, Translation } from '../types/storytelling';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class TranslationService {
  static async translateStory(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Translation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        translations: [],
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const result = await response.json();
      return result.data.language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  static async getTranslationQuota(): Promise<{ used: number; limit: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/translation-quota`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get translation quota');
      }

      const result = await response.json();
      return result.data;
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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