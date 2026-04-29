'use client'
import React from 'react';
import { FiPackage, FiGlobe, FiShield, FiTruck, FiCheckCircle, FiTarget, FiFileText, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import { FaLeaf, FaBoxOpen, FaCogs, FaFlask, FaShoppingBag, FaPalette } from 'react-icons/fa';
import { useWebsiteData } from '@/hooks/useWebsiteData';

const services = [
  {
    title: 'Product Sourcing',
    description: 'Comprehensive sourcing from verified Indian manufacturers',
  },
  {
    title: 'Global Export',
    description: 'Seamless export services to markets worldwide',
  },
  {
    title: 'Quality Control',
    description: 'Rigorous inspection and verification processes',
  },
  {
    title: 'Logistics Support',
    description: 'End-to-end logistics and documentation expertise',
  },
]

const industries = ['Agro & Food', 'Packaging', 'Industrial', 'Chemicals', 'Consumer Products', 'Handicrafts']

export default function Home() {
  const { getContent, loading } = useWebsiteData();

  return (
    <>
      <section className="heroBand">
        <div className="container">
          <h1>
            {getContent('home', 'Hero', 'title', 'Your Trusted Merchant Exporter from India')}
          </h1>
          <p>
            {getContent('home', 'Hero', 'desc', 'Global sourcing expertise backed by comprehensive logistics support')}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem' }}>
            <a href="/sourcing" className="btnPrimary">
              Explore Sourcing
            </a>
            <a href="/contact" className="btnSecondary">
              Get in Touch
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
            <h2>What We Do</h2>
          </div>
          <div className="cardsGrid4">
            {services.map((service, idx) => {
              let Icon = FiPackage;
              if (service.title === 'Product Sourcing') Icon = FiPackage;
              if (service.title === 'Global Export') Icon = FiGlobe;
              if (service.title === 'Quality Control') Icon = FiShield;
              if (service.title === 'Logistics Support') Icon = FiTruck;
              
              return (
                <article key={service.title} className="card" style={{ textAlign: 'center' }}>
                  <span className="iconDot"><Icon /></span>
                  <h3>{service.title}</h3>
                  <p className="muted" style={{ marginTop: '0.5rem' }}>{service.description}</p>
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
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Complete export documentation (COO, certificates, etc.)</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Air and sea freight management</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Customs compliance and clearance</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Real-time tracking and updates</li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <a href="/logistics" className="btnPrimary">
                Learn More
              </a>
            </div>
          </div>
          <div className="imageBlock" />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="imageBlock" />
          <div>
            <h2>Comprehensive Sourcing Capability</h2>
            <p style={{ marginTop: '0.65rem' }} className="muted">
              We source a wide range of products, raw materials, and packaging solutions from
              India&apos;s most reliable manufacturers.
            </p>
            <ul className="featureList" style={{ marginTop: '1.2rem' }}>
              <li className="featureItem">
                <div className="featureIcon"><FiBriefcase /></div>
                <div className="featureText">
                  <strong>Verified Suppliers</strong>
                  <span>Extensive network of certified manufacturers</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon"><FiTarget /></div>
                <div className="featureText">
                  <strong>Custom Requirements</strong>
                  <span>Tailored sourcing for your specific needs</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon"><FiFileText /></div>
                <div className="featureText">
                  <strong>Quality Assurance</strong>
                  <span>Strict verification and inspection protocols</span>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: '0.9rem' }}>
              <a href="/sourcing" className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>
                View Sourcing Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Industries We Serve</h2>
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
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{item}</h3>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/industries" style={{ color: '#1f5ff5', fontWeight: 600 }}>
              View All Industries →
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>Quality Assurance & Export Packaging</h2>
            <p>
              We ensure every product meets international standards with rigorous quality control and
              professional export-grade packaging.
            </p>
          </div>
          <div className="cardsGrid3">
            {[
              {
                title: 'Quality Inspection',
                description: 'Pre-shipment inspection, sample approval, and supplier verification',
              },
              {
                title: 'Export Packaging',
                description: 'Professional packaging solutions for safe international transit',
              },
              {
                title: 'Compliance',
                description: 'Country-specific labeling and regulatory compliance',
              },
            ].map((item, idx) => {
              let Icon = FiShield;
              if (item.title === 'Quality Inspection') Icon = FiShield;
              if (item.title === 'Export Packaging') Icon = FiPackage;
              if (item.title === 'Compliance') Icon = FiCheckCircle;

              return (
                <article key={item.title} className="card">
                  <div style={{ fontSize: '2.2rem', color: '#1f5ff5', marginBottom: '1rem' }}>
                    <Icon />
                  </div>
                  <h3 style={{ marginBottom: '0.6rem' }}>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/quality-packaging" style={{ color: '#1f5ff5', fontWeight: 600 }}>
              Learn More About Quality →
            </a>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>How We Work</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[
              {
                title: 'Requirement Analysis',
                description: 'We understand your specific needs',
              },
              {
                title: 'Supplier Matching',
                description: 'Connect with verified manufacturers',
              },
              {
                title: 'Quality Verification',
                description: 'Rigorous quality checks and samples',
              },
              {
                title: 'Documentation',
                description: 'Complete export compliance handling',
              },
              {
                title: 'Global Shipping',
                description: 'Reliable logistics to your destination',
              },
            ].map((item, idx) => (
              <div key={item.title} style={{ position: 'relative' }}>
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

      <section className="ctaBand">
        <div className="container">
          <h3>{getContent('home', 'CTA', 'title', 'Ready to Source from India?')}</h3>
          <p style={{ color: '#dbe8ff' }}>
            {getContent('home', 'CTA', 'desc', "Let's discuss your requirements. Our sourcing team is ready to help you find the right products at the right price.")}
          </p>
          <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <a href="/sourcing" className="btnPrimary">
              Request Sourcing
            </a>
            <a href="/about" className="btnSecondary">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
