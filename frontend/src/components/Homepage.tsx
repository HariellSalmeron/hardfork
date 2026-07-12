import '../styles/Homepage.css'
import '../styles/Landing.css'

export default function Homepage() {
  return (
    <main className="homepage">
      <header className="header homepage-header">
        <div className="header-content">
          <div className="header-branding">
            <img src="/assets/images/header.png" alt="Logo" className="header-logo" />
          </div>

          <div className="header-right-group">
            <nav className="header-nav header-nav-right">
              <a className="header-nav-item" href="#">Marketplace</a>
              <a className="header-nav-item" href="#">Portfolio</a>
              <a className="header-nav-item" href="#">Governance</a>
              <a className="header-nav-item" href="#">Resources</a>
            </nav>
            <div className="header-actions">
              <button className="btn-connect">Connect</button>
              <button className="btn-launch">Launch</button>
            </div>
          </div>
        </div>
      </header>

      <header className="dashboard-header homepage-hero">
        <div>
          <h1>Own whiskey barrels on the blockchain</h1>
          <p>Fractional ownership of rare whiskey barrels. Verify on-chain provenance and trade with ease.</p>
          <div className="homepage-hero-buttons">
            <button type="button">Explore</button>
            <button type="button">Portfolio</button>
          </div>
        </div>
        <div className="hero-image-placeholder">Image</div>
      </header>

      <section className="homepage-section homepage-features">
        <p className="section-label">Features</p>
        <h2>What makes us different</h2>
        <p className="section-subtitle">Own a piece of premium whiskey barrels</p>
        <div className="features-grid">
          <article className="feature-card feature-card--image">
            <div className="feature-card-icon" aria-hidden="true"></div>
            <h3>Fractional barrel ownership</h3>
            <p>Buy tokens representing your share of aging whiskey.</p>
            <a className="feature-card-link" href="#">Learn</a>
          </article>

          <article className="feature-card feature-card--dark">
            <div className="feature-card-icon" aria-hidden="true"></div>
            <h3>Governance on the blockchain</h3>
            <p>One token equals one vote on all proposals.</p>
            <a className="feature-card-link" href="#">Learn</a>
          </article>

          <article className="feature-card feature-card--dark">
            <div className="feature-card-icon" aria-hidden="true"></div>
            <h3>Real-time marketplace activity</h3>
            <p>Track live barrels and minting progress instantly.</p>
            <a className="feature-card-link" href="#">Learn</a>
          </article>
        </div>
      </section>

      <section className="homepage-section homepage-metrics">
        <div className="metrics-intro">
          <div>
            <h2>The platform is live and growing every day</h2>
          </div>
          <div>
            <p className="metrics-description">Real barrels. Real ownership. Real governance. Watch the numbers climb as more collectors join the movement.</p>
          </div>
        </div>

        <div className="metrics-stats">
          <div className="metric-item">
            <p className="metric-value">847</p>
            <p className="metric-label">Tokens minted</p>
          </div>
          <div className="metric-item">
            <p className="metric-value">12</p>
            <p className="metric-label">Active barrels</p>
          </div>
          <div className="metric-item">
            <p className="metric-value">4250</p>
            <p className="metric-label">STX raised</p>
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-proof">
        <div className="proof-grid">
          <div className="proof-copy">
            <p className="proof-label">Security</p>
            <h2>Your barrels are sealed and verified</h2>
            <p className="proof-description">Each barrel carries a proof-stamp dial showing exactly how many tokens have been minted. The physical whiskey stays locked in secure treasury vaults while you hold the governance rights.</p>

            <div className="proof-cards">
              <article className="proof-card">
                <div className="proof-icon"></div>
                <div>
                  <h3>Proof stamps</h3>
                  <p>Track minting progress with transparent dial indicators on every barrel.</p>
                </div>
              </article>
              <article className="proof-card">
                <div className="proof-icon"></div>
                <div>
                  <h3>Custody verified</h3>
                  <p>Physical assets held in institutional-grade vaults with full transparency.</p>
                </div>
              </article>
            </div>

            <div className="proof-actions">
              <button type="button" className="btn-outline">Explore</button>
              <button type="button" className="btn-link">Learn</button>
            </div>
          </div>

            <div className="proof-image-placeholder" aria-hidden="true"></div>
        </div>
      </section>

      <section className="homepage-section homepage-governance">
        <div className="governance-grid">
          <div className="governance-copy">
            <p className="proof-labelGov">Governance</p>
            <h2>Your tokens give you real voting power</h2>
            <p className="governance-description">Every token you hold equals one vote on distillery proposals. Shape the future of the operation and have your voice heard in the governance chamber.</p>

            <div className="governance-cards">
              <article className="governance-card">
                <h3>Active proposals</h3>
                <p>Vote on operational decisions that affect your barrel’s future.</p>
              </article>
              <article className="governance-card">
                <h3>Equal voting</h3>
                <p>One token equals one vote across all governance matters.</p>
              </article>
            </div>

            <div className="proof-actions">
              <button type="button" className="btn-outline">Govern</button>
              <button type="button" className="btn-link">Learn</button>
            </div>
          </div>

          <div className="proof-image-placeholder" aria-hidden="true"></div>
        </div>
      </section>

      <section className="homepage-section homepage-testimonials">
        <div className="testimonials-header">
          <h2>What collectors say</h2>
          <p>Real ownership, real returns</p>
        </div>
        <div className="testimonial-grid">
          <article className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>“I finally own a piece of something tangible. The governance voting makes me feel like a real stakeholder, not just a passive investor.”</p>
            <div className="testimonial-meta">
              <span className="testimonial-avatar">JM</span>
              <div>
                <p className="testimonial-name">James Mitchell</p>
                <p className="testimonial-role">Whiskey collector</p>
              </div>
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>“The transparency here is unmatched. I can see exactly where my barrel is and track every decision being made.”</p>
            <div className="testimonial-meta">
              <span className="testimonial-avatar">SC</span>
              <div>
                <p className="testimonial-name">Sarah Chen</p>
                <p className="testimonial-role">Portfolio manager</p>
              </div>
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>“Fractional ownership opened up an investment I could never afford before. The blockchain makes it all trustworthy.”</p>
            <div className="testimonial-meta">
              <span className="testimonial-avatar">MW</span>
              <div>
                <p className="testimonial-name">Marcus Webb</p>
                <p className="testimonial-role">Investor, collector</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="homepage-section homepage-cta-banner">
        <div className="cta-banner-inner">
          <h2>Start building your barrel portfolio</h2>
          <p>Connect your wallet and mint your first tokens today.</p>
          <div className="cta-buttons">
            <button type="button" className="btn-primary">Mint</button>
            <button type="button" className="btn-secondary">Browse</button>
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-faq">
        <div className="faq-header">
          <h2>Questions</h2>
          <p>Everything you need to know about fractional barrel ownership and governance.</p>
        </div>

        <div className="faq-grid">
          <article className="faq-card">
            <h3>How does fractional ownership work?</h3>
            <p>You purchase tokens that represent a share of a physical barrel aging in our vaults. Each token grants you voting rights on distillery decisions while the whiskey remains secure.</p>
          </article>

          <article className="faq-card">
            <h3>What happens to my tokens?</h3>
            <p>Your tokens remain in your wallet as long as you hold them. You can trade them on the marketplace, vote with them in governance proposals, or keep them as your barrel matures.</p>
          </article>

          <article className="faq-card">
            <h3>Can I sell my tokens?</h3>
            <p>Yes. The marketplace allows you to buy and sell tokens at any time. Prices fluctuate based on demand and barrel maturity.</p>
          </article>

          <article className="faq-card">
            <h3>How is voting power calculated?</h3>
            <p>One token equals one vote. If you hold fifty tokens across multiple barrels, you have fifty votes on any proposal.</p>
          </article>

          <article className="faq-card">
            <h3>What proposals can I vote on?</h3>
            <p>Proposals cover operational decisions like barrel selection, release timing, and distillery direction. All token holders vote equally on matters that affect the operation.</p>
          </article>

          <article className="faq-card">
            <h3>Are the barrels really in vaults?</h3>
            <p>Every barrel is held in institutional-grade custody with full transparency. You can track your barrel’s location and condition through the proof-stamp dial on each NFT card.</p>
          </article>
        </div>

        <div className="faq-contact">
          <div>
            <h3>Need more clarity?</h3>
            <p>Reach out to our team for detailed answers.</p>
          </div>
          <button type="button" className="btn-outline">Contact</button>
        </div>
      </section>

      <section className="homepage-section homepage-footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-top-left">
              <h3>Stay in the barrel</h3>
              <p>Get updates on new releases and governance votes</p>
            </div>
            <div className="footer-top-right">
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button type="button" className="btn-subscribe">Subscribe</button>
              </div>
              <p className="newsletter-note">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#">Marketplace</a>
              <a href="#">My Portfolio</a>
              <a href="#">Governance</a>
              <a href="#">Home</a>
              <a href="#">Resources</a>
            </div>
            <div className="footer-column">
              <h4>Documentation</h4>
              <a href="#">API Reference</a>
              <a href="#">Developer Guide</a>
              <a href="#">Support</a>
              <a href="#">Community</a>
              <a href="#">Legal</a>
            </div>
            <div className="footer-column">
              <h4>Terms of Service</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Disclaimer</a>
              <a href="#">Contact</a>
              <a href="#">Social</a>
            </div>
            <div className="footer-column">
              <h4>Twitter</h4>
              <a href="#">Discord</a>
              <a href="#">GitHub</a>
              <a href="#">Medium</a>
              <a href="#">About</a>
              <a href="#">Our Story</a>
            </div>
            <div className="footer-column">
              <h4>Meet the team</h4>
              <a href="#">Join us</a>
              <a href="#">Press kit</a>
              <a href="#">Brand guidelines</a>
              <a href="#">Partners</a>
              <a href="#">Partner with us</a>
            </div>
            <div className="footer-column">
              <h4>Integration partners</h4>
              <a href="#">Affiliate program</a>
              <a href="#">Sponsorships</a>
              <a href="#">Become a partner</a>
              <a href="#">Security</a>
              <a href="#">Audits</a>
            </div>
          </div>

  <div className="footer-divider" />

          <div className="footer-bottom">
            <img src="/assets/images/header.png" alt="Descriptive Barrel logo" className="footer-logo-img" />
            <p>© 2025 Descriptive Barrel. All rights reserved.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
