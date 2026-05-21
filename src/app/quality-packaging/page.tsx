'use client'
import React from 'react';
import { FiShield, FiEye, FiFileText, FiCheckCircle, FiPackage, FiClipboard } from 'react-icons/fi';
import { FaVial, FaRecycle, FaLeaf } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { MediaBackground, MediaBlock } from '@/components/common/EditableMedia';

const qualitySteps = [
  {
    title: 'Supplier Verification',
    desc: 'Thorough vetting of manufacturers including facility audits, certifications review, and capability assessment',
    Icon: FiShield
  },
  {
    title: 'Sample Approval',
    desc: 'Comprehensive testing of samples against your specifications before production authorization',
    Icon: FaVial
  },
  {
    title: 'Pre-Shipment Inspection',
    desc: 'Final quality check before shipping including visual inspection, measurements, and functionality tests',
    Icon: FiEye
  },
  {
    title: 'Documentation',
    desc: 'Complete quality certificates, test reports, and compliance documentation for your records',
    Icon: FiFileText
  }
];

const packagingSolutions = [
  {
    title: 'Export Packaging',
    desc: 'Heavy-duty packaging designed for international shipping, including palletization and containerization',
    Icon: FiPackage
  },
  {
    title: 'Retail Packaging',
    desc: 'Consumer-ready packaging with custom branding, labels, and presentation materials',
    Icon: FiPackage
  },
  {
    title: 'Private Label Packaging',
    desc: 'Complete white-label packaging solutions with your brand identity and specifications',
    Icon: FiClipboard
  },
  {
    title: 'Protective Packaging',
    desc: 'Specialized packaging for fragile, hazardous, or temperature-sensitive products',
    Icon: FiShield
  }
];

const packagingTypes = [
  {
    title: 'Industrial Packaging',
    tags: ['Corrugated boxes', 'Wooden crates', 'Pallets', 'Stretch wrap', 'Industrial drums']
  },
  {
    title: 'Consumer Packaging',
    tags: ['Folding cartons', 'Blister packs', 'Pouches', 'Bottles & jars', 'Display boxes']
  },
  {
    title: 'Specialty Packaging',
    tags: ['Vacuum packaging', 'Modified atmosphere', 'Temperature controlled', 'Anti-static', 'Hazmat compliant']
  }
];

export default function QualityPackagingPage() {
  const { getContent, loading } = useWebsiteData();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: '#ffffff',
        gap: '1.5rem',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #e7ecf4',
          borderTop: '3px solid #1f5ff5',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}></div>
        <p style={{
          color: '#66738d',
          fontSize: '0.95rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}>
          Loading Live Version...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <MediaBackground 
        className="heroBand"
        url={getContent('quality-packaging', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1521331908054-9a180b7d3912?auto=format&fit=crop&q=80&w=2000')}
      >
        <div className="container">
          <h1>{getContent('quality-packaging', 'Hero', 'title', 'Quality Assurance & Export Packaging')}</h1>
          <p>{getContent('quality-packaging', 'Hero', 'desc', 'Reliable quality checks and secure export packaging to deliver consistent products worldwide.')}</p>
        </div>
      </MediaBackground>

      <section id="inspection" className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('quality-packaging', 'Inspection', 'title', 'Quality Inspection Process')}</h2>
          </div>
          <div className="cardsGrid4">
            {qualitySteps.map((item, idx) => (
              <article className="card" key={idx} style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{getContent('quality-packaging', 'Inspection', `item${idx+1}_title`, item.title)}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{getContent('quality-packaging', 'Inspection', `item${idx+1}_desc`, item.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <MediaBlock className="imageBlock" url={getContent('quality-packaging', 'Standards', 'side_img', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000')} alt="Inspection standards" />
          <div>
            <h2>{getContent('quality-packaging', 'Standards', 'title', 'Our Inspection Standards')}</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              {getContent('quality-packaging', 'Standards', 'desc', 'We implement comprehensive quality checks at every stage to ensure your products meet the highest standards.')}
            </p>
            <ul className="checkList" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text)' }}>
              {[
                'Factory audit and capability assessment',
                'Raw material verification',
                'In-process quality monitoring',
                'Finished product inspection',
                'Packaging and labeling verification',
                'Documentation compliance check'
              ].map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem' }}>
                  <FiCheckCircle className="checkIcon" /> {getContent('quality-packaging', 'Standards', `item${idx+1}`, item)}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '1.8rem', background: '#f4f8ff', padding: '1rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem', color: '#4a5568' }}>
              <strong>{getContent('quality-packaging', 'Standards', 'note_bold', 'Third-party inspection services')}</strong> {getContent('quality-packaging', 'Standards', 'note_desc', 'are available on request for additional assurance')}
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('quality-packaging', 'Solutions', 'title', 'Packaging Solutions')}</h2>
            <p>
              {getContent('quality-packaging', 'Solutions', 'desc', 'Professional packaging designed for safe international transit and market-ready presentation')}
            </p>
          </div>
          <div className="cardsGrid4">
            {packagingSolutions.map((item, idx) => (
              <article className="card" key={idx} style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{getContent('quality-packaging', 'Solutions', `item${idx+1}_title`, item.title)}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{getContent('quality-packaging', 'Solutions', `item${idx+1}_desc`, item.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="packaging" className="section">
        <div className="container split">
          <div>
            <h2>{getContent('quality-packaging', 'Options', 'title', 'Comprehensive Packaging Options')}</h2>
            <p className="muted" style={{ marginTop: '0.7rem', marginBottom: '2rem' }}>
              {getContent('quality-packaging', 'Options', 'desc', 'From industrial bulk packaging to retail-ready presentation, we provide solutions for every need.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packagingTypes.map((pt, idx) => (
                <article className="card" key={idx} style={{ padding: '1.5rem', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>{getContent('quality-packaging', 'Options', `type${idx+1}_title`, pt.title)}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {pt.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ background: '#f0f5ff', color: '#1f5ff5', fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                        {getContent('quality-packaging', 'Options', `type${idx+1}_tag${tIdx+1}`, tag)}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <MediaBlock className="imageBlock" url={getContent('quality-packaging', 'Options', 'side_img', 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000')} alt="Packaging options" />
        </div>
      </section>

      <section className="section" style={{ background: '#07a63d', color: '#fff' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#fff' }}>{getContent('quality-packaging', 'Sustainable', 'title', 'Sustainable Packaging Solutions')}</h2>
            <p style={{ color: '#d9ffe7', maxWidth: '700px', margin: '0.7rem auto 0 auto' }}>
              {getContent('quality-packaging', 'Sustainable', 'desc', 'Environmentally responsible packaging options without compromising protection or quality')}
            </p>
          </div>
          <div className="cardsGrid2" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <article className="card" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
                <FaLeaf />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>{getContent('quality-packaging', 'Sustainable', 'item1_title', 'Eco-Friendly Packaging')}</h3>
              <p style={{ color: '#d9ffe7', fontSize: '0.95rem' }}>
                {getContent('quality-packaging', 'Sustainable', 'item1_desc', 'Biodegradable and sustainable packaging materials that reduce environmental impact')}
              </p>
            </article>
            <article className="card" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
                <FaRecycle />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>{getContent('quality-packaging', 'Sustainable', 'item2_title', 'Recyclable Materials')}</h3>
              <p style={{ color: '#d9ffe7', fontSize: '0.95rem' }}>
                {getContent('quality-packaging', 'Sustainable', 'item2_desc', 'Packaging solutions using recyclable materials compliant with global environmental standards')}
              </p>
            </article>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: '#d9ffe7', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaLeaf style={{ fontSize: '1.2rem' }} /> {getContent('quality-packaging', 'Sustainable', 'feat1', 'Biodegradable Options')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaRecycle style={{ fontSize: '1.2rem' }} /> {getContent('quality-packaging', 'Sustainable', 'feat2', 'FSC Certified Materials')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCheckCircle style={{ fontSize: '1.2rem' }} /> {getContent('quality-packaging', 'Sustainable', 'feat3', 'Carbon Neutral Shipping')}
            </div>
          </div>
        </div>
      </section>

      <section id="compliance" className="section sectionSoft" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', color: '#1f5ff5', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <FiClipboard />
          </div>
          <h2>{getContent('quality-packaging', 'Compliance', 'title', 'Compliance & Certification')}</h2>
          <p className="muted" style={{ maxWidth: '700px', margin: '0.8rem auto 2.5rem auto' }}>
            {getContent('quality-packaging', 'Compliance', 'desc', 'All our quality and packaging solutions comply with international standards and country-specific regulations.')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {['ISO Certified', 'FDA Compliant', 'FSSAI Approved', 'CE Marking'].map((cert, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1rem 2rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#1b2638' }}>
                {getContent('quality-packaging', 'Compliance', `cert${idx+1}`, cert)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <MediaBackground className="ctaBand" url={getContent('quality-packaging', 'CTA', 'bg_img', 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=2000')} overlay="rgba(31, 95, 245, 0.9)">
        <div className="container">
          <h3>{getContent('quality-packaging', 'CTA', 'title', 'Need Quality Assurance or Packaging Solutions?')}</h3>
          <p style={{ color: '#dbe8ff' }}>{getContent('quality-packaging', 'CTA', 'desc', 'Speak with our team for product-specific support.')}</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary">
              {getContent('quality-packaging', 'CTA', 'btn_text', 'Contact Us')}
            </a>
          </div>
        </div>
      </MediaBackground>
    </>
  )
}
