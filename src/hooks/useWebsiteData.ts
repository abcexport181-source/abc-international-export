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
                .in('language_code', Array.from(new Set(['en', language])));
            
            if (error) {
              console.error('Supabase fetch ERROR:', error);
            } else if (data) {
              console.log(`Successfully fetched ${data.length} items for ${language}`);
              setContent(data);
            }
        } catch (error) {
            console.error('Error fetching website content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [language]);

    const getContent = (page: string, section: string, key: string, defaultValue: string) => {
        const item = content.find(c =>
            c.page_name === page && 
            c.section_name.toLowerCase() === section.toLowerCase() && 
            c.content_key === key &&
            c.language_code === language
        );
        const englishMediaItem = isMediaKey(key) ? content.find(c =>
            c.page_name === page &&
            c.section_name.toLowerCase() === section.toLowerCase() &&
            c.content_key === key &&
            c.language_code === 'en'
        ) : null;

        if (englishMediaItem) {
            return englishMediaItem.content_value;
        }

        const englishFallback = content.find(c =>
            c.page_name === page &&
            c.section_name.toLowerCase() === section.toLowerCase() &&
            c.content_key === key &&
            c.language_code === 'en'
        );
        return item ? item.content_value : englishFallback ? englishFallback.content_value : defaultValue;
    };

    return { getContent, loading, refresh: fetchData };
};
