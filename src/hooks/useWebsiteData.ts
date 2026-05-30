import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export const useWebsiteData = () => {
    const { language } = useLanguage();
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isMediaKey = (key: string) => key.includes('img') || key.includes('image');


    const fetchData = async () => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        try {
            console.log(`Fetching website content for language: ${language}...`);
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .in('language_code', Array.from(new Set(['en', language])))
                .filter('id', 'neq', `cache_buster_${Date.now()}`);
            
            if (error) {
              console.error('Supabase fetch ERROR:', error);
            } else if (data) {
              console.log(`Successfully fetched ${data.length} items for ${language}`);

              // Normalize language_code values from the DB to avoid mismatches
              // (examples: 'AR', 'ar ', null) — convert to trimmed lowercase strings
              const normalizedData = (data as any[]).map((item: any) => ({
                ...item,
                language_code: String(item.language_code || 'en').toLowerCase().trim()
              }));

              setContent(normalizedData);
            }
        } catch (error) {
            console.error('Error fetching website content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleUpdate = () => {
            console.log('Website data update event received, refetching...');
            fetchData();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('website-data-updated', handleUpdate);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('website-data-updated', handleUpdate);
            }
        };
    }, [language]);

    const getContent = (page: string, section: string, key: string, defaultValue: string) => {
        const item = content.find(c =>
            c.page_name === page && 
            c.section_name.toLowerCase() === section.toLowerCase() && 
            c.content_key === key &&
            c.language_code === language
        );
        
        // For media keys (img/image), always use the English version (images shared across languages)
        if (isMediaKey(key)) {
            const englishMediaItem = content.find(c =>
                c.page_name === page &&
                c.section_name.toLowerCase() === section.toLowerCase() &&
                c.content_key === key &&
                c.language_code === 'en'
            );
            if (englishMediaItem) {
                return englishMediaItem.content_value || defaultValue;
            }
        }

        // If a language-specific record EXISTS, return it (even if empty — empty means
        // the translation slot was created but not filled in yet; we still prefer it
        // over English so partially-translated pages show blank rather than English)
        if (item !== undefined) {
            return item.content_value || defaultValue;
        }

        // No language-specific record — fall back to English
        const englishFallback = content.find(c =>
            c.page_name === page &&
            c.section_name.toLowerCase() === section.toLowerCase() &&
            c.content_key === key &&
            c.language_code === 'en'
        );
        
        return englishFallback?.content_value || defaultValue;
    };

    return { getContent, loading, refresh: fetchData };
};
