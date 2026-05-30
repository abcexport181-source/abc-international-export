'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ───────────────────────────────────────────────────────────────────

type ContentRow = {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_value: string;
  language_code: string;
  char_limit?: number;
};

type WebsiteDataContextType = {
  getContent: (page: string, section: string, key: string, defaultValue: string) => string;
  loading: boolean;
  refresh: () => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

const isMediaKey = (key: string) => key.includes('img') || key.includes('image');

/**
 * Fetches ALL rows from site_content for the given language codes, paginating
 * beyond Supabase's default 1000-row limit.
 */
async function fetchAllContentRows(languageCodes: string[]): Promise<ContentRow[]> {
  const PAGE_SIZE = 1000;
  let allRows: ContentRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('site_content')
      .select('id, page_name, section_name, content_key, content_value, language_code, char_limit')
      .in('language_code', languageCodes)
      .order('id')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error('[WebsiteDataContext] Supabase fetch error:', error.message);
      break;
    }

    if (!data || data.length === 0) break;

    // Normalise language_code — guard against 'AR', 'ar ', null etc.
    const normalised = data.map((row: any) => ({
      ...row,
      language_code: String(row.language_code ?? 'en').toLowerCase().trim(),
    }));

    allRows = allRows.concat(normalised);

    if (data.length < PAGE_SIZE) break; // last page — no more rows
    from += PAGE_SIZE;
  }

  return allRows;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WebsiteDataProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Track the language for which data was last fetched to avoid duplicate requests
  const fetchingForRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const langCodes = Array.from(new Set(['en', language]));
    const cacheKey = langCodes.sort().join('+');

    // Skip if already fetching for the exact same set of languages
    if (fetchingForRef.current === cacheKey) return;
    fetchingForRef.current = cacheKey;

    setLoading(true);

    try {
      const rows = await fetchAllContentRows(langCodes);
      setContent(rows);
    } catch (err) {
      console.error('[WebsiteData] Fetch failed:', err);
    } finally {
      setLoading(false);
      // Allow re-fetching if language changes again
      fetchingForRef.current = null;
    }
  }, [language]);

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchingForRef.current = null; // force re-fetch on manual update
      fetchData();
    };
    window.addEventListener('website-data-updated', handleUpdate);
    return () => window.removeEventListener('website-data-updated', handleUpdate);
  }, [fetchData]);

  const getContent = useCallback(
    (page: string, section: string, key: string, defaultValue: string): string => {
      const sectionLower = section.toLowerCase();

      // For media keys: always use the English version (images are shared across languages)
      if (isMediaKey(key)) {
        const enMedia = content.find(
          c => c.page_name === page && c.section_name.toLowerCase() === sectionLower && c.content_key === key && c.language_code === 'en'
        );
        return enMedia?.content_value || defaultValue;
      }

      // Language-specific record (exists in DB → use it even if empty)
      const item = content.find(
        c => c.page_name === page && c.section_name.toLowerCase() === sectionLower && c.content_key === key && c.language_code === language
      );
      if (item !== undefined) {
        return item.content_value || defaultValue;
      }

      // English fallback
      const enFallback = content.find(
        c => c.page_name === page && c.section_name.toLowerCase() === sectionLower && c.content_key === key && c.language_code === 'en'
      );
      return enFallback?.content_value || defaultValue;
    },
    [content, language]
  );

  return (
    <WebsiteDataContext.Provider value={{ getContent, loading, refresh: fetchData }}>
      {children}
    </WebsiteDataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWebsiteData() {
  const ctx = useContext(WebsiteDataContext);
  if (!ctx) throw new Error('useWebsiteData must be used within <WebsiteDataProvider>');
  return ctx;
}
