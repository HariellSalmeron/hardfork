import { afterEach, describe, expect, it, vi } from 'vitest'
import { getStacksNetworkMode } from '../../frontend/src/lib/networkConfig'

describe('getStacksNetworkMode', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('defaults to testnet when no override is provided', () => {
    vi.stubEnv('VITE_STACKS_NETWORK', '')
    expect(getStacksNetworkMode()).toBe('testnet')
  })

  it('uses mainnet when explicitly configured', () => {
    vi.stubEnv('VITE_STACKS_NETWORK', 'mainnet')
    expect(getStacksNetworkMode()).toBe('mainnet')
  })
})
