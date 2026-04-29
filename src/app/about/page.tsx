import { FiPackage, FiGlobe, FiCheckCircle, FiArrowRight, FiFileText, FiShield, FiTruck } from 'react-icons/fi';
import { FaIndustry } from 'react-icons/fa';

const approach = [
  { title: 'Understand Requirement', description: 'Deep dive into your specific product and market needs' },
  { title: 'Identify Suppliers', description: 'Match you with verified manufacturers from our network' },
  { title: 'Verify Quality', description: 'Conduct thorough quality checks and sample testing' },
  { title: 'Handle Compliance', description: 'Manage all export documentation and regulations' },
  { title: 'Ship Globally', description: 'Ensure safe, timely delivery to your destination' }
]
const reasons = [
  { title: 'Multi-Industry Sourcing', description: 'Access to suppliers across agro, packaging, industrial, chemicals, consumer goods, and more', Icon: FiGlobe },
  { title: 'Export Expertise', description: 'Complete knowledge of international trade compliance and documentation', Icon: FiFileText },
  { title: 'Verified Manufacturers', description: 'Pre-vetted, certified suppliers with proven track records', Icon: FaIndustry },
  { title: 'Quality Control', description: 'Rigorous inspection protocols at every stage', Icon: FiShield },
  { title: 'Packaging Solutions', description: 'Export-grade packaging tailored to your product needs', Icon: FiPackage },
  { title: 'Logistics Support', description: 'End-to-end shipping backed by Linear Global', Icon: FiTruck }
]

export default function AboutPage() {
  return (
    <>
      <section className="heroBand">
        <div className="container">
          <h1>About ABC International</h1>
          <p>Your trusted partner for high-quality sourcing and global export support from India.</p>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container split">
          <div>
            <h2>Who We Are</h2>
            <p className="muted" style={{ lineHeight: '1.6', marginBottom: '1.2rem' }}>
              ABC International is a premier merchant exporter and comprehensive sourcing partner 
              based in India.
            </p>
            <p className="muted" style={{ lineHeight: '1.6', marginBottom: '1.2rem' }}>
              We bridge the gap between global buyers and India&apos;s vast manufacturing ecosystem, 
              helping businesses worldwide access quality products at competitive prices.
            </p>
            <p className="muted" style={{ lineHeight: '1.6', marginBottom: '1.2rem' }}>
              What sets us apart is our backing by Linear Global—a trusted name in logistics—giving 
              us unparalleled expertise in export documentation, shipping, and compliance.
            </p>
            <p className="muted" style={{ lineHeight: '1.6' }}>
              Whether you need raw materials, finished products, packaging, or private label 
              manufacturing, we have the network, knowledge, and logistics capability to deliver.
            </p>
          </div>
          <div className="imageBlock" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>Merchant Exporter + Sourcing Partner</h2>
            <p>
              We don&apos;t just facilitate exports—we actively source products on your behalf, ensuring quality,
              compliance, and timely delivery.
            </p>
          </div>
          <div className="cardsGrid2" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <article className="card" style={{ padding: '2.5rem 2.2rem' }}>
              <div className="iconCircle">
                <FiPackage />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>As Your Sourcing Partner</h3>
              <ul className="checkList" style={{ color: 'var(--text)' }}>
                <li><FiCheckCircle className="checkIcon" /> Identify and vet manufacturers based on your requirements</li>
                <li><FiCheckCircle className="checkIcon" /> Negotiate pricing and terms on your behalf</li>
                <li><FiCheckCircle className="checkIcon" /> Arrange samples and conduct quality inspections</li>
                <li><FiCheckCircle className="checkIcon" /> Custom sourcing for specialized products</li>
              </ul>
            </article>
            <article className="card" style={{ padding: '2.5rem 2.2rem' }}>
              <div className="iconCircle">
                <FiGlobe />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>As Merchant Exporter</h3>
              <ul className="checkList" style={{ color: 'var(--text)' }}>
                <li><FiCheckCircle className="checkIcon" /> Handle all export documentation and compliance</li>
                <li><FiCheckCircle className="checkIcon" /> Manage customs clearance and shipping logistics</li>
                <li><FiCheckCircle className="checkIcon" /> Provide certificates (COO, Phytosanitary, FSSAI, etc.)</li>
                <li><FiCheckCircle className="checkIcon" /> Ensure timely, safe delivery to global destinations</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section heroBand" style={{ padding: '3rem 0' }}>
        <div className="container split">
          <div>
            <h2 style={{ color: '#fff' }}>Backed by Linear Global Credibility</h2>
            <p style={{ color: '#dbe8ff', marginTop: '0.65rem' }}>
              Our partnership with <strong>Linear Global</strong> gives us access to world-class
              logistics infrastructure, ensuring your shipments are handled with expertise and care.
            </p>
            <ul className="checkList" style={{ color: '#ffffff', marginTop: '1.2rem' }}>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Proven track record in international freight forwarding</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Deep understanding of export regulations</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Strong relationships with shipping lines and carriers</li>
              <li><FiCheckCircle className="checkIcon" style={{ color: '#ffffff' }} /> Real-time tracking and shipment visibility</li>
            </ul>
          </div>
          <div className="imageBlock" />
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Our Approach</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '0.9rem',
            }}
          >
            {approach.map((item, idx) => (
              <div key={item.title} style={{ position: 'relative' }}>
                <article className="card" style={{ height: '100%', padding: '1.8rem 1.2rem', textAlign: 'left' }}>
                  <span className="stepNumber">
                    {idx + 1}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>{item.title}</h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>{item.description}</p>
                </article>
                {idx < 4 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-0.45rem',
                    transform: 'translate(50%, -50%)',
                    color: '#1f5ff5',
                    fontSize: '1.25rem',
                    zIndex: 10
                  }}>
                    <FiArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>Why Choose Us</h2>
          </div>
          <div className="cardsGrid3">
            {reasons.map((item) => (
              <article key={item.title} className="card" style={{ padding: '2rem 1.8rem' }}>
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

      <section className="ctaBand">
        <div className="container">
          <h3>Talk to Our Sourcing Team</h3>
          <p style={{ color: '#dbe8ff' }}>Share your requirement and get a practical sourcing roadmap.</p>
          <div style={{ marginTop: '0.9rem' }}>
            <a href="/contact" className="btnPrimary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
