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

export async function saveIndustryAction(industry: any) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('industries')
      .upsert({
        ...industry,
        id: industry.id.startsWith(industry.language_code + ':') ? industry.id : `${industry.language_code}:${industry.id}`
      });


    if (error) throw error;
    revalidatePath('/industries');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('saveIndustryAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteIndustryAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('industries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/industries');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('deleteIndustryAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleIndustryVisibilityAction(id: string, isVisible: boolean) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('industries')
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/industries');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('toggleIndustryVisibilityAction error:', err);
    return { success: false, error: err.message };
  }
}
