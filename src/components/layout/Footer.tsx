'use client'
import Link from 'next/link'
import { FiLinkedin, FiFacebook, FiTwitter } from 'react-icons/fi'
import styles from './Footer.module.css'
import { useWebsiteData } from '@/hooks/useWebsiteData'

const Footer = () => {
  const { getContent } = useWebsiteData();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h3 className={styles.brand}>ABC International</h3>
          <p className={styles.muted}>
            {getContent('global', 'footer', 'brand_desc', 'Your trusted merchant exporter and global sourcing partner, backed by logistics expertise.')}
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'quick_links', 'Quick Links')}</h4>
          <ul className={styles.links}>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/sourcing">Sourcing Services</Link>
            </li>
            <li>
              <Link href="/industries">Industries</Link>
            </li>
            <li>
              <Link href="/logistics">Logistics Expertise</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'services', 'Services')}</h4>
          <ul className={styles.links}>
            <li>Product Sourcing</li>
            <li>Quality Assurance</li>
            <li>Export Packaging</li>
            <li>Export Documentation</li>
          </ul>
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'contact_us', 'Contact Us')}</h4>
          <ul className={styles.links}>
            <li>info@abc-international.co.in</li>
            <li>+91 XXX XX XXXXX</li>
            <li>Mumbai, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomContent}`}>
          <div className={styles.copyright}>© {new Date().getFullYear()} ABC International. All rights reserved.</div>
          <a href="https://www.designedbykirtida.in" target="_blank" rel="noopener noreferrer" className={styles.designerLink}>www.designedbykirtida.in</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
