'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


]


const Header = () => {
  const pathname = usePathname()
  const [isBlogVisible, setIsBlogVisible] = useState(false)

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('content_value')
          .eq('content_key', 'blog_visibility')
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
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About Us' },
              { href: '/sourcing', label: 'Sourcing' },
              { href: '/industries', label: 'Industries' },
              { href: '/quality-packaging', label: 'Quality & Packaging' },
              { href: '/logistics', label: 'Logistics' },
              { href: '/blogs', label: 'Blog', hidden: !isBlogVisible },
              { href: '/contact', label: 'Contact' },
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

      </div>
    </header>
  )
}

export default Header
