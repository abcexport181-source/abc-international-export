'use client'
import React from 'react';
import Script from 'next/script';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { MediaBackground } from '@/components/common/EditableMedia';

const RECAPTCHA_ACTION = 'contact_form';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactPage() {
  const { getContent, loading } = useWebsiteData();
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [formData, setFormData] = React.useState({
    name: '',
    company: '',
    email: '',
    country: '',
    requirement: '',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

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

  const getRecaptchaToken = async () => {
    if (!recaptchaSiteKey) return null;
    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA is still loading. Please try again in a moment.');
    }

    await new Promise<void>((resolve) => window.grecaptcha?.ready(resolve));
    return window.grecaptcha.execute(recaptchaSiteKey, { action: RECAPTCHA_ACTION });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email || !formData.country || !formData.requirement) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const captchaToken = await getRecaptchaToken();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, captchaToken, captchaAction: RECAPTCHA_ACTION })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit inquiry. Please try again.');
      }

      setStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        country: '',
        requirement: '',
        message: ''
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      {recaptchaSiteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      )}

      <MediaBackground 
        className="heroBand heroBandCentered"
        url={getContent('contact', 'Hero', 'bg_img', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000')}
      >
        <div className="container">
          <h1>{getContent('contact', 'Hero', 'title', 'Get in Touch')}</h1>
          <p>{getContent('contact', 'Hero', 'desc', 'Ready to start sourcing from India? Contact our team to discuss your requirements.')}</p>
        </div>
      </MediaBackground>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container split" style={{ alignItems: 'start', gap: '4rem' }}>
          <div style={{ flex: 1.2 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{getContent('contact', 'Form', 'title', 'Send Us a Message')}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_name', 'Name *')}</label>
                <input 
                  placeholder={getContent('contact', 'Form', 'placeholder_name', 'Your full name')} 
                  style={field} 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_company', 'Company *')}</label>
                <input 
                  placeholder={getContent('contact', 'Form', 'placeholder_company', 'Your company name')} 
                  style={field} 
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_email', 'Email *')}</label>
                <input 
                  type="email"
                  placeholder={getContent('contact', 'Form', 'placeholder_email', 'your@email.com')} 
                  style={field} 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_country', 'Country *')}</label>
                <input 
                  placeholder={getContent('contact', 'Form', 'placeholder_country', 'Your country')} 
                  style={field} 
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_requirement', 'Product Requirement *')}</label>
                <input 
                  placeholder={getContent('contact', 'Form', 'placeholder_requirement', 'What products are you looking for?')} 
                  style={field} 
                  required
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                />
              </div>
              <div>
                <label style={label}>{getContent('contact', 'Form', 'label_message', 'Message')}</label>
                <textarea 
                  placeholder={getContent('contact', 'Form', 'placeholder_message', 'Additional details about your requirements...')} 
                  style={{ ...field, minHeight: '120px', resize: 'vertical' }} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btnPrimary" 
                disabled={status === 'submitting'}
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
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: status === 'submitting' ? 0.7 : 1
                }}
              >
                {status === 'submitting' ? 'Submitting...' : getContent('contact', 'Form', 'submit_btn', 'Submit Inquiry')} <FiSend />
              </button>

              {status === 'success' && (
                <div style={{ padding: '1rem', background: '#d1e7dd', color: '#0f5132', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500 }}>
                  Thank you! Your inquiry has been successfully sent. We will get back to you shortly.
                </div>
              )}
              {status === 'error' && (
                <div style={{ padding: '1rem', background: '#f8d7da', color: '#842029', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500 }}>
                  {errorMessage}
                </div>
              )}

              {recaptchaSiteKey && (
                <p style={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center', marginTop: '0.5rem' }}>
                  Protected by Google reCAPTCHA.
                </p>
              )}
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
