'use client'
import Link from 'next/link'
import { FiLinkedin, FiFacebook, FiTwitter } from 'react-icons/fi'
import styles from './Footer.module.css'
import { useWebsiteData } from '@/hooks/useWebsiteData'

const Footer = () => {
  const { getContent } = useWebsiteData();
  const socialLinks = [
    { href: getContent('global', 'footer', 'social_linkedin', ''), label: 'LinkedIn', Icon: FiLinkedin },
    { href: getContent('global', 'footer', 'social_facebook', ''), label: 'Facebook', Icon: FiFacebook },
    { href: getContent('global', 'footer', 'social_twitter', ''), label: 'Twitter', Icon: FiTwitter },
  ].filter(link => link.href.trim().length > 0);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h3 className={styles.brand}>ABC International</h3>
          <p className={styles.muted}>
            {getContent('global', 'footer', 'brand_desc', 'Your trusted merchant exporter and global sourcing partner, backed by logistics expertise.')}
          </p>
          {socialLinks.length > 0 && (
            <div className={styles.socials}>
              {socialLinks.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'quick_links', 'Quick Links')}</h4>
          <ul className={styles.links}>
            <li>
              <Link href="/about">{getContent('global', 'footer', 'link_about', 'About Us')}</Link>
            </li>
            <li>
              <Link href="/sourcing">{getContent('global', 'footer', 'link_sourcing', 'Sourcing Services')}</Link>
            </li>
            <li>
              <Link href="/industries">{getContent('global', 'footer', 'link_industries', 'Industries')}</Link>
            </li>
            <li>
              <Link href="/logistics">{getContent('global', 'footer', 'link_logistics', 'Logistics Expertise')}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'services', 'Services')}</h4>
          <ul className={styles.links}>
            <li>
              <Link href="/sourcing#process">
                {getContent('global', 'footer', 'service_sourcing', 'Product Sourcing')}
              </Link>
            </li>
            <li>
              <Link href="/quality-packaging#inspection">
                {getContent('global', 'footer', 'service_quality', 'Quality Assurance')}
              </Link>
            </li>
            <li>
              <Link href="/quality-packaging#packaging">
                {getContent('global', 'footer', 'service_packaging', 'Export Packaging')}
              </Link>
            </li>
            <li>
              <Link href="/quality-packaging#compliance">
                {getContent('global', 'footer', 'service_docs', 'Export Documentation')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{getContent('global', 'footer', 'contact_us', 'Contact Us')}</h4>
          <ul className={styles.links}>
            <li>{getContent('global', 'footer', 'contact_email', 'info@abc-international.co.in')}</li>
            <li>{getContent('global', 'footer', 'contact_phone', '+91 XXX XX XXXXX')}</li>
            <li>{getContent('global', 'footer', 'contact_address', 'Mumbai, Maharashtra, India')}</li>
          </ul>
        </div>
      </div>
      <div className={styles.translationDisclaimer} style={{ textAlign: 'center', padding: '0.75rem 0', color: '#94a3b8', fontSize: '0.95rem' }}>
        {getContent('global', 'footer', 'translation_disclaimer', 'Translations are provided for convenience. In case of discrepancies, the English version shall prevail.')}
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomContent}`}>
          <div className={styles.copyright}>{getContent('global', 'footer', 'copyright', '© 2026 ABC International. All rights reserved.')}</div>
          <a href="https://www.designedbykirtida.in" target="_blank" rel="noopener noreferrer" className={styles.designerLink}>www.designedbykirtida.in</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
