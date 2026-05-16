'use client'
import React from 'react';
import { FiPackage, FiGlobe, FiCheckCircle, FiArrowRight, FiFileText, FiShield, FiTruck } from 'react-icons/fi';
import { FaIndustry } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';



export default function AboutPage() {
  const { getContent, loading } = useWebsiteData();

  const approach = [
    { title: getContent('about', 'Approach', 'step1_title', 'Understand Requirement'), description: getContent('about', 'Approach', 'step1_desc', 'Deep dive into your specific product and market needs') },
    { title: getContent('about', 'Approach', 'step2_title', 'Identify Suppliers'), description: getContent('about', 'Approach', 'step2_desc', 'Match you with verified manufacturers from our network') },
    { title: getContent('about', 'Approach', 'step3_title', 'Verify Quality'), description: getContent('about', 'Approach', 'step3_desc', 'Conduct thorough quality checks and sample testing') },
    { title: getContent('about', 'Approach', 'step4_title', 'Handle Compliance'), description: getContent('about', 'Approach', 'step4_desc', 'Manage all export documentation and regulations') },
    { title: getContent('about', 'Approach', 'step5_title', 'Ship Globally'), description: getContent('about', 'Approach', 'step5_desc', 'Ensure safe, timely delivery to your destination') }
  ]

  const reasons = [
    { title: getContent('about', 'Why Choose Us', 'item1_title', 'Multi-Industry Sourcing'), description: getContent('about', 'Why Choose Us', 'item1_desc', 'Access to suppliers across agro, packaging, industrial, chemicals, consumer goods, and more'), Icon: FiGlobe },
    { title: getContent('about', 'Why Choose Us', 'item2_title', 'Export Expertise'), description: getContent('about', 'Why Choose Us', 'item2_desc', 'Complete knowledge of international trade compliance and documentation'), Icon: FiFileText },
    { title: getContent('about', 'Why Choose Us', 'item3_title', 'Verified Manufacturers'), description: getContent('about', 'Why Choose Us', 'item3_desc', 'Pre-vetted, certified suppliers with proven track records'), Icon: FaIndustry },
    { title: getContent('about', 'Why Choose Us', 'item4_title', 'Quality Control'), description: getContent('about', 'Why Choose Us', 'item4_desc', 'Rigorous inspection protocols at every stage'), Icon: FiShield },
    { title: getContent('about', 'Why Choose Us', 'item5_title', 'Packaging Solutions'), description: getContent('about', 'Why Choose Us', 'item5_desc', 'Export-grade packaging tailored to your product needs'), Icon: FiPackage },
    { title: getContent('about', 'Why Choose Us', 'item6_title', 'Logistics Support'), description: getContent('about', 'Why Choose Us', 'item6_desc', 'End-to-end shipping backed by Linear Global'), Icon: FiTruck }
  ]

  return (
    <>
      <section 
        className="heroBand" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getContent('about', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <h1>{getContent('about', 'Hero', 'title', 'About ABC International')}</h1>
          <p>{getContent('about', 'Hero', 'desc', 'Your trusted partner for high-quality sourcing and global export support from India.')}</p>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container split">
          <div>
            <h2>{getContent('about', 'Who We Are', 'title', 'Who We Are')}</h2>
            <div className="muted" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {getContent('about', 'Main', 'content', `ABC International is a premier merchant exporter and comprehensive sourcing partner based in India.

We bridge the gap between global buyers and India's vast manufacturing ecosystem, helping businesses worldwide access quality products at competitive prices.

What sets us apart is our backing by Linear Global—a trusted name in logistics—giving us unparalleled expertise in export documentation, shipping, and compliance.

Whether you need raw materials, finished products, packaging, or private label manufacturing, we have the network, knowledge, and logistics capability to deliver.`)}
            </div>
          </div>
          <div className="imageBlock">
            <img 
              src={getContent('about', 'Main', 'side_img', 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000')} 
              alt="About Us" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('about', 'Merchant Exporter', 'title', 'Merchant Exporter + Sourcing Partner')}</h2>
            <p>
              {getContent('about', 'Merchant Exporter', 'subtitle', "We don't just facilitate exports—we actively source products on your behalf, ensuring quality, compliance, and timely delivery.")}
            </p>
          </div>
          <div className="cardsGrid2" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <article className="card" style={{ padding: '2.5rem 2.2rem' }}>
              <div className="iconCircle">
                <FiPackage />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>{getContent('about', 'Merchant Exporter', 'col1_title', 'As Your Sourcing Partner')}</h3>
              <ul className="checkList" style={{ color: 'var(--text)' }}>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col1_item1', 'Identify and vet manufacturers based on your requirements')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col1_item2', 'Negotiate pricing and terms on your behalf')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col1_item3', 'Arrange samples and conduct quality inspections')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col1_item4', 'Custom sourcing for specialized products')}</li>
              </ul>
            </article>
            <article className="card" style={{ padding: '2.5rem 2.2rem' }}>
              <div className="iconCircle">
                <FiGlobe />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>{getContent('about', 'Merchant Exporter', 'col2_title', 'As Merchant Exporter')}</h3>
              <ul className="checkList" style={{ color: 'var(--text)' }}>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col2_item1', 'Handle all export documentation and compliance')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col2_item2', 'Manage customs clearance and shipping logistics')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col2_item3', 'Provide certificates (COO, Phytosanitary, FSSAI, etc.)')}</li>
                <li><FiCheckCircle className="checkIcon" /> {getContent('about', 'Merchant Exporter', 'col2_item4', 'Ensure timely, safe delivery to global destinations')}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section heroBand" style={{ padding: '3rem 0' }}>
        <div className="container split">
          <div>
            <h2 style={{ color: '#fff' }}>{getContent('about', 'Linear', 'title', 'Backed by Linear Global Credibility')}</h2>
            <p style={{ color: '#dbe8ff', marginTop: '0.65rem' }}>
              {getContent('about', 'Linear', 'desc', 'Our partnership with Linear Global gives us access to world-class logistics infrastructure, ensuring your shipments are handled with expertise and care.')}
            </p>
            <ul className="checkList" style={{ color: '#ffffff', marginTop: '1.2rem' }}>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('about', 'Linear', 'item1', 'Proven track record in international freight forwarding')}</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('about', 'Linear', 'item2', 'Deep understanding of export regulations')}</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('about', 'Linear', 'item3', 'Strong relationships with shipping lines and carriers')}</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> {getContent('about', 'Linear', 'item4', 'Real-time tracking and shipment visibility')}</li>
            </ul>
          </div>
          <div className="imageBlock">
            <img 
              src={getContent('about', 'Linear', 'side_img', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000')} 
              alt="Linear Global" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('about', 'Approach', 'title', 'Our Approach')}</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '0.9rem',
            }}
          >
            {approach.map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <article className="card" style={{ height: '100%', padding: '1.8rem 1.2rem', textAlign: 'left' }}>
                  <span className="stepNumber">
                    {idx + 1}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>{item.title}</h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>{item.description}</p>
                </article>
                {idx < 4 && (
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

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('about', 'Why Choose Us', 'title', 'Why Choose Us')}</h2>
          </div>
          <div className="cardsGrid3">
            {reasons.map((item, idx) => (
              <article key={idx} className="card" style={{ padding: '2rem 1.8rem' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaBand">
        <div className="container">
          <h3>{getContent('about', 'CTA', 'title', 'Talk to Our Sourcing Team')}</h3>
          <p style={{ color: '#dbe8ff' }}>{getContent('about', 'CTA', 'desc', 'Share your requirement and get a practical sourcing roadmap.')}</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary">
              {getContent('about', 'CTA', 'btn_text', 'Contact Us')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
