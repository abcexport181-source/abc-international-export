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

                            // Debug: Log quality-packaging content
                            const qualityPackagingItems = normalizedData.filter((c: any) => c.page_name === 'quality-packaging');
                            if (qualityPackagingItems.length > 0) {
                                const byLanguage: Record<string, number> = {};
                                qualityPackagingItems.forEach((item: any) => {
                                    byLanguage[item.language_code] = (byLanguage[item.language_code] || 0) + 1;
                                });
                                console.log(`Quality-packaging content by language:`, byLanguage);
                                if (language === 'ar') {
                                    const arabicItems = qualityPackagingItems.filter((c: any) => c.language_code === 'ar');
                                    console.log(`Arabic quality-packaging items: ${arabicItems.length}`, arabicItems.slice(0, 3));
                  
                  // Show all Inspection section items for Arabic
                  const inspectionItems = arabicItems.filter((c: any) => c.section_name === 'Inspection');
                  console.log(`[DEBUG] Inspection section Arabic items (${inspectionItems.length}):`, 
                    inspectionItems.map((i: any) => `${i.content_key}=${i.content_value.substring(0, 20)}`));

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
        
        // Debug: if Arabic and quality-packaging Inspection section, log details
        if (language === 'ar' && page === 'quality-packaging' && section === 'Inspection') {
            if (key === 'item2_title' || key === 'title') {
                console.log(`[DEBUG-DETAIL] Looking for: page=${page}, section=${section}, key=${key}, lang=${language}`);
                console.log(`[DEBUG-DETAIL] Found item:`, item ? `YES - "${item.content_value}"` : 'NO');
                
                // Show ALL rows in content for debugging
                const allInspectionRows = content.filter(c => c.page_name === page && c.section_name === section);
                console.log(`[DEBUG-DETAIL] Total rows for ${page}.${section}:`, allInspectionRows.length);
                console.log(`[DEBUG-DETAIL] All keys available:`, allInspectionRows.map(r => r.content_key));
                console.log(`[DEBUG-DETAIL] Arabic rows:`, 
                  allInspectionRows.filter(r => r.language_code === 'ar').map(r => `${r.content_key}(lang:${r.language_code})`));
            }
        }
        
        // For media keys (img/image), prefer English if available
        // But ONLY for media keys - not for text content
        if (isMediaKey(key)) {
            const englishMediaItem = content.find(c =>
                c.page_name === page &&
                c.section_name.toLowerCase() === section.toLowerCase() &&
                c.content_key === key &&
                c.language_code === 'en'
            );
            if (englishMediaItem?.content_value) {
                return englishMediaItem.content_value;
            }
        }

        // If we found the item in the requested language, return it
        if (item?.content_value) {
            return item.content_value;
        }

        // Otherwise fall back to English version
        const englishFallback = content.find(c =>
            c.page_name === page &&
            c.section_name.toLowerCase() === section.toLowerCase() &&
            c.content_key === key &&
            c.language_code === 'en'
        );
        
        if (englishFallback?.content_value) {
            if (language === 'ar' && page === 'quality-packaging') {
                console.log(`[getContent] FALLBACK TO ENGLISH for ${key}`);
            }
            return englishFallback.content_value;
        }
        
        // Last resort: use default
        return defaultValue;
    };

    return { getContent, loading, refresh: fetchData };
};
