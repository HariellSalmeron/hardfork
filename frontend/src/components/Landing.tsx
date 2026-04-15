import '../styles/Landing.css'

function Landing({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="landing-click-capture" onClick={onNavigate}>
      <header className="header">
        <div className="header-content">
          <div className="header-branding">
          </div>
        </div>
      </header>

      <section className="section-one hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-branding">
              <img src="/assets/images/Forker.png" alt="HARDFORK" className="hero-logo-img" />  
              <p className="hero-subtitle">THE LIQUID LEDGER</p>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Maturation is no longer passive.<br />It’s governed.</h1>
              <p className="hero-tagline"></p>
              <p className="hero-description">Hard Fork Distillery is currently building the bridge between physical spirit maturation and the Bitcoin layer. We are hard-forking the traditional model to create a transparent, verifiable, and community-directed future for craft whiskey.</p>
              <a href="#" className="btn btn-primary">Follow us on X</a>
            </div>
          </div>
          <div className="hero-right" aria-hidden="true" />
        </div>
        
      </section>
      
 <section className="stats-section">
        <div className="stats-container">
          <div className="stat-itemLeft">
            <div className="stat-icon"></div>
            <div className="stat-text-divRight">
              <p className="stat-text">Whiskey cask investments have historically targeted long-term gains of 8-15% per year.</p>
            </div>
          </div>
          <div className="stat-itemRight">
            <div className="stat-icon"></div>
            <div className="stat-text-div">
              <p className="stat-text">Unlike Bitcoin, whiskey is a physical asset offering a “real-world” hedge against digital volatility.</p>
            </div>
          </div>
        </div>
      </section>


      <section id="section-3" className="liquid-ledger">
        <div className="liquid-ledger-grid">
          <div className="liquid-ledger-image" aria-hidden="true" />
          <div className="liquid-ledger-content">
            <p className="section-label-text">THE LIQUID LEDGER</p>
            <h2 className="section-title">Engineering The <br />Future Of Craft Spirits.</h2>
            <p className="section-subtitle">We are currently in the Physical & Digital Build-out Phase. While our smart contracts are being finalized on the Stacks layer, our new production and aging facility is rising from the ground.We are bridging high-tech transparency with traditional heritage from day one.</p>
           
            <a href="#" className="btn btn-primary">Learn More</a>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="story-grid">
          <div className="story-content">
            <p className="story-label-text">OUR ORIGINS</p>
            <h2 className="section-title">The HardFork Story</h2>
            
            <div className="story-item">
              <h3 className="story-subtitle">Bitcoin Roots</h3>
              <p className="story-text">Our journey began in the early days of the Bitcoin movement. This legacy reflects our team's decade-plus resilience and pioneering mindset — native to the decentralized movement we are now applying to distillery operations.</p>
            </div>

            <div className="story-item">
              <h3 className="story-subtitle">The Tekna/Labrada Legacy</h3>
              <p className="story-text">With 15 years of leadership in industrial accountability, the Tekna and Labrada teams are bringing a proven standard of operational integrity and supply-chain transparency to the world of fine spirits.</p>
            </div>

            <div className="story-item">
              <h3 className="story-subtitle">The Acquisitions</h3>
              <p className="story-text">Our foundation is secured by the strategic acquisition of the James River and Old Fourth Distillery assets. These historic resources provide the premium "Jumpstart" inventory that is currently being prepared for our ecosystem launch.</p>
            </div>
          </div>

          <div className="story-image" aria-hidden="true"></div>
        </div>
      </section>

      <section className="ecosystem-section">
        <div className="ecosystem-header">
          <p className="ecosystem-label-text">THE ECONOMY</p>
          <h2 className="section-title">Designing The <br />Governance of Spirits.</h2>
          <p className="section-description">Our team is finalizing the architecture that separates platform utility from asset-specific management to ensure long-term stability and regulatory compliance.</p>
        </div>

        <div className="ecosystem-cards">
          <article className="ecosystem-card">
            <div className="card-circle-wrapper">
            <img src="/assets/images/circle-icon.png" alt="circle icon" className="card-circle-icon" /> 
            </div>
            <p className="card-label-text">$CASK</p>
           
            <p className="card-subtitle">The Utility Key</p>
            <p className="card-text">Planned features include staking for allocation rights and access to premium platform features.</p>
          </article>
          <article className="ecosystem-card">
            <div className="card-circle-wrapper">
              <img src="/assets/images/circle-icon.png" alt="circle icon" className="card-circle-icon" />
            </div>
            <p className="card-label-text">$SHOT</p>
           
            <p className="card-subtitle">The Management License</p>
            <p className="card-text">Designed to allow holders to direct the labor of the distillery, voting on chill levels and maturation paths.</p>
          </article>
        </div>

        <div className="ecosystem-ornament" aria-hidden="true"></div>

        <div className="ecosystem-action">
          <a href="#" className="btn btn-secondary">MORE INFO</a>
        </div>
      </section>

      <section className="value-section">
        <div className="value-grid">
          <article className="value-card">
            <div className="value-icon-wrapper">
              <img src="/assets/images/icon.png" alt="spirits icon" className="value-icon" />
            </div>
            <p className="value-card-text">The maturing, finite nature of high-end spirits make it an exciting, high-luxury, alternative investment strategy.</p>
          </article>
          <article className="value-card">
            <div className="value-icon-wrapper">
              <img src="/assets/images/box.png" alt="book icon" className="value-icon" />
            </div>
            <p className="value-card-text">Whiskey is a physical asset that can be touched, stored in bonded warehouses, and eventually consumed if not sold.</p>
          </article>
        </div>
      </section>

      <section className="section-seven">
        <div className="section-seven-content">
          <p className="section-dapp-image">THE DAPP</p>
          <h2 className="section-title">THE GOVERNOR'S OFFICE</h2>
          <p className="section-description">The Governor's Office is being developed as the central hub for the Hard Fork DAO. We are currently building the interface where you will eventually:</p>
        </div>

        <div className="section-seven-grid">
          <article className="section-seven-card card-manage">
            <div className="section-seven-image-div">
              <img src="/assets/images/book.png" alt="book" className="section-seven-icon section-seven-icon-book" />
            </div>
            <div className="section-seven-text-div">
              <h3>Manage</h3>
              <p>Track specific $SHOT licenses and barrel metadata.</p>
            </div>
          </article>
          <article className="section-seven-card card-monitor">
            <div className="section-seven-image-div">
              <img src="/assets/images/Frame.png" alt="frame" className="section-seven-icon section-seven-icon-frame" />
            </div>
            <div className="section-seven-text-div">
              <h3 className="monitor-title">Monitor</h3>
              <p className="monitor-text">View live rickhouse sensor stats and evaporation estimates.</p>
            </div>
          </article>
          <article className="section-seven-card card-direct">
            <div className="section-seven-image-div">
              <img src="/assets/images/Group.png" alt="group" className="section-seven-icon section-seven-icon-group" />
            </div>
            <div className="section-seven-text-div">
              <h3>Direct</h3>
              <p>Cast on-chain votes to determine the maturation path of your spirits.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-grid">
          <div className="faq-text">
            <span className="faq-label-image">FAQ'S</span>
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3>How will governance work once launched?</h3>
              <p>Barrel governance will be handled via blockchain-based voting. $SHOT holders will have a transparent say in maturation decisions, directing the physical labor of the distillery staff.</p>
            </div>

            <div className="faq-item">
              <h3>What is "Chain of Possession"?</h3>
              <p>The Chain of Possession is our on-chain audit trail for barrel transfers. It ensures each handoff is recorded immutably, preventing tampering and providing full transparency.</p>
            </div>

            <div className="faq-item">
              <h3>How can I stay updated on the build?</h3>
              <p>Follow us on X and subscribe to the developer blog (links above). We also publish regular updates on product milestones and on-chain releases.</p>
            </div>

            <div className="faq-item">
              <h3>Do I own the physical whiskey?</h3>
              <p>Ownership is tokenized via $CASK and $SHOT. While you do not hold the barrels yourself, token holders receive governance rights and access to the underlying inventory as it matures.</p>
            </div>
          </div>

          <div className="faq-image" aria-hidden="true" />
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-top">
            <h3 className="footer-label">Supported By</h3>
            <div className="footer-logos">
              <img src="/assets/images/logoIpsum.png" alt="Partner logo 1" />
              <img src="/assets/images/logoIpsum2.png" alt="Partner logo 2" />
              <img src="/assets/images/logoIpsum3.png" alt="Partner logo 3" />
              <img src="/assets/images/logoIpsum4.png" alt="Partner logo 4" />
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-column footer-branding">
              <div className="footer-logo">
                <img src="/assets/images/Forker.png" alt="HARDFORK logo" className="footer-logo-img" />
              </div>
              <p className="footer-description">We're building the bridge between physical spirit maturation and the Bitcoin layer.</p>
              <div className="footer-socials">
                <img src="/assets/images/socmed.png" alt="Social media icons" />
              </div>
            </div>

            <div className="footer-column footer-quick-column footer-menu-column">
              <h4 className="footer-menu-title footer-menu-title-quick">QUICK MENU</h4>
              <ul className="footer-menu footer-quick-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#team">Our Team</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column footer-service-column footer-service-menu-column">
              <h4 className="footer-menu-title footer-menu-title-service">SERVICE</h4>
              <ul className="footer-menu footer-service-menu">
                <li><a href="#contact">Contact Via Email</a></li>
                <li><a href="#faq">Help & FAQ</a></li>
                <li><a href="#communities">Communities</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Use</a></li>
              </ul>
            </div>

            <div className="footer-column footer-contact-column footer-contact-info-column">
              <h4 className="footer-menu-title footer-menu-title-contact">CONTACT</h4>
              <p className="footer-contact footer-contact-phone">
  <span className="contact-icon">
    <img src="/assets/images/phone.png" alt="Phone no." />
  </span>
  +1 (409) 555-5555
</p>
              <p className="footer-contact footer-contact-email">
  <span className="contact-icon">
    <img src="/assets/images/email.png" alt="Email icon" />
  </span>
  support@hard-fork.com
</p>
              <p className="footer-contact footer-contact-address">
  <span className="contact-icon">
    <img src="/assets/images/location.png" alt="Location" />
  </span>
  123 Main Street, Suite 100<br />Greer, SC 29650<br />United States
</p>
            </div>

            <div className="footer-column footer-payment-column footer-payment-methods-column">
              <h4 className="footer-menu-title footer-menu-title-payment">PAYMENT</h4>
              <div className="footer-payment footer-payment-methods">
                <img src="/assets/images/payment.png" alt="Payment methods" />
              </div>
            </div>

            <div className="footer-column footer-newsletter">
              <h4 className="footer-menu-title">NEWSLETTER</h4>
              <p className="footer-newsletter-text">Don't miss out on the opportunity to stay informed with our exclusive newsletter subscription.</p>
              <div className="footer-subscribe">
                <div className="newsletter-field">
                  <img src="/assets/images/email.png" alt="Email icon" className="newsletter-icon" />
                  <input type="email" className="newsletter-input" placeholder="Your email address" />
                </div>
                <button className="btn btn-subscribe">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© Copyright HARDFORK 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing