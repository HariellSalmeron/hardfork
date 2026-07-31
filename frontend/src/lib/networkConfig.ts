import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network'

export type StacksNetworkMode = 'mainnet' | 'testnet'

export function getStacksNetworkMode(): StacksNetworkMode {
  const envValue = import.meta.env?.VITE_STACKS_NETWORK?.toLowerCase?.() ?? ''
  if (envValue === 'testnet') return 'testnet'
  return 'mainnet'
}

export function getStacksNetwork() {
  return getStacksNetworkMode() === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET
}
