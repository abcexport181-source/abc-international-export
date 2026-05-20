import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { productsData } from '@/data/products';
import { FiCheckCircle, FiShield, FiPackage, FiTruck, FiFileText, FiMapPin, FiMail, FiArrowRight } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

import { cookies } from 'next/headers';
import { defaultLanguage } from '@/lib/languages';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get('site_language')?.value || defaultLanguage;

  const baseSlug = slug.replace(/^(en|es|fr|de|it|pt|nl|ru|zh|ja|ko|ar|hi|tr):/, '');
  const langSlug = lang === 'en' ? baseSlug : `${lang}:${baseSlug}`;
  
  let product: any = null;

  // Try fetching from Supabase first
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', langSlug)
      .eq('is_visible', true)
      .single();
    
    if (data) {
      product = data;
    } else {
      // Fallback to English version if translation is missing
      const { data: enProd } = await supabase
        .from('products')
        .select('*')
        .eq('id', `en:${baseSlug}`)
        .eq('is_visible', true)
        .single();
      
      if (enProd) {
        product = enProd;
      } else {
        const { data: legacyProd } = await supabase
          .from('products')
          .select('*')
          .eq('id', baseSlug)
          .eq('is_visible', true)
          .single();
        if (legacyProd) product = legacyProd;
      }
    }
  }

  // Fallback to mock data (English only)
  if (!product && lang === 'en') {
    const mockProd = productsData.find(p => p.id === baseSlug);
    if (mockProd) {
      product = {
        ...mockProd, 
        category_id: mockProd.category, 
        export_details: mockProd.exportDetails, 
        is_visible: true
      };
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="section" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#718096' }}>
            <Link href="/industries" style={{ color: '#1f5ff5' }}>Industries</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href={`/industries/${product.category_id}`} style={{ color: '#1f5ff5' }}>{product.category_id.replace(/^(en|es|fr|de|it|pt|nl|ru|zh|ja|ko|ar|hi|tr):/, '').replace('-', ' ')}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#1b2638', fontWeight: 600 }}>{product.name}</span>
          </nav>

          <div className="container split" style={{ alignItems: 'start', gap: '4rem' }}>
            <div style={{ flex: 1.2 }}>
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid #edf2f7',
                background: '#f8fafc',
                marginBottom: '1rem'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', display: 'block' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: '1px solid #edf2f7',
                    aspectRatio: '1/1',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }}>
                    <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1.5 }}>
              <h1 style={{ fontSize: '2.2rem', color: '#1b2638', marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #edf2f7' }}>
                <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>Merchant Exporter: <strong>ABC International</strong></span>
                <span style={{ color: '#1f5ff5', fontSize: '0.9rem', fontWeight: 600 }}>Verified Supplier</span>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>About this product</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>{product.description}</p>
                <ul className="checkList" style={{ color: '#1b2638' }}>
                  {product.features?.map((feature: string) => (
                    <li key={feature} style={{ marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                      <FiCheckCircle className="checkIcon" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPackage /> Global Export Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MOQ</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details?.moq || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Origin</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details?.origin || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Capacity</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details?.capacity || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Port of Delivery</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details?.delivery || '-'}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/contact" className="btnPrimary" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                  Request Quotation
                </Link>
                <Link href="/contact" className="btnSecondary" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                  Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'left' }}>
            <h2>Technical Specifications</h2>
            <p>Detailed chemical and physical properties of our product.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(product.specs || {}).map(([key, value]: [string, any], idx) => (
                  <tr key={key} style={{ 
                    borderBottom: idx === Object.entries(product.specs || {}).length - 1 ? 'none' : '1px solid #edf2f7',
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={{ 
                      padding: '1.2rem', 
                      background: '#f8fafc', 
                      width: '30%', 
                      fontWeight: 600, 
                      color: '#4a5568',
                      borderRight: '1px solid #edf2f7'
                    }}>{key}</td>
                    <td style={{ padding: '1.2rem', color: '#1b2638', background: '#fff' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cardsGrid4">
          <div className="card" style={{ padding: '1.5rem' }}>
            <FiShield style={{ color: '#1f5ff5', fontSize: '1.5rem', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Quality Assurance</h4>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Pre-shipment inspection by SGS or Intertek available.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <FiFileText style={{ color: '#1f5ff5', fontSize: '1.5rem', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Compliance</h4>
            <p className="muted" style={{ fontSize: '0.85rem' }}>All export certificates provided: COO, MSDS, FSSAI, etc.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <FiPackage style={{ color: '#1f5ff5', fontSize: '1.5rem', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Packaging</h4>
            <p className="muted" style={{ fontSize: '0.85rem' }}>{product.export_details?.packaging || '-'}</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <FiTruck style={{ color: '#1f5ff5', fontSize: '1.5rem', marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Shipping</h4>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Global delivery via Sea or Air Freight.</p>
          </div>
        </div>
      </section>
    </>
  );
}
