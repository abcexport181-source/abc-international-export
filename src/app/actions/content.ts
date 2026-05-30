'use server'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from './auth';
import { languages } from '@/lib/languages';
// Force re-deployment and re-sync check

export async function updateSiteContentBatch(updates: { id: string, value: string }[]) {
  try {
    await requireAdminSession();
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { 
      success: false, 
      error: 'SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in Vercel settings. Please add it to enable saving.' 
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const promises = updates.map(update => 
      supabaseAdmin
        .from('site_content')
        .update({ content_value: update.value })
        .eq('id', update.id)
        .select()
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      console.error('Batch update errors:', errors);
      return { success: false, error: 'Some updates failed' };
    }

    // Check if any rows were actually updated
    const totalUpdated = results.reduce((acc, r) => acc + (r.data?.length || 0), 0);
    const updatedData = results.flatMap(r => r.data || []);

    if (totalUpdated === 0) {
      return { success: false, error: 'No rows were found to update. Try running "Sync Mock Data" first.' };
    }

    // Revalidate the entire site
    revalidatePath('/', 'layout');
    return { success: true, count: totalUpdated, data: updatedData };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function syncInitialDataBatch(initialContent: any[], languageCode: string) {
  try {
    await requireAdminSession();
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { 
      success: false, 
      error: 'SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing.' 
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const dataToUpsert = initialContent.map(c => {
      const calculatedLimit = c.limit || Math.max(Math.ceil(String(c.val).length * 1.5), 40);
      return {
        id: `${languageCode}_${c.page}_${c.section.replace(/\s+/g, '_').toLowerCase()}_${c.key}`,
        page_name: c.page,
        section_name: c.section,
        content_key: c.key,
        content_value: String(c.val),
        language_code: languageCode,
        char_limit: calculatedLimit
      };
    });

    // 1. Insert missing rows (never overwrite content_value)
    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert(dataToUpsert, { 
        onConflict: 'id',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Batch sync error (insert):', error);
      return { success: false, error: error.message };
    }

    // 2. Explicitly update char_limit for all rows in this batch 
    // (This ensures that if we change a limit in code, it reflects in the DB even for existing rows)
    const limitUpdates = dataToUpsert.map(item => 
      supabaseAdmin
        .from('site_content')
        .update({ char_limit: item.char_limit })
        .eq('id', item.id)
    );
    
    await Promise.all(limitUpdates);

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


export async function upsertSiteContent(updates: { 
  id?: string, 
  page_name: string, 
  section_name: string, 
  content_key: string, 
  content_value: string,
  language_code: string
}[]) {
  try {
    await requireAdminSession();
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY is missing.' };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const dataToUpsert = updates.map(u => {
      let charLimit = 500;
      if (
        u.page_name === 'global' &&
        u.section_name === 'footer' &&
        ['social_linkedin', 'social_facebook', 'social_twitter'].includes(u.content_key)
      ) {
        charLimit = 300;
      } else if (u.page_name === 'about' && u.section_name === 'Approach') {
        charLimit = 180;
      } else if (u.page_name === 'about' && u.section_name === 'Linear' && u.content_key === 'item4') {
        charLimit = 80;
      } else if (u.page_name === 'sourcing' && u.section_name === 'Custom' && u.content_key === 'feat5_desc') {
        charLimit = 100;
      } else if (u.page_name === 'sourcing' && u.section_name === 'CTA' && u.content_key === 'btn_text') {
        charLimit = 50;
      } else if (u.page_name === 'industries') {
        const industriesLimits: Record<string, number> = {
          'Hero.badge': 80,
          'Hero.title': 150,
          'Hero.desc': 240,
          'Hero.products_link': 80,
          'Sourcing.title': 150,
          'Sourcing.desc': 320,
          'Sourcing.item1': 120,
          'Sourcing.item2': 120,
          'Sourcing.item3': 120,
          'Sourcing.item4': 120,
          'Missing.title': 150,
          'Missing.desc': 240,
          'Missing.btn_text': 80,
        };
        const limitKey = `${u.section_name}.${u.content_key}`;
        if (industriesLimits[limitKey]) charLimit = industriesLimits[limitKey];
      }
      return {
        id: u.id || `${u.language_code}_${u.page_name}_${u.section_name.replace(/\s+/g, '_').toLowerCase()}_${u.content_key}`,
        page_name: u.page_name,
        section_name: u.section_name,
        content_key: u.content_key,
        content_value: u.content_value,
        language_code: u.language_code,
        char_limit: charLimit
      };
    });

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .upsert(dataToUpsert)
      .select();

    if (error) throw error;
    
    revalidatePath('/', 'layout');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateBlogMenuVisibilityAction(newValue: boolean) {
  try {
    await requireAdminSession();
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY is missing.' };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. DELETE all existing rows for global navigation blog_visibility to avoid duplicates/stale keys
    const { error: deleteError } = await supabaseAdmin
      .from('site_content')
      .delete()
      .eq('page_name', 'global')
      .eq('section_name', 'navigation')
      .eq('content_key', 'blog_visibility');

    if (deleteError) {
      console.error('Error deleting old visibility keys:', deleteError);
    }

    // 2. Prepare fresh clean rows for all supported languages
    const dataToInsert = languages.map(lang => ({
      id: `${lang.code}_global_navigation_blog_visibility`,
      page_name: 'global',
      section_name: 'navigation',
      content_key: 'blog_visibility',
      content_value: String(newValue),
      language_code: lang.code,
      char_limit: 500
    }));

    // 3. Insert the new clean set
    const { data, error: insertError } = await supabaseAdmin
      .from('site_content')
      .insert(dataToInsert)
      .select();

    if (insertError) throw insertError;

    revalidatePath('/', 'layout');
    return { success: true, data };
  } catch (err: any) {
    console.error('Error in updateBlogMenuVisibilityAction:', err);
    return { success: false, error: err.message };
  }
}
