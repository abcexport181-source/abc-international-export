const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '..', '..', '.env.local');
console.log('Reading env from:', envPath);

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const parts = line.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const val = parts[1].trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
      }
    }
  }
} catch (e) {
  console.error('Error reading env file:', e);
}

// Fallback to environment variables if present
supabaseUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
supabaseAnonKey = supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
  console.error('Supabase is not configured with real credentials in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('content_key', 'blog_visibility');
  
  if (error) {
    console.error('Query error:', error);
  } else {
    console.log('Query result:', JSON.stringify(data, null, 2));
  }
}

check();
