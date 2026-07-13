import React from 'react'
import '../styles/Homepage.css'

interface HeaderProps {
  onNavigate: (path: string) => void
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="header homepage-header">
      <div className="header-content">
        <div className="header-branding">
          <img src="/assets/images/header.png" alt="Logo" className="header-logo" />
        </div>

        <div className="header-right-group">
          <nav className="header-nav header-nav-right">
            <a
              className="header-nav-item"
              href="/marketplace"
              onClick={(event) => {
                event.preventDefault()
                onNavigate('/marketplace')
              }}
            >
              Marketplace
            </a>
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
  )
}

export default Header
