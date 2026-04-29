'use server'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function updateSiteContentBatch(updates: { id: string, value: string }[]) {
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
    if (totalUpdated === 0) {
      return { success: false, error: 'No rows were found to update. Try running "Sync Mock Data" first.' };
    }

    revalidatePath('/');
    return { success: true, count: totalUpdated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
