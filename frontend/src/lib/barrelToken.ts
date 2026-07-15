import { connect as connectStacksWallet, getLocalStorage, openContractCall, AppConfig, UserSession } from '@stacks/connect'
import { fetchCallReadOnlyFunction, standardPrincipalCV, uintCV } from '@stacks/transactions'
import { getStacksNetwork } from './networkConfig'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const network = getStacksNetwork()

const TOKEN_CONTRACT = {
  address: 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ',
  name: 'barrel-token206',
}

const PUBLIC_SALE_CONTRACT = {
  address: 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ',
  name: 'public-sale206',
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

export function getStoredWalletAddress(): string | null {
  try {
    const data = getLocalStorage() as { addresses?: { stx?: Array<{ address?: string }> } } | null
    return data?.addresses?.stx?.[0]?.address ?? null
  } catch (error) {
    console.warn('Unable to read stored wallet address', error)
    return null
  }
}

export async function connectWallet() {
  await connectStacksWallet({
    forceWalletSelect: true,
    enableLocalStorage: true,
  })
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
    functionArgs: [standardPrincipalCV(`${PUBLIC_SALE_CONTRACT.address}.${PUBLIC_SALE_CONTRACT.name}`), uintCV(amount)],
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

export async function buy(amount: number) {
  const price = await getSalePrice()
  if (price === null) throw new Error('Unable to get sale price')
  const walletAddress = getStoredWalletAddress()
  if (!walletAddress) throw new Error('Wallet not connected')
  const totalCost = BigInt(amount) * BigInt(price)

  return openContractCall({
    contractAddress: PUBLIC_SALE_CONTRACT.address,
    contractName: PUBLIC_SALE_CONTRACT.name,
    functionName: 'buy',
    functionArgs: [uintCV(amount)],
    network,
    appDetails: { name: 'HardFork Dashboard', icon: window.location.origin + '/favicon.ico' },
    postConditionMode: 'deny',
    postConditions: [
      {
        type: 'stx-postcondition',
        address: walletAddress,
        condition: 'eq',
        amount: totalCost.toString(),
      },
    ],
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
  try {
    const networkMode = network.isTestnet ? 'testnet' : 'mainnet'
    const apiUrl = `https://api.${networkMode}.hiro.so/extended/v1/address/${address}/balances`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const stxBalance = data.stx?.balance ?? 0
    return Number(stxBalance)
  } catch (err) {
    console.error('Failed to fetch STX balance', err)
    return null
  }
}

export { userSession }
