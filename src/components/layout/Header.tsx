'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/sourcing', label: 'Sourcing' },
  { href: '/industries', label: 'Industries' },
  { href: '/quality-packaging', label: 'Quality & Packaging' },
  { href: '/logistics', label: 'Logistics' },
  { href: '/contact', label: 'Contact' },
]

const Header = () => {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.logo}>
          <span>ABC</span> International
        </Link>
        <nav className={styles.nav}>
          <ul>
            {navItems.map((item) => {
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
