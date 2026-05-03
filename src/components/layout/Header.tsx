'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import { languages } from '@/lib/languages'
import { useWebsiteData } from '@/hooks/useWebsiteData'



const Header = () => {
  const pathname = usePathname()
  const [isBlogVisible, setIsBlogVisible] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { getContent } = useWebsiteData()



  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('content_value')
          .eq('content_key', 'blog_visibility')
          .eq('language_code', 'en') // Global setting
          .single();

        
        if (data) {
          setIsBlogVisible(data.content_value === 'true');
        }
      } catch (err) {
        console.error('Error fetching blog visibility:', err);
      }
    };
    fetchVisibility();
  }, []);


  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.logo}>
          <img 
            src="/logo.jpeg" 
            alt="ABC International" 
            style={{ height: '60px', width: 'auto', display: 'block' }} 
          />
        </Link>
        <nav className={styles.nav}>
          <ul>
            {[
              { href: '/', label: getContent('global', 'navigation', 'home', 'Home') },
              { href: '/about', label: getContent('global', 'navigation', 'about', 'About Us') },
              { href: '/sourcing', label: getContent('global', 'navigation', 'sourcing', 'Sourcing') },
              { href: '/industries', label: getContent('global', 'navigation', 'industries', 'Industries') },
              { href: '/quality-packaging', label: getContent('global', 'navigation', 'quality', 'Quality & Packaging') },
              { href: '/logistics', label: getContent('global', 'navigation', 'logistics', 'Logistics') },
              { href: '/blogs', label: getContent('global', 'navigation', 'blog', 'Blog'), hidden: !isBlogVisible },
              { href: '/contact', label: getContent('global', 'navigation', 'contact', 'Contact') },

            ].filter(item => !item.hidden).map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link href={item.href} className={isActive ? styles.active : ''}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.langSelect}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.code.toUpperCase()}
              </option>
            ))}
          </select>
        </div>


      </div>
    </header>
  )
}

export default Header
