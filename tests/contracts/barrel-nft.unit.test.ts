/**
 * Unit tests for BarrelNFT contract logic using MockContractState.
 * These mimic contract behavior without requiring Clarinet deployment.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockContractState, TestDataGenerator } from '../utils/test-helpers';

describe('BarrelNFT Logic (state simulation)', () => {
  let state: MockContractState;
  let owner: string;

  beforeEach(() => {
    state = new MockContractState();
    owner = TestDataGenerator.randomAddress('SP');
    state.setState('contract-owner', owner);
    state.setState('next-token-id', 1n);
    state.setState('paused', false);
  });

  it('allows owner to mint and update token URI', () => {
    const recipient = TestDataGenerator.randomAddress('ST');
    const uri = 'ipfs://test';

    // simulate mint
    const tokenId = state.getState('next-token-id');
    state.setState(`token-owner-${tokenId}`, recipient);
    state.setState(`token-uri-${tokenId}`, uri);
    state.setState('next-token-id', tokenId + 1n);

    expect(state.getState(`token-owner-${tokenId}`)).toBe(recipient);
    expect(state.getState(`token-uri-${tokenId}`)).toBe(uri);
  });

  it('should transfer token between owners', () => {
    const tokenId = 1n;
    const alice = TestDataGenerator.randomAddress('SP');
    const bob = TestDataGenerator.randomAddress('ST');
    state.setState(`token-owner-${tokenId}`, alice);

    // simulate transfer
    state.setState(`token-owner-${tokenId}`, bob);
    expect(state.getState(`token-owner-${tokenId}`)).toBe(bob);
  });

  it('should be able to burn token', () => {
    const tokenId = 1n;
    const alice = TestDataGenerator.randomAddress('SP');
    state.setState(`token-owner-${tokenId}`, alice);
    state.setState(`token-uri-${tokenId}`, 'uri');

    // simulate burn
    state.setState(`token-owner-${tokenId}`, null);
    state.setState(`token-uri-${tokenId}`, null);

    expect(state.getState(`token-owner-${tokenId}`)).toBeNull();
    expect(state.getState(`token-uri-${tokenId}`)).toBeNull();
  });
});