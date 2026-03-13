import '../styles/Landing.css'

function Landing() {
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
                <img src="/assets/images/infrastructure.png" alt="Chain of Possession" />
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
    </>
  )
}

export default Landing
