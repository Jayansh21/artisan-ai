import { SpeechClient } from '@google-cloud/speech';
import { Translate } from '@google-cloud/translate/build/src/v2'; // Named import, not default
import { logger } from '../utils/logger';

// Google Cloud configuration
export interface GoogleCloudConfig {
  projectId: string;
  keyFilename?: string;
  credentials?: any;
}

let speechClient: SpeechClient | null = null;
let translateClient: Translate | null = null; // Proper typing

export const initializeGoogleCloudServices = (): boolean => {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE;
    const credentialsJson = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON;

    if (!projectId) {
      logger.warn(
        'Google Cloud Project ID not configured. Speech and translation services will be unavailable.'
      );
      return false;
    }

    const config: GoogleCloudConfig = { projectId };

    if (credentialsJson) {
      try {
        config.credentials = JSON.parse(credentialsJson);
        logger.info('Using Google Cloud credentials from environment variable');
      } catch (error) {
        logger.error('Failed to parse Google Cloud credentials JSON:', error);
        return false;
      }
    } else if (keyFilename) {
      config.keyFilename = keyFilename;
      logger.info(`Using Google Cloud service account key file: ${keyFilename}`);
    } else {
      logger.info('Using default Google Cloud application credentials');
    }

    // Initialize clients
    try {
      speechClient = new SpeechClient(config as any);
      logger.info('Google Cloud Speech-to-Text client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Speech-to-Text client:', error);
      speechClient = null;
    }

    try {
      translateClient = new Translate(config as any);
      logger.info('Google Cloud Translation client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Translation client:', error);
      translateClient = null;
    }

    return speechClient !== null || translateClient !== null;
  } catch (error) {
    logger.error('Failed to initialize Google Cloud services:', error);
    return false;
  }
};

// Get clients
export const getSpeechClient = (): SpeechClient => {
  if (!speechClient) {
    const initialized = initializeGoogleCloudServices();
    if (!initialized || !speechClient) {
      throw new Error('Google Cloud Speech-to-Text service is not available.');
    }
  }
  return speechClient;
};

export const getTranslateClient = (): Translate => {
  if (!translateClient) {
    const initialized = initializeGoogleCloudServices();
    if (!initialized || !translateClient) {
      throw new Error('Google Cloud Translation service is not available.');
    }
  }
  return translateClient;
};

// Health check
export const checkGoogleCloudHealth = async () => {
  const result = {
    speechToText: { available: false, error: undefined as string | undefined },
    translation: { available: false, error: undefined as string | undefined },
  };

  try {
    getSpeechClient();
    result.speechToText.available = true;
  } catch (error) {
    result.speechToText.error = error instanceof Error ? error.message : 'Unknown error';
  }

  try {
    const client = getTranslateClient();
    await client.getLanguages();
    result.translation.available = true;
  } catch (error) {
    result.translation.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
};

// Supported speech languages
export const SUPPORTED_SPEECH_LANGUAGES = [
  'en-US','es-ES','fr-FR','de-DE','it-IT','pt-PT','ru-RU',
  'ja-JP','ko-KR','zh-CN','ar-SA','hi-IN','bn-IN','ur-PK',
  'tr-TR','pl-PL','nl-NL','sv-SE','da-DK','no-NO'
];

// Audio configs
export const AUDIO_ENCODING_CONFIG = {
  WEBM_OPUS: { encoding: 'WEBM_OPUS' as const, sampleRateHertz: 48000, audioChannelCount: 1 },
  LINEAR16: { encoding: 'LINEAR16' as const, sampleRateHertz: 16000, audioChannelCount: 1 },
  MP3: { encoding: 'MP3' as const, sampleRateHertz: 44100, audioChannelCount: 1 },
};

// Initialize automatically (except for tests)
if (process.env.NODE_ENV !== 'test') {
  initializeGoogleCloudServices();
}