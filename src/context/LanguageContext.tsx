'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLanguage, normalizeLanguage } from '@/lib/languages';

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

  // No localStorage useEffect here.
  // setLanguage() writes to BOTH localStorage and the cookie at the same time.
  // The server reads the cookie to set initialLanguage, so this component always
  // starts with the correct language. Reading localStorage on mount was causing a
  // bug: stale localStorage ('en') would overwrite a valid cookie-based language ('ar').

  const setLanguage = (lang: string) => {
    const normalizedLang = normalizeLanguage(lang);
    setLanguageState(normalizedLang);
    localStorage.setItem('site_language', normalizedLang);
    // Set cookie for server components so initialLanguage is correct on next render
    document.cookie = `site_language=${normalizedLang}; path=/; max-age=31536000; samesite=lax`;
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
