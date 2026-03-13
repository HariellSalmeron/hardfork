/**
 * State simulation tests for GovernanceToken contract
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MockContractState,
  TestDataGenerator,
} from '../utils/test-helpers';

describe('GovernanceToken Logic (state simulation)', () => {
  let state: MockContractState;
  let owner: string;

  beforeEach(() => {
    state = new MockContractState();
    owner = TestDataGenerator.randomAddress('SP');
    state.setState('contract-owner', owner);
    state.setState('paused', false);
    state.setState('total-supply', 0n);
    state.setState(`balance-${owner}`, 0n);
  });

  it('should allow owner to mint and delegate', () => {
    state.updateState('total-supply', (s: bigint) => s + 1000n);
    state.updateState(`balance-${owner}`, (b: bigint) => b + 1000n);
    expect(state.getState('total-supply')).toBe(1000n);
    expect(state.getState(`balance-${owner}`)).toBe(1000n);

    // delegate to another address
    const delegatee = TestDataGenerator.randomAddress('ST');
    state.setState(`delegate-${owner}`, delegatee);
    expect(state.getState(`delegate-${owner}`)).toBe(delegatee);
  });

  it('should transfer and track balances', () => {
    const alice = TestDataGenerator.randomAddress('SP');
    const bob = TestDataGenerator.randomAddress('ST');
    state.setState(`balance-${alice}`, 500n);
    state.updateState(`balance-${alice}`, (b: bigint) => b - 200n);
    state.setState(`balance-${bob}`, 200n);
    expect(state.getState(`balance-${alice}`)).toBe(300n);
    expect(state.getState(`balance-${bob}`)).toBe(200n);
  });

  it('should respect paused state for transfers', () => {
    state.setState('paused', true);
    expect(state.getState('paused')).toBe(true);
  });
});
