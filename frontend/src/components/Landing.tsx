import { useState } from 'react'
import '../styles/Landing.css'

function Landing() {
  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-branding">
            <img src="/assets/images/Logo.png" alt="Hard Fork Whiskey Logo" className="header-logo" />
          </div>
        </div>
      </header>

      {/* Section 1 - Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">THE WHISKEY HARD FORK.</h1>
          
          <p className="hero-tagline">Maturation is no longer passive. It's governed.</p>
          
          <p className="hero-description">
           Hard Fork Distillery is currently building the bridge between physical spirit maturation and the Bitcoin layer. We are hard-forking the traditional model to create a transparent, verifiable, and community-directed future for craft whiskey. 
          </p>
          
          <div className="hero-buttons">
            <a href="#" className="btn btn-primary">
              <span className="btn-icon">𝕏</span>
              FOLLOW US ON X
            </a>
            <a href="#" className="btn btn-secondary">
              <span className="btn-icon">⚠️</span>
              READ OUR DEVELOPER BLOG
            </a>
          </div>
        </div>
      </section>

   

      {/* Section 2 - The Liquid Ledger */}
      <section className="liquid-ledger">
        {/* Video Background */}
        <div className="video-container">
          <video autoPlay muted loop className="background-video">
            <source src="/assets/images/10040032-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="liquid-ledger-content">
          <p className="section-label">PROOF OF PROCESS</p>
          <h2 className="section-title">THE LIQUID <span className="gold-text">LEDGER</span></h2>
          <p className="section-subtitle">Engineering the Future of Craft Spirits.</p>
          
          <p className="section-description">
            We are currently in the Physical & Digital Build-out Phase. While our smart contracts are being finalized on the Stacks layer, our new production and aging facility is rising from the ground. We are bridging high-tech transparency with traditional heritage from day one.
          </p>

          <div className="status-cards">
            <div className="status-card">
              <div className="card-top">
                <div className="card-labels">
                  <h3 className="card-category">CHAIN OF POSSESSION</h3>
                  <p className="card-category-sub">SYSTEM ARCHITECTURE</p>
                </div>
                <span className="status-badge">IN PROGRESS</span>
              </div>
              <div className="card-icon-box">
                <img src="/assets/images/Infrastructure.png" alt="Chain of Possession" />
              </div>
              <h4 className="card-title">Infrastructure Status</h4>
              <p className="card-description">
                New Distillery Construction located in South Carolina is underway. We are building our state-of-the-art production and aging facility, designed from the foundation for IoT-integrated barrel maturation monitoring.
              </p>
            </div>

            <div className="status-card">
              <div className="card-top">
                <div className="card-labels">
                  <h3 className="card-category">SMART CONTRACT STATUS</h3>
                  <p className="card-category-sub">SYSTEM ARCHITECTURE</p>
                </div>
                <span className="status-badge">IN PROGRESS</span>
              </div>
              <div className="card-icon-box">
                <img src="/assets/images/Smartcontract.png" alt="Smart Contract Status" />
              </div>
              <h4 className="card-title">Smart Contract Status</h4>
              <p className="card-description">
                Stacks Smart Contract Development (Alpha). Finalizing the logic for $CASK and $SHOT to ensure seamless interaction with physical barrel data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Dual-Token Ecosystem */}
      <section className="ecosystem">
        <div className="ecosystem-container">
          <p className="ecosystem-label">THE ECONOMY</p>
          <h2 className="ecosystem-title">DUAL-TOKEN <span className="gold-text">ECOSYSTEM</span></h2>
          <p className="ecosystem-subtitle">Designing the Governance of Spirits.</p>
          
          <p className="ecosystem-description">
            Our team is finalizing the architecture that separates platform utility from asset-specific management to ensure long-term stability and regulatory compliance.
          </p>

          <div className="token-cards">
            <div className="token-card">
              <div className="token-header">
                <div className="token-icon-circle">
                  <img src="/assets/images/cask.png" alt="Cask Token" className="token-icon-img" />
                </div>
                <span className="token-badge">IN DEVELOPMENT</span>
              </div>
              <h3 className="token-name">$CASK</h3>
              <h4 className="token-subtitle">The utility key</h4>
              <p className="token-description">
                Planned features include staking for allocation rights and access to premium platform features.
              </p>
            </div>

            <div className="token-card">
              <div className="token-header">
                <div className="token-icon-circle">
                  <img src="/assets/images/$SHOT ICON.png" alt="Shot Token" className="token-icon-img" />
                </div>
                <span className="token-badge">IN DEVELOPMENT</span>
              </div>
              <h3 className="token-name">$SHOT</h3>
              <h4 className="token-subtitle">The management license</h4>
              <p className="token-description">
                The management license. Designed to allow holders to direct the labor of the distillery, voting on chill levels and maturation paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - The Governor's Office */}
      <section className="governors-office">
        <div className="governors-container">
          <p className="governors-label">THE DAPP</p>
          <h2 className="governors-title">
            THE GOVERNOR'S <span className="gold-text">OFFICE</span>
          </h2>
          <p className="governors-subtitle">Active Management. Under Construction.</p>
          <p className="governors-description">
            The Governor's Office is being developed as the central hub for the Hard Fork DAO. We are currently building the interface where you will eventually:
          </p>

          <div className="governors-cards">
            <div className="governors-card">
              <div className="governors-card-icon">
                <img src="/assets/images/Manage.png" alt="Manage" />
              </div>
              <h3 className="governors-card-title">Manage</h3>
              <p className="governors-card-text">Track specific $SHOT licenses and barrel metadata.</p>
            </div>

            <div className="governors-card">
              <div className="governors-card-icon">
                <img src="/assets/images/Monitor.png" alt="Monitor" />
              </div>
              <h3 className="governors-card-title">Monitor</h3>
              <p className="governors-card-text">View live rickhouse sensor stats and evaporation estimates.</p>
            </div>

            <div className="governors-card">
              <div className="governors-card-icon">
                <img src="/assets/images/Direct.png" alt="Direct" />
              </div>
              <h3 className="governors-card-title">Direct</h3>
              <p className="governors-card-text">Cast on-chain votes to determine the maturation path of your spirits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - The Hard Fork Story */}
      <section className="story">
        <div className="story-container">
          <p className="story-label">OUR ORIGINS</p>
          <h2 className="story-title">THE HARD FORK <span className="gold-text">STORY</span></h2>

          <div className="timeline">
            <div className="timeline-row">
              <div className="timeline-card">
                <div className="timeline-card-tag">BITCOIN ROOTS</div>
                <h3 className="timeline-card-title">Bitcoin Roots</h3>
                <p className="timeline-card-text">
                  Our journey began in the early days of the Bitcoin movement. This legacy reflects our team's decade-plus resilience and pioneering mindset — native to the decentralized movement we are now applying to distillery operations.
                </p>
              </div>

              <div className="timeline-node">
                <div className="timeline-dot" />
              </div>

              <div className="timeline-year">2011</div>
            </div>

<div className="timeline-row reverse">
              <div className="timeline-15year">15 YEARS</div>

              <div className="timeline-node15year">
                <div className="timeline-dot15years" />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-tag">THE ACQUISITIONS</div>
                <h3 className="timeline-card-title">The Acquisitions</h3>
                <p className="timeline-card-text">
                  Our foundation is secured by the strategic acquisition of the James River and Old Fourth Distillery assets. These historic resources provide the premium “Jumpstart” inventory that is currently being prepared for our ecosystem launch.
                </p>
              </div>
            </div>

            <div className="timeline-row">
              <div className="timeline-card">
                <div className="timeline-card-tag">OPERATIONAL FOUNDATION</div>
                <h3 className="timeline-card-title">The Tekna/Labrada Legacy</h3>
                <p className="timeline-card-text">
                  With 15 years of leadership in industrial accountability, the Tekna and Labrada teams are bringing a proven standard of operational integrity and supply-chain transparency to the world of fine spirits.
                </p>
              </div>

              <div className="timeline-node">
                <div className="timeline-dot" />
              </div>

              <div className="timeline-year">NOW</div>
            </div>

      
          </div>
        </div>
      </section>

      {/* Section 6 - FAQ */}
      <section className="faq">
        <div className="faq-container">
          <p className="faq-label">FAQ</p>
          <h2 className="faq-title">FREQUENTLY ASKED <span className="gold-text">QUESTIONS</span></h2>

          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className={`faq-item ${activeIndex === index ? 'open' : ''}`}
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
              >
                <button type="button" className="faq-question">
                  {item.question}
                  <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer" aria-hidden={activeIndex !== index}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const faqItems = [
  {
    question: 'How will governance work once launched?',
    answer:
      'Barrel governance will be handled via blockchain-based voting. $SHOT holders will have a transparent say in maturation decisions, directing the physical labor of the distillery staff.',
  },
  {
    question: 'What is the “Chain of Possession”?',
    answer:
      'The Chain of Possession is our on-chain audit trail for barrel transfers. It ensures each handoff is recorded immutably, preventing tampering and providing full transparency.',
  },
  {
    question: 'How can I stay updated on the build?',
    answer:
      'Follow us on X and subscribe to the developer blog (links above). We also publish regular updates on product milestones and on-chain releases.',
  },
  {
    question: 'Do I own the physical whiskey?',
    answer:
      'Ownership is tokenized via $CASK and $SHOT. While you do not hold the barrels yourself, token holders receive governance rights and access to the underlying inventory as it matures.',
  },
]

export default Landing
