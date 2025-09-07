import { SpeechClient } from '@google-cloud/speech';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface SpeechToTextResult {
  text: string;
  confidence: number;
  language: string;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
}

export class SpeechToTextService {
  private client: SpeechClient;
  private supportedLanguages: string[] = [
    'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-PT', 'ru-RU',
    'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'bn-IN', 'ur-PK',
    'tr-TR', 'pl-PL', 'nl-NL', 'sv-SE', 'da-DK', 'no-NO'
  ];

  constructor() {
    this.client = new SpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    });
  }

  async convertSpeechToText(
    audioBuffer: Buffer,
    language: string = 'en',
    options?: {
      enableWordTimeOffsets?: boolean;
      enableAutomaticPunctuation?: boolean;
      model?: string;
    }
  ): Promise<SpeechToTextResult> {
    try {
      // Map language code to Google Cloud format
      const languageCode = this.mapLanguageCode(language);
      
      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: 'WEBM_OPUS' as const,
          sampleRateHertz: 48000,
          languageCode: languageCode,
          alternativeLanguageCodes: this.getAlternativeLanguages(languageCode),
          enableWordTimeOffsets: options?.enableWordTimeOffsets || false,
          enableAutomaticPunctuation: options?.enableAutomaticPunctuation ?? true,
          model: options?.model || 'default',
          useEnhanced: true,
          // Enable speaker diarization for better accuracy
          diarizationConfig: {
            enableSpeakerDiarization: true,
            minSpeakerCount: 1,
            maxSpeakerCount: 2,
          },
        },
      };

      logger.info(`Starting speech-to-text conversion for language: ${languageCode}`);
      
      const [response] = await this.client.recognize(request);
      
      if (!response.results || response.results.length === 0) {
        throw new Error('No speech detected in the audio');
      }

      // Get the best result
      const result = response.results[0];
      const alternative = result.alternatives?.[0];
      
      if (!alternative) {
        throw new Error('No transcription alternatives found');
      }

      const transcription: SpeechToTextResult = {
        text: alternative.transcript || '',
        confidence: alternative.confidence || 0,
        language: languageCode,
        alternatives: result.alternatives?.slice(1, 4).map(alt => ({
          text: alt.transcript || '',
          confidence: alt.confidence || 0
        }))
      };

      logger.info(`Speech-to-text conversion successful. Confidence: ${transcription.confidence}`);
      
      return transcription;
    } catch (error) {
      logger.error('Speech-to-text conversion failed:', error);
      throw new Error(
        error instanceof Error 
          ? `Speech recognition failed: ${error.message}`
          : 'Speech recognition failed'
      );
    }
  }

  async convertLongAudio(
    audioBuffer: Buffer,
    language: string = 'en'
  ): Promise<SpeechToTextResult> {
    try {
      // For audio longer than 1 minute, use long-running recognition
      const languageCode = this.mapLanguageCode(language);
      
      // First, we need to upload the audio to Google Cloud Storage
      // This is a simplified version - in production you'd want proper GCS integration
      const gcsUri = await this.uploadToCloudStorage(audioBuffer);
      
      const request = {
        audio: {
          uri: gcsUri,
        },
        config: {
          encoding: 'WEBM_OPUS' as const,
          sampleRateHertz: 48000,
          languageCode: languageCode,
          enableAutomaticPunctuation: true,
          model: 'default',
          useEnhanced: true,
        },
      };

      logger.info(`Starting long-running speech-to-text conversion`);
      
      const [operation] = await this.client.longRunningRecognize(request);
      const [response] = await operation.promise();
      
      if (!response.results || response.results.length === 0) {
        throw new Error('No speech detected in the long audio');
      }

      // Combine all results
      const fullTranscription = response.results
        .map(result => result.alternatives?.[0]?.transcript || '')
        .join(' ');
        
      const averageConfidence = response.results.reduce(
        (acc, result) => acc + (result.alternatives?.[0]?.confidence || 0),
        0
      ) / response.results.length;

      return {
        text: fullTranscription,
        confidence: averageConfidence,
        language: languageCode
      };
    } catch (error) {
      logger.error('Long audio speech-to-text conversion failed:', error);
      throw new Error(
        error instanceof Error 
          ? `Long audio recognition failed: ${error.message}`
          : 'Long audio recognition failed'
      );
    }
  }

  private mapLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ur': 'ur-PK',
      'tr': 'tr-TR',
      'pl': 'pl-PL',
      'nl': 'nl-NL',
      'sv': 'sv-SE',
      'da': 'da-DK',
      'no': 'no-NO'
    };

    return languageMap[language] || 'en-US';
  }

  private getAlternativeLanguages(primaryLanguage: string): string[] {
    // Return up to 3 alternative languages that might be detected
    const alternatives = this.supportedLanguages
      .filter(lang => lang !== primaryLanguage)
      .slice(0, 3);
    
    return alternatives;
  }

  private async uploadToCloudStorage(audioBuffer: Buffer): Promise<string> {
    // This is a placeholder implementation
    // In a real application, you would upload to Google Cloud Storage
    // and return the GCS URI
    
    // For now, we'll throw an error indicating this needs to be implemented
    throw new Error('Long audio processing requires Google Cloud Storage setup');
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages.map(lang => lang.split('-')[0]);
  }

  async validateAudioFormat(audioBuffer: Buffer): Promise<boolean> {
    try {
      // Basic validation - check if buffer has content
      if (!audioBuffer || audioBuffer.length === 0) {
        return false;
      }

      // Check minimum size (should be at least a few KB for valid audio)
      if (audioBuffer.length < 1000) {
        return false;
      }

      // Check maximum size (100MB limit)
      if (audioBuffer.length > 100 * 1024 * 1024) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Audio format validation failed:', error);
      return false;
    }
  }

  async estimateProcessingTime(audioBuffer: Buffer): Promise<number> {
    // Rough estimate: processing takes about 10-20% of the audio duration
    // This is a very rough calculation based on file size
    const sizeInMB = audioBuffer.length / (1024 * 1024);
    const estimatedDurationMinutes = sizeInMB / 2; // Rough estimate
    const processingTimeSeconds = estimatedDurationMinutes * 0.15 * 60; // 15% of duration
    
    return Math.max(5, Math.min(300, processingTimeSeconds)); // Between 5 seconds and 5 minutes
  }
}