import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  Translations,
  getTranslation,
  getDirection,
  getFontFamily,
} from '../lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'inventory-system-language';

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') {
      return stored;
    }
    return defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  useEffect(() => {
    const direction = getDirection(language);
    const fontFamily = getFontFamily(language);

    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.body.style.fontFamily = fontFamily;

    // Add/remove RTL class for conditional styling
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: getTranslation(language),
    direction: getDirection(language),
    isRTL: language === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hooks
export function useTranslations(): Translations {
  const { t } = useLanguage();
  return t;
}

export function useIsRTL(): boolean {
  const { isRTL } = useLanguage();
  return isRTL;
}

// Language switcher component
interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'dropdown';
}

export function LanguageSwitcher({
  className = '',
  showLabel = false,
  variant = 'button',
}: LanguageSwitcherProps) {
  const { language, setLanguage, isRTL } = useLanguage();

  if (variant === 'dropdown') {
    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={`px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    );
  }

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium transition-colors ${className}`}
    >
      <span className="text-lg">{language === 'en' ? '🇸🇦' : '🇺🇸'}</span>
      {showLabel && (
        <span>{language === 'en' ? 'العربية' : 'English'}</span>
      )}
    </button>
  );
}
