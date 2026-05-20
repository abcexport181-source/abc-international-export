'use server'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing.');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function saveBlogAction(blog: any) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('blogs')
      .upsert(blog);

    if (error) throw error;
    revalidatePath('/blogs', 'layout');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('saveBlogAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/blogs', 'layout');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('deleteBlogAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleBlogVisibilityAction(id: string, isVisible: boolean) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('blogs')
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/blogs', 'layout');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('toggleBlogVisibilityAction error:', err);
    return { success: false, error: err.message };
  }
}
