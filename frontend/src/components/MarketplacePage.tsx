import React from 'react'
import Header from './Header'
import '../styles/MarketplacePage.css'

interface MarketplacePageProps {
  onNavigate: (path: string) => void
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  return (
    <main className="homepage">
      <Header onNavigate={onNavigate} />

      <section className="marketplace-hero">
        <div className="marketplace-hero__container">
          <h1 className="marketplace-hero__title">Live barrel offerings</h1>
          <p className="marketplace-hero__sub">Mint fractional tokens backed by aged whiskey in secure custody</p>
        </div>
      </section>

      <section className="marketplace-overview">
        <div className="marketplace-overview__inner">
          <div className="marketplace-overview__header">
            <span className="marketplace-overview__label">Live</span>
            <h2 className="marketplace-overview__title">The distillery at a glance</h2>
          </div>

          <div className="marketplace-overview__meta">
            <p>Watch the barrels move. Track the tokens minted. See what the community is building together in real time.</p>
            <div className="marketplace-overview__actions">
              <button type="button" className="btn-outline">Refresh</button>
              <button type="button" className="btn-link">Info</button>
            </div>
          </div>

          <div className="marketplace-stats">
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">47</p>
              <p className="marketplace-stat-label">Active batches aging</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">8,340</p>
              <p className="marketplace-stat-label">Tokens in circulation</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">156,000</p>
              <p className="marketplace-stat-label">STX committed</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MarketplacePage
