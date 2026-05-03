import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FiCalendar, FiUser, FiArrowLeft, FiShare2 } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getBlog(slug: string) {
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', slug)
      .eq('is_visible', true)
      .single();
    return data;
  }
  return null;
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article style={{ background: '#fff' }}>
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#1f5ff5', marginBottom: '2rem', textDecoration: 'none', fontWeight: 500 }}>
            <FiArrowLeft /> Back to Insights
          </Link>
          
          <h1 style={{ fontSize: '3rem', color: '#1b2638', marginBottom: '1.5rem', lineHeight: '1.2' }}>{blog.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: '1px solid #edf2f7', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '2rem', color: '#718096' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCalendar /> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser /> {blog.author}
              </span>
            </div>
            <button style={{ border: 'none', background: 'none', color: '#1f5ff5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)' }}>
            <img src={blog.image} alt={blog.title} style={{ width: '100%', display: 'block' }} />
          </div>
          
          <div 
            className="blog-content"
            style={{ 
              fontSize: '1.15rem', 
              lineHeight: '1.8', 
              color: '#2d3748',
              whiteSpace: 'pre-wrap'
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div style={{ background: '#1b2638', padding: '3rem', borderRadius: '20px', color: '#fff' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Get Market Insights in Your Inbox</h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Join 500+ global traders receiving our weekly export-import newsletter.</p>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              <input type="email" placeholder="Your work email" style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '8px', border: 'none' }} />
              <button className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
