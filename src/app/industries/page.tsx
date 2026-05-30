import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { industriesData, productsData } from '@/data/products';
import { FiArrowRight } from 'react-icons/fi';

import { cookies } from 'next/headers';
import { defaultLanguage, stripLanguagePrefix } from '@/lib/languages';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const defaultIndustriesContent = {
  'Hero.badge': 'Our Expertise',
  'Hero.title': 'Industries We Serve',
  'Hero.desc': "Bridging global demand with India's manufacturing excellence across diverse sectors.",
  'Hero.products_link': 'View All Products',
  'Sourcing.title': 'Global Sourcing Made Simple',
  'Sourcing.desc': 'We understand that every industry has unique requirements. Our team specializes in finding the right manufacturers who meet your exact technical specifications and quality standards.',
  'Sourcing.item1': 'Verified Suppliers Only',
  'Sourcing.item2': 'Quality Control Inspections',
  'Sourcing.item3': 'Custom Packaging Solutions',
  'Sourcing.item4': 'End-to-end Logistics Management',
  'Missing.title': "Can't find what you're looking for?",
  'Missing.desc': 'We source thousands of products beyond what is listed here. Get in touch for a custom quote.',
  'Missing.btn_text': 'Contact Sourcing Desk'
};

const obsoleteIndustriesContent: Partial<Record<keyof typeof defaultIndustriesContent, string>> = {
  'Hero.desc': 'Comprehensive sourcing expertise across diverse manufacturing sectors in India.',
  'Missing.title': "Don't See Your Industry?",
  'Missing.desc': 'Our sourcing network handles specialized requirements. If your sector is not listed, we can still help find the right manufacturers in India.',
  'Missing.btn_text': 'Discuss Your Requirements'
};

type IndustryListItem = {
  id: string;
  title: string;
  icon: string;
  description_short: string;
  is_visible: boolean;
};

type ProductListItem = {
  id: string;
  category_id: string;
  is_visible: boolean;
};

type SiteContentRow = {
  section_name: string;
  content_key: string;
  content_value: string;
  language_code: string;
};

const getCurrentContentValue = (
  key: keyof typeof defaultIndustriesContent,
  value: string
) => value === obsoleteIndustriesContent[key] ? defaultIndustriesContent[key] : value;

const getSupabaseClient = () => {
  if (!supabaseUrl.startsWith('http') || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: 'no-store' });
      }
    }
  });
};

const getMockIndustries = (): IndustryListItem[] =>
  industriesData.map(industry => ({
    id: industry.id,
    title: industry.title,
    icon: industry.icon,
    description_short: industry.desc,
    is_visible: true
  }));

const getMockProducts = (): ProductListItem[] =>
  productsData.map(product => ({
    id: product.id,
    category_id: product.category,
    is_visible: true
  }));

async function getIndustriesAndProducts(lang: string) {
  let industries: IndustryListItem[] = [];
  let products: ProductListItem[] = [];

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data: indData } = await supabase
      .from('industries')
      .select('*')
      .eq('is_visible', true)
      .eq('language_code', lang)
      .order('title');
    const { data: enIndData } = await supabase
      .from('industries')
      .select('*')
      .eq('is_visible', true)
      .eq('language_code', 'en')
      .order('title');
      
    const { data: prodData } = await supabase
      .from('products')
      .select('id, category_id, is_visible')
      .eq('is_visible', true)
      .eq('language_code', lang);
    const { data: enProdData } = await supabase
      .from('products')
      .select('id, category_id, is_visible')
      .eq('is_visible', true)
      .eq('language_code', 'en');
    
    const visibleTranslatedIndustries = indData || [];
    const visibleEnglishIndustries = enIndData || [];
    const activeIndustries = visibleTranslatedIndustries.length > 0
      ? visibleTranslatedIndustries
      : visibleEnglishIndustries;

    if (activeIndustries.length > 0) {
      const englishIcons = new Map(visibleEnglishIndustries.map((industry) => [
        stripLanguagePrefix(industry.id),
        industry.icon
      ]));
      industries = activeIndustries.map((industry) => ({
        id: industry.id,
        title: industry.title,
        icon: englishIcons.get(stripLanguagePrefix(industry.id)) || industry.icon,
        description_short: industry.description_short,
        is_visible: industry.is_visible
      }));
    }

    products = (visibleTranslatedIndustries.length > 0 ? prodData : enProdData) || [];
  }

  if (industries.length === 0) {
    industries = getMockIndustries();
    products = getMockProducts();
  }

  return { industries, products };
}

async function getIndustriesContent(lang: string) {
  const content = { ...defaultIndustriesContent };
  const supabase = getSupabaseClient();
  if (!supabase) return content;

  const { data } = await supabase
    .from('site_content')
    .select('section_name, content_key, content_value, language_code')
    .eq('page_name', 'industries')
    .in('language_code', Array.from(new Set(['en', lang])));

  const rows = (data || []) as SiteContentRow[];
  for (const item of rows.filter(item => item.language_code === 'en')) {
    const key = `${item.section_name}.${item.content_key}` as keyof typeof defaultIndustriesContent;
    if (key in content) content[key] = getCurrentContentValue(key, item.content_value || content[key]);
  }
  for (const item of rows.filter(item => item.language_code === lang)) {
    const key = `${item.section_name}.${item.content_key}` as keyof typeof defaultIndustriesContent;
    if (key in content) content[key] = getCurrentContentValue(key, item.content_value || content[key]);
  }

  return content;
}

export default async function IndustriesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('site_language')?.value || defaultLanguage;

  const { industries, products } = await getIndustriesAndProducts(lang);
  const content = await getIndustriesContent(lang);

  return (
    <>
      <section className="section sectionSoft" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="sectionHeader">
            <span className="badge">{content['Hero.badge']}</span>
            <h1>{content['Hero.title']}</h1>
            <p>{content['Hero.desc']}</p>
          </div>

          <div className="cardsGrid3">
            {industries.map((industry) => {
              const industrySlug = stripLanguagePrefix(industry.id);
              const hasProducts = products.some(p => stripLanguagePrefix(p.category_id) === industrySlug && p.is_visible);
              
              return (
                <div key={industry.id} className="card industryCard" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  padding: '2.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="iconBox" style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1.5rem',
                    width: '70px',
                    height: '70px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px'
                  }}>
                    {industry.icon}
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', color: '#1b2638', marginBottom: '1rem' }}>{industry.title}</h3>
                  <p className="muted" style={{ marginBottom: '2rem', flexGrow: 1, lineHeight: '1.6' }}>
                    {industry.description_short}
                  </p>
                  
                  {hasProducts ? (
                    <Link href={`/industries/${industrySlug}`} className="link" style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontWeight: 600,
                      color: '#1f5ff5'
                    }}>
                      {content['Hero.products_link']} <FiArrowRight />
                    </Link>
                  ) : (
                    <span style={{ height: '24px' }}></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Sourcing Section */}
      <section className="section">
        <div className="container split" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{content['Sourcing.title']}</h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.7', marginBottom: '2rem' }}>
              {content['Sourcing.desc']}
            </p>
            <ul className="checkList">
              <li>{content['Sourcing.item1']}</li>
              <li>{content['Sourcing.item2']}</li>
              <li>{content['Sourcing.item3']}</li>
              <li>{content['Sourcing.item4']}</li>
            </ul>
          </div>
          <div style={{ flex: 1, background: '#1b2638', borderRadius: '20px', padding: '4rem', color: '#fff', textAlign: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{content['Missing.title']}</h3>
            <p style={{ opacity: 0.9, marginBottom: '2rem' }}>{content['Missing.desc']}</p>
            <Link href="/contact" className="btnPrimary" style={{ background: '#fff', color: '#1b2638' }}>{content['Missing.btn_text']}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
