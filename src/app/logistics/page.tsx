'use client'
import React from 'react';
import { FiClock, FiShield, FiClipboard, FiMapPin, FiFileText, FiPackage, FiCheckCircle, FiGlobe, FiArrowRight } from 'react-icons/fi';
import { FaShip, FaPlane } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';

const shippingSolutions = [
  {
    title: 'Sea Freight',
    Icon: FaShip,
    features: [
      'Full Container Load (FCL)',
      'Less than Container Load (LCL)',
      'Roll-on/Roll-off (RoRo)',
      'Bulk cargo shipping',
      'Port-to-port delivery',
      'Door-to-door service'
    ]
  },
  {
    title: 'Air Freight',
    Icon: FaPlane,
    features: [
      'Express air cargo',
      'Standard air freight',
      'Charter services',
      'Temperature-controlled',
      'Dangerous goods handling',
      'Airport-to-airport delivery'
    ]
  },
  {
    title: 'Consolidation',
    Icon: FiPackage,
    features: [
      'LCL consolidation',
      'Multi-vendor shipments',
      'Cost optimization',
      'Regular sailing schedules',
      'Cargo aggregation',
      'Shared container services'
    ]
  }
];

const complianceItems = [
  {
    title: 'Country-Specific Regulations',
    desc: 'Expert knowledge of import requirements for 100+ countries including USA, EU, Middle East, Africa, and Asia',
    Icon: FiGlobe
  },
  {
    title: 'Labeling Requirements',
    desc: 'Ensure product labels meet destination country standards including language, content, and format',
    Icon: FiFileText
  },
  {
    title: 'Packing Standards',
    desc: 'Compliance with international packing standards like ISPM 15 for wooden packaging materials',
    Icon: FiPackage
  },
  {
    title: 'Customs Clearance',
    desc: 'Smooth customs processing with accurate documentation and classification',
    Icon: FiShield
  }
];

const timelineSteps = [
  { title: 'Order Confirmation', desc: 'Production begins' },
  { title: 'Quality Check', desc: 'Pre-shipment inspection' },
  { title: 'Documentation', desc: 'Prepare all export docs' },
  { title: 'Shipping', desc: 'Cargo dispatched' },
  { title: 'Delivery', desc: 'Reach destination' }
];

const docs = [
  { title: 'Certificate of Origin (COO)', desc: 'Official certification of product origin for customs clearance and preferential tariffs' },
  { title: 'Phytosanitary Certificate', desc: 'Required for agricultural and food products, certifying pest-free status' },
  { title: 'FSSAI Certificate', desc: 'Food safety certification for food products exported from India' },
  { title: 'Commercial Invoice', desc: 'Detailed invoice with product descriptions, values, and shipping terms' },
  { title: 'Packing List', desc: 'Complete itemized list of package contents, dimensions, and weights' },
  { title: 'Bill of Lading / Airway Bill', desc: 'Official shipping document serving as receipt and contract' },
  { title: 'Insurance Certificate', desc: 'Cargo insurance documentation for protection during transit' },
  { title: 'Export License', desc: 'Government authorization for specific controlled products' }
];

const expertiseItems = [
  {
    title: 'Timely Delivery',
    desc: 'Meet your deadlines with reliable shipping schedules',
    Icon: FiClock
  },
  {
    title: 'Safe Transit',
    desc: 'Professional handling and insurance protection',
    Icon: FiShield
  },
  {
    title: 'Compliance',
    desc: 'Navigate complex customs and regulations',
    Icon: FiClipboard
  },
  {
    title: 'Global Reach',
    desc: 'Deliver to any destination worldwide',
    Icon: FiMapPin
  }
];

export default function LogisticsSubPage() {
  const { getContent } = useWebsiteData();

  return (
    <>
      <section 
        className="heroBand"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getContent('logistics', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <h1>{getContent('logistics', 'Hero', 'title', 'Logistics Backed Export Expertise')}</h1>
          <p>{getContent('logistics', 'Hero', 'desc', 'From cargo planning to documentation, we ensure products move efficiently to global markets.')}</p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/contact" className="btnPrimary">
              Explore Logistics Support
            </a>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Why Logistics Expertise Matters</h2>
            <p style={{ maxWidth: '800px', margin: '0.8rem auto 0 auto', color: '#4a5568' }}>
              Export success isn't just about finding the right product—it's about getting it to your destination safely, on time, and in compliance with all regulations.
            </p>
          </div>
          <div className="cardsGrid4">
            {expertiseItems.map((item) => (
              <article className="card" key={item.title} style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#1f5ff5', marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
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
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Complete Export Documentation</h2>
            <p style={{ maxWidth: '700px', margin: '0.8rem auto 0 auto', color: '#4a5568' }}>
              We handle all the paperwork so you don't have to. Our team ensures every document is accurate and compliant.
            </p>
          </div>
          <div className="cardsGrid4">
            {docs.map((item) => (
              <article className="card" key={item.title} style={{ padding: '1.5rem', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FiFileText style={{ color: '#1f5ff5', marginTop: '0.2rem', flexShrink: 0 }} />
                  {item.title}
                </h3>
                <p className="muted" style={{ fontSize: '0.9rem' }}>{item.desc}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: '3rem', background: '#f4f8ff', padding: '1rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', color: '#4a5568', textAlign: 'center' }}>
            <strong>Additional certifications available:</strong> Health Certificate, Fumigation Certificate, Test Reports, GSP Certificate, and more
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Comprehensive Shipping Solutions</h2>
            <p style={{ maxWidth: '700px', margin: '0.8rem auto 0 auto', color: '#4a5568' }}>
              Multiple shipping modes to suit your timeline, budget, and cargo requirements
            </p>
          </div>
          <div className="cardsGrid3">
            {shippingSolutions.map((item) => (
              <article className="card" key={item.title} style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
                <div className="iconCircle" style={{ width: '56px', height: '56px', fontSize: '1.6rem', marginBottom: '1.5rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>{item.title}</h3>
                <ul className="checkList" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text)' }}>
                  {item.features.map(f => (
                    <li key={f} style={{ fontSize: '0.9rem' }}>
                      <FiCheckCircle className="checkIcon" /> {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section heroBand">
        <div className="container split">
          <div className="imageBlock" style={{ borderRadius: '12px' }} />
          <div>
            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem' }}>Powered by Linear Global</h2>
            <p style={{ color: '#dbe8ff', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Our partnership with Linear Global gives us access to world-class logistics infrastructure 
              and expertise built over decades in international freight forwarding.
            </p>
            <ul className="checkList" style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                'Real-time shipment tracking and visibility',
                'Competitive freight rates through established partnerships',
                'Dedicated customs clearance team',
                'Insurance coverage options',
                'Warehousing and storage facilities',
                'Last-mile delivery coordination',
                '24/7 customer support',
                'Multi-modal transportation solutions'
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem' }}>
                  <FiCheckCircle style={{ color: '#fff', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Compliance Handling</h2>
            <p style={{ color: '#4a5568', marginTop: '0.5rem' }}>Navigate complex international regulations with confidence</p>
          </div>
          <div className="cardsGrid4">
            {complianceItems.map((item) => (
              <article key={item.title} style={{ textAlign: 'center', padding: '1rem' }}>
                <div className="iconCircle" style={{ margin: '0 auto 1.5rem auto', width: '56px', height: '56px', fontSize: '1.6rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Export Process Timeline</h2>
            <p style={{ color: '#4a5568', marginTop: '0.5rem' }}>From order confirmation to final delivery, we manage every step</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {timelineSteps.map((step, idx) => (
              <React.Fragment key={step.title}>
                <article className="card" style={{ flex: 1, minWidth: '180px', padding: '1.5rem', textAlign: 'left', position: 'relative' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#1f5ff5', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    {idx + 1}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>{step.desc}</p>
                </article>
                {idx < timelineSteps.length - 1 && (
                  <FiArrowRight style={{ color: '#1f5ff5', fontSize: '1.2rem', flexShrink: 0 }} className="hideMobile" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="heroBand" style={{ borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <FiShield />
            </div>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '1.5rem' }}>This Builds Serious Buyer Trust</h2>
            <p style={{ color: '#fff', maxWidth: '800px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
              When you work with ABC International, you&apos;re not just getting a supplier—you&apos;re 
              getting a complete logistics partner who ensures your cargo arrives safely, on time, 
              and in full compliance.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" className="btnPrimary" style={{ background: '#fff', color: '#1f5ff5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Discuss Your Shipment <FiArrowRight />
              </a>
              <a href="/sourcing" className="btnSecondary" style={{ border: '1px solid #fff', color: '#fff' }}>
                Explore Sourcing Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
