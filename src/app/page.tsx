'use client'
import React from 'react';
import { FiPackage, FiGlobe, FiShield, FiTruck, FiCheckCircle, FiTarget, FiFileText, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import { FaLeaf, FaBoxOpen, FaCogs, FaFlask, FaShoppingBag, FaPalette } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';

  // Handled dynamically in the component

const industries = ['Agro & Food', 'Packaging', 'Industrial', 'Chemicals', 'Consumer Products', 'Handicrafts']

export default function Home() {
  const { getContent, loading } = useWebsiteData();
  const heroBg = getContent('home', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000');
  const isHeroVideo = /\.(webm|mp4|mov)(\?|#|$)/i.test(heroBg);

  return (
    <>
      <section 
        className="heroBand" 
        style={{ 
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: isHeroVideo ? undefined : `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isHeroVideo && (
          <>
            <video
              src={heroBg}
              autoPlay
              muted
              loop
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          </>
        )}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1>
            {getContent('home', 'Hero', 'title', 'Your Trusted Merchant Exporter from India')}
          </h1>
          <p>
            {getContent('home', 'Hero', 'desc', 'Global sourcing expertise backed by comprehensive logistics support')}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem' }}>
            <a href="/sourcing" className="btnPrimary">
              {getContent('home', 'Hero', 'btn_sourcing', 'Explore Sourcing')}
            </a>
            <a href="/contact" className="btnSecondary">
              {getContent('home', 'Hero', 'btn_contact', 'Get in Touch')}
            </a>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('home', 'Who We Are', 'title', 'Who We Are')}</h2>
            <p>
              {getContent('home', 'Who We Are', 'p1', 'ABC International is a trusted merchant exporter and comprehensive sourcing partner based in India.')}
            </p>
            <p style={{ marginTop: '0.8rem' }}>
              {getContent('home', 'Who We Are', 'p2', "Backed by Linear Global's logistics expertise, we provide end-to-end export solutions from identifying the right suppliers to ensuring compliant, timely delivery to global markets.")}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('home', 'Services', 'title', 'What We Do')}</h2>
          </div>
          <div className="cardsGrid4">
            {[
              { id: 1, icon: FiPackage },
              { id: 2, icon: FiGlobe },
              { id: 3, icon: FiShield },
              { id: 4, icon: FiTruck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.id} className="card" style={{ textAlign: 'center' }}>
                  <span className="iconDot"><Icon /></span>
                  <h3>{getContent('home', 'Services', `s${item.id}_title`, 'Service Title')}</h3>
                  <p className="muted" style={{ marginTop: '0.5rem' }}>
                    {getContent('home', 'Services', `s${item.id}_desc`, 'Service description goes here.')}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section heroBand" style={{ padding: '3rem 0' }}>
        <div className="container split">
          <div>
            <h2 style={{ color: '#fff' }}>{getContent('home', 'Logistics', 'title', 'Logistics Expertise That Sets Us Apart')}</h2>
            <p style={{ color: '#dbe8ff', marginTop: '0.65rem' }}>
              {getContent('home', 'Logistics', 'desc', "With Linear Global's proven logistics network, we handle every aspect of export logistics—from documentation to customs clearance to final delivery.")}
            </p>
            <ul className="checkList" style={{ color: '#dbe8ff', marginTop: '1rem' }}>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('home', 'Logistics', 'item1', 'Complete export documentation')}</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('home', 'Logistics', 'item2', 'Air and sea freight management')}</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('home', 'Logistics', 'item3', 'Customs compliance and clearance')}</li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <a href="/logistics" className="btnPrimary">
                {getContent('home', 'Logistics', 'btn_text', 'Learn More')}
              </a>
            </div>
          </div>
          <div className="imageBlock">
            <img 
              src={getContent('home', 'Logistics', 'side_img', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000')} 
              alt="Logistics" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="imageBlock">
            <img 
              src={getContent('home', 'Sourcing', 'side_img', 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000')} 
              alt="Sourcing" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
          <div>
            <h2>{getContent('home', 'Sourcing', 'title', 'Comprehensive Sourcing Capability')}</h2>
            <p style={{ marginTop: '0.65rem' }} className="muted">
              {getContent('home', 'Sourcing', 'desc', "We source a wide range of products, raw materials, and packaging solutions from India's most reliable manufacturers.")}
            </p>
            <ul className="featureList" style={{ marginTop: '1.2rem' }}>
              <li className="featureItem">
                <div className="featureIcon"><FiBriefcase /></div>
                <div className="featureText">
                  <strong>{getContent('home', 'Sourcing', 'item1_title', 'Verified Suppliers')}</strong>
                  <span>{getContent('home', 'Sourcing', 'item1_desc', 'Extensive network of certified manufacturers')}</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon"><FiTarget /></div>
                <div className="featureText">
                  <strong>{getContent('home', 'Sourcing', 'item2_title', 'Custom Requirements')}</strong>
                  <span>{getContent('home', 'Sourcing', 'item2_desc', 'Tailored sourcing for your specific needs')}</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon"><FiFileText /></div>
                <div className="featureText">
                  <strong>{getContent('home', 'Sourcing', 'item3_title', 'Quality Assurance')}</strong>
                  <span>{getContent('home', 'Sourcing', 'item3_desc', 'Strict verification and inspection protocols')}</span>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: '0.9rem' }}>
              <a href="/sourcing" className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>
                {getContent('home', 'Sourcing', 'btn_text', 'View Sourcing Services')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('home', 'Industries', 'title', 'Industries We Serve')}</h2>
          </div>
          <div className="cardsGrid4" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
            {industries.map((item, idx) => {
              let Icon = FaLeaf;
              let color = '#4caf50'; // green
              if (item === 'Packaging') { Icon = FaBoxOpen; color = '#a17255'; } // brown
              if (item === 'Industrial') { Icon = FaCogs; color = '#8892b0'; } // steel/purple
              if (item === 'Chemicals') { Icon = FaFlask; color = '#00bcd4'; } // cyan
              if (item === 'Consumer Products') { Icon = FaShoppingBag; color = '#2196f3'; } // blue
              if (item === 'Handicrafts') { Icon = FaPalette; color = '#ff7b72'; } // pinkish

              return (
                <article key={item} className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', color: color, marginBottom: '0.8rem', display: 'flex', justifyContent: 'center' }}>
                    <Icon />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{getContent('home', 'Industries', `ind_${idx}`, item)}</h3>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/industries" style={{ color: '#1f5ff5', fontWeight: 600 }}>
              {getContent('home', 'Industries', 'btn_text', 'View All Industries →')}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('home', 'Quality', 'title', 'Quality Assurance & Export Packaging')}</h2>
            <p>
              {getContent('home', 'Quality', 'desc', 'We ensure every product meets international standards.')}
            </p>
          </div>
          <div className="cardsGrid3">
            {[1, 2, 3].map((i) => {
              const icons = [FiShield, FiPackage, FiCheckCircle];
              const Icon = icons[i-1];
              return (
                <article key={i} className="card">
                  <div style={{ fontSize: '2.2rem', color: '#1f5ff5', marginBottom: '1rem' }}>
                    <Icon />
                  </div>
                  <h3 style={{ marginBottom: '0.6rem' }}>
                    {getContent('home', 'Quality', `item${i}_title`, 'Quality Item')}
                  </h3>
                  <p className="muted">
                    {getContent('home', 'Quality', `item${i}_desc`, 'Item description.')}
                  </p>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/quality-packaging" style={{ color: '#1f5ff5', fontWeight: 600 }}>
              {getContent('home', 'Quality', 'btn_text', 'Learn More About Quality →')}
            </a>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('home', 'Process', 'title', 'How We Work')}</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ position: 'relative' }}>
                <article className="card" style={{ height: '100%', padding: '1.8rem 1.2rem', textAlign: 'left' }}>
                  <span className="stepNumber">{i}</span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>
                    {getContent('home', 'Process', `step${i}_title`, 'Step Title')}
                  </h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>
                    {getContent('home', 'Process', `step${i}_desc`, 'Step description.')}
                  </p>
                </article>
                {i < 5 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-0.45rem',
                    transform: 'translate(50%, -50%)',
                    color: '#1f5ff5',
                    fontSize: '1.25rem',
                    zIndex: 10
                  }}>
                    <FiArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaBand">
        <div className="container">
          <h3>{getContent('home', 'CTA', 'title', 'Ready to Source from India?')}</h3>
          <p style={{ color: '#dbe8ff' }}>
            {getContent('home', 'CTA', 'desc', "Let's discuss your requirements. Our sourcing team is ready to help you find the right products at the right price.")}
          </p>
          <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <a href="/sourcing" className="btnPrimary">
              {getContent('home', 'CTA', 'btn_sourcing', 'Request Sourcing')}
            </a>
            <a href="/about" className="btnSecondary">
              {getContent('home', 'CTA', 'btn_about', 'Learn More About Us')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
