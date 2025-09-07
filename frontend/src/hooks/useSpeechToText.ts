import { useState, useCallback, useRef } from 'react';
import { VoiceRecordingState, SpeechToTextResult, AudioProcessingStatus } from '../types/storytelling';
import { AudioRecorder } from '../utils/audioUtils';
import { SpeechService } from '../services/speechService';

export const useSpeechToText = () => {
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null
  });

  const [processingStatus, setProcessingStatus] = useState<AudioProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const [transcriptionResult, setTranscriptionResult] = useState<SpeechToTextResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      await recorderRef.current.startRecording();
      
      startTimeRef.current = Date.now();
      setRecordingState(prev => ({ ...prev, isRecording: true, isPaused: false }));

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setRecordingState(prev => ({ ...prev, duration: elapsed }));
      }, 100);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      const audioBlob = await recorderRef.current.stopRecording();
      const audioUrl = URL.createObjectURL(audioBlob);

      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioBlob,
        audioUrl
      }));

      return audioBlob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      return null;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    recorderRef.current.pauseRecording();
    setRecordingState(prev => ({ ...prev, isPaused: true }));

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const resumeRecording = useCallback(() => {
    recorderRef.current.resumeRecording();
    setRecordingState(prev => ({ ...prev, isPaused: false }));

    // Resume duration timer
    const pausedDuration = recordingState.duration;
    startTimeRef.current = Date.now() - (pausedDuration * 1000);
    
    durationIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setRecordingState(prev => ({ ...prev, duration: elapsed }));
    }, 100);
  }, [recordingState.duration]);

  const convertToText = useCallback(async (audioBlob: Blob, language: string = 'en') => {
    try {
      setError(null);
      setTranscriptionResult(null);
      
      const result = await SpeechService.convertSpeechToText(
        audioBlob,
        language,
        setProcessingStatus
      );
      
      setTranscriptionResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert speech to text';
      setError(errorMessage);
      setProcessingStatus({
        status: 'error',
        progress: 0,
        message: errorMessage
      });
      return null;
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    if (recordingState.audioUrl) {
      URL.revokeObjectURL(recordingState.audioUrl);
    }

    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null
    });

    setTranscriptionResult(null);
    setProcessingStatus({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setError(null);
  }, [recordingState.audioUrl]);

  const downloadRecording = useCallback((filename?: string) => {
    if (recordingState.audioBlob) {
      const url = URL.createObjectURL(recordingState.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [recordingState.audioBlob]);

  return {
    recordingState,
    processingStatus,
    transcriptionResult,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    convertToText,
    resetRecording,
    downloadRecording
  };
};