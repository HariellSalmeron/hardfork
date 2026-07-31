import React, { useEffect, useState } from 'react'
import Header from './Header'
import { approveSale, buy, connectWallet, getAllowanceOf, getBalanceOf, getSaleAvailable, getSalePrice, getStacksAddressFromResult, getStoredWalletAddress, getStxBalance, getWalletNetworkMode, sell } from '../lib/barrelToken'
import { getStacksNetworkMode } from '../lib/networkConfig'
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
  const [allowance, setAllowance] = useState<number | null>(null)
  const [salePrice, setSalePrice] = useState<number | null>(null)
  const [saleAvailable, setSaleAvailable] = useState<number | null>(null)
  const [, setWalletNetwork] = useState<'mainnet' | 'testnet' | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void refreshSaleState()

    const address = getStoredWalletAddress()
    if (!address) return

    const networkMode = getWalletNetworkMode(address)
    setWalletNetwork(networkMode)

    if (networkMode !== getStacksNetworkMode()) {
      setStatus(
        `Connected wallet is on ${networkMode}, but this app is running on ${getStacksNetworkMode()}. Please reconnect with a wallet on the correct network.`
      )
      return
    }

    setWalletAddress(address)
    void fetchBalance(address)
    void fetchStxBalance(address)
    void fetchAllowance(address)
  }, [])

  useEffect(() => {
    if (!walletAddress) return
    const networkMode = getWalletNetworkMode(walletAddress)
    setWalletNetwork(networkMode)
    if (networkMode !== getStacksNetworkMode()) {
      setStatus(
        `Connected wallet is on ${networkMode}, but this app is running on ${getStacksNetworkMode()}. Please reconnect with a wallet on the correct network.`
      )
      return
    }
    void fetchBalance(walletAddress)
    void fetchAllowance(walletAddress)
    void fetchStxBalance(walletAddress)
  }, [walletAddress])

  const fetchBalance = async (address: string) => {
    const value = await getBalanceOf(address)
    setBalance(value)
  }

  const fetchStxBalance = async (address: string) => {
    const value = await getStxBalance(address)
    setStxBalance(value)
  }

  const fetchAllowance = async (address: string) => {
    const value = await getAllowanceOf(address)
    setAllowance(value)
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const pollAllowance = async (address: string, target: number) => {
    const deadline = Date.now() + 15000
    while (Date.now() < deadline) {
      const value = await getAllowanceOf(address)
      setAllowance(value)
      if (value !== null && value >= target) return true
      await delay(3000)
    }
    return false
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
      const result = await connectWallet()
      const address = getStacksAddressFromResult(result) ?? getStoredWalletAddress()
      if (!address) {
        setStatus('Wallet connected, but no address was returned.')
        return
      }

      const networkMode = getWalletNetworkMode(address)
      setWalletNetwork(networkMode)
      if (networkMode !== getStacksNetworkMode()) {
        setStatus(
          `Wallet connected, but it is on ${networkMode}. Please reconnect with a wallet on ${getStacksNetworkMode()}.`
        )
        return
      }

      setWalletAddress(address)
      setStatus(`Wallet connected: ${address}`)
      await Promise.all([fetchBalance(address), fetchStxBalance(address), refreshSaleState(), fetchAllowance(address)])
    } catch (error) {
      console.error('Wallet connection failed', error)
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('User rejected request')) {
        setStatus('Wallet connection was rejected. Please approve the connection in your wallet.')
      } else if (message.includes('No compatible Stacks wallet')) {
        setStatus('No compatible Stacks wallet found. Please install or enable Leather or another supported wallet.')
      } else {
        setStatus(`Wallet connection failed: ${message}`)
      }
    }
  }

  const handleBuy = async () => {
    if (!walletAddress) {
      setStatus('Connecting wallet...')
      try {
        await connectWallet()
        const address = getStoredWalletAddress()
        if (address) {
          setWalletAddress(address)
        } else {
          setStatus('Wallet connection failed.')
          return
        }
      } catch (error) {
        console.error('Wallet connection failed', error)
        setStatus('Wallet connection failed.')
        return
      }
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
      const addr = getStoredWalletAddress()
      if (addr) await Promise.all([fetchBalance(addr), fetchStxBalance(addr), refreshSaleState()])
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

  const handleApprove = async () => {
    if (!walletAddress) {
      setStatus('Connect your wallet first.')
      return
    }

    const amount = Number(sellAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setStatus('Enter a valid sell amount.')
      return
    }

    setStatus('Submitting approval transaction...')
    try {
      await approveSale(amount)
      setStatus('Approval submitted. Waiting for blockchain confirmation...')
      const addr = getStoredWalletAddress()
      if (addr) {
        const approved = await pollAllowance(addr, amount)
        if (approved) {
          setStatus(`Approval confirmed. You may now sell ${amount} BARREL.`)
        } else {
          setStatus('Approval may still be pending. Refresh allowance or wait a few seconds.')
        }
      }
    } catch (error) {
      console.error('Approval error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('User rejected')) {
        setStatus('Approval rejected. Click "Approve" in the wallet popup to proceed.')
      } else {
        setStatus(`Approval failed: ${errorMessage}`)
      }
    }
  }

  const handleSell = async () => {
    if (!walletAddress) {
      setStatus('Connect your wallet first.')
      return
    }

    const amount = Number(sellAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setStatus('Enter a valid sell amount.')
      return
    }

    if (allowance === null || allowance < amount) {
      setStatus('You must approve the public sale contract for this amount before selling.')
      return
    }

    setStatus('Submitting sell transaction...')
    try {
      await sell(amount)
      setStatus('Sell submitted. Check your wallet for approval.')
      const addr = getStoredWalletAddress()
      if (addr) await Promise.all([fetchBalance(addr), fetchStxBalance(addr), refreshSaleState(), fetchAllowance(addr)])
    } catch (error) {
      console.error('Sell error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('User rejected')) {
        setStatus('Sell rejected. Click "Approve" in the wallet popup to proceed.')
      } else {
        setStatus(`Sell failed: ${errorMessage}`)
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
              <p className="marketplace-stat-value">
                {walletAddress
                  ? stxBalance !== null
                    ? (stxBalance / 1000000).toFixed(2)
                    : 'Loading...'
                  : 'Connect wallet'}
              </p>
              <p className="marketplace-stat-label">Your STX balance</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">
                {walletAddress
                  ? balance !== null
                    ? balance
                    : 'Loading...'
                  : 'Connect wallet'}
              </p>
              <p className="marketplace-stat-label">Your BARREL balance</p>
            </article>
            <article className="marketplace-stat-card">
              <p className="marketplace-stat-value">
                {walletAddress
                  ? allowance !== null
                    ? allowance
                    : 'Loading...'
                  : 'Connect wallet'}
              </p>
              <p className="marketplace-stat-label">Allowance to public-sale</p>
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
              <h3>Sell BARREL</h3>
              <p>Current sell is handled by the `public-sale` contract. ALEX DEX integration is future work and not required here.</p>
              <label>
                Amount
                <input type="number" min="1" value={sellAmount} onChange={(event) => setSellAmount(event.target.value)} />
              </label>
              <div className="marketplace-panel__actions">
                <button type="button" className="btn-outline" onClick={() => void handleApprove()}>
                  Approve sale
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => void handleSell()}
                  disabled={allowance === null || allowance < Number(sellAmount)}
                >
                  Sell BARREL
                </button>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => walletAddress ? fetchAllowance(walletAddress) : setStatus('Connect your wallet first.')}
                >
                  Refresh allowance
                </button>
              </div>
              {allowance !== null && allowance < Number(sellAmount) ? (
                <p className="marketplace-note">Current allowance is too low; click Approve sale first or refresh allowance after confirming the wallet popup.</p>
              ) : null}
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
