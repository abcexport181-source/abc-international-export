'use client'
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, ProductData, isSupabaseConfigured } from '@/lib/supabase';
import { productsData } from '@/data/products';
import { FiCheckCircle, FiShield, FiPackage, FiTruck, FiFileText, FiMapPin, FiMail } from 'react-icons/fi';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!isSupabaseConfigured) {
        const prod = productsData.find(p => p.id === slug);
        if (prod) {
          setProduct({...prod, category_id: prod.category, export_details: prod.exportDetails, is_visible: true});
        }
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .eq('is_visible', true)
        .single();
      
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading product details...</div>;
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
            <Link href={`/industries/${product.category_id}`} style={{ color: '#1f5ff5' }}>{product.category_id.replace('-', ' ')}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span style={{ color: '#1b2638', fontWeight: 600 }}>{product.name}</span>
          </nav>

          <div className="container split" style={{ alignItems: 'start', gap: '4rem' }}>
            {/* Left Side: Product Images */}
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

            {/* Right Side: Product Details */}
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
                  {product.features.map(feature => (
                    <li key={feature} style={{ marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                      <FiCheckCircle className="checkIcon" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Export Specifications Box */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPackage /> Global Export Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MOQ</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details.moq}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Origin</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details.origin}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Capacity</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details.capacity}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Port of Delivery</p>
                    <p style={{ fontWeight: 600 }}>{product.export_details.delivery}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/contact" className="btnPrimary" style={{ flex: 1, padding: '1rem' }}>
                  Request Quotation
                </Link>
                <Link href="/contact" className="btnSecondary" style={{ flex: 1, padding: '1rem' }}>
                  Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Table */}
      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'left' }}>
            <h2>Technical Specifications</h2>
            <p>Detailed chemical and physical properties of our {product.name.toLowerCase()}.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <tr key={key} style={{ borderBottom: idx === Object.entries(product.specs).length - 1 ? 'none' : '1px solid #edf2f7' }}>
                    <td style={{ padding: '1.2rem', background: '#fcfdfe', width: '30%', fontWeight: 600, color: '#4a5568' }}>{key}</td>
                    <td style={{ padding: '1.2rem', color: '#1b2638' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Compliance & Shipping Footer */}
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
            <p className="muted" style={{ fontSize: '0.85rem' }}>{product.export_details.packaging}</p>
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
