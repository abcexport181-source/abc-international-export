'use client'
import React from 'react';
import { FiShield, FiEye, FiFileText, FiCheckCircle, FiPackage, FiClipboard } from 'react-icons/fi';
import { FaVial, FaRecycle, FaLeaf } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';

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
  const { getContent } = useWebsiteData();

  return (
    <>
      <section 
        className="heroBand"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getContent('quality-packaging', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1521331908054-9a180b7d3912?auto=format&fit=crop&q=80&w=2000')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <h1>{getContent('quality-packaging', 'Hero', 'title', 'Quality Assurance & Export Packaging')}</h1>
          <p>{getContent('quality-packaging', 'Hero', 'desc', 'Reliable quality checks and secure export packaging to deliver consistent products worldwide.')}</p>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Quality Inspection Process</h2>
          </div>
          <div className="cardsGrid4">
            {qualitySteps.map((item) => (
              <article className="card" key={item.title} style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="imageBlock" />
          <div>
            <h2>Our Inspection Standards</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              We implement comprehensive quality checks at every stage to ensure your products meet the highest standards.
            </p>
            <ul className="checkList" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text)' }}>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Factory audit and capability assessment</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Raw material verification</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> In-process quality monitoring</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Finished product inspection</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Packaging and labeling verification</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Documentation compliance check</li>
            </ul>
            <div style={{ marginTop: '1.8rem', background: '#f4f8ff', padding: '1rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem', color: '#4a5568' }}>
              <strong>Third-party inspection services</strong> are available on request for additional assurance
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Packaging Solutions</h2>
            <p>
              Professional packaging designed for safe international transit and market-ready presentation
            </p>
          </div>
          <div className="cardsGrid4">
            {packagingSolutions.map((item) => (
              <article className="card" key={item.title} style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Comprehensive Packaging Options</h2>
            <p className="muted" style={{ marginTop: '0.7rem', marginBottom: '2rem' }}>
              From industrial bulk packaging to retail-ready presentation, we provide solutions for every need.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packagingTypes.map(pt => (
                <article className="card" key={pt.title} style={{ padding: '1.5rem', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>{pt.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {pt.tags.map(tag => (
                      <span key={tag} style={{ background: '#f0f5ff', color: '#1f5ff5', fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="imageBlock" />
        </div>
      </section>

      <section className="section" style={{ background: '#07a63d', color: '#fff' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: '#fff' }}>Sustainable Packaging Solutions</h2>
            <p style={{ color: '#d9ffe7', maxWidth: '700px', margin: '0.7rem auto 0 auto' }}>
              Environmentally responsible packaging options without compromising protection or quality
            </p>
          </div>
          <div className="cardsGrid2" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <article className="card" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
                <FaLeaf />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>Eco-Friendly Packaging</h3>
              <p style={{ color: '#d9ffe7', fontSize: '0.95rem' }}>
                Biodegradable and sustainable packaging materials that reduce environmental impact
              </p>
            </article>
            <article className="card" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
                <FaRecycle />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>Recyclable Materials</h3>
              <p style={{ color: '#d9ffe7', fontSize: '0.95rem' }}>
                Packaging solutions using recyclable materials compliant with global environmental standards
              </p>
            </article>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: '#d9ffe7', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaLeaf style={{ fontSize: '1.2rem' }} /> Biodegradable Options
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaRecycle style={{ fontSize: '1.2rem' }} /> FSC Certified Materials
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCheckCircle style={{ fontSize: '1.2rem' }} /> Carbon Neutral Shipping
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', color: '#1f5ff5', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <FiClipboard />
          </div>
          <h2>Compliance & Certification</h2>
          <p className="muted" style={{ maxWidth: '700px', margin: '0.8rem auto 2.5rem auto' }}>
            All our quality and packaging solutions comply with international standards and country-specific regulations.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {['ISO Certified', 'FDA Compliant', 'FSSAI Approved', 'CE Marking'].map(cert => (
              <div key={cert} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1rem 2rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#1b2638' }}>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaBand">
        <div className="container">
          <h3>Need Quality Assurance or Packaging Solutions?</h3>
          <p style={{ color: '#dbe8ff' }}>Speak with our team for product-specific support.</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
