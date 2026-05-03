import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { industriesData, productsData } from '@/data/products';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let industry: any = null;
  let products: any[] = [];

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch industry
    const { data: ind } = await supabase
      .from('industries')
      .select('*')
      .eq('id', slug)
      .eq('is_visible', true)
      .single();
    
    if (ind) {
      industry = ind;
      // Fetch products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', slug)
        .eq('is_visible', true);
      
      if (prods) products = prods;
    }
  }

  // Fallback to mock data
  if (!industry) {
    const mockInd = industriesData.find(i => i.id === slug);
    if (mockInd) {
      industry = {
        ...mockInd, 
        is_visible: true, 
        full_info: mockInd.fullInfo, 
        description_short: mockInd.desc
      };
      products = productsData
        .filter(p => p.category === slug)
        .map(p => ({
          ...p, 
          category_id: p.category, 
          export_details: p.exportDetails, 
          is_visible: true
        }));
    }
  }

  if (!industry) {
    notFound();
  }

  return (
    <>
      <section className="section" style={{ background: '#f8fafc', paddingTop: '4rem' }}>
        <div className="container">
          <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#718096' }}>
            <Link href="/industries" style={{ color: '#1f5ff5' }}>Industries</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#1b2638', fontWeight: 600 }}>{industry.title}</span>
          </nav>

          <div className="container split" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <span className="badge" style={{ marginBottom: '1rem' }}>Sector Excellence</span>
              <h1 style={{ fontSize: '2.5rem', color: '#1b2638', marginBottom: '1.5rem' }}>{industry.title}</h1>
              <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.7', marginBottom: '2rem' }}>{industry.full_info}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {industry.keys?.map((key: string) => (
                  <span key={key} style={{ 
                    padding: '0.5rem 1rem', 
                    background: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#4a5568',
                    fontWeight: 500
                  }}>
                    {key}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ flex: 0.8, textAlign: 'center' }}>
              <div style={{ 
                fontSize: '8rem', 
                background: '#fff', 
                width: '200px', 
                height: '200px', 
                margin: '0 auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)'
              }}>
                {industry.icon}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h2>Available Products in {industry.title}</h2>
            <p style={{ margin: '0.8rem 0 0 0' }}>Explore our premium selection of {industry.title.toLowerCase()} sourced from India&apos;s best manufacturers.</p>
          </div>

          <div className="cardsGrid3">
            {products.map((product: any) => (
              <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                <article className="card" style={{ height: '100%', padding: '0', overflow: 'hidden' }}>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#1b2638' }}>{product.name}</h3>
                    <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                      {product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f5ff5', fontWeight: 600, fontSize: '0.9rem' }}>
                      View Export Details <FiArrowRight />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
