'use client'
import React, { useState, useEffect } from 'react';
import { supabase, IndustryData, ProductData, SiteContent, isSupabaseConfigured } from '@/lib/supabase';
import { FiLayout, FiGrid, FiBox, FiEye, FiEyeOff, FiEdit2, FiPlus, FiTrash2, FiSave, FiAlertCircle, FiHome, FiInfo, FiMail, FiLogOut } from 'react-icons/fi';
import { industriesData, productsData } from '@/data/products';

type Tab = 'home-content' | 'about-content' | 'contact-content' | 'industries' | 'products';

import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { createSession, removeSession, getSession } from '@/app/actions/auth';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('home-content');
  const [industries, setIndustries] = useState<IndustryData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [editingIndustry, setEditingIndustry] = useState<IndustryData | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  useEffect(() => {
    // Check session from cookie (server-side source of truth)
    getSession().then((decodedToken) => {
      if (decodedToken) {
        setUser(decodedToken);
      }
      setAuthLoading(false);
    });

    // Also sync with Firebase client state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure session cookie exists
        const token = await firebaseUser.getIdToken();
        await createSession(token);
      } else {
        await removeSession();
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const result = await createSession(token);
      
      if (result.success) {
        const decodedToken = await getSession();
        setUser(decodedToken);
        setMessage({ text: 'Logged in successfully!', type: 'success' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    await removeSession();
    setUser(null);
  };

  useEffect(() => {
    if (isSupabaseConfigured && user) {
      fetchData();
      fetchSiteContent();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!isSupabaseConfigured) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <FiAlertCircle style={{ fontSize: '3.5rem', color: '#ef4444', marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Supabase Not Connected</h2>
          <p className="muted" style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
            To use the Admin CMS, you must add your <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and 
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> to your environment variables in Vercel.
          </p>
          <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'left' }}>
            <strong>Local Dev Tip:</strong> Create a <code>.env.local</code> file temporarily to test locally, but do not commit it to Git.
          </div>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Admin Login</h2>
          <p className="muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to manage your export website.</p>
          
          {message.text && (
            <div style={{ padding: '0.8rem', background: '#fde8e8', color: '#9b1c1c', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={label}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={field} placeholder="admin@example.com" required />
            </div>
            <div>
              <label style={label}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={field} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btnPrimary" style={{ marginTop: '1rem', width: '100%' }} disabled={authLoading}>
              {authLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const fetchSiteContent = async () => {
    const { data } = await supabase.from('site_content').select('*').order('page_name');
    if (data) setSiteContent(data);
  };

  const updateContent = async (id: string, value: string) => {
    const { error } = await supabase.from('site_content').update({ content_value: value }).eq('id', id);
    if (!error) fetchSiteContent();
  };

  const getCharLimit = (text: string) => Math.max(Math.ceil(text.length * 1.5), 30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: indData } = await supabase.from('industries').select('*').order('title');
      const { data: prodData } = await supabase.from('products').select('*').order('name');
      if (indData) setIndustries(indData);
      if (prodData) setProducts(prodData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) return data.url;
      throw new Error(data.error || 'Upload failed');
    } catch (err: any) {
      setMessage({ text: 'Upload failed: ' + err.message, type: 'error' });
      return null;
    }
  };

  const saveIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndustry) return;

    const { error } = await supabase
      .from('industries')
      .upsert(editingIndustry);

    if (!error) {
      setMessage({ text: 'Industry saved successfully!', type: 'success' });
      setEditingIndustry(null);
      fetchData();
    } else {
      setMessage({ text: 'Error saving industry: ' + error.message, type: 'error' });
    }
  };

  const syncInitialData = async () => {
    setLoading(true);
    try {
      // Sync Industries
      for (const ind of industriesData) {
        await supabase.from('industries').upsert({
          id: ind.id,
          title: ind.title,
          icon: ind.icon,
          description_short: ind.desc,
          full_info: ind.fullInfo,
          keys: ind.keys,
          is_visible: true
        });
      }
      // Sync Products
      for (const prod of productsData) {
        await supabase.from('products').upsert({
          id: prod.id,
          category_id: prod.category,
          name: prod.name,
          description: prod.description,
          image: prod.image,
          features: prod.features,
          specs: prod.specs,
          export_details: prod.exportDetails,
          is_visible: true
        });
      }
      // Sync Site Content - COMPLETE LIST
      const initialContent = [
        // HOME PAGE
        { page: 'home', section: 'Hero', key: 'title', val: 'Your Trusted Merchant Exporter from India' },
        { page: 'home', section: 'Hero', key: 'desc', val: 'Global sourcing expertise backed by comprehensive logistics support.' },
        
        { page: 'home', section: 'Who We Are', key: 'title', val: 'Who We Are' },
        { page: 'home', section: 'Who We Are', key: 'p1', val: 'ABC International is a trusted merchant exporter and comprehensive sourcing partner based in India.' },
        { page: 'home', section: 'Who We Are', key: 'p2', val: "Backed by Linear Global's logistics expertise, we provide end-to-end export solutions from identifying the right suppliers to ensuring compliant, timely delivery to global markets." },

        { page: 'home', section: 'Services', key: 'title', val: 'What We Do' },
        { page: 'home', section: 'Services', key: 's1_title', val: 'Product Sourcing' },
        { page: 'home', section: 'Services', key: 's1_desc', val: 'Comprehensive sourcing from verified Indian manufacturers' },
        { page: 'home', section: 'Services', key: 's2_title', val: 'Global Export' },
        { page: 'home', section: 'Services', key: 's2_desc', val: 'Seamless export services to markets worldwide' },
        { page: 'home', section: 'Services', key: 's3_title', val: 'Quality Control' },
        { page: 'home', section: 'Services', key: 's3_desc', val: 'Rigorous inspection and verification processes' },
        { page: 'home', section: 'Services', key: 's4_title', val: 'Logistics Support' },
        { page: 'home', section: 'Services', key: 's4_desc', val: 'End-to-end logistics and documentation expertise' },

        { page: 'home', section: 'Logistics', key: 'title', val: 'Logistics Expertise That Sets Us Apart' },
        { page: 'home', section: 'Logistics', key: 'desc', val: "With Linear Global's proven logistics network, we handle every aspect of export logistics—from documentation to customs clearance to final delivery." },
        { page: 'home', section: 'Logistics', key: 'item1', val: 'Complete export documentation (COO, certificates, etc.)' },
        { page: 'home', section: 'Logistics', key: 'item2', val: 'Air and sea freight management' },
        { page: 'home', section: 'Logistics', key: 'item3', val: 'Customs compliance and clearance' },

        { page: 'home', section: 'Sourcing', key: 'title', val: 'Comprehensive Sourcing Capability' },
        { page: 'home', section: 'Sourcing', key: 'desc', val: 'We source a wide range of products, raw materials, and packaging solutions from India\'s most reliable manufacturers.' },

        { page: 'home', section: 'Quality', key: 'title', val: 'Quality Assurance & Export Packaging' },
        { page: 'home', section: 'Quality', key: 'desc', val: 'We ensure every product meets international standards with rigorous quality control and professional export-grade packaging.' },
        { page: 'home', section: 'Quality', key: 'item1_title', val: 'Quality Inspection' },
        { page: 'home', section: 'Quality', key: 'item1_desc', val: 'Pre-shipment inspection, sample approval, and supplier verification' },
        { page: 'home', section: 'Quality', key: 'item2_title', val: 'Export Packaging' },
        { page: 'home', section: 'Quality', key: 'item2_desc', val: 'Professional packaging solutions for safe international transit' },
        { page: 'home', section: 'Quality', key: 'item3_title', val: 'Compliance' },
        { page: 'home', section: 'Quality', key: 'item3_desc', val: 'Country-specific labeling and regulatory compliance' },

        { page: 'home', section: 'Process', key: 'title', val: 'How We Work' },
        { page: 'home', section: 'Process', key: 'step1_title', val: 'Requirement Analysis' },
        { page: 'home', section: 'Process', key: 'step1_desc', val: 'We understand your specific needs' },
        { page: 'home', section: 'Process', key: 'step2_title', val: 'Supplier Matching' },
        { page: 'home', section: 'Process', key: 'step2_desc', val: 'Connect with verified manufacturers' },
        { page: 'home', section: 'Process', key: 'step3_title', val: 'Quality Verification' },
        { page: 'home', section: 'Process', key: 'step3_desc', val: 'Rigorous quality checks and samples' },
        { page: 'home', section: 'Process', key: 'step4_title', val: 'Documentation' },
        { page: 'home', section: 'Process', key: 'step4_desc', val: 'Complete export compliance handling' },
        { page: 'home', section: 'Process', key: 'step5_title', val: 'Global Shipping' },
        { page: 'home', section: 'Process', key: 'step5_desc', val: 'Reliable logistics to your destination' },

        { page: 'home', section: 'CTA', key: 'title', val: 'Ready to Source from India?' },
        { page: 'home', section: 'CTA', key: 'desc', val: "Let's discuss your requirements. Our sourcing team is ready to help you find the right products at the right price." },

        // ABOUT PAGE
        { page: 'about', section: 'Hero', key: 'title', val: 'About ABC International' },
        { page: 'about', section: 'Hero', key: 'desc', val: 'Your trusted partner for high-quality sourcing and global export support from India.' },
        { page: 'about', section: 'Main', key: 'content', val: "ABC International is a premier merchant exporter and comprehensive sourcing partner based in India.\n\nWe bridge the gap between global buyers and India's vast manufacturing ecosystem, helping businesses worldwide access quality products at competitive prices.\n\nWhat sets us apart is our backing by Linear Global—a trusted name in logistics—giving us unparalleled expertise in export documentation, shipping, and compliance.\n\nWhether you need raw materials, finished products, packaging, or private label manufacturing, we have the network, knowledge, and logistics capability to deliver." },

        // CONTACT PAGE
        { page: 'contact', section: 'Hero', key: 'title', val: 'Get in Touch' },
        { page: 'contact', section: 'Hero', key: 'desc', val: 'Ready to start sourcing from India? Contact our team to discuss your requirements.' },
        { page: 'contact', section: 'Info', key: 'email', val: 'info@abc-international.co.in' },
        { page: 'contact', section: 'Info', key: 'phone', val: '+91 XXXX XXXXXX' },
        { page: 'contact', section: 'Info', key: 'address', val: 'Mumbai, Maharashtra, India' },
        { page: 'contact', section: 'Stats', key: 'res_time', val: '24h' },
        { page: 'contact', section: 'Stats', key: 'res_desc', val: 'Average response time' },
        { page: 'contact', section: 'Stats', key: 'countries', val: '100+' },
        { page: 'contact', section: 'Stats', key: 'countries_desc', val: 'Countries served' },
        { page: 'contact', section: 'Stats', key: 'suppliers', val: '1000+' },
        { page: 'contact', section: 'Stats', key: 'suppliers_desc', val: 'Verified suppliers' },

        // IMAGES
        { page: 'home', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000' },
        { page: 'home', section: 'Logistics', key: 'side_img', val: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000' },
        { page: 'home', section: 'Sourcing', key: 'side_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000' },
        { page: 'about', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000' },
        { page: 'about', section: 'Main', key: 'side_img', val: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000' },
        { page: 'contact', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000' }
      ];

      for (const c of initialContent) {
        // Automatically calculate limit as 50% more than current text (min 40)
        const calculatedLimit = Math.max(Math.ceil(c.val.length * 1.5), 40);
        
        await supabase.from('site_content').upsert({
          id: `${c.page}_${c.section.replace(/\s+/g, '_').toLowerCase()}_${c.key}`,
          page_name: c.page,
          section_name: c.section,
          content_key: c.key,
          content_value: c.val,
          char_limit: calculatedLimit
        });
      }
      
      setMessage({ text: 'Data synchronized successfully!', type: 'success' });
      fetchData();
      fetchSiteContent();
    } catch (err: any) {
      console.error('Sync error:', err);
      setMessage({ text: 'Sync failed: ' + (err.message || 'Unknown error'), type: 'error' });
    }
    setLoading(false);
  };

  const toggleVisibility = async (type: 'industries' | 'products', id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from(type)
      .update({ is_visible: !currentStatus })
      .eq('id', id);

    if (!error) fetchData();
  };

  const deleteItem = async (type: 'industries' | 'products', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
    const { error } = await supabase.from(type).delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#1b2638', color: '#fff', padding: '2rem 0' }}>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Panel</h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.4rem' }}>ABC International CMS</p>
        </div>
        <nav>
          {[
            { id: 'home-content', label: 'Home Page', icon: FiHome },
            { id: 'about-content', label: 'About Us', icon: FiInfo },
            { id: 'contact-content', label: 'Contact', icon: FiMail },
            { id: 'industries', label: 'Industries', icon: FiGrid },
            { id: 'products', label: 'Products', icon: FiBox },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === tab.id ? '#1f5ff5' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', border: 'none', background: 'transparent', color: '#ff7b72', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', marginTop: '2rem' }}
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', position: 'relative' }}>
        {/* Modals */}
        {editingIndustry && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>Edit Industry: {editingIndustry.title}</h3>
                <button onClick={() => setEditingIndustry(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={saveIndustry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={label}>Title</label>
                  <input 
                    value={editingIndustry.title} 
                    onChange={e => setEditingIndustry({...editingIndustry, title: e.target.value})}
                    maxLength={getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.title || '')}
                    style={field} 
                  />
                  <small className="muted">{editingIndustry.title.length} / {getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.title || '')}</small>
                </div>
                <div>
                  <label style={label}>Description (Short)</label>
                  <textarea 
                    value={editingIndustry.description_short} 
                    onChange={e => setEditingIndustry({...editingIndustry, description_short: e.target.value})}
                    maxLength={getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.desc || '')}
                    style={{...field, height: '80px'}} 
                  />
                  <small className="muted">{editingIndustry.description_short.length} / {getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.desc || '')}</small>
                </div>
                <div>
                  <label style={label}>Full Information (Long)</label>
                  <textarea 
                    value={editingIndustry.full_info} 
                    onChange={e => setEditingIndustry({...editingIndustry, full_info: e.target.value})}
                    maxLength={getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.fullInfo || '')}
                    style={{...field, height: '150px'}} 
                  />
                  <small className="muted">{editingIndustry.full_info.length} / {getCharLimit(industriesData.find(i => i.id === editingIndustry.id)?.fullInfo || '')}</small>
                </div>
                <div>
                  <label style={label}>Icon / Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={editingIndustry.icon} 
                      onChange={e => setEditingIndustry({...editingIndustry, icon: e.target.value})}
                      style={field} 
                      placeholder="Emoji or Cloudinary URL"
                    />
                    <input 
                      type="file" 
                      id="ind-icon-upload" 
                      style={{ display: 'none' }} 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleImageUpload(file);
                          if (url) setEditingIndustry({...editingIndustry, icon: url});
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('ind-icon-upload')?.click()}
                      style={{ ...actionBtn, background: '#f1f5f9', width: 'auto', padding: '0 1rem' }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btnPrimary" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" onClick={() => setEditingIndustry(null)} className="btnSecondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingProduct && (
          <div style={modalOverlay}>
            <div style={{...modalContent, maxWidth: '800px'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>Edit Product: {editingProduct.name}</h3>
                <button onClick={() => setEditingProduct(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const { error } = await supabase.from('products').upsert(editingProduct);
                if (!error) { fetchData(); setEditingProduct(null); setMessage({text: 'Product saved!', type: 'success'}); }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={label}>Product Name</label>
                    <input 
                      value={editingProduct.name} 
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      style={field} 
                    />
                  </div>
                  <div>
                    <label style={label}>Product Image</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={editingProduct.image} 
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                        style={field} 
                        placeholder="Cloudinary URL"
                      />
                      <input 
                        type="file" 
                        id="prod-img-upload" 
                        style={{ display: 'none' }} 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file);
                            if (url) setEditingProduct({...editingProduct, image: url});
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={() => document.getElementById('prod-img-upload')?.click()}
                        style={{ ...actionBtn, background: '#f1f5f9', width: 'auto', padding: '0 1rem' }}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={label}>Description</label>
                  <textarea 
                    value={editingProduct.description} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    style={{...field, height: '100px'}} 
                  />
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Export Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {Object.keys(editingProduct.export_details).map(key => (
                      <div key={key}>
                        <label style={{...label, textTransform: 'capitalize'}}>{key}</label>
                        <input 
                          value={(editingProduct.export_details as any)[key]} 
                          onChange={e => setEditingProduct({
                            ...editingProduct, 
                            export_details: {...editingProduct.export_details, [key]: e.target.value}
                          })}
                          style={field} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btnPrimary" style={{ flex: 1 }}>Save Product</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btnSecondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1b2638' }}>
              {activeTab === 'home-content' && 'Home Page Content'}
              {activeTab === 'about-content' && 'About Page Content'}
              {activeTab === 'contact-content' && 'Contact Page Content'}
              {activeTab === 'industries' && 'Manage Industries'}
              {activeTab === 'products' && 'Manage Products'}
            </h2>
            <p className="muted">Manage your website content and visibility settings.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchData} className="btnSecondary" style={{ padding: '0.6rem' }} title="Refresh Data"><FiSave /></button>
            <button onClick={syncInitialData} className="btnSecondary" style={{ fontSize: '0.85rem' }}>
              Sync Mock Data
            </button>
            <button className="btnPrimary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiPlus /> Add New {activeTab === 'industries' ? 'Industry' : 'Product'}
            </button>
            <button 
              onClick={handleLogout} 
              className="btnSecondary" 
              style={{ fontSize: '0.85rem', color: '#ef4444', borderColor: '#fecaca' }}
            >
              <FiLogOut style={{ marginRight: '0.5rem' }} /> Logout
            </button>
          </div>
        </header>

        {message.text && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            background: message.type === 'success' ? '#def7ec' : '#fde8e8',
            color: message.type === 'success' ? '#03543f' : '#9b1c1c',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <FiAlertCircle /> {message.text}
          </div>
        )}

        {activeTab.includes('content') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {(() => {
              const currentPage = activeTab.split('-')[0];
              
              // Define the sequence for each page to match the live site
              const sectionOrder: Record<string, string[]> = {
                'home': ['Hero', 'Who We Are', 'Services', 'Logistics', 'Sourcing', 'Quality', 'Process', 'CTA'],
                'about': ['Hero', 'Main'],
                'contact': ['Hero', 'Info', 'Stats']
              };

              const orderedSections = sectionOrder[currentPage] || [];
              const availableSections = Array.from(new Set(siteContent.filter(c => c.page_name === currentPage).map(c => c.section_name)));
              
              // Combine ordered sections and any others not in the list
              const finalSections = [
                ...orderedSections.filter(s => availableSections.includes(s)),
                ...availableSections.filter(s => !orderedSections.includes(s))
              ];

              if (finalSections.length === 0 && !loading) {
                return (
                  <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <FiAlertCircle style={{ fontSize: '3rem', color: '#e2e8f0', marginBottom: '1rem' }} />
                    <p className="muted">No content found for this page. <br/> Use "Sync Mock Data" to initialize.</p>
                  </div>
                );
              }

              return finalSections.map(section => (
                <div key={section} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>{section}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {siteContent
                      .filter(c => c.page_name === currentPage && c.section_name === section)
                      .sort((a, b) => {
                        // Keep keys like 'title' at the top, then 'desc', then others
                        const priority = (k: string) => k === 'title' ? 0 : k === 'desc' ? 1 : 2;
                        return priority(a.content_key) - priority(b.content_key);
                      })
                      .map(item => (
                        <div key={item.id}>
                          <label style={label}>{item.content_key.replace(/_/g, ' ').replace(/\d/g, '').replace('item', 'Point ').replace('step', 'Step ')}</label>
                          {item.content_key.includes('img') ? (
                            <div style={{ marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={item.content_value} style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} alt="Preview" />
                                <div style={{ flex: 1 }}>
                                  <input 
                                    value={item.content_value} 
                                    onChange={e => updateContent(item.id, e.target.value)}
                                    style={field}
                                    placeholder="Image URL"
                                  />
                                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                      type="file" 
                                      id={`upload-${item.id}`} 
                                      style={{ display: 'none' }} 
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const url = await handleImageUpload(file);
                                          if (url) updateContent(item.id, url);
                                        }
                                      }}
                                    />
                                    <button 
                                      type="button" 
                                      onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                                      className="btnSecondary" 
                                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                    >
                                      Upload New Image
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : item.content_key.includes('desc') || item.content_key.includes('content') || item.content_key.includes('p1') || item.content_key.includes('p2') || item.content_key.includes('address') ? (
                            <textarea 
                              value={item.content_value} 
                              onChange={e => updateContent(item.id, e.target.value)}
                              maxLength={item.char_limit}
                              style={{...field, height: item.content_key === 'content' ? '200px' : '80px'}}
                            />
                          ) : (
                            <input 
                              value={item.content_value} 
                              onChange={e => updateContent(item.id, e.target.value)}
                              maxLength={item.char_limit}
                              style={field}
                            />
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                            <small className="muted">{item.content_value.length} / {item.char_limit} characters</small>
                            <small style={{ color: '#1f5ff5', fontWeight: 600 }}>Auto-saving...</small>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading CMS data...</div>
        ) : (activeTab === 'industries' || activeTab === 'products') && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={th}>Name / Title</th>
                  <th style={th}>Status</th>
                  <th style={th}>Last Updated</th>
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'industries' && industries.map(item => (
                  <tr key={item.id} style={tr}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: item.is_visible ? '#def7ec' : '#f3f4f6',
                        color: item.is_visible ? '#03543f' : '#718096'
                      }}>
                        {item.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="muted" style={{ ...td, fontSize: '0.85rem' }}>
                      {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => toggleVisibility('industries', item.id, item.is_visible)} title="Toggle Visibility" style={actionBtn}>
                          {item.is_visible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button onClick={() => setEditingIndustry(item)} title="Edit" style={actionBtn}><FiEdit2 /></button>
                        <button onClick={() => deleteItem('industries', item.id)} title="Delete" style={{ ...actionBtn, color: '#ef4444' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'products' && products.map(item => (
                  <tr key={item.id} style={tr}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: item.is_visible ? '#def7ec' : '#f3f4f6',
                        color: item.is_visible ? '#03543f' : '#718096'
                      }}>
                        {item.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="muted" style={{ ...td, fontSize: '0.85rem' }}>
                      {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => toggleVisibility('products', item.id, item.is_visible)} title="Toggle Visibility" style={actionBtn}>
                          {item.is_visible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button onClick={() => setEditingProduct(item)} title="Edit" style={actionBtn}><FiEdit2 /></button>
                        <button onClick={() => deleteItem('products', item.id)} title="Delete" style={{ ...actionBtn, color: '#ef4444' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '2rem'
};

const modalContent: React.CSSProperties = {
  background: '#fff',
  padding: '2.5rem',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
};

const field: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  marginTop: '0.5rem',
  fontSize: '0.95rem'
};

const label: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#475569'
};


const th: React.CSSProperties = {
  padding: '1.2rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.85rem',
  color: '#64748b',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const td: React.CSSProperties = {
  padding: '1.2rem 1.5rem',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '0.95rem'
};

const tr: React.CSSProperties = {
  transition: 'background 0.2s'
};

const actionBtn: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#64748b',
  fontSize: '1rem',
  transition: 'all 0.2s'
};
