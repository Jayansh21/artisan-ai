import { SpeechToTextResult, AudioProcessingStatus } from '../types/storytelling';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class SpeechService {
  static async convertSpeechToText(
    audioBlob: Blob,
    language: string = 'en',
    onProgress?: (status: AudioProcessingStatus) => void
  ): Promise<SpeechToTextResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);

    try {
      onProgress?.({
        status: 'processing',
        progress: 0,
        message: 'Uploading audio...'
      });

      const response = await fetch(`${API_BASE_URL}/storytelling/speech-to-text`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process audio');
      }

      onProgress?.({
        status: 'processing',
        progress: 50,
        message: 'Processing audio...'
      });

      const result = await response.json();

      onProgress?.({
        status: 'completed',
        progress: 100,
        message: 'Audio processed successfully'
      });

      return result.data;
    } catch (error) {
      onProgress?.({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Processing failed'
      });
      throw error;
    }
  }

  static async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/storytelling/supported-languages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supported languages');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      // Return default languages if API fails
      return ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
    }
  }

  static async testMicrophone(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone test failed:', error);
      return false;
    }
  }

  static async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Error getting audio devices:', error);
      return [];
    }
  }
}