import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { industriesData, productsData } from '@/data/products';
import { FiArrowRight } from 'react-icons/fi';

import { cookies } from 'next/headers';
import { defaultLanguage } from '@/lib/languages';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const languagePrefixPattern = /^(en|es|fr|de|it|pt|nl|ru|zh|ja|ko|ar|hi|tr):/;

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

const normalizeId = (id: string) => id.replace(languagePrefixPattern, '');

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

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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
        normalizeId(industry.id),
        industry.icon
      ]));
      industries = activeIndustries.map((industry) => ({
        id: industry.id,
        title: industry.title,
        icon: englishIcons.get(normalizeId(industry.id)) || industry.icon,
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

export default async function IndustriesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('site_language')?.value || defaultLanguage;

  const { industries, products } = await getIndustriesAndProducts(lang);

  return (
    <>
      <section className="section sectionSoft" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="sectionHeader">
            <span className="badge">Our Expertise</span>
            <h1>Industries We Serve</h1>
            <p>Bridging global demand with India&apos;s manufacturing excellence across diverse sectors.</p>
          </div>

          <div className="cardsGrid3">
            {industries.map((industry) => {
              const industrySlug = normalizeId(industry.id);
              const hasProducts = products.some(p => normalizeId(p.category_id) === industrySlug && p.is_visible);
              
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
                      View All Products <FiArrowRight />
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
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Global Sourcing Made Simple</h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.7', marginBottom: '2rem' }}>
              We understand that every industry has unique requirements. Our team specializes in finding the right manufacturers who meet your exact technical specifications and quality standards.
            </p>
            <ul className="checkList">
              <li>Verified Suppliers Only</li>
              <li>Quality Control Inspections</li>
              <li>Custom Packaging Solutions</li>
              <li>End-to-end Logistics Management</li>
            </ul>
          </div>
          <div style={{ flex: 1, background: '#1b2638', borderRadius: '20px', padding: '4rem', color: '#fff', textAlign: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Can&apos;t find what you&apos;re looking for?</h3>
            <p style={{ opacity: 0.9, marginBottom: '2rem' }}>We source thousands of products beyond what is listed here. Get in touch for a custom quote.</p>
            <Link href="/contact" className="btnPrimary" style={{ background: '#fff', color: '#1b2638' }}>Contact Sourcing Desk</Link>
          </div>
        </div>
      </section>
    </>
  );
}
