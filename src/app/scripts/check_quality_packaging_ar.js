// Debug script to check quality-packaging Arabic translations in Supabase
// Run with: node check_quality_packaging_ar.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase credentials in environment variables');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('\n=== Checking quality-packaging content ===\n');

  // Check all quality-packaging entries by language
  const { data: allContent, error } = await supabase
    .from('site_content')
    .select('id, page_name, section_name, content_key, content_value, language_code')
    .eq('page_name', 'quality-packaging')
    .order('language_code')
    .order('section_name');

  if (error) {
    console.error('ERROR fetching content:', error);
    process.exit(1);
  }

  console.log(`Total quality-packaging entries: ${allContent?.length || 0}\n`);

  // Group by language
  const byLanguage = {};
  allContent?.forEach(row => {
    if (!byLanguage[row.language_code]) {
      byLanguage[row.language_code] = [];
    }
    byLanguage[row.language_code].push(row);
  });

  // Show summary
  Object.keys(byLanguage).sort().forEach(lang => {
    console.log(`Language: ${lang} - Count: ${byLanguage[lang].length} entries`);
  });

  console.log('\n=== Checking Arabic (ar) entries ===\n');
  const arabicContent = byLanguage['ar'] || [];
  
  if (arabicContent.length === 0) {
    console.log('⚠️  NO Arabic entries found for quality-packaging!');
    console.log('\n=== English entries (for reference) ===\n');
    (byLanguage['en'] || []).forEach(row => {
      console.log(`  ${row.section_name}.${row.content_key}: "${row.content_value.substring(0, 60)}..."`);
    });
  } else {
    console.log(`Found ${arabicContent.length} Arabic entries:`);
    arabicContent.forEach(row => {
      const isRTL = /[\u0600-\u06FF]/.test(row.content_value);
      const valuePreview = row.content_value.substring(0, 60);
      console.log(`  ${row.section_name}.${row.content_key}: "${valuePreview}..." ${isRTL ? '✓ (RTL)' : '⚠️ (NOT RTL - might be English)'}`);
    });
  }

  console.log('\n=== Checking if quality-packaging has proper filter logic ===\n');
  
  // Test the exact query the app uses
  const { data: testQuery } = await supabase
    .from('site_content')
    .select('*')
    .in('language_code', ['en', 'ar'])
    .filter('id', 'neq', `cache_buster_${Date.now()}`);

  const qualityPackagingAr = testQuery?.filter(c => 
    c.page_name === 'quality-packaging' && c.language_code === 'ar'
  ) || [];
  
  console.log(`App query returns ${qualityPackagingAr.length} Arabic quality-packaging entries`);

  if (qualityPackagingAr.length > 0) {
    console.log('\n✓ Arabic content IS being returned by the query');
    console.log('Issue is likely in the React hook filtering or display logic\n');
  } else {
    console.log('\n✗ Arabic content is NOT being returned by the query');
    console.log('Issue is at the Supabase database level\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
