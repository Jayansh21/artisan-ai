import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Download, RotateCcw } from 'lucide-react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { formatDuration } from '../../utils/audioUtils';

interface VoiceRecorderProps {
  onTranscription: (text: string, confidence: number) => void;
  language: string;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  language,
  disabled = false
}) => {
  const {
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
  } = useSpeechToText();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (transcriptionResult) {
      onTranscription(transcriptionResult.text, transcriptionResult.confidence);
    }
  }, [transcriptionResult, onTranscription]);

  const handleStartRecording = async () => {
    if (disabled) return;
    await startRecording();
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      await convertToText(audioBlob, language);
    }
  };

  const handlePlayPause = () => {
    if (!recordingState.audioUrl) return;

    if (isPlaying) {
      setIsPlaying(false);
      // Pause audio playback logic here
    } else {
      setIsPlaying(true);
      // Start audio playback logic here
    }
  };

  const getRecordingButtonColor = () => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      return 'bg-red-500 hover:bg-red-600';
    }
    if (recordingState.isPaused) {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const getRecordingButtonIcon = () => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      return <MicOff className="w-6 h-6" />;
    }
    if (recordingState.isPaused) {
      return <Mic className="w-6 h-6" />;
    }
    return <Mic className="w-6 h-6" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <button
            onClick={
              recordingState.isRecording
                ? recordingState.isPaused
                  ? resumeRecording
                  : handleStopRecording
                : handleStartRecording
            }
            disabled={disabled || processingStatus.status === 'processing'}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200
              ${getRecordingButtonColor()}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${recordingState.isRecording ? 'animate-pulse' : ''}
            `}
          >
            {getRecordingButtonIcon()}
          </button>
          
          {recordingState.isRecording && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      {recordingState.isRecording && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={recordingState.isPaused ? resumeRecording : pauseRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {recordingState.isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {recordingState.isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={handleStopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}

      {/* Duration Display */}
      <div className="text-center mb-4">
        <div className="text-2xl font-mono text-gray-700">
          {formatDuration(recordingState.duration)}
        </div>
        <div className="text-sm text-gray-500">
          {recordingState.isRecording 
            ? recordingState.isPaused 
              ? 'Recording paused' 
              : 'Recording...' 
            : recordingState.audioBlob 
              ? 'Recording completed' 
              : 'Press record to start'
          }
        </div>
      </div>

      {/* Audio Playback Controls */}
      {recordingState.audioUrl && !recordingState.isRecording && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={() => downloadRecording('my-story.webm')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button
            onClick={resetRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      )}

      {/* Processing Status */}
      {processingStatus.status !== 'idle' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {processingStatus.message}
            </span>
            <span className="text-sm text-gray-500">
              {processingStatus.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                processingStatus.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${processingStatus.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-500 text-sm font-medium">
              Error: {error}
            </div>
          </div>
        </div>
      )}

      {/* Transcription Result */}
      {transcriptionResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Transcription (Confidence: {Math.round(transcriptionResult.confidence * 100)}%)
          </div>
          <div className="text-gray-800 leading-relaxed">
            {transcriptionResult.text}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click the microphone to start recording your craft story. 
        Speak clearly and at a normal pace for best results.
      </div>
    </div>
  );
};

export {};