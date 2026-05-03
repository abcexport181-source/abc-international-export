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

export async function saveProductAction(product: any) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('products')
      .upsert(product);

    if (error) throw error;
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('saveProductAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('deleteProductAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleProductVisibilityAction(id: string, isVisible: boolean) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('products')
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('toggleProductVisibilityAction error:', err);
    return { success: false, error: err.message };
  }
}
