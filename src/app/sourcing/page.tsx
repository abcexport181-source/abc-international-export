import { FiPackage, FiCheckCircle, FiClipboard, FiSearch, FiDollarSign, FiEye, FiTruck, FiArrowRight, FiShield, FiFileText } from 'react-icons/fi';
import { FaIndustry, FaVial } from 'react-icons/fa';

const sourceItems = [
  { title: 'Products', description: 'Finished goods across all categories ready for export', Icon: FiPackage },
  { title: 'Raw Materials', description: 'Industrial and manufacturing raw materials from verified suppliers', Icon: FaIndustry },
  { title: 'Packaging', description: 'Custom packaging solutions and materials for your products', Icon: FiPackage },
  { title: 'Private Label', description: 'White-label and private label manufacturing services', Icon: FiCheckCircle }
]
const process = [
  { title: 'Requirement', description: 'Share your product specifications, quantity, quality standards, and target price', Icon: FiClipboard },
  { title: 'Supplier Identification', description: 'We identify and shortlist verified manufacturers from our extensive network', Icon: FiSearch },
  { title: 'Samples', description: 'Arrange samples for your evaluation and approval before bulk production', Icon: FaVial },
  { title: 'Pricing', description: 'Negotiate competitive pricing and payment terms on your behalf', Icon: FiDollarSign },
  { title: 'Inspection', description: 'Conduct pre-shipment quality inspection to ensure compliance with your standards', Icon: FiEye },
  { title: 'Shipment', description: 'Handle complete export logistics from factory to your destination', Icon: FiTruck }
]

export default function SourcingPage() {
  return (
    <>
      <section className="heroBand">
        <div className="container">
          <h1>Global Product Sourcing from India</h1>
          <p>
            End-to-end sourcing from India with verified suppliers and product solutions tailored for
            your market.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/contact" className="btnPrimary">
              Source From India
            </a>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>What We Source</h2>
            <p>
              From raw materials to finished products, we source across all categories to meet your business needs
            </p>
          </div>
          <div className="cardsGrid4">
            {sourceItems.map((item) => (
              <article key={item.title} className="card" style={{ padding: '2rem 1.5rem' }}>
                <div className="iconCircle" style={{ width: '48px', height: '48px', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
                  <item.Icon />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionSoft" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sectionHeader">
            <h2>Our Sourcing Process</h2>
            <p>
              A transparent, step-by-step approach to finding and delivering the right products
            </p>
          </div>
          <div className="cardsGrid3">
            {process.map((item, idx) => (
              <article key={item.title} className="card" style={{ padding: '2rem 1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <span className="stepNumber" style={{ marginBottom: 0, width: '44px', height: '44px' }}>
                    {idx + 1}
                  </span>
                  <item.Icon style={{ fontSize: '1.8rem', color: '#1f5ff5' }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '0.95rem' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="imageBlock" />
          <div>
            <h2>Manufacturer Network Across Industries</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              Our extensive network spans India&apos;s manufacturing landscape, giving you access to suppliers across diverse sectors.
            </p>
            <ul className="checkList" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', color: 'var(--text)' }}>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Agro & Food Products</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Packaging Materials</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Industrial Equipment</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Raw Materials</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Chemicals & Additives</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Consumer Products</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Textiles & Apparel</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Handicrafts & Decor</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Engineering Products</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Pharmaceuticals</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Electronics Components</li>
              <li style={{ fontSize: '0.95rem' }}><FiCheckCircle className="checkIcon" /> Building Materials</li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <a href="/industries" style={{ color: '#1f5ff5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Explore All Industries <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section heroBand">
        <div className="container heroBandCentered">
          <h2 style={{ color: '#fff' }}>Custom Sourcing Solutions</h2>
          <p style={{ color: '#dbe8ff' }}>
            We deliver flexible sourcing plans to match your product, quality, and delivery goals.
          </p>
          <div className="cardsGrid3" style={{ marginTop: '1rem', textAlign: 'left' }}>
            {['Specific Product Specs', 'Global Certifications', 'Quality Protocols', 'Budget Control', 'Timeline Management', 'Complete Traceability'].map((item) => (
              <article className="card" key={item} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <h3 style={{ color: '#fff' }}>{item}</h3>
                <p style={{ color: '#dbe8ff' }}>Built to reduce risk and improve execution consistency.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Quality You Can Trust</h2>
            <p className="muted" style={{ marginTop: '0.7rem' }}>
              We don&apos;t just connect you with suppliers—we ensure every product meets your quality standards.
            </p>
            <ul className="featureList" style={{ marginTop: '1.5rem' }}>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiShield /></div>
                <div className="featureText">
                  <strong>Supplier Verification</strong>
                  <span>All manufacturers are pre-vetted for certifications and capability</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FaVial /></div>
                <div className="featureText">
                  <strong>Sample Testing</strong>
                  <span>Comprehensive sample evaluation before bulk orders</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiEye /></div>
                <div className="featureText">
                  <strong>Pre-Shipment Inspection</strong>
                  <span>Third-party inspection services available on request</span>
                </div>
              </li>
              <li className="featureItem">
                <div className="featureIcon" style={{ fontSize: '1.35rem' }}><FiFileText /></div>
                <div className="featureText">
                  <strong>Documentation</strong>
                  <span>Complete test reports and quality certificates</span>
                </div>
              </li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <a href="/quality-packaging" style={{ color: '#1f5ff5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Learn About Quality Processes <FiArrowRight />
              </a>
            </div>
          </div>
          <div className="imageBlock" />
        </div>
      </section>

      <section className="section sectionSoft" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Ready to Start Sourcing?</h2>
          <p className="muted">Let us help you source the right product from trusted Indian suppliers.</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary" style={{ background: '#1f5ff5', color: '#fff' }}>
              Request Sourcing Support
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
