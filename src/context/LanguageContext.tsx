'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLanguage } from '@/lib/languages';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = defaultLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: string;
}) {
  const [language, setLanguageState] = useState(initialLanguage);
  const router = useRouter();

  useEffect(() => {
    // Load language from localStorage if available
    const savedLang = localStorage.getItem('site_language');
    if (savedLang && savedLang !== language) {
      setLanguageState(savedLang);
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
    // Also set a cookie for server components if needed
    document.cookie = `site_language=${lang}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
