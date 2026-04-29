import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseAnonKey.length > 0;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Type cast to prevent deep errors, but usage will still need check

export interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  content_key: string;
  content_value: string;
  char_limit: number;
}

export interface IndustryData {
  id: string;
  title: string;
  icon: string;
  description_short: string;
  full_info: string;
  keys: string[];
  is_visible: boolean;
  created_at?: string;
}

export interface ProductData {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
  export_details: {
    moq: string;
    origin: string;
    capacity: string;
    packaging: string;
    payment: string;
    delivery: string;
  };
  is_visible: boolean;
  created_at?: string;
}
