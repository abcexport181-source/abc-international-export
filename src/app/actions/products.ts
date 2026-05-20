'use server'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from './auth';

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
    await requireAdminSession();
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('products')
      .upsert({
        ...product,
        id: product.id.startsWith(product.language_code + ':') ? product.id : `${product.language_code}:${product.id}`
      });

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
    await requireAdminSession();
    const supabaseAdmin = getSupabaseAdmin();
    const isEnglish = !id.includes(':') || id.startsWith('en:');
    const baseId = id.replace(/^(en|es|fr|de|it|pt|nl|ru|zh|ja|ko|ar|hi|tr):/, '');

    // 1. Delete target record
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 2. Cascade delete to translations if this is English
    if (isEnglish) {
      await supabaseAdmin
        .from('products')
        .delete()
        .like('id', `%:${baseId}`);
    }

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
    await requireAdminSession();
    const supabaseAdmin = getSupabaseAdmin();
    const isEnglish = !id.includes(':') || id.startsWith('en:');
    const baseId = id.replace(/^(en|es|fr|de|it|pt|nl|ru|zh|ja|ko|ar|hi|tr):/, '');

    // 1. Update target record visibility
    const { error } = await supabaseAdmin
      .from('products')
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;

    // 2. Cascade visibility update to translations if this is English
    if (isEnglish) {
      await supabaseAdmin
        .from('products')
        .update({ is_visible: isVisible })
        .like('id', `%:${baseId}`);
    }

    revalidatePath('/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('toggleProductVisibilityAction error:', err);
    return { success: false, error: err.message };
  }
}
