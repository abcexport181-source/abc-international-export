'use client'
import React, { useState, useEffect } from 'react';
import { supabase, IndustryData, ProductData, SiteContent, isSupabaseConfigured } from '@/lib/supabase';
import { FiLayout, FiGrid, FiBox, FiEye, FiEyeOff, FiEdit2, FiPlus, FiTrash2, FiSave, FiAlertCircle, FiHome, FiInfo, FiMail, FiLogOut, FiSearch, FiTruck, FiList, FiShield } from 'react-icons/fi';
import { industriesData, productsData } from '@/data/products';
import BackToTop from '@/components/common/BackToTop';

type Tab = 'home-content' | 'about-content' | 'sourcing-content' | 'logistics-content' | 'quality-packaging-content' | 'industries-content' | 'contact-content' | 'industries' | 'products' | 'blogs';


import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { createSession, removeSession, getSession } from '@/app/actions/auth';
import { updateSiteContentBatch, syncInitialDataBatch, upsertSiteContent } from '@/app/actions/content';

import { saveIndustryAction, deleteIndustryAction, toggleIndustryVisibilityAction } from '@/app/actions/industries';
import { saveProductAction, deleteProductAction, toggleProductVisibilityAction } from '@/app/actions/products';
import { saveBlogAction, deleteBlogAction, toggleBlogVisibilityAction } from '@/app/actions/blogs';
import { FiFileText } from 'react-icons/fi';
import { BlogData } from '@/lib/supabase';



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
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isBlogVisibleOnSite, setIsBlogVisibleOnSite] = useState(false);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);



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
    setMessage({ text: '', type: '' });
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
    // Add a dummy filter to bust any potential caches
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .order('page_name')
      .filter('id', 'neq', `cache_buster_${Date.now()}`); 
      
    if (data) {
      setSiteContent(data);
      const blogVis = data.find((c: SiteContent) => c.content_key === 'blog_visibility');
      if (blogVis) setIsBlogVisibleOnSite(blogVis.content_value === 'true');
    }
  };

  const toggleBlogPageVisibility = async () => {
    const newValue = !isBlogVisibleOnSite;
    // We use a generic ID for the global setting if it exists, or let upsert handle it
    const existing = siteContent.find((c: SiteContent) => c.content_key === 'blog_visibility');
    
    const result = await upsertSiteContent([{
      id: existing?.id,
      page_name: 'global',
      section_name: 'navigation',
      content_key: 'blog_visibility',
      content_value: String(newValue)
    }]);

    
    if (result.success) {
      setIsBlogVisibleOnSite(newValue);
      setMessage({ text: `Blog page is now ${newValue ? 'visible' : 'hidden'} in the menu bar.`, type: 'success' });
      fetchSiteContent(); // refresh state
    } else {
      setMessage({ text: 'Error updating blog visibility: ' + result.error, type: 'error' });
    }
  };


  const updateLocalContent = (id: string, value: string) => {
    setPendingChanges(prev => ({ ...prev, [id]: value }));
  };

  const saveAllChanges = async () => {
    const changesCount = Object.keys(pendingChanges).length;
    if (changesCount === 0) return;
    
    setIsSaving(true);
    const updatesArray = Object.entries(pendingChanges).map(([id, value]) => ({ id, value }));
    
    try {
      const result = await updateSiteContentBatch(updatesArray);
      
      if (result.success) {
        setMessage({ text: `Successfully updated ${result.count} items!`, type: 'success' });
        
        // Update local state immediately with returned data to avoid re-fetch lag/stale data
        if (result.data) {
          setSiteContent(prev => {
            const newContent = [...prev];
            (result.data as any[]).forEach(updatedItem => {
              const index = newContent.findIndex(c => c.id === updatedItem.id);
              if (index !== -1) {
                newContent[index] = updatedItem;
              }
            });
            return newContent;
          });
        }

        setPendingChanges({});
        
        // Still fetch in background just to be absolutely sure, but UI is already updated
        fetchSiteContent();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error('Save operation failed:', err);
      setMessage({ text: 'Error saving: ' + err.message, type: 'error' });
    }
    setIsSaving(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCharLimit = (text: string) => Math.max(Math.ceil(text.length * 1.5), 30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: indData } = await supabase.from('industries').select('*').order('title');
      const { data: prodData } = await supabase.from('products').select('*').order('name');
      const { data: blogData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (indData) setIndustries(indData);
      if (prodData) setProducts(prodData);
      if (blogData) setBlogs(blogData);

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
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.url) return data.url;
        throw new Error(data.error || 'Upload failed');
      } else {
        const text = await res.text();
        console.error('Server returned non-JSON response:', text);
        throw new Error(`Server Error (${res.status}): Please check Vercel logs. The server returned a non-JSON response.`);
      }
    } catch (err: any) {
      setMessage({ text: 'Upload failed: ' + err.message, type: 'error' });
      return null;
    }
  };

  const DirectUpload = ({ value, onChange, label: fieldLabel }: { value: string, onChange: (url: string) => void, label: string }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    return (
      <div style={{ marginTop: '0.8rem' }}>
        <label style={label}>{fieldLabel}</label>
        <div style={{ 
          marginTop: '0.5rem',
          border: '2px dashed #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => {
          console.log('Upload area clicked for:', fieldLabel);
          fileInputRef.current?.click();
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = '#1f5ff5'}
        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          {value ? (
            <img src={value} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} alt="Preview" />
          ) : (
            <div style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>
              <FiPlus style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <p>Click to upload image</p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }} 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              console.log('File selected:', file?.name, 'Size:', file?.size);
              if (file) {
                // Client-side size check (4.5MB limit for Vercel)
                if (file.size > 4.5 * 1024 * 1024) {
                  setMessage({ text: 'Image is too large! Please use an image smaller than 4.5MB (Current: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB)', type: 'error' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setUploading(true);
                console.log('Starting upload to server...');
                const url = await handleImageUpload(file);
                console.log('Upload result URL:', url);
                if (url) onChange(url);
                setUploading(false);
              }
            }}
          />
          
          {uploading && <div style={{ fontSize: '0.85rem', color: '#1f5ff5' }}>Uploading...</div>}
          
          <div style={{ width: '100%', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              value={value} 
              onChange={e => onChange(e.target.value)}
              style={{ ...field, marginTop: 0, fontSize: '0.75rem' }}
              placeholder="Or paste image URL here..."
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  };

  const saveIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndustry) return;

    // Ensure keys is an array before saving
    const dataToSave = {
      ...editingIndustry,
      keys: typeof editingIndustry.keys === 'string' 
        ? (editingIndustry.keys as string).split(',').map(k => k.trim()).filter(k => k)
        : editingIndustry.keys
    };

    const result = await saveIndustryAction(dataToSave);


    if (result.success) {
      setMessage({ text: 'Industry saved successfully!', type: 'success' });
      setEditingIndustry(null);
      fetchData();
    } else {
      console.error('Supabase Save Error:', result.error);
      setMessage({ text: 'Error saving industry: ' + (result.error || 'Unknown error'), type: 'error' });
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
        
        // SOURCING PAGE
        { page: 'sourcing', section: 'Hero', key: 'title', val: 'Global Product Sourcing from India' },
        { page: 'sourcing', section: 'Hero', key: 'desc', val: 'End-to-end sourcing from India with verified suppliers and product solutions tailored for your market.' },
        { page: 'sourcing', section: 'Source', key: 'title', val: 'What We Source' },
        { page: 'sourcing', section: 'Source', key: 'desc', val: 'From raw materials to finished products, we source across all categories to meet your business needs' },
        { page: 'sourcing', section: 'Source', key: 'item1_title', val: 'Products' },
        { page: 'sourcing', section: 'Source', key: 'item1_desc', val: 'Finished goods across all categories ready for export' },
        { page: 'sourcing', section: 'Source', key: 'item2_title', val: 'Raw Materials' },
        { page: 'sourcing', section: 'Source', key: 'item2_desc', val: 'Industrial and manufacturing raw materials from verified suppliers' },
        { page: 'sourcing', section: 'Source', key: 'item3_title', val: 'Packaging' },
        { page: 'sourcing', section: 'Source', key: 'item3_desc', val: 'Custom packaging solutions and materials for your products' },
        { page: 'sourcing', section: 'Source', key: 'item4_title', val: 'Private Label' },
        { page: 'sourcing', section: 'Source', key: 'item4_desc', val: 'White-label and private label manufacturing services' },
        { page: 'sourcing', section: 'Process', key: 'title', val: 'Our Sourcing Process' },
        { page: 'sourcing', section: 'Process', key: 'desc', val: 'A transparent, step-by-step approach to finding and delivering the right products' },
        { page: 'sourcing', section: 'Process', key: 'step1_title', val: 'Requirement' },
        { page: 'sourcing', section: 'Process', key: 'step1_desc', val: 'Share your product specifications, quantity, quality standards, and target price' },
        { page: 'sourcing', section: 'Process', key: 'step2_title', val: 'Supplier Identification' },
        { page: 'sourcing', section: 'Process', key: 'step2_desc', val: 'We identify and shortlist verified manufacturers from our extensive network' },
        { page: 'sourcing', section: 'Process', key: 'step3_title', val: 'Samples' },
        { page: 'sourcing', section: 'Process', key: 'step3_desc', val: 'Arrange samples for your evaluation and approval before bulk production' },
        { page: 'sourcing', section: 'Process', key: 'step4_title', val: 'Pricing' },
        { page: 'sourcing', section: 'Process', key: 'step4_desc', val: 'Negotiate competitive pricing and payment terms on your behalf' },
        { page: 'sourcing', section: 'Process', key: 'step5_title', val: 'Inspection' },
        { page: 'sourcing', section: 'Process', key: 'step5_desc', val: 'Conduct pre-shipment quality inspection to ensure compliance with your standards' },
        { page: 'sourcing', section: 'Process', key: 'step6_title', val: 'Shipment' },
        { page: 'sourcing', section: 'Process', key: 'step6_desc', val: 'Handle complete export logistics from factory to your destination' },
        { page: 'sourcing', section: 'Network', key: 'title', val: 'Manufacturer Network Across Industries' },
        { page: 'sourcing', section: 'Network', key: 'desc', val: 'Our extensive network spans India\'s manufacturing landscape, giving you access to suppliers across diverse sectors.' },
        { page: 'sourcing', section: 'Network', key: 'item1', val: 'Agro & Food Products' },
        { page: 'sourcing', section: 'Network', key: 'item2', val: 'Packaging Materials' },
        { page: 'sourcing', section: 'Network', key: 'item3', val: 'Industrial Equipment' },
        { page: 'sourcing', section: 'Network', key: 'item4', val: 'Raw Materials' },
        { page: 'sourcing', section: 'Network', key: 'item5', val: 'Chemicals & Additives' },
        { page: 'sourcing', section: 'Network', key: 'item6', val: 'Consumer Products' },
        { page: 'sourcing', section: 'Network', key: 'item7', val: 'Textiles & Apparel' },
        { page: 'sourcing', section: 'Network', key: 'item8', val: 'Handicrafts & Decor' },
        { page: 'sourcing', section: 'Network', key: 'item9', val: 'Engineering Products' },
        { page: 'sourcing', section: 'Network', key: 'item10', val: 'Pharmaceuticals' },
        { page: 'sourcing', section: 'Network', key: 'item11', val: 'Electronics Components' },
        { page: 'sourcing', section: 'Network', key: 'item12', val: 'Building Materials' },
        { page: 'sourcing', section: 'Network', key: 'link_text', val: 'Explore All Industries' },
        { page: 'sourcing', section: 'Custom', key: 'title', val: 'Custom Sourcing Solutions' },
        { page: 'sourcing', section: 'Custom', key: 'desc', val: 'We deliver flexible sourcing plans to match your product, quality, and delivery goals.' },
        { page: 'sourcing', section: 'Custom', key: 'feat1_title', val: 'Specific Product Specs' },
        { page: 'sourcing', section: 'Custom', key: 'feat1_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Custom', key: 'feat2_title', val: 'Global Certifications' },
        { page: 'sourcing', section: 'Custom', key: 'feat2_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Custom', key: 'feat3_title', val: 'Quality Protocols' },
        { page: 'sourcing', section: 'Custom', key: 'feat3_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Custom', key: 'feat4_title', val: 'Budget Control' },
        { page: 'sourcing', section: 'Custom', key: 'feat4_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Custom', key: 'feat5_title', val: 'Timeline Management' },
        { page: 'sourcing', section: 'Custom', key: 'feat5_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Custom', key: 'feat6_title', val: 'Complete Traceability' },
        { page: 'sourcing', section: 'Custom', key: 'feat6_desc', val: 'Built to reduce risk and improve execution consistency.' },
        { page: 'sourcing', section: 'Quality', key: 'title', val: 'Quality You Can Trust' },
        { page: 'sourcing', section: 'Quality', key: 'desc', val: 'We don\'t just connect you with suppliers—we ensure every product meets your quality standards.' },
        { page: 'sourcing', section: 'Quality', key: 'item1_title', val: 'Supplier Verification' },
        { page: 'sourcing', section: 'Quality', key: 'item1_desc', val: 'All manufacturers are pre-vetted for certifications and capability' },
        { page: 'sourcing', section: 'Quality', key: 'item2_title', val: 'Sample Testing' },
        { page: 'sourcing', section: 'Quality', key: 'item2_desc', val: 'Comprehensive sample evaluation before bulk orders' },
        { page: 'sourcing', section: 'Quality', key: 'item3_title', val: 'Pre-Shipment Inspection' },
        { page: 'sourcing', section: 'Quality', key: 'item3_desc', val: 'Third-party inspection services available on request' },
        { page: 'sourcing', section: 'Quality', key: 'item4_title', val: 'Documentation' },
        { page: 'sourcing', section: 'Quality', key: 'item4_desc', val: 'Complete test reports and quality certificates' },
        { page: 'sourcing', section: 'Quality', key: 'link_text', val: 'Learn About Quality Processes' },
        { page: 'sourcing', section: 'CTA', key: 'title', val: 'Ready to Start Sourcing?' },
        { page: 'sourcing', section: 'CTA', key: 'desc', val: 'Let us help you source the right product from trusted Indian suppliers.' },
        { page: 'sourcing', section: 'CTA', key: 'btn_text', val: 'Request Sourcing Support' },

        // LOGISTICS PAGE
        { page: 'logistics', section: 'Hero', key: 'title', val: 'Logistics Backed Export Expertise' },
        { page: 'logistics', section: 'Hero', key: 'desc', val: 'From cargo planning to documentation, we ensure products move efficiently to global markets.' },
        { page: 'logistics', section: 'Expertise', key: 'title', val: 'Why Logistics Expertise Matters' },
        { page: 'logistics', section: 'Expertise', key: 'desc', val: 'Export success isn\'t just about finding the right product—it\'s about getting it to your destination safely, on time, and in compliance with all regulations.' },
        { page: 'logistics', section: 'Expertise', key: 'item1_title', val: 'Timely Delivery' },
        { page: 'logistics', section: 'Expertise', key: 'item1_desc', val: 'Meet your deadlines with reliable shipping schedules' },
        { page: 'logistics', section: 'Expertise', key: 'item2_title', val: 'Safe Transit' },
        { page: 'logistics', section: 'Expertise', key: 'item2_desc', val: 'Professional handling and insurance protection' },
        { page: 'logistics', section: 'Expertise', key: 'item3_title', val: 'Compliance' },
        { page: 'logistics', section: 'Expertise', key: 'item3_desc', val: 'Navigate complex customs and regulations' },
        { page: 'logistics', section: 'Expertise', key: 'item4_title', val: 'Global Reach' },
        { page: 'logistics', section: 'Expertise', key: 'item4_desc', val: 'Deliver to any destination worldwide' },
        { page: 'logistics', section: 'Docs', key: 'title', val: 'Complete Export Documentation' },
        { page: 'logistics', section: 'Docs', key: 'desc', val: 'We handle all the paperwork so you don\'t have to. Our team ensures every document is accurate and compliant.' },
        { page: 'logistics', section: 'Docs', key: 'item1_title', val: 'Certificate of Origin (COO)' },
        { page: 'logistics', section: 'Docs', key: 'item1_desc', val: 'Official certification of product origin for customs clearance and preferential tariffs' },
        { page: 'logistics', section: 'Docs', key: 'item2_title', val: 'Phytosanitary Certificate' },
        { page: 'logistics', section: 'Docs', key: 'item2_desc', val: 'Required for agricultural and food products, certifying pest-free status' },
        { page: 'logistics', section: 'Docs', key: 'item3_title', val: 'FSSAI Certificate' },
        { page: 'logistics', section: 'Docs', key: 'item3_desc', val: 'Food safety certification for food products exported from India' },
        { page: 'logistics', section: 'Docs', key: 'item4_title', val: 'Commercial Invoice' },
        { page: 'logistics', section: 'Docs', key: 'item4_desc', val: 'Detailed invoice with product descriptions, values, and shipping terms' },
        { page: 'logistics', section: 'Docs', key: 'item5_title', val: 'Packing List' },
        { page: 'logistics', section: 'Docs', key: 'item5_desc', val: 'Complete itemized list of package contents, dimensions, and weights' },
        { page: 'logistics', section: 'Docs', key: 'item6_title', val: 'Bill of Lading / Airway Bill' },
        { page: 'logistics', section: 'Docs', key: 'item6_desc', val: 'Official shipping document serving as receipt and contract' },
        { page: 'logistics', section: 'Docs', key: 'item7_title', val: 'Insurance Certificate' },
        { page: 'logistics', section: 'Docs', key: 'item7_desc', val: 'Cargo insurance documentation for protection during transit' },
        { page: 'logistics', section: 'Docs', key: 'item8_title', val: 'Export License' },
        { page: 'logistics', section: 'Docs', key: 'item8_desc', val: 'Government authorization for specific controlled products' },
        { page: 'logistics', section: 'Docs', key: 'note_bold', val: 'Additional certifications available:' },
        { page: 'logistics', section: 'Docs', key: 'note_desc', val: 'Health Certificate, Fumigation Certificate, Test Reports, GSP Certificate, and more' },
        { page: 'logistics', section: 'Solutions', key: 'title', val: 'Comprehensive Shipping Solutions' },
        { page: 'logistics', section: 'Solutions', key: 'desc', val: 'Multiple shipping modes to suit your timeline, budget, and cargo requirements' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_title', val: 'Sea Freight' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat1', val: 'Full Container Load (FCL)' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat2', val: 'Less than Container Load (LCL)' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat3', val: 'Roll-on/Roll-off (RoRo)' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat4', val: 'Bulk cargo shipping' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat5', val: 'Port-to-port delivery' },
        { page: 'logistics', section: 'Solutions', key: 'sol1_feat6', val: 'Door-to-door service' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_title', val: 'Air Freight' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat1', val: 'Express air cargo' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat2', val: 'Standard air freight' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat3', val: 'Charter services' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat4', val: 'Temperature-controlled' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat5', val: 'Dangerous goods handling' },
        { page: 'logistics', section: 'Solutions', key: 'sol2_feat6', val: 'Airport-to-airport delivery' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_title', val: 'Consolidation' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat1', val: 'LCL consolidation' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat2', val: 'Multi-vendor shipments' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat3', val: 'Cost optimization' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat4', val: 'Regular sailing schedules' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat5', val: 'Cargo aggregation' },
        { page: 'logistics', section: 'Solutions', key: 'sol3_feat6', val: 'Shared container services' },
        { page: 'logistics', section: 'Partner', key: 'title', val: 'Powered by Linear Global' },
        { page: 'logistics', section: 'Partner', key: 'desc', val: 'Our partnership with Linear Global gives us access to world-class logistics infrastructure and expertise built over decades in international freight forwarding.' },
        { page: 'logistics', section: 'Partner', key: 'item1', val: 'Real-time shipment tracking and visibility' },
        { page: 'logistics', section: 'Partner', key: 'item2', val: 'Competitive freight rates through established partnerships' },
        { page: 'logistics', section: 'Partner', key: 'item3', val: 'Dedicated customs clearance team' },
        { page: 'logistics', section: 'Partner', key: 'item4', val: 'Insurance coverage options' },
        { page: 'logistics', section: 'Partner', key: 'item5', val: 'Warehousing and storage facilities' },
        { page: 'logistics', section: 'Partner', key: 'item6', val: 'Last-mile delivery coordination' },
        { page: 'logistics', section: 'Partner', key: 'item7', val: '24/7 customer support' },
        { page: 'logistics', section: 'Partner', key: 'item8', val: 'Multi-modal transportation solutions' },
        { page: 'logistics', section: 'Compliance', key: 'title', val: 'Compliance Handling' },
        { page: 'logistics', section: 'Compliance', key: 'desc', val: 'Navigate complex international regulations with confidence' },
        { page: 'logistics', section: 'Compliance', key: 'item1_title', val: 'Country-Specific Regulations' },
        { page: 'logistics', section: 'Compliance', key: 'item1_desc', val: 'Expert knowledge of import requirements for 100+ countries including USA, EU, Middle East, Africa, and Asia' },
        { page: 'logistics', section: 'Compliance', key: 'item2_title', val: 'Labeling Requirements' },
        { page: 'logistics', section: 'Compliance', key: 'item2_desc', val: 'Ensure product labels meet destination country standards including language, content, and format' },
        { page: 'logistics', section: 'Compliance', key: 'item3_title', val: 'Packing Standards' },
        { page: 'logistics', section: 'Compliance', key: 'item3_desc', val: 'Compliance with international packing standards like ISPM 15 for wooden packaging materials' },
        { page: 'logistics', section: 'Compliance', key: 'item4_title', val: 'Customs Clearance' },
        { page: 'logistics', section: 'Compliance', key: 'item4_desc', val: 'Smooth customs processing with accurate documentation and classification' },
        { page: 'logistics', section: 'Timeline', key: 'title', val: 'Export Process Timeline' },
        { page: 'logistics', section: 'Timeline', key: 'desc', val: 'From order confirmation to final delivery, we manage every step' },
        { page: 'logistics', section: 'Timeline', key: 'step1_title', val: 'Order Confirmation' },
        { page: 'logistics', section: 'Timeline', key: 'step1_desc', val: 'Production begins' },
        { page: 'logistics', section: 'Timeline', key: 'step2_title', val: 'Quality Check' },
        { page: 'logistics', section: 'Timeline', key: 'step2_desc', val: 'Pre-shipment inspection' },
        { page: 'logistics', section: 'Timeline', key: 'step3_title', val: 'Documentation' },
        { page: 'logistics', section: 'Timeline', key: 'step3_desc', val: 'Prepare all export docs' },
        { page: 'logistics', section: 'Timeline', key: 'step4_title', val: 'Shipping' },
        { page: 'logistics', section: 'Timeline', key: 'step4_desc', val: 'Cargo dispatched' },
        { page: 'logistics', section: 'Timeline', key: 'step5_title', val: 'Delivery' },
        { page: 'logistics', section: 'Timeline', key: 'step5_desc', val: 'Reach destination' },
        { page: 'logistics', section: 'Trust', key: 'title', val: 'This Builds Serious Buyer Trust' },
        { page: 'logistics', section: 'Trust', key: 'desc', val: 'When you work with ABC International, you\'re not just getting a supplier—you\'re getting a complete logistics partner who ensures your cargo arrives safely, on time, and in full compliance.' },
        { page: 'logistics', section: 'Trust', key: 'btn1_text', val: 'Discuss Your Shipment' },
        { page: 'logistics', section: 'Trust', key: 'btn2_text', val: 'Explore Sourcing Services' },

        // QUALITY-PACKAGING PAGE
        { page: 'quality-packaging', section: 'Hero', key: 'title', val: 'Quality Assurance & Export Packaging' },
        { page: 'quality-packaging', section: 'Hero', key: 'desc', val: 'Reliable quality checks and secure export packaging to deliver consistent products worldwide.' },
        { page: 'quality-packaging', section: 'Inspection', key: 'title', val: 'Quality Inspection Process' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item1_title', val: 'Supplier Verification' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item1_desc', val: 'Thorough vetting of manufacturers including facility audits, certifications review, and capability assessment' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item2_title', val: 'Sample Approval' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item2_desc', val: 'Comprehensive testing of samples against your specifications before production authorization' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item3_title', val: 'Pre-Shipment Inspection' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item3_desc', val: 'Final quality check before shipping including visual inspection, measurements, and functionality tests' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item4_title', val: 'Documentation' },
        { page: 'quality-packaging', section: 'Inspection', key: 'item4_desc', val: 'Complete quality certificates, test reports, and compliance documentation for your records' },
        { page: 'quality-packaging', section: 'Standards', key: 'title', val: 'Our Inspection Standards' },
        { page: 'quality-packaging', section: 'Standards', key: 'desc', val: 'We implement comprehensive quality checks at every stage to ensure your products meet the highest standards.' },
        { page: 'quality-packaging', section: 'Standards', key: 'item1', val: 'Factory audit and capability assessment' },
        { page: 'quality-packaging', section: 'Standards', key: 'item2', val: 'Raw material verification' },
        { page: 'quality-packaging', section: 'Standards', key: 'item3', val: 'In-process quality monitoring' },
        { page: 'quality-packaging', section: 'Standards', key: 'item4', val: 'Finished product inspection' },
        { page: 'quality-packaging', section: 'Standards', key: 'item5', val: 'Packaging and labeling verification' },
        { page: 'quality-packaging', section: 'Standards', key: 'item6', val: 'Documentation compliance check' },
        { page: 'quality-packaging', section: 'Standards', key: 'note_bold', val: 'Third-party inspection services' },
        { page: 'quality-packaging', section: 'Standards', key: 'note_desc', val: 'are available on request for additional assurance' },
        { page: 'quality-packaging', section: 'Solutions', key: 'title', val: 'Packaging Solutions' },
        { page: 'quality-packaging', section: 'Solutions', key: 'desc', val: 'Professional packaging designed for safe international transit and market-ready presentation' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item1_title', val: 'Export Packaging' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item1_desc', val: 'Heavy-duty packaging designed for international shipping, including palletization and containerization' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item2_title', val: 'Retail Packaging' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item2_desc', val: 'Consumer-ready packaging with custom branding, labels, and presentation materials' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item3_title', val: 'Private Label Packaging' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item3_desc', val: 'Complete white-label packaging solutions with your brand identity and specifications' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item4_title', val: 'Protective Packaging' },
        { page: 'quality-packaging', section: 'Solutions', key: 'item4_desc', val: 'Specialized packaging for fragile, hazardous, or temperature-sensitive products' },
        { page: 'quality-packaging', section: 'Options', key: 'title', val: 'Comprehensive Packaging Options' },
        { page: 'quality-packaging', section: 'Options', key: 'desc', val: 'From industrial bulk packaging to retail-ready presentation, we provide solutions for every need.' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_title', val: 'Industrial Packaging' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_tag1', val: 'Corrugated boxes' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_tag2', val: 'Wooden crates' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_tag3', val: 'Pallets' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_tag4', val: 'Stretch wrap' },
        { page: 'quality-packaging', section: 'Options', key: 'type1_tag5', val: 'Industrial drums' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_title', val: 'Consumer Packaging' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_tag1', val: 'Folding cartons' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_tag2', val: 'Blister packs' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_tag3', val: 'Pouches' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_tag4', val: 'Bottles & jars' },
        { page: 'quality-packaging', section: 'Options', key: 'type2_tag5', val: 'Display boxes' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_title', val: 'Specialty Packaging' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_tag1', val: 'Vacuum packaging' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_tag2', val: 'Modified atmosphere' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_tag3', val: 'Temperature controlled' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_tag4', val: 'Anti-static' },
        { page: 'quality-packaging', section: 'Options', key: 'type3_tag5', val: 'Hazmat compliant' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'title', val: 'Sustainable Packaging Solutions' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'desc', val: 'Environmentally responsible packaging options without compromising protection or quality' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'item1_title', val: 'Eco-Friendly Packaging' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'item1_desc', val: 'Biodegradable and sustainable packaging materials that reduce environmental impact' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'item2_title', val: 'Recyclable Materials' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'item2_desc', val: 'Packaging solutions using recyclable materials compliant with global environmental standards' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'feat1', val: 'Biodegradable Options' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'feat2', val: 'FSC Certified Materials' },
        { page: 'quality-packaging', section: 'Sustainable', key: 'feat3', val: 'Carbon Neutral Shipping' },
        { page: 'quality-packaging', section: 'Compliance', key: 'title', val: 'Compliance & Certification' },
        { page: 'quality-packaging', section: 'Compliance', key: 'desc', val: 'All our quality and packaging solutions comply with international standards and country-specific regulations.' },
        { page: 'quality-packaging', section: 'Compliance', key: 'cert1', val: 'ISO Certified' },
        { page: 'quality-packaging', section: 'Compliance', key: 'cert2', val: 'FDA Compliant' },
        { page: 'quality-packaging', section: 'Compliance', key: 'cert3', val: 'FSSAI Approved' },
        { page: 'quality-packaging', section: 'Compliance', key: 'cert4', val: 'CE Marking' },
        { page: 'quality-packaging', section: 'CTA', key: 'title', val: 'Need Quality Assurance or Packaging Solutions?' },
        { page: 'quality-packaging', section: 'CTA', key: 'desc', val: 'Speak with our team for product-specific support.' },
        { page: 'quality-packaging', section: 'CTA', key: 'btn_text', val: 'Contact Us' },

        // INDUSTRIES PAGE
        { page: 'industries', section: 'Hero', key: 'title', val: 'Industries We Serve' },
        { page: 'industries', section: 'Hero', key: 'desc', val: 'Comprehensive sourcing expertise across diverse manufacturing sectors in India.' },
        { page: 'industries', section: 'Missing', key: 'title', val: 'Don\'t See Your Industry?' },
        { page: 'industries', section: 'Missing', key: 'desc', val: 'Our sourcing network handles specialized requirements. If your sector is not listed, we can still help find the right manufacturers in India.' },
        { page: 'industries', section: 'Missing', key: 'btn_text', val: 'Discuss Your Requirements' },
        { page: 'industries', section: 'Expertise', key: 'title', val: 'Why Choose Our Multi-Industry Expertise' },
        { page: 'industries', section: 'Expertise', key: 'item1_title', val: 'Vast Network' },
        { page: 'industries', section: 'Expertise', key: 'item1_desc', val: 'Connections with thousands of verified manufacturers across all major industries' },
        { page: 'industries', section: 'Expertise', key: 'item2_title', val: 'Quality Assurance' },
        { page: 'industries', section: 'Expertise', key: 'item2_desc', val: 'Industry-specific quality standards and inspection protocols' },
        { page: 'industries', section: 'Expertise', key: 'item3_title', val: 'Compliance Expertise' },
        { page: 'industries', section: 'Expertise', key: 'item3_desc', val: 'Deep knowledge of export regulations for each industry segment' },
        { page: 'industries', section: 'CTA', key: 'title', val: 'Ready to Source from India?' },
        { page: 'industries', section: 'CTA', key: 'desc', val: 'Whatever your industry, we have the expertise and network to help you source quality products from India.' },
        { page: 'industries', section: 'CTA', key: 'btn1_text', val: 'Explore Sourcing Services' },
        { page: 'industries', section: 'CTA', key: 'btn2_text', val: 'Get In Touch' },

        // IMAGES
        { page: 'home', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000' },
        { page: 'home', section: 'Logistics', key: 'side_img', val: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000' },
        { page: 'home', section: 'Sourcing', key: 'side_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000' },
        { page: 'about', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000' },
        { page: 'about', section: 'Main', key: 'side_img', val: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000' },
        { page: 'contact', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000' },
        { page: 'sourcing', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=2000' },
        { page: 'sourcing', section: 'Network', key: 'side_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000' },
        { page: 'sourcing', section: 'Custom', key: 'bg_img', val: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000' },
        { page: 'sourcing', section: 'Quality', key: 'side_img', val: 'https://images.unsplash.com/photo-1521331908054-9a180b7d3912?auto=format&fit=crop&q=80&w=1000' },
        { page: 'logistics', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000' },
        { page: 'logistics', section: 'Partner', key: 'side_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=1000' },
        { page: 'logistics', section: 'Partner', key: 'bg_img', val: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000' },
        { page: 'logistics', section: 'Trust', key: 'bg_img', val: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000' },
        { page: 'industries', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000' },
        { page: 'industries', section: 'CTA', key: 'bg_img', val: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000' },
        { page: 'quality-packaging', section: 'Hero', key: 'bg_img', val: 'https://images.unsplash.com/photo-1521331908054-9a180b7d3912?auto=format&fit=crop&q=80&w=2000' },
        { page: 'quality-packaging', section: 'Standards', key: 'side_img', val: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000' },
        { page: 'quality-packaging', section: 'Options', key: 'side_img', val: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000' },
        { page: 'quality-packaging', section: 'CTA', key: 'bg_img', val: 'https://images.unsplash.com/photo-1566367576585-051277d52997?auto=format&fit=crop&q=80&w=2000' },
        { page: 'global', section: 'navigation', key: 'blog_visibility', val: 'false' }
      ];


      const result = await syncInitialDataBatch(initialContent);
      
      if (result.success) {
        setMessage({ text: 'Data synchronized successfully!', type: 'success' });
        fetchData();
        fetchSiteContent();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {

      console.error('Sync error:', err);
      setMessage({ text: 'Sync failed: ' + (err.message || 'Unknown error'), type: 'error' });
    }
    setLoading(false);
  };

  const toggleVisibility = async (type: 'industries' | 'products' | 'blogs', id: string, currentStatus: boolean) => {
    let result;
    if (type === 'industries') result = await toggleIndustryVisibilityAction(id, !currentStatus);
    else if (type === 'products') result = await toggleProductVisibilityAction(id, !currentStatus);
    else result = await toggleBlogVisibilityAction(id, !currentStatus);

    if (result.success) fetchData();
    else setMessage({ text: 'Error: ' + result.error, type: 'error' });
  };



  const deleteItem = async (type: 'industries' | 'products' | 'blogs', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
    let result;
    if (type === 'industries') result = await deleteIndustryAction(id);
    else if (type === 'products') result = await deleteProductAction(id);
    else result = await deleteBlogAction(id);
      
    if (result.success) fetchData();
    else setMessage({ text: 'Error: ' + result.error, type: 'error' });
  };



  const handleAddNew = () => {
    console.log('Adding new item for tab:', activeTab);
    if (activeTab === 'industries') {
      setEditingIndustry({
        id: '',
        title: '',
        icon: '📁',
        description_short: '',
        full_info: '',
        keys: [],
        is_visible: true
      });
    } else if (activeTab === 'products') {
      setEditingProduct({
        id: '',
        category_id: industries.length > 0 ? industries[0].id : '',
        name: '',
        description: '',
        image: '',
        features: [],
        specs: {},
        export_details: {
          moq: '',
          origin: '',
          capacity: '',
          packaging: '',
          payment: '',
          delivery: ''
        },
        is_visible: true
      });
    } else if (activeTab === 'blogs') {
      setEditingBlog({
        id: '',
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: user?.email?.split('@')[0] || 'Admin',
        is_visible: true
      });
    }
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
            { id: 'sourcing-content', label: 'Sourcing', icon: FiSearch },
            { id: 'logistics-content', label: 'Logistics', icon: FiTruck },
            { id: 'quality-packaging-content', label: 'Quality & Packaging', icon: FiShield },
            { id: 'industries-content', label: 'Industries Page', icon: FiGrid },
            { id: 'contact-content', label: 'Contact', icon: FiMail },
            { id: 'industries', label: 'Manage Industries', icon: FiList },
            { id: 'products', label: 'Manage Products', icon: FiBox },
            { id: 'blogs', label: 'Manage Blogs', icon: FiFileText },
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
                <h3>{editingIndustry.id ? `Edit Industry: ${editingIndustry.title}` : 'Add New Industry'}</h3>
                <button onClick={() => setEditingIndustry(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={saveIndustry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {industries.every(i => i.id !== editingIndustry.id) && (
                  <div>
                    <label style={label}>Industry ID (slug, e.g. 'agro-food')</label>
                    <input 
                      value={editingIndustry.id} 
                      onChange={e => setEditingIndustry({...editingIndustry, id: e.target.value})}
                      style={field} 
                      required
                      placeholder="e.g. textile-apparel"
                    />
                  </div>
                )}
                <div>
                  <label style={label}>Title</label>
                  <input 
                    value={editingIndustry.title} 
                    onChange={e => setEditingIndustry({...editingIndustry, title: e.target.value})}
                    maxLength={100}
                    style={field} 
                  />
                </div>


                <div>
                  <label style={label}>Description (Short)</label>
                  <textarea 
                    value={editingIndustry.description_short} 
                    onChange={e => setEditingIndustry({...editingIndustry, description_short: e.target.value})}
                    maxLength={500}
                    style={{...field, height: '80px'}} 
                  />
                  <small className="muted">{editingIndustry.description_short.length} / 500</small>
                </div>

                <div>
                  <label style={label}>Full Information (Long)</label>
                  <textarea 
                    value={editingIndustry.full_info} 
                    onChange={e => setEditingIndustry({...editingIndustry, full_info: e.target.value})}
                    maxLength={2000}
                    style={{...field, height: '150px'}} 
                  />
                  <small className="muted">{editingIndustry.full_info.length} / 2000</small>
                </div>

                <div>
                  <label style={label}>Tags / Keys (Comma separated)</label>
                  <input 
                    value={Array.isArray(editingIndustry.keys) ? editingIndustry.keys.join(', ') : editingIndustry.keys} 
                    onChange={e => setEditingIndustry({...editingIndustry, keys: e.target.value as any})}
                    style={field} 
                    placeholder="e.g. Textiles, Fabrics, Home Decor"
                  />
                </div>


                <DirectUpload 
                  label="Icon / Image" 
                  value={editingIndustry.icon} 
                  onChange={(url) => setEditingIndustry({...editingIndustry, icon: url})} 
                />
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
                <h3>{editingProduct.id ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}</h3>
                <button onClick={() => setEditingProduct(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const productToSave = { ...editingProduct };
                
                const result = await saveProductAction(productToSave);

                if (result.success) { 
                  fetchData(); 
                  setEditingProduct(null); 
                  setMessage({text: 'Product saved!', type: 'success'}); 
                } else {
                  setMessage({text: 'Error saving product: ' + result.error, type: 'error'});
                }

              }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {products.every(p => p.id !== editingProduct.id) && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={label}>Product ID (slug, e.g. 'premium-rice')</label>
                      <input 
                        value={editingProduct.id} 
                        onChange={e => setEditingProduct({...editingProduct, id: e.target.value})}
                        style={field} 
                        required
                        placeholder="e.g. organic-cotton-towels"
                      />
                    </div>
                  )}
                  <div>
                    <label style={label}>Industry Category</label>

                    <select 
                      value={editingProduct.category_id}
                      onChange={e => setEditingProduct({...editingProduct, category_id: e.target.value})}
                      style={field}
                      required
                    >
                      <option value="">Select Industry</option>
                      {industries.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={label}>Product Name</label>
                    <input 
                      value={editingProduct.name} 
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      style={field} 
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <DirectUpload 
                      label="Product Image" 
                      value={editingProduct.image} 
                      onChange={(url) => setEditingProduct({...editingProduct, image: url})} 
                    />
                  </div>
                </div>

                <div>
                  <label style={label}>About this Product (Description)</label>
                  <textarea 
                    value={editingProduct.description} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    style={{...field, height: '150px'}} 
                    placeholder="Enter detailed information about the product..."
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
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Technical Specifications</h4>
                  {Object.entries(editingProduct.specs || {}).map(([key, val], idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <input 
                        value={key} 
                        onChange={e => {
                          const newSpecs = { ...editingProduct.specs };
                          const oldVal = newSpecs[key];
                          delete newSpecs[key];
                          newSpecs[e.target.value] = oldVal;
                          setEditingProduct({ ...editingProduct, specs: newSpecs });
                        }}
                        placeholder="Property (e.g. Moisture)"
                        style={{ ...field, flex: 1 }}
                      />
                      <input 
                        value={val} 
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, [key]: e.target.value }
                        })}
                        placeholder="Value (e.g. 12% Max)"
                        style={{ ...field, flex: 2 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newSpecs = { ...editingProduct.specs };
                          delete newSpecs[key];
                          setEditingProduct({ ...editingProduct, specs: newSpecs });
                        }}
                        style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct({
                      ...editingProduct, 
                      specs: { ...(editingProduct.specs || {}), '': '' }
                    })}
                    style={{ fontSize: '0.85rem', color: '#1f5ff5', background: 'none', border: '1px dashed #1f5ff5', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%' }}
                  >
                    + Add New Specification
                  </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Product Features</h4>
                  {(editingProduct.features || []).map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <input 
                        value={feature} 
                        onChange={e => {
                          const newFeatures = [...editingProduct.features];
                          newFeatures[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, features: newFeatures });
                        }}
                        placeholder="e.g. Pesticide residue-free"
                        style={field}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newFeatures = editingProduct.features.filter((_: any, i: number) => i !== idx);
                          setEditingProduct({ ...editingProduct, features: newFeatures });
                        }}
                        style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct({
                      ...editingProduct, 
                      features: [...(editingProduct.features || []), '']
                    })}
                    style={{ fontSize: '0.85rem', color: '#1f5ff5', background: 'none', border: '1px dashed #1f5ff5', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%' }}
                  >
                    + Add New Feature
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btnPrimary" style={{ flex: 1 }}>Save Product</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btnSecondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingBlog && (
          <div style={modalOverlay}>
            <div style={{...modalContent, maxWidth: '800px'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>{editingBlog.id ? `Edit Blog: ${editingBlog.title}` : 'Add New Blog'}</h3>
                <button onClick={() => setEditingBlog(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const blogToSave = { ...editingBlog };
                
                const result = await saveBlogAction(blogToSave);
                if (result.success) { 
                  fetchData(); 
                  setEditingBlog(null); 
                  setMessage({text: 'Blog saved!', type: 'success'}); 
                } else {
                  setMessage({text: 'Error saving blog: ' + result.error, type: 'error'});
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {blogs.every(b => b.id !== editingBlog.id) && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={label}>Blog ID (slug, e.g. 'future-of-textiles')</label>
                      <input 
                        value={editingBlog.id} 
                        onChange={e => setEditingBlog({...editingBlog, id: e.target.value})}
                        style={field} 
                        required
                        placeholder="e.g. trends-in-global-export"
                      />
                    </div>
                  )}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={label}>Blog Title</label>
                    <input 
                      value={editingBlog.title} 
                      onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
                      style={field} 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={label}>Author</label>
                  <input 
                    value={editingBlog.author} 
                    onChange={e => setEditingBlog({...editingBlog, author: e.target.value})}
                    style={field} 
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <DirectUpload 
                    label="Cover Image" 
                    value={editingBlog.image} 
                    onChange={(url) => setEditingBlog({...editingBlog, image: url})} 
                  />
                </div>

                <div>
                  <label style={label}>Excerpt (Short summary)</label>
                  <textarea 
                    value={editingBlog.excerpt} 
                    onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                    style={{...field, height: '80px'}} 
                    maxLength={300}
                  />
                </div>

                <div>
                  <label style={label}>Blog Content (HTML or Plain Text)</label>
                  <textarea 
                    value={editingBlog.content} 
                    onChange={e => setEditingBlog({...editingBlog, content: e.target.value})}
                    style={{...field, height: '300px'}} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btnPrimary" style={{ flex: 1 }}>Save Blog</button>
                  <button type="button" onClick={() => setEditingBlog(null)} className="btnSecondary" style={{ flex: 1 }}>Cancel</button>
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
              {activeTab === 'blogs' && 'Manage Blogs'}
            </h2>
            <p className="muted">Manage your website content and visibility settings.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchData} className="btnSecondary" style={{ padding: '0.6rem' }} title="Refresh Data"><FiSave /></button>
            <button 
              onClick={syncInitialData} 
              className="btnSecondary" 
              style={{ fontSize: '0.85rem', color: '#ef4444', borderColor: '#fecaca', fontWeight: 600 }}
            >
              Sync Mock Data
            </button>
            {(activeTab === 'industries' || activeTab === 'products' || activeTab === 'blogs') && (
              <button onClick={handleAddNew} className="btnPrimary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPlus /> Add New {activeTab === 'industries' ? 'Industry' : activeTab === 'products' ? 'Product' : 'Blog'}
              </button>
            )}
            {activeTab === 'blogs' && (
              <button 
                onClick={toggleBlogPageVisibility} 
                className="btnSecondary" 
                style={{ 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  borderColor: isBlogVisibleOnSite ? '#def7ec' : '#fecaca',
                  color: isBlogVisibleOnSite ? '#03543f' : '#ef4444',
                  padding: '0.5rem 1rem'
                }}
              >
                {isBlogVisibleOnSite ? <FiEye /> : <FiEyeOff />}
                Blog Page: {isBlogVisibleOnSite ? 'Visible in Menu' : 'Hidden from Menu'}
              </button>
            )}

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

        {activeTab.endsWith('-content') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {(() => {
              const currentPage = activeTab.replace('-content', '');
              
              // Define the sequence for each page to match the live site
              const sectionOrder: Record<string, string[]> = {
                'home': ['Hero', 'Who We Are', 'Services', 'Logistics', 'Sourcing', 'Quality', 'Process', 'CTA'],
                'about': ['Hero', 'Main'],
                'contact': ['Hero', 'Info', 'Stats'],
                'sourcing': ['Hero', 'Source', 'Process', 'Network', 'Custom', 'Quality', 'CTA'],
                'logistics': ['Hero', 'Expertise', 'Docs', 'Solutions', 'Partner', 'Compliance', 'Timeline', 'Trust'],
                'industries': ['Hero', 'Missing', 'Expertise', 'CTA'],
                'quality-packaging': ['Hero', 'Inspection', 'Standards', 'Solutions', 'Options', 'Sustainable', 'Compliance', 'CTA']
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
                            <DirectUpload 
                              label={item.content_key.replace(/_/g, ' ')} 
                              value={pendingChanges[item.id] !== undefined ? pendingChanges[item.id] : item.content_value} 
                              onChange={(url) => updateLocalContent(item.id, url)} 
                            />
                          ) : item.content_key.includes('desc') || item.content_key.includes('content') || item.content_key.includes('p1') || item.content_key.includes('p2') || item.content_key.includes('address') ? (
                            <textarea 
                              value={pendingChanges[item.id] !== undefined ? pendingChanges[item.id] : item.content_value} 
                              onChange={e => updateLocalContent(item.id, e.target.value)}
                              maxLength={item.char_limit}
                              style={{...field, height: item.content_key === 'content' ? '200px' : '80px'}}
                            />
                          ) : (
                            <input 
                              value={pendingChanges[item.id] !== undefined ? pendingChanges[item.id] : item.content_value} 
                              onChange={e => updateLocalContent(item.id, e.target.value)}
                              maxLength={item.char_limit}
                              style={field}
                            />
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                            <small className="muted">{(pendingChanges[item.id] !== undefined ? pendingChanges[item.id] : item.content_value).length} / {item.char_limit} characters</small>
                            {pendingChanges[item.id] !== undefined && <small style={{ color: '#059669', fontWeight: 600 }}>Unsaved changes</small>}
                          </div>
                        </div>
                      ))}
                    
                    {Object.keys(pendingChanges).some(id => siteContent.find(c => c.id === id)?.section_name === section) && (
                      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={saveAllChanges} 
                          className="btnPrimary" 
                          style={{ background: '#059669', color: '#ffffff', fontSize: '0.9rem', padding: '0.8rem 2rem' }}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Section Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading CMS data...</div>
        ) : (activeTab === 'industries' || activeTab === 'products' || activeTab === 'blogs') && (
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
                
                {activeTab === 'blogs' && blogs.map(item => (
                  <tr key={item.id} style={tr}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
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
                        <button onClick={() => toggleVisibility('blogs', item.id, item.is_visible)} title="Toggle Visibility" style={actionBtn}>
                          {item.is_visible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button onClick={() => setEditingBlog(item)} title="Edit" style={actionBtn}><FiEdit2 /></button>
                        <button onClick={() => deleteItem('blogs', item.id)} title="Delete" style={{ ...actionBtn, color: '#ef4444' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
            
            {Object.keys(pendingChanges).length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
                <button 
                  onClick={saveAllChanges} 
                  className="btnPrimary" 
                  style={{ background: '#059669', color: '#ffffff', padding: '0.8rem 2rem' }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <BackToTop />
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
