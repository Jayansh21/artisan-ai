import React, { useState } from 'react';
import { Globe, Download, Copy, Edit3, Check, X, Share2, Star } from 'lucide-react';
import { Translation } from '../../types/storytelling';
import { getLanguageByCode } from '../../utils/languageConstants';

interface TranslationResultsProps {
  translations: Translation[];
  onUpdateTranslation: (translationId: string, newText: string) => void;
  onRemoveTranslation: (translationId: string) => void;
  onExportTranslations: (format: 'json' | 'csv') => void;
  isLoading?: boolean;
}

export const TranslationResults: React.FC<TranslationResultsProps> = ({
  translations,
  onUpdateTranslation,
  onRemoveTranslation,
  onExportTranslations,
  isLoading = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setEditText(translation.translatedText);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateTranslation(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleCopy = async (text: string, translationId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(translationId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Translating your story...</span>
          </div>
        </div>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Translations Yet</h3>
          <p className="text-gray-500">
            Select target languages and translate your story to connect with a global audience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">
            Translations ({translations.length})
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportTranslations('json')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          
          <button
            onClick={() => onExportTranslations('csv')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Translation Cards */}
      <div className="p-6 space-y-4">
        {translations.map((translation) => {
          const language = getLanguageByCode(translation.language);
          const isEditing = editingId === translation.id;
          
          return (
            <div
              key={translation.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              {/* Language Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language?.flag || '🌍'}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language?.name || translation.languageName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {language?.nativeName || translation.language}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Confidence Badge */}
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${getConfidenceColor(translation.confidence)}
                  `}>
                    {getConfidenceText(translation.confidence)} 
                    ({Math.round(translation.confidence * 100)}%)
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(translation.translatedText, translation.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Copy translation"
                    >
                      {copiedId === translation.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(translation)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Edit translation"
                      disabled={isEditing}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onRemoveTranslation(translation.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove translation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Translation Content */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Edit the translation..."
                  />
                  
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {translation.translatedText}
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              {!isEditing && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Translated on {new Date(translation.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 rounded">
                      <Share2 className="w-3 h-3" />
                      Share
                    </button>
                    
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 rounded">
                      <Star className="w-3 h-3" />
                      Favorite
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Total: {translations.length} translation{translations.length !== 1 ? 's' : ''}
          </span>
          
          <span>
            Average confidence: {Math.round(
              translations.reduce((acc, t) => acc + t.confidence, 0) / translations.length * 100
            )}%
          </span>
        </div>
      </div>
    </div>
  );
};