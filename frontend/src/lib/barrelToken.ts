import { connect as connectStacksWallet, request as requestStacks, getLocalStorage, openContractCall, AppConfig, UserSession, getStacksProvider, isStacksWalletInstalled } from '@stacks/connect'
import { fetchCallReadOnlyFunction, standardPrincipalCV, contractPrincipalCV, uintCV } from '@stacks/transactions'
import { getStacksNetwork, getStacksNetworkMode } from './networkConfig'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const network = getStacksNetwork()

export const TOKEN_CONTRACT = {
  address: 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F',
  name: 'barrel-token224',
}

export const PUBLIC_SALE_CONTRACT = {
  address: 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F',
  name: 'public-sale224',
}

function parseClarityNumber(value: unknown): number | null {
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  if (value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)) {
    return parseClarityNumber((value as { value: unknown }).value)
  }
  return null
}

function isStacksAddress(address: string): boolean {
  return /^S[PTMN]/.test(address)
}

function getNetworkModeFromAddress(address: string): 'mainnet' | 'testnet' {
  if (address.startsWith('SP') || address.startsWith('SM')) return 'mainnet'
  if (address.startsWith('ST') || address.startsWith('SN')) return 'testnet'
  return getStacksNetworkMode()
}

function normalizeStoredAddress(address?: string | null): string | null {
  if (!address || typeof address !== 'string') return null
  return isStacksAddress(address) ? address : null
}

function findStacksAddress(addresses: any): string | null {
  if (!addresses) return null

  if (Array.isArray(addresses)) {
    return addresses.map((entry) => normalizeStoredAddress(entry?.address)).find(Boolean) ?? null
  }

  if (typeof addresses === 'object') {
    return Object.values(addresses)
      .map((value) => findStacksAddress(value))
      .find(Boolean) ?? null
  }

  return null
}

export function getStacksAddressFromResult(result: any): string | null {
  return findStacksAddress(result?.addresses)
}

export function getStoredWalletAddress(): string | null {
  try {
    // Prefer session-backed user data if available
    try {
      const userData = (userSession as any).loadUserData ? (userSession as any).loadUserData() : null
      if (userData) {
        const addr =
          findStacksAddress(userData?.profile?.stx?.accounts) ||
          findStacksAddress(userData?.addresses) ||
          normalizeStoredAddress(userData?.address)
        if (addr) return addr
      }
    } catch (e) {
      // ignore and fallback to local storage
    }

    const data = getLocalStorage() as { addresses?: Record<string, Array<{ address?: string }>> } | null
    return findStacksAddress(data?.addresses) ?? null
  } catch (error) {
    console.warn('Unable to read stored wallet address', error)
    return null
  }
}

export async function connectWallet() {
  const options = {
    forceWalletSelect: true,
    enableLocalStorage: true,
    network: getStacksNetworkMode(),
  }

  try {
    return await connectStacksWallet(options)
  } catch (error) {
    console.warn('connect() failed, attempting direct provider fallback if available.', error)
    const provider = getStacksProvider()
    if (provider) {
      try {
        return await requestStacks({ provider, enableLocalStorage: true }, 'getAddresses', { network: getStacksNetworkMode() })
      } catch (fallbackError) {
        console.warn('Direct provider getAddresses fallback failed.', fallbackError)
      }
    }
    if (!isStacksWalletInstalled()) {
      throw new Error('No compatible Stacks wallet installed or enabled. Please install or enable Leather or another Stacks wallet.')
    }
    throw error
  }
}

export function getWalletNetworkMode(address: string): 'mainnet' | 'testnet' {
  return getNetworkModeFromAddress(address)
}

export async function mint(recipient: string, amount: number) {
  return openContractCall({
    contractAddress: TOKEN_CONTRACT.address,
    contractName: TOKEN_CONTRACT.name,
    functionName: 'mint',
    functionArgs: [standardPrincipalCV(recipient), uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
  })
}

export async function mintForBarrel(recipient: string) {
  return openContractCall({
    contractAddress: TOKEN_CONTRACT.address,
    contractName: TOKEN_CONTRACT.name,
    functionName: 'mint-for-barrel',
    functionArgs: [standardPrincipalCV(recipient)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
  })
}

export async function transfer(recipient: string, amount: number) {
  return openContractCall({
    contractAddress: TOKEN_CONTRACT.address,
    contractName: TOKEN_CONTRACT.name,
    functionName: 'transfer',
    functionArgs: [standardPrincipalCV(recipient), uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
  })
}

export async function approveSale(amount: number) {
  return openContractCall({
    contractAddress: TOKEN_CONTRACT.address,
    contractName: TOKEN_CONTRACT.name,
    functionName: 'approve',
    functionArgs: [contractPrincipalCV(PUBLIC_SALE_CONTRACT.address, PUBLIC_SALE_CONTRACT.name), uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
  })
}

export async function sell(amount: number) {
  return openContractCall({
    contractAddress: PUBLIC_SALE_CONTRACT.address,
    contractName: PUBLIC_SALE_CONTRACT.name,
    functionName: 'sell',
    functionArgs: [uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
  })
}

export async function getAllowanceOf(owner: string): Promise<number | null> {
  try {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: TOKEN_CONTRACT.address,
      contractName: TOKEN_CONTRACT.name,
      functionName: 'get-allowance-of',
      functionArgs: [
        standardPrincipalCV(owner),
        contractPrincipalCV(PUBLIC_SALE_CONTRACT.address, PUBLIC_SALE_CONTRACT.name),
      ],
      network,
      senderAddress: owner,
    })
    return parseClarityNumber(cv)
  } catch (err) {
    console.error('read-only allowance error', err)
    return null
  }
}

export async function buy(amount: number) {
  const price = await getSalePrice()
  if (price === null) throw new Error('Unable to get sale price')

  // Resolve the active wallet address just before opening the call.
  const walletAddress = getStoredWalletAddress()
  if (!walletAddress) throw new Error('Wallet not connected')

  return openContractCall({
    contractAddress: PUBLIC_SALE_CONTRACT.address,
    contractName: PUBLIC_SALE_CONTRACT.name,
    functionName: 'buy',
    functionArgs: [uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
    postConditionMode: 'allow',
  })
}

export async function getBalanceOf(owner: string): Promise<number | null> {
  try {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: TOKEN_CONTRACT.address,
      contractName: TOKEN_CONTRACT.name,
      functionName: 'get-balance-of',
      functionArgs: [standardPrincipalCV(owner)],
      network,
      senderAddress: owner,
    })
    return parseClarityNumber(cv)
  } catch (err) {
    console.error('read-only error', err)
    return null
  }
}

const READ_ONLY_FALLBACK_SENDER = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'

export async function getSalePrice(): Promise<number | null> {
  try {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: PUBLIC_SALE_CONTRACT.address,
      contractName: PUBLIC_SALE_CONTRACT.name,
      functionName: 'get-price',
      functionArgs: [],
      network,
      senderAddress: READ_ONLY_FALLBACK_SENDER,
    })
    return parseClarityNumber(cv)
  } catch (err) {
    console.error('read-only sale price error', err)
    throw err
  }
}

export async function getSaleAvailable(): Promise<number | null> {
  try {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: PUBLIC_SALE_CONTRACT.address,
      contractName: PUBLIC_SALE_CONTRACT.name,
      functionName: 'get-available',
      functionArgs: [],
      network,
      senderAddress: READ_ONLY_FALLBACK_SENDER,
    })
    return parseClarityNumber(cv)
  } catch (err) {
    console.error('read-only sale availability error', err)
    throw err
  }
}

export async function getStxBalance(address: string): Promise<number | null> {
  if (!isStacksAddress(address)) {
    console.warn('Invalid STX address provided for balance fetch:', address)
    return null
  }

  const networkMode = getNetworkModeFromAddress(address)
  const urls = networkMode === 'mainnet'
    ? ['https://api.mainnet.hiro.so', 'https://api.hiro.so']
    : ['https://api.testnet.hiro.so', 'https://api.hiro.so']

  for (const baseUrl of urls) {
    try {
      const apiUrl = `${baseUrl}/extended/v1/address/${address}/balances`
      const response = await fetch(apiUrl, { mode: 'cors' })
      if (!response.ok) {
        const message = `HTTP ${response.status} ${response.statusText}`
        console.warn(`STX balance fetch failed for ${apiUrl}: ${message}`)
        continue
      }
      const data = await response.json()
      const stxBalance = data.stx?.balance ?? 0
      return Number(stxBalance)
    } catch (err) {
      console.warn(`STX balance fetch error from ${baseUrl}`, err)
    }
  }

  console.error('Failed to fetch STX balance from all known endpoints')
  return null
}

export { userSession }
