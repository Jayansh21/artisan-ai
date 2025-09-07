import React, { useState, useEffect } from 'react';
import { Mic, Type, Globe, Save, Share2, BookOpen } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { TextInput } from './TextInput';
import { LanguageSelector } from './LanguageSelector';
import { TranslationResults } from './TranslationResults';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationService } from '../../services/translationService';
import { StoryFormData } from '../../types/storytelling';
import { CRAFT_TAGS } from '../../utils/languageConstants';

export const StorytellingDashboard: React.FC = () => {
  const [activeInputType, setActiveInputType] = useState<'voice' | 'text'>('voice');
  const [storyData, setStoryData] = useState<StoryFormData>({
    title: '',
    content: '',
    inputType: 'voice',
    originalLanguage: 'en',
    targetLanguages: [],
    tags: [],
    isPublic: false
  });

  const {
    translations,
    isTranslating,
    error: translationError,
    translationProgress,
    translateText,
    detectLanguage,
    updateTranslation,
    removeTranslation,
    clearTranslations,
    downloadExport
  } = useTranslation();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Auto-detect language when content changes
  useEffect(() => {
    if (storyData.content.length > 50) {
      detectLanguage(storyData.content).then(detectedLang => {
        if (detectedLang !== storyData.originalLanguage) {
          setStoryData(prev => ({ ...prev, originalLanguage: detectedLang }));
        }
      });
    }
  }, [storyData.content, detectLanguage, storyData.originalLanguage]);

  const handleVoiceTranscription = (text: string, confidence: number) => {
    setStoryData(prev => ({
      ...prev,
      content: text,
      inputType: 'voice'
    }));
  };

  const handleTextChange = (text: string) => {
    setStoryData(prev => ({
      ...prev,
      content: text,
      inputType: 'text'
    }));
  };

  const handleLanguageSelection = (languages: string[]) => {
    setStoryData(prev => ({
      ...prev,
      targetLanguages: languages
    }));
  };

  const handleTranslate = async () => {
    if (!storyData.content.trim()) {
      alert('Please enter your story first');
      return;
    }

    if (storyData.targetLanguages.length === 0) {
      alert('Please select at least one target language');
      return;
    }

    const validation = TranslationService.validateText(storyData.content);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    await translateText({
      text: storyData.content,
      sourceLanguage: storyData.originalLanguage,
      targetLanguages: storyData.targetLanguages
    });
  };

  const handleSaveStory = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Here you would typically save to your backend
      // For now, we'll simulate a save operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // You would make an API call here like:
      // await StoryService.saveStory(storyData, translations);
      
      console.log('Story saved:', { storyData, translations });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save story');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const canTranslate = storyData.content.trim().length >= 10 && storyData.targetLanguages.length > 0;
  const canSave = storyData.content.trim().length >= 10;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Share Your Craft Story</h1>
        </div>
        <p className="text-gray-600">
          Tell the world about your craft, connect with global audiences, and preserve your artisan heritage.
        </p>
      </div>

      {/* Story Title */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Story Title
        </label>
        <input
          type="text"
          value={storyData.title}
          onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Give your story a compelling title..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Input Method Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900">Choose Your Input Method</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveInputType('voice')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeInputType === 'voice' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Mic className="w-4 h-4" />
              Record Voice
            </button>
            
            <button
              onClick={() => setActiveInputType('text')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeInputType === 'text' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Type className="w-4 h-4" />
              Type Text
            </button>
          </div>
        </div>

        {/* Input Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeInputType === 'voice' ? (
              <VoiceRecorder
                onTranscription={handleVoiceTranscription}
                language={storyData.originalLanguage}
              />
            ) : (
              <TextInput
                value={storyData.content}
                onChange={handleTextChange}
              />
            )}
          </div>

          <div className="space-y-4">
            {/* Language Selection */}
            <LanguageSelector
              selectedLanguages={storyData.targetLanguages}
              onLanguageChange={handleLanguageSelection}
              sourceLanguage={storyData.originalLanguage}
              maxSelections={8}
            />

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!canTranslate || isTranslating}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
                ${canTranslate && !isTranslating
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Translating... ({translationProgress}%)
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Translate Story
                </>
              )}
            </button>

            {/* Tags Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Craft Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {CRAFT_TAGS.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`
                      px-3 py-1 text-xs rounded-full border transition-colors
                      ${storyData.tags.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Translation Results */}
      {(translations.length > 0 || isTranslating || translationError) && (
        <TranslationResults
          translations={translations}
          onUpdateTranslation={updateTranslation}
          onRemoveTranslation={removeTranslation}
          onExportTranslations={downloadExport}
          isLoading={isTranslating}
        />
      )}

      {/* Translation Error */}
      {translationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-medium">Translation Error</div>
          <div className="text-red-500 text-sm mt-1">{translationError}</div>
          <button
            onClick={clearTranslations}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear and try again
          </button>
        </div>
      )}

      {/* Save Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={storyData.isPublic}
                onChange={(e) => setStoryData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Make story public</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadExport('json')}
              disabled={translations.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={handleSaveStory}
              disabled={!canSave || isSaving}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                ${canSave && !isSaving
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Story
                </>
              )}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {saveError}
          </div>
        )}
      </div>
    </div>
  );
};

export {};