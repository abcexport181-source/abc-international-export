'use client'
import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { useWebsiteData } from '@/hooks/useWebsiteData';

const contactInfo = [
  {
    title: 'Email',
    details: ['info@abc-international.co.in', 'export@abc-international.co.in'],
    Icon: FiMail
  },
  {
    title: 'Phone',
    details: ['+91 XXXX XXXXXX', 'Monday - Friday, 9:00 AM - 6:00 PM IST'],
    Icon: FiPhone
  },
  {
    title: 'Address',
    details: ['ABC International', 'Mumbai, Maharashtra', 'India'],
    Icon: FiMapPin
  },
  {
    title: 'Business Hours',
    details: [
      'Monday - Friday: 9:00 AM - 6:00 PM IST',
      'Saturday: 9:00 AM - 1:00 PM IST',
      'Sunday: Closed'
    ],
    Icon: FiClock
  }
];

import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactPage() {
  const { getContent, loading } = useWebsiteData();
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <>
      <section 
        className="heroBand heroBandCentered"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getContent('contact', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container">
          <h1>{getContent('contact', 'Hero', 'title', 'Get in Touch')}</h1>
          <p>{getContent('contact', 'Hero', 'desc', 'Ready to start sourcing from India? Contact our team to discuss your requirements.')}</p>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container split" style={{ alignItems: 'start', gap: '4rem' }}>
          <div style={{ flex: 1.2 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Send Us a Message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={label}>Name *</label>
                <input placeholder="Your full name" style={field} />
              </div>
              <div>
                <label style={label}>Company *</label>
                <input placeholder="Your company name" style={field} />
              </div>
              <div>
                <label style={label}>Email *</label>
                <input placeholder="your@email.com" style={field} />
              </div>
              <div>
                <label style={label}>Country *</label>
                <input placeholder="Your country" style={field} />
              </div>
              <div>
                <label style={label}>Product Requirement *</label>
                <input placeholder="What products are you looking for?" style={field} />
              </div>
              <div>
                <label style={label}>Message</label>
                <textarea placeholder="Additional details about your requirements..." style={{ ...field, minHeight: '120px', resize: 'vertical' }} />
              </div>

              {/* Google reCAPTCHA - Temporarily Hidden (On Hold) */}
              {/* 
              <div style={{ marginTop: '0.5rem' }}>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={onCaptchaChange}
                />
              </div>
              */}

              <button 
                type="button" 
                className="btnPrimary" 
                // disabled={!captchaValue} // On hold
                style={{ 
                  background: '#1f5ff5', 
                  color: '#fff', 
                  width: '100%', 
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.6rem', 
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Submit Inquiry <FiSend />
              </button>
              <p style={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center', marginTop: '0.5rem' }}>
                Note: Bot protection (reCAPTCHA) is currently on hold.
              </p>
            </form>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Company Information</h2>
              <div style={{ background: '#f8faff', padding: '2rem', borderRadius: '12px', border: '1px solid #edf2ff' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>ABC International</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={iconBox}><FiMail /></div>
                    <div>
                      <h4 style={h4}>Email</h4>
                      <p className="muted" style={p}>{getContent('contact', 'Info', 'email', 'info@abc-international.co.in')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={iconBox}><FiPhone /></div>
                    <div>
                      <h4 style={h4}>Phone</h4>
                      <p className="muted" style={p}>{getContent('contact', 'Info', 'phone', '+91 XXXX XXXXXX')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={iconBox}><FiMapPin /></div>
                    <div>
                      <h4 style={h4}>Address</h4>
                      <p className="muted" style={p}>{getContent('contact', 'Info', 'address', 'Mumbai, Maharashtra, India')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ background: '#f0f6ff', padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Why Contact Us?</h3>
              <ul className="checkList" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  'Get personalized sourcing recommendations',
                  'Receive competitive pricing quotes',
                  'Discuss logistics and shipping options',
                  'Learn about compliance requirements',
                  'Schedule factory visits and inspections'
                ].map(item => (
                  <li key={item} style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1f5ff5' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionSoft" style={{ textAlign: 'center', paddingTop: 0 }}>
        <div className="container">
          <h2>Quick Response Guarantee</h2>
          <p className="muted" style={{ maxWidth: '760px', margin: '0 auto' }}>
            Our sourcing team typically responds to inquiries within 24 hours during business days.
          </p>
          <div className="cardsGrid3" style={{ marginTop: '1rem' }}>
            <article className="card">
              <h3>{getContent('contact', 'Stats', 'res_time', '24h')}</h3>
              <p className="muted">{getContent('contact', 'Stats', 'res_desc', 'Average response time')}</p>
            </article>
            <article className="card">
              <h3>{getContent('contact', 'Stats', 'countries', '100+')}</h3>
              <p className="muted">{getContent('contact', 'Stats', 'countries_desc', 'Countries served')}</p>
            </article>
            <article className="card">
              <h3>{getContent('contact', 'Stats', 'suppliers', '1000+')}</h3>
              <p className="muted">{getContent('contact', 'Stats', 'suppliers_desc', 'Verified suppliers')}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

const label: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#1b2638',
  fontWeight: 600,
}

const field: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  background: '#fff',
  fontSize: '0.95rem',
  marginTop: '0.5rem',
}

const iconBox: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  background: '#dbe8ff',
  color: '#1f5ff5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '1.2rem'
}

const h4: React.CSSProperties = {
  fontSize: '0.95rem',
  marginBottom: '0.3rem',
  color: '#1b2638'
}

const p: React.CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: '1.4'
}
