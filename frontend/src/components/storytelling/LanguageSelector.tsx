import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X, Globe } from 'lucide-react';
import { Language } from '../../types/storytelling';
import { SUPPORTED_LANGUAGES, POPULAR_LANGUAGES } from '../../utils/languageConstants';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
  sourceLanguage?: string;
  multiple?: boolean;
  placeholder?: string;
  maxSelections?: number;
  showPopular?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguageChange,
  sourceLanguage,
  multiple = true,
  placeholder = 'Select target languages',
  maxSelections = 10,
  showPopular = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availableLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter(lang => lang.code !== sourceLanguage);
  }, [sourceLanguage]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return availableLanguages;
    
    const query = searchQuery.toLowerCase();
    return availableLanguages.filter(lang => 
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  }, [availableLanguages, searchQuery]);

  const popularLanguages = useMemo(() => {
    return availableLanguages.filter(lang => POPULAR_LANGUAGES.includes(lang.code));
  }, [availableLanguages]);

  const selectedLanguageObjects = useMemo(() => {
    return selectedLanguages.map(code => 
      SUPPORTED_LANGUAGES.find(lang => lang.code === code)
    ).filter(Boolean) as Language[];
  }, [selectedLanguages]);

  const handleLanguageToggle = (languageCode: string) => {
    if (!multiple) {
      onLanguageChange([languageCode]);
      setIsOpen(false);
      return;
    }

    if (selectedLanguages.includes(languageCode)) {
      onLanguageChange(selectedLanguages.filter(code => code !== languageCode));
    } else if (selectedLanguages.length < maxSelections) {
      onLanguageChange([...selectedLanguages, languageCode]);
    }
  };

  const handleRemoveLanguage = (languageCode: string) => {
    onLanguageChange(selectedLanguages.filter(code => code !== languageCode));
  };

  const handleSelectAll = (languages: Language[]) => {
    const newSelections = [
      ...selectedLanguages,
      ...languages
        .filter(lang => !selectedLanguages.includes(lang.code))
        .slice(0, maxSelections - selectedLanguages.length)
        .map(lang => lang.code)
    ];
    onLanguageChange(newSelections);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Globe className="inline w-4 h-4 mr-1" />
        Target Languages
      </label>

      {/* Selected Languages Display */}
      {selectedLanguageObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedLanguageObjects.map(lang => (
            <div
              key={lang.code}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              <button
                onClick={() => handleRemoveLanguage(lang.code)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className={selectedLanguages.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
          {selectedLanguages.length > 0 
            ? `${selectedLanguages.length} language${selectedLanguages.length > 1 ? 's' : ''} selected`
            : placeholder
          }
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* Popular Languages */}
            {showPopular && !searchQuery && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Popular Languages</h4>
                  {multiple && (
                    <button
                      onClick={() => handleSelectAll(popularLanguages)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {popularLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageToggle(lang.code)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50
                        ${selectedLanguages.includes(lang.code) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                      `}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                      {selectedLanguages.includes(lang.code) && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Languages */}
            <div className="p-3">
              {!searchQuery && (
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">All Languages</h4>
                  {multiple && (
                    <button
                      onClick={() => handleSelectAll(availableLanguages)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                  )}
                </div>
              )}
              
              {filteredLanguages.length > 0 ? (
                <div className="space-y-1">
                  {filteredLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageToggle(lang.code)}
                      disabled={!selectedLanguages.includes(lang.code) && selectedLanguages.length >= maxSelections}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                        ${selectedLanguages.includes(lang.code) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                      `}
                    >
                      <span>{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{lang.name}</div>
                        <div className="text-xs text-gray-500 truncate">{lang.nativeName}</div>
                      </div>
                      {selectedLanguages.includes(lang.code) && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No languages found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {multiple && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                {selectedLanguages.length} of {maxSelections} languages selected
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// This empty export is required to make this file a module for TypeScript
export {};