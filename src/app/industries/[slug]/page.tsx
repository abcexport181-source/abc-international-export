'use client'
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, IndustryData, ProductData, isSupabaseConfigured } from '@/lib/supabase';
import { industriesData, productsData } from '@/data/products';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [industry, setIndustry] = useState<IndustryData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        const ind = industriesData.find(i => i.id === slug);
        if (ind) {
          setIndustry({...ind, is_visible: true, full_info: ind.fullInfo});
          setProducts(productsData.filter(p => p.category === slug).map(p => ({...p, category_id: p.category, export_details: p.exportDetails, is_visible: true})));
        }
        setLoading(false);
        return;
      }
      
      // Fetch industry
      const { data: ind } = await supabase
        .from('industries')
        .select('*')
        .eq('id', slug)
        .eq('is_visible', true)
        .single();
      
      if (!ind) {
        setLoading(false);
        return;
      }

      setIndustry(ind);

      // Fetch products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', slug)
        .eq('is_visible', true);
      
      if (prods) setProducts(prods);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading category data...</div>;
  }

  if (!industry) {
    notFound();
  }

  return (
    <>
      <section className="heroBand heroBandCentered">
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{industry.icon}</div>
          <h1>{industry.title}</h1>
          <p>{industry.full_info}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h2>Available Products in {industry.title}</h2>
            <p style={{ margin: '0.8rem 0 0 0' }}>Explore our premium selection of {industry.title.toLowerCase()} sourced from India&apos;s best manufacturers.</p>
          </div>

          <div className="cardsGrid3">
            {products.map((product) => (
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
            
            {products.length === 0 && (
              <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem' }}>
                <p className="muted">Detailed product listings for this category are being updated. Please contact our sourcing team for specific requirements.</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link href="/contact" className="btnPrimary">Inquire About This Category</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Key Industry Specializations</h2>
          </div>
          <div className="cardsGrid4">
            {industry.keys.map(key => (
              <div key={key} className="card" style={{ padding: '1.2rem', textAlign: 'center' }}>
                <FiCheckCircle style={{ color: '#1f5ff5', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{key}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaBand">
        <div className="container">
          <h3>Looking for something specific in {industry.title}?</h3>
          <p style={{ color: '#dbe8ff' }}>Our network covers thousands of manufacturers. If you don&apos;t see a product here, we can find it for you.</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/contact" className="btnPrimary">Start Sourcing Inquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
