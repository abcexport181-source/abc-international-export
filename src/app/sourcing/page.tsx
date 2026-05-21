'use client'
import React from 'react';
import { FiPackage, FiCheckCircle, FiClipboard, FiSearch, FiDollarSign, FiEye, FiTruck, FiArrowRight, FiShield, FiFileText } from 'react-icons/fi';
import { FaIndustry, FaVial } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { MediaBackground, MediaBlock } from '@/components/common/EditableMedia';

const sourceItems = [
  { title: 'Products', description: 'Finished goods across all categories ready for export', Icon: FiPackage },
  { title: 'Raw Materials', description: 'Industrial and manufacturing raw materials from verified suppliers', Icon: FaIndustry },
  { title: 'Packaging', description: 'Custom packaging solutions and materials for your products', Icon: FiPackage },
  { title: 'Private Label', description: 'White-label and private label manufacturing services', Icon: FiCheckCircle }
]
const process = [
  { title: 'Requirement', description: 'Share your product specifications, quantity, quality standards, and target price', Icon: FiClipboard },
  { title: 'Supplier Identification', description: 'We identify and shortlist verified manufacturers from our extensive network', Icon: FiSearch },
  { title: 'Samples', description: 'Arrange samples for your evaluation and approval before bulk production', Icon: FaVial },
  { title: 'Pricing', description: 'Negotiate competitive pricing and payment terms on your behalf', Icon: FiDollarSign },
  { title: 'Inspection', description: 'Conduct pre-shipment quality inspection to ensure compliance with your standards', Icon: FiEye },
  { title: 'Shipment', description: 'Handle complete export logistics from factory to your destination', Icon: FiTruck }
]

export default function SourcingPage() {
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
        url={getContent('sourcing', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=2000')}
      >
        <div className="container">
          <h1>{getContent('sourcing', 'Hero', 'title', 'Global Product Sourcing from India')}</h1>
          <p>
            {getContent('sourcing', 'Hero', 'desc', 'End-to-end sourcing from India with verified suppliers and product solutions tailored for your market.')}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/contact" className="btnPrimary">
              Source From India
            </a>
          </div>
        </div>
      </MediaBackground>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('sourcing', 'Source', 'title', 'What We Source')}</h2>
            <p>
              {getContent('sourcing', 'Source', 'desc', 'From raw materials to finished products, we source across all categories to meet your business needs')}
            </p>
          </div>
          <div className="cardsGrid4">
            {sourceItems.map((item, idx) => (
              <article key={item.title} className="card" style={{ padding: '2rem 1.5rem' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{getContent('sourcing', 'Source', `item${idx+1}_title`, item.title)}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{getContent('sourcing', 'Source', `item${idx+1}_desc`, item.description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionSoft" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sectionHeader">
            <h2>{getContent('sourcing', 'Process', 'title', 'Our Sourcing Process')}</h2>
            <p>
              {getContent('sourcing', 'Process', 'desc', 'A transparent, step-by-step approach to finding and delivering the right products')}
            </p>
          </div>
          <div className="cardsGrid3">
            {process.map((item, idx) => (
              <article key={item.title} className="card" style={{ padding: '2rem 1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <span className="stepNumber" style={{ marginBottom: 0, width: '44px', height: '44px' }}>
                    {idx + 1}
                  </span>
                  <item.Icon style={{ fontSize: '1.8rem', color: '#1f5ff5' }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{getContent('sourcing', 'Process', `step${idx+1}_title`, item.title)}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{getContent('sourcing', 'Process', `step${idx+1}_desc`, item.description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <MediaBlock className="imageBlock" url={getContent('sourcing', 'Network', 'side_img', 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000')} alt="Manufacturer network" />
          <div>
            <h2>{getContent('sourcing', 'Network', 'title', 'Manufacturer Network Across Industries')}</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              {getContent('sourcing', 'Network', 'desc', 'Our extensive network spans India\'s manufacturing landscape, giving you access to suppliers across diverse sectors.')}
            </p>
            <ul className="checkList" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', color: 'var(--text)' }}>
              {[
                'Agro & Food Products', 'Packaging Materials', 'Industrial Equipment', 'Raw Materials',
                'Chemicals & Additives', 'Consumer Products', 'Textiles & Apparel', 'Handicrafts & Decor',
                'Engineering Products', 'Pharmaceuticals', 'Electronics Components', 'Building Materials'
              ].map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> {getContent('sourcing', 'Network', `item${idx+1}`, item)}</li>
              ))}
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <a href="/industries" style={{ color: '#1f5ff5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {getContent('sourcing', 'Network', 'link_text', 'Explore All Industries')} <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <MediaBackground className="section heroBand" url={getContent('sourcing', 'Custom', 'bg_img', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')} overlay="rgba(31, 95, 245, 0.9)">
        <div className="container heroBandCentered">
          <h2 style={{ color: '#fff' }}>{getContent('sourcing', 'Custom', 'title', 'Custom Sourcing Solutions')}</h2>
          <p style={{ color: '#dbe8ff' }}>
            {getContent('sourcing', 'Custom', 'desc', 'We deliver flexible sourcing plans to match your product, quality, and delivery goals.')}
          </p>
          <div className="cardsGrid3" style={{ marginTop: '1rem', textAlign: 'left' }}>
            {['Specific Product Specs', 'Global Certifications', 'Quality Protocols', 'Budget Control', 'Timeline Management', 'Complete Traceability'].map((item, idx) => (
              <article className="card" key={idx} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <h3 style={{ color: '#fff' }}>{getContent('sourcing', 'Custom', `feat${idx+1}_title`, item)}</h3>
                <p style={{ color: '#dbe8ff' }}>{getContent('sourcing', 'Custom', `feat${idx+1}_desc`, 'Built to reduce risk and improve execution consistency.')}</p>
              </article>
            ))}
          </div>
        </div>
      </MediaBackground>

      <section className="section">
        <div className="container split">
          <div>
            <h2>{getContent('sourcing', 'Quality', 'title', 'Quality You Can Trust')}</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              {getContent('sourcing', 'Quality', 'desc', 'We don\'t just connect you with suppliers—we ensure every product meets your quality standards.')}
            </p>
            <ul className="featureList" style={{ marginTop: '1.5rem' }}>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiShield /></div>
                <div className="featureText">
                  <strong>{getContent('sourcing', 'Quality', 'item1_title', 'Supplier Verification')}</strong>
                  <span>{getContent('sourcing', 'Quality', 'item1_desc', 'All manufacturers are pre-vetted for certifications and capability')}</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FaVial /></div>
                <div className="featureText">
                  <strong>{getContent('sourcing', 'Quality', 'item2_title', 'Sample Testing')}</strong>
                  <span>{getContent('sourcing', 'Quality', 'item2_desc', 'Comprehensive sample evaluation before bulk orders')}</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiEye /></div>
                <div className="featureText">
                  <strong>{getContent('sourcing', 'Quality', 'item3_title', 'Pre-Shipment Inspection')}</strong>
                  <span>{getContent('sourcing', 'Quality', 'item3_desc', 'Third-party inspection services available on request')}</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiFileText /></div>
                <div className="featureText">
                  <strong>{getContent('sourcing', 'Quality', 'item4_title', 'Documentation')}</strong>
                  <span>{getContent('sourcing', 'Quality', 'item4_desc', 'Complete test reports and quality certificates')}</span>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <a href="/quality-packaging" style={{ color: '#1f5ff5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {getContent('sourcing', 'Quality', 'link_text', 'Learn About Quality Processes')} <FiArrowRight />
              </a>
            </div>
          </div>
          <MediaBlock className="imageBlock" url={getContent('sourcing', 'Quality', 'side_img', 'https://images.unsplash.com/photo-1521331908054-9a180b7d3912?auto=format&fit=crop&q=80&w=1000')} alt="Quality process" />
        </div>
      </section>

      <section className="section sectionSoft" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>{getContent('sourcing', 'CTA', 'title', 'Ready to Start Sourcing?')}</h2>
          <p className="muted">{getContent('sourcing', 'CTA', 'desc', 'Let us help you source the right product from trusted Indian suppliers.')}</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>
              {getContent('sourcing', 'CTA', 'btn_text', 'Request Sourcing Support')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
