// Audio utilities for voice recording and processing
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

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not start recording. Please check microphone permissions.');
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (error) => {
        this.cleanup();
        reject(error);
      };

      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording' || false;
  }

  isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused' || false;
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const createAudioURL = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeAudioURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const downloadAudio = (blob: Blob, filename: string): void => {
  const url = createAudioURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  revokeAudioURL(url);
};

export const validateAudioFile = (file: File): boolean => {
  const allowedTypes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  return allowedTypes.includes(file.type);
};

export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = () => {
      reject(new Error('Could not load audio file'));
    };
    audio.src = URL.createObjectURL(file);
  });
};