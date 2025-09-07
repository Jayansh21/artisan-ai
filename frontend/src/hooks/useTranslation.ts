import { useState, useCallback } from 'react';
import { Translation, TranslationRequest } from '../types/storytelling';
import { TranslationService } from '../services/translationService';

export const useTranslation = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationProgress, setTranslationProgress] = useState(0);

  const translateText = useCallback(async (request: TranslationRequest) => {
    setIsTranslating(true);
    setError(null);
    setTranslationProgress(0);

    try {
      // Validate text first
      const validation = TranslationService.validateText(request.text);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const progressInterval = setInterval(() => {
        setTranslationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await TranslationService.translateStory(request);

      clearInterval(progressInterval);
      setTranslationProgress(100);

      if (!response.success) {
        throw new Error(response.error || 'Translation failed');
      }

      setTranslations(response.translations);
      return response.translations;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      return [];
    } finally {
      setIsTranslating(false);
      setTimeout(() => setTranslationProgress(0), 1000);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string) => {
    try {
      setError(null);
      const detectedLanguage = await TranslationService.detectLanguage(text);
      return detectedLanguage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Language detection failed';
      setError(errorMessage);
      return 'en';
    }
  }, []);

  const addTranslation = useCallback((translation: Translation) => {
    setTranslations(prev => [...prev, translation]);
  }, []);

  const removeTranslation = useCallback((translationId: string) => {
    setTranslations(prev => prev.filter(t => t.id !== translationId));
  }, []);

  const updateTranslation = useCallback((translationId: string, updatedText: string) => {
    setTranslations(prev => 
      prev.map(t => 
        t.id === translationId 
          ? { ...t, translatedText: updatedText }
          : t
      )
    );
  }, []);

  const clearTranslations = useCallback(() => {
    setTranslations([]);
    setError(null);
  }, []);

  const exportTranslations = useCallback((format: 'json' | 'csv' = 'json') => {
    if (translations.length === 0) return null;

    if (format === 'json') {
      const dataStr = JSON.stringify(translations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      return {
        blob: dataBlob,
        filename: `translations-${Date.now()}.json`
      };
    } else {
      // CSV format
      const csvHeader = 'Language,Language Name,Translation,Confidence\n';
      const csvContent = translations
        .map(t => `"${t.language}","${t.languageName}","${t.translatedText.replace(/"/g, '""')}","${t.confidence}"`)
        .join('\n');
      
      const dataBlob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
      return {
        blob: dataBlob,
        filename: `translations-${Date.now()}.csv`
      };
    }
  }, [translations]);

  const downloadExport = useCallback((format: 'json' | 'csv' = 'json') => {
    const exportData = exportTranslations(format);
    if (!exportData) return;

    const url = URL.createObjectURL(exportData.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportTranslations]);

  const getTranslationByLanguage = useCallback((languageCode: string) => {
    return translations.find(t => t.language === languageCode);
  }, [translations]);

  const hasTranslation = useCallback((languageCode: string) => {
    return translations.some(t => t.language === languageCode);
  }, [translations]);

  return {
    translations,
    isTranslating,
    error,
    translationProgress,
    translateText,
    detectLanguage,
    addTranslation,
    removeTranslation,
    updateTranslation,
    clearTranslations,
    exportTranslations,
    downloadExport,
    getTranslationByLanguage,
    hasTranslation
  };
};