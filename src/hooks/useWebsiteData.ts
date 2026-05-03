import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export const useWebsiteData = () => {
    const { language } = useLanguage();
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                .eq('language_code', language);
            
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
            c.content_key === key
        );
        return item ? item.content_value : defaultValue;
    };

    return { getContent, loading, refresh: fetchData };
};
