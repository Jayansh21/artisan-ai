import React, { useState, useEffect, useCallback } from 'react';
import { Type, FileText, Save, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  autoDetectLanguage?: boolean;
  onLanguageDetected?: (language: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "Tell us about your craft, your journey, your inspiration... Share what makes your work special and meaningful.",
  minLength = 10,
  maxLength = 10000,
  disabled = false,
  autoDetectLanguage = true,
  onLanguageDetected
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedValue, setSavedValue] = useState('');

  // Update counts when value changes
  useEffect(() => {
    setCharacterCount(value.length);
    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    setHasUnsavedChanges(value !== savedValue);
  }, [value, savedValue]);

  // Auto-save functionality
  const handleSave = useCallback(() => {
    setSavedValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  const handleReset = useCallback(() => {
    onChange(savedValue);
    setHasUnsavedChanges(false);
  }, [savedValue, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setHasUnsavedChanges(true);
  }, [onChange]);

  const getValidationStatus = () => {
    if (characterCount === 0) return { status: 'empty', message: 'Start typing your story...' };
    if (characterCount < minLength) return { status: 'too-short', message: `Minimum ${minLength} characters required` };
    if (characterCount > maxLength) return { status: 'too-long', message: `Maximum ${maxLength} characters allowed` };
    return { status: 'valid', message: 'Looking good!' };
  };

  const validation = getValidationStatus();

  const getProgressColor = () => {
    switch (validation.status) {
      case 'too-short': return 'bg-yellow-500';
      case 'too-long': return 'bg-red-500';
      case 'valid': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getProgressWidth = () => {
    if (characterCount === 0) return 0;
    if (characterCount > maxLength) return 100;
    return Math.min((characterCount / maxLength) * 100, 100);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 leading-relaxed">
        {paragraph || <br />}
      </p>
    ));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">Your Story</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          
          {hasUnsavedChanges && (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {isPreview ? (
        // Preview Mode
        <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
          {value ? (
            <div className="prose max-w-none text-gray-800">
              {formatText(value)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <FileText className="w-8 h-8 mr-2" />
              No content to preview
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              ${validation.status === 'too-long' ? 'border-red-300' : ''}
            `}
            style={{ fontSize: '16px', lineHeight: '1.5' }}
          />
          
          {/* Character limit indicator */}
          {characterCount > maxLength * 0.8 && (
            <div className={`
              absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium
              ${validation.status === 'too-long' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}
            `}>
              {characterCount}/{maxLength}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{validation.message}</span>
          <span>{characterCount} characters, {wordCount} words</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${getProgressWidth()}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 font-medium">
              • Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            disabled={disabled || characterCount === 0}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
          
          <span className="text-gray-300">|</span>
          
          <div className="text-sm text-gray-500">
            {validation.status === 'valid' ? 'Ready to translate' : 'Keep writing...'}
          </div>
        </div>
      </div>

      {/* Writing Tips */}
      {characterCount < 50 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Writing Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Share your craft's history and cultural significance</li>
            <li>• Describe your creative process and techniques</li>
            <li>• Tell about what inspires your work</li>
            <li>• Mention the materials and tools you use</li>
            <li>• Include your journey as an artisan</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export {};