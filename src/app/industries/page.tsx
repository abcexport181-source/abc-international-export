'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiGlobe, FiCheckSquare, FiClipboard, FiArrowRight } from 'react-icons/fi';
import { supabase, IndustryData, isSupabaseConfigured } from '@/lib/supabase';
import { industriesData } from '@/data/products';
import { useWebsiteData } from '@/hooks/useWebsiteData';

export default function IndustriesPage() {
  const { getContent } = useWebsiteData();
  const [industries, setIndustries] = useState<IndustryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIndustries() {
      if (!isSupabaseConfigured) {
        setIndustries(industriesData.map(i => ({...i, is_visible: true, full_info: i.fullInfo, description_short: i.desc})));
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('industries')
        .select('*')
        .eq('is_visible', true)
        .order('title');
      
      if (data) setIndustries(data);
      setLoading(false);
    }
    fetchIndustries();
  }, []);

  return (
    <>
      <section 
        className="heroBand heroBandCentered"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getContent('industries', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <h1>{getContent('industries', 'Hero', 'title', 'Industries We Serve')}</h1>
          <p>{getContent('industries', 'Hero', 'desc', 'Comprehensive sourcing expertise across diverse manufacturing sectors in India.')}</p>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading industries...</div>
          ) : (
            <div className="cardsGrid3">
              {industries.map((item) => (
                <Link href={`/industries/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                  <article className="card" style={{ height: '100%', cursor: 'pointer', padding: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1 }}>{item.icon}</div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#1b2638' }}>{item.title}</h3>
                    <p className="muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{item.description_short}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {item.keys.slice(0, 4).map(k => (
                        <span key={k} style={{ background: '#f3f4f6', color: '#4b5563', fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: '20px' }}>
                          {k}
                        </span>
                      ))}
                      {item.keys.length > 4 && (
                        <span style={{ fontSize: '0.8rem', color: '#718096', alignSelf: 'center' }}>
                          +{item.keys.length - 4} more
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f5ff5', fontWeight: 600, fontSize: '0.9rem' }}>
                      View All Products <FiArrowRight />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section sectionSoft" style={{ paddingTop: 0, textAlign: 'center' }}>
        <div className="container">
          <h2>Don&apos;t See Your Industry?</h2>
          <p className="muted">
            Our sourcing network handles specialized requirements. If your sector is not listed, we
            can still help find the right manufacturers in India.
          </p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>
              Discuss Your Requirements
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Why Choose Our Multi-Industry Expertise</h2>
          </div>
          <div className="cardsGrid3">
            {[
              {
                title: 'Vast Network',
                desc: 'Connections with thousands of verified manufacturers across all major industries',
                Icon: FiGlobe
              },
              {
                title: 'Quality Assurance',
                desc: 'Industry-specific quality standards and inspection protocols',
                Icon: FiCheckSquare
              },
              {
                title: 'Compliance Expertise',
                desc: 'Deep knowledge of export regulations for each industry segment',
                Icon: FiClipboard
              }
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', padding: '1rem' }}>
                <div className="iconCircle" style={{ width: '64px', height: '64px', fontSize: '1.8rem', margin: '0 auto 1.5rem auto' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.8rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaBand">
        <div className="container">
          <h3>Ready to Source from India?</h3>
          <p style={{ color: '#dbe8ff' }}>
            Whatever your industry, we have the expertise and network to help you source quality
            products from India.
          </p>
          <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.7rem', justifyContent: 'center' }}>
            <a href="/sourcing" className="btnPrimary">
              Explore Sourcing Services
            </a>
            <a href="/contact" className="btnSecondary">
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
