export interface Story {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  originalLanguage: string;
  translations: Translation[];
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface Translation {
  id: string;
  storyId: string;
  language: string;
  languageName: string;
  translatedText: string;
  confidence: number;
  createdAt: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface SpeechToTextResult {
  text: string;
  confidence: number;
  language: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguages: string[];
}

export interface TranslationResponse {
  success: boolean;
  translations: Translation[];
  error?: string;
}

export interface StoryFormData {
  title: string;
  content: string;
  inputType: 'voice' | 'text';
  originalLanguage: string;
  targetLanguages: string[];
  tags: string[];
  isPublic: boolean;
}

export interface AudioProcessingStatus {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}