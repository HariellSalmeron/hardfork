import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { connectWallet, transfer, buy, getBalanceOf, getSalePrice, getSaleAvailable, getStoredWalletAddress } from '../lib/barrelToken'
import { signOut } from '../lib/auth'
import '../styles/Dashboard.css'

type DashboardProps = {
  onNavigate: (path: string) => void
}

function Dashboard(_: DashboardProps) {
  const { user } = useAuth()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [salePrice, setSalePrice] = useState<number | null>(null)
  const [saleAvailable, setSaleAvailable] = useState<number | null>(null)
  const [saleLoading, setSaleLoading] = useState(true)
  const [saleError, setSaleError] = useState<string | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0')
  const [buyAmount, setBuyAmount] = useState('1')
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadInitialData() {
      await fetchSaleState()

      try {
        const address = getStoredWalletAddress()
        if (address) {
          setWalletAddress(address)
          await fetchBalance(address)
        }
      } catch (error) {
        console.warn('No Stacks wallet session available yet', error)
      }
    }

    loadInitialData()
  }, [])

  const fetchBalance = async (address: string) => {
    const value = await getBalanceOf(address)
    setBalance(value)
  }

  const fetchSaleState = async () => {
    setSaleLoading(true)
    setSaleError(null)
    try {
      const [price, available] = await Promise.all([getSalePrice(), getSaleAvailable()])
      setSalePrice(price)
      setSaleAvailable(available)
    } catch (err) {
      setSalePrice(null)
      setSaleAvailable(null)
      setSaleError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaleLoading(false)
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
        await Promise.all([fetchBalance(address), fetchSaleState()])
        return
      }
    } catch (error) {
      console.warn('Failed to read wallet session after connection', error)
    }

    setStatus('Wallet connection failed or no address returned.')
  }

  const handleBuy = async () => {
    if (!walletAddress) {
      setStatus('Connect wallet first.')
      return
    }
    const amountNumber = Number(buyAmount)
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setStatus('Enter a valid buy amount.')
      return
    }
    setStatus('Submitting buy transaction...')
    await buy(amountNumber)
    setStatus('Buy submitted. Check wallet for approval.')
    await Promise.all([fetchBalance(walletAddress), fetchSaleState()])
  }

  const handleTransfer = async () => {
    if (!walletAddress) {
      setStatus('Connect wallet first.')
      return
    }
    if (!recipient) {
      setStatus('Enter recipient address.')
      return
    }
    const amountNumber = Number(amount)
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setStatus('Enter a valid transfer amount.')
      return
    }
    setStatus('Submitting transfer transaction...')
    await transfer(recipient, amountNumber)
    setStatus('Transfer submitted. Check wallet for approval.')
    await fetchBalance(walletAddress)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>HardFork Barrel Dashboard</h1>
          <p>{user?.email ? `Signed in as ${user.email}` : 'Signed in'}</p>
        </div>
        <button type="button" onClick={handleSignOut}>Sign out</button>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-info-card">
          <h2>BARREL Token Details</h2>
          <p>$BARREL is your testnet governance token for the HardFork Barrel system.</p>
          <ul>
            <li>Token contract: <code>barrel-token202</code></li>
            <li>Public sale contract: <code>public-sale202</code></li>
            <li>Contract address: <code>STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ</code></li>
            <li>Network: Testnet</li>
            <li>Buy flow: <code>public-sale202.buy</code> buys tokens with STX</li>
            <li>Transfer flow: <code>barrel-token202.transfer</code> moves BARREL tokens to another STX address</li>
          </ul>
        </section>

        <section className="dashboard-card">
          <h2>Wallet Connection</h2>
          <button type="button" onClick={handleConnect}>
            {walletAddress ? 'Reconnect Stacks Wallet' : 'Connect Stacks Wallet'}
          </button>
          <p>{walletAddress ? `Wallet address: ${walletAddress}` : 'No wallet connected yet.'}</p>
        </section>

        <section className="dashboard-card">
          <h2>Barrel Token Balance</h2>
          <p>{walletAddress ? `Balance: ${balance ?? 0} BARREL` : 'Connect your wallet to read balance.'}</p>
          <button type="button" onClick={() => walletAddress && fetchBalance(walletAddress)} disabled={!walletAddress}>
            Refresh Balance
          </button>
        </section>

        <section className="dashboard-card">
          <h2>Buy BARREL Tokens</h2>
          <p>Submit a buy order through the deployed public sale contract on testnet.</p>
          <label>
            Amount
            <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} min="1" max="500" />
          </label>
          <button type="button" onClick={handleBuy} disabled={!walletAddress}>
            Buy BARREL
          </button>
          <p>
            {saleLoading
              ? 'Loading sale price...'
              : salePrice != null
                ? `Current sale price: ${salePrice} microSTX per token`
                : saleError
                  ? `Sale price error: ${saleError}`
                  : 'Unable to load sale price'}
          </p>
          <p>
            {saleLoading
              ? 'Loading availability...'
              : saleAvailable != null
                ? `Available for purchase: ${saleAvailable} tokens`
                : saleError
                  ? `Availability error: ${saleError}`
                  : 'Unable to load availability'}
          </p>
        </section>

        <section className="dashboard-card">
          <h2>Transfer / Sell BARREL</h2>
          <label>
            Recipient address
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="ST..." />
          </label>
          <label>
            Amount
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" />
          </label>
          <button type="button" onClick={handleTransfer} disabled={!walletAddress}>
            Send BARREL
          </button>
        </section>

        <section className="dashboard-status">
          <h2>Status</h2>
          <p>{status || 'No recent actions yet. Use the wallet connect button to begin.'}</p>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
