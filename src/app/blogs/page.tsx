import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getBlogs() {
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    });
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return [];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <section className="section sectionSoft" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="sectionHeader">
            <span className="badge">Knowledge Hub</span>
            <h1>Our Insights & Blogs</h1>
            <p>Expert perspective on global trade, logistics, and industrial trends from India.</p>
          </div>

          <div className="cardsGrid3">
            {blogs.map((blog: any) => (
              <Link href={`/blogs/${blog.id}`} key={blog.id} style={{ textDecoration: 'none' }}>
                <article className="card" style={{ height: '100%', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#718096', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FiCalendar /> {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FiUser /> {blog.author}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', color: '#1b2638', marginBottom: '1rem', lineHeight: '1.3' }}>{blog.title}</h3>
                    <p className="muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1 }}>
                      {blog.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f5ff5', fontWeight: 600, fontSize: '0.95rem' }}>
                      Read More <FiArrowRight />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {blogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p className="muted">No blogs published yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
