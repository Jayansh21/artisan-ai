// shared/constants/index.ts

// Language Constants
export const SUPPORTED_LANGUAGES = {
  // English (Primary)
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Global'
  },
  
  // Indian Languages
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    region: 'North India'
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    region: 'West Bengal, Bangladesh'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    region: 'Andhra Pradesh, Telangana'
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    region: 'Maharashtra'
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    region: 'Tamil Nadu'
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    region: 'Gujarat'
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    region: 'Karnataka'
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    region: 'Kerala'
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    region: 'Punjab'
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
    region: 'Odisha'
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    flag: '🇮🇳',
    region: 'Assam'
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇮🇳',
    region: 'North India'
  }
} as const;

export const LANGUAGE_GROUPS = {
  POPULAR: ['hi', 'bn', 'te', 'mr', 'ta', 'gu'],
  SOUTH_INDIAN: ['te', 'ta', 'kn', 'ml'],
  NORTH_INDIAN: ['hi', 'pa', 'ur'],
  EAST_INDIAN: ['bn', 'as', 'or'],
  WEST_INDIAN: ['gu', 'mr']
} as const;

// Market Expansion Constants
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
] as const;

export const ARTISAN_CATEGORIES = {
  TEXTILES: [
    'Banarasi Silk Sarees', 'Kanchipuram Silk Sarees', 'Handloom Cotton Sarees',
    'Pashmina Shawls', 'Phulkari Dupatta', 'Bandhani Fabrics', 'Ikat Textiles',
    'Chikankari Kurtas', 'Block Print Fabrics', 'Embroidered Fabrics'
  ],
  ART: [
    'Kalamkari Art', 'Madhubani Paintings', 'Warli Art', 'Tanjore Paintings',
    'Pattachitra Art', 'Miniature Paintings'
  ],
  POTTERY: [
    'Blue Pottery', 'Terracotta Items', 'Traditional Pottery', 'Glazed Ceramics'
  ],
  METALWORK: [
    'Dhokra Art', 'Brass Handicrafts', 'Metal Crafts', 'Jewelry (Temple/Traditional)'
  ],
  WOODWORK: [
    'Wooden Handicrafts', 'Carved Furniture', 'Wooden Toys', 'Sandalwood Crafts'
  ],
  OTHER: [
    'Leather Goods', 'Jute Products', 'Bamboo Crafts', 'Stone Carving',
    'Carpet/Rugs', 'Glass Work', 'Paper Mache'
  ]
} as const;

// API Constants
export const API_ENDPOINTS = {
  MARKET_ANALYSIS: '/api/market/analyze',
  CONTACT_DISCOVERY: '/api/contacts/discover',
  SPEECH_TO_TEXT: '/api/speech/transcribe',
  TRANSLATION: '/api/translate',
  STORYTELLING: '/api/storytelling',
  AUTOMATION: '/api/automation'
} as const;

// Voice Input Constants
export const SPEECH_CONFIG = {
  LANGUAGES: {
    'en-US': 'English (US)',
    'en-IN': 'English (India)',
    'hi-IN': 'Hindi (India)',
    'bn-IN': 'Bengali (India)',
    'te-IN': 'Telugu (India)',
    'ta-IN': 'Tamil (India)',
    'mr-IN': 'Marathi (India)',
    'gu-IN': 'Gujarati (India)',
    'kn-IN': 'Kannada (India)',
    'ml-IN': 'Malayalam (India)',
    'pa-IN': 'Punjabi (India)',
    'or-IN': 'Odia (India)'
  },
  MAX_RECORDING_TIME: 300, // 5 minutes
  SAMPLE_RATE: 16000
} as const;

// Cultural Adaptation Constants
export const CULTURAL_CONTEXTS = {
  FESTIVALS: {
    NATIONAL: ['Diwali', 'Holi', 'Eid', 'Christmas', 'Dussehra'],
    REGIONAL: {
      'Tamil Nadu': ['Pongal', 'Tamil New Year'],
      'West Bengal': ['Durga Puja', 'Kali Puja', 'Poila Boishakh'],
      'Kerala': ['Onam', 'Vishu'],
      'Punjab': ['Baisakhi', 'Karva Chauth'],
      'Maharashtra': ['Ganesh Chaturthi', 'Gudi Padwa']
    }
  },
  SEASONS: {
    PEAK_WEDDING: ['October', 'November', 'December', 'January', 'February'],
    FESTIVAL_SEASON: ['September', 'October', 'November'],
    MONSOON: ['June', 'July', 'August', 'September']
  }
} as const;

// Business Constants
export const BUSINESS_METRICS = {
  MARKET_SIZES: {
    SMALL: '< ₹10L',
    MEDIUM: '₹10L - ₹1Cr',
    LARGE: '₹1Cr - ₹10Cr',
    ENTERPRISE: '> ₹10Cr'
  },
  COMPETITION_LEVELS: {
    LOW: 'Low (< 5 sellers)',
    MEDIUM: 'Medium (5-20 sellers)',
    HIGH: 'High (20+ sellers)'
  },
  INVESTMENT_RANGES: {
    MINIMAL: '₹5,000 - ₹25,000',
    MODERATE: '₹25,000 - ₹1,00,000',
    SUBSTANTIAL: '₹1,00,000 - ₹5,00,000',
    MAJOR: '> ₹5,00,000'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  SPEECH_NOT_SUPPORTED: 'Speech recognition is not supported in your browser.',
  MICROPHONE_ACCESS_DENIED: 'Microphone access is required for voice input.',
  TRANSLATION_FAILED: 'Translation service is currently unavailable.',
  INVALID_INPUT: 'Please provide valid input text.',
  MAX_LENGTH_EXCEEDED: 'Text length exceeds maximum limit.',
  LANGUAGE_NOT_SUPPORTED: 'Selected language is not supported.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSLATION_COMPLETE: 'Translation completed successfully!',
  AUDIO_RECORDED: 'Audio recorded successfully!',
  MARKET_ANALYSIS_COMPLETE: 'Market analysis completed!',
  CONTACTS_DISCOVERED: 'New contacts discovered!',
  STORY_SAVED: 'Your story has been saved!'
} as const;

// Export language utilities
export const getLanguageByCode = (code: string) => SUPPORTED_LANGUAGES[code as keyof typeof SUPPORTED_LANGUAGES];
export const getAllLanguageCodes = () => Object.keys(SUPPORTED_LANGUAGES);
export const getLanguagesByGroup = (group: keyof typeof LANGUAGE_GROUPS) => LANGUAGE_GROUPS[group];

export default {
  SUPPORTED_LANGUAGES,
  LANGUAGE_GROUPS,
  INDIAN_STATES,
  ARTISAN_CATEGORIES,
  API_ENDPOINTS,
  SPEECH_CONFIG,
  CULTURAL_CONTEXTS,
  BUSINESS_METRICS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getLanguageByCode,
  getAllLanguageCodes,
  getLanguagesByGroup
};