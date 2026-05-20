'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { useLanguage } from '@/context/LanguageContext'
import { languages } from '@/lib/languages'
import { useWebsiteData } from '@/hooks/useWebsiteData'



const Header = ({ isBlogVisible = false }: { isBlogVisible?: boolean }) => {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const { getContent } = useWebsiteData()
  const [clientBlogVisible, setClientBlogVisible] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedVisibility = window.localStorage.getItem('blog_visibility');
    if (storedVisibility !== null) {
      setClientBlogVisible(storedVisibility === 'true');
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'blog_visibility' && event.newValue !== null) {
        setClientBlogVisible(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [language]);

  const finalBlogVisible = clientBlogVisible !== null ? clientBlogVisible : isBlogVisible;

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
              { href: '/blogs', label: getContent('global', 'navigation', 'blog', 'Blog'), hidden: !finalBlogVisible },
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
            onChange={(e) => {
              setLanguage(e.target.value)
              window.location.reload()
            }}
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
