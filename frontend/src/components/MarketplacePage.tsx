import React, { useEffect, useState } from 'react'
import Header from './Header'
import { buy, connectWallet, getBalanceOf, getSaleAvailable, getSalePrice, getStoredWalletAddress, transfer, getStxBalance } from '../lib/barrelToken'
import '../styles/MarketplacePage.css'

interface MarketplacePageProps {
  onNavigate: (path: string) => void
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [stxBalance, setStxBalance] = useState<number | null>(null)
  const [buyAmount, setBuyAmount] = useState('1')
  const [sellAmount, setSellAmount] = useState('1')
  const [recipient, setRecipient] = useState('')
  const [salePrice, setSalePrice] = useState<number | null>(null)
  const [saleAvailable, setSaleAvailable] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const address = getStoredWalletAddress()
    if (address) {
      setWalletAddress(address)
      void fetchBalance(address)
      void fetchStxBalance(address)
      void refreshSaleState()
    }
  }, [])

  const fetchBalance = async (address: string) => {
    const value = await getBalanceOf(address)
    setBalance(value)
  }

  const fetchStxBalance = async (address: string) => {
    const value = await getStxBalance(address)
    setStxBalance(value)
  }

  const refreshSaleState = async () => {
    setLoading(true)
    try {
      const [price, available] = await Promise.all([getSalePrice(), getSaleAvailable()])
      setSalePrice(price)
      setSaleAvailable(available)
    } catch (error) {
      console.error('Unable to refresh marketplace sale state', error)
      setStatus('Unable to load sale state from the current network.')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setStatus('Connecting wallet...')
    try {
      await connectWallet()
      const address = getStoredWalletAddress()
      if (address) {
        setWalletAddress(address)
        setStatus(`Wallet connected: ${address}`)
        await Promise.all([fetchBalance(address), fetchStxBalance(address), refreshSaleState()])
      }
    } catch (error) {
      console.error('Wallet connection failed', error)
      setStatus('Wallet connection failed.')
    }
  }

  const handleBuy = async () => {
    if (!walletAddress) {
      setStatus('Connect your wallet first.')
      return
    }

    const amount = Number(buyAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setStatus('Enter a valid buy amount.')
      return
    }

    setStatus('Submitting buy transaction...')
    try {
      await buy(amount)
      setStatus('Buy submitted. Check your wallet for approval.')
      await Promise.all([fetchBalance(walletAddress), fetchStxBalance(walletAddress), refreshSaleState()])
    } catch (error) {
      console.error('Buy error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('User rejected')) {
        setStatus('Transaction rejected. Click "Approve" in the Leather wallet popup to proceed.')
      } else {
        setStatus(`Buy failed: ${errorMessage}`)
      }
    }
  }

  const handleSell = async () => {
    if (!walletAddress) {
      setStatus('Connect your wallet first.')
      return
    }

    if (!recipient) {
      setStatus('Enter a recipient address before selling.')
      return
    }

    const amount = Number(sellAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setStatus('Enter a valid sell amount.')
      return
    }

    setStatus('Submitting transfer transaction...')
    try {
      await transfer(recipient, amount)
      setStatus('Transfer submitted. Check your wallet for approval.')
      await Promise.all([fetchBalance(walletAddress), fetchStxBalance(walletAddress)])
    } catch (error) {
      console.error('Transfer error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('User rejected')) {
        setStatus('Transaction rejected. Click "Approve" in the Leather wallet popup to proceed.')
      } else {
        setStatus(`Transfer failed: ${errorMessage}`)
      }
    }
  }

  return (
    <main className="homepage">
      <Header onNavigate={onNavigate} />

      <section className="marketplace-hero">
        <div className="marketplace-hero__container">
          <h1 className="marketplace-hero__title">Live barrel offerings</h1>
          <p className="marketplace-hero__sub">Buy and sell BARREL tokens against the connected Stacks network.</p>
        </div>
      </section>

      <section className="marketplace-overview">
        <div className="marketplace-overview__inner">
          <div className="marketplace-overview__header">
            <span className="marketplace-overview__label">Live</span>
            <h2 className="marketplace-overview__title">The distillery at a glance</h2>
          </div>

          <div className="marketplace-overview__meta">
            <p>Connect your wallet and interact with the current public sale contract directly from this page.</p>
            <div className="marketplace-overview__actions">
              <button type="button" className="btn-outline" onClick={handleConnect}>
                {walletAddress ? 'Reconnect wallet' : 'Connect wallet'}
              </button>
              <button type="button" className="btn-link" onClick={() => void refreshSaleState()}>Refresh</button>
            </div>
          </div>

          <div className="marketplace-stats">
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">{salePrice ?? '—'}</p>
              <p className="marketplace-stat-label">Current sale price (microSTX/token)</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">{saleAvailable ?? '—'}</p>
              <p className="marketplace-stat-label">Tokens still available</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">{stxBalance !== null ? (stxBalance / 1000000).toFixed(2) : '—'}</p>
              <p className="marketplace-stat-label">Your STX balance</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">{balance ?? '—'}</p>
              <p className="marketplace-stat-label">Your BARREL balance</p>
            </article>
          </div>

          <div className="marketplace-actions">
            <div className="marketplace-panel">
              <h3>Buy BARREL</h3>
              <label>
                Amount
                <input type="number" min="1" max="500" value={buyAmount} onChange={(event) => setBuyAmount(event.target.value)} />
              </label>
              <button type="button" className="btn-outline" onClick={() => void handleBuy()}>
                Buy now
              </button>
            </div>

            <div className="marketplace-panel">
              <h3>Sell / transfer BARREL</h3>
              <label>
                Recipient
                <input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="ST..." />
              </label>
              <label>
                Amount
                <input type="number" min="1" value={sellAmount} onChange={(event) => setSellAmount(event.target.value)} />
              </label>
              <button type="button" className="btn-outline" onClick={() => void handleSell()}>
                Send tokens
              </button>
            </div>
          </div>

          {status ? <p className="marketplace-status">{status}</p> : null}
          {loading ? <p className="marketplace-status">Refreshing marketplace state...</p> : null}
        </div>
      </section>
    </main>
  )
}

export default MarketplacePage
