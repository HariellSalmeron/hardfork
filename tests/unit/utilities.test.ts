// This file has been removed as part of the cleanup process.
/**
 * Example Unit Tests
 * Demonstrates testing utility functions, helpers, and non-contract code
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TestDataGenerator,
  AssertionHelpers,
  MockContractState,
  PerformanceTimer,
  GasCostTracker,
} from '../utils/test-helpers';

describe('Unit Tests - Utility Functions', () => {
  describe('TestDataGenerator', () => {
    it('should generate valid Stacks addresses', () => {
      const address = TestDataGenerator.randomAddress('SP');
      expect(AssertionHelpers.isValidAddress(address)).toBe(true);
      expect(address.startsWith('SP')).toBe(true);
    });

    it('should generate random amounts within range', () => {
      const amount = TestDataGenerator.randomAmount(1000, 10000);
      expect(amount).toBeGreaterThanOrEqual(1000);
      expect(amount).toBeLessThanOrEqual(10000);
    });

    it('should generate positive token IDs', () => {
      const tokenId = TestDataGenerator.randomTokenId();
      expect(tokenId).toBeGreaterThan(0n);
    });

    it('should generate valid contract names', () => {
      const contractName = TestDataGenerator.randomContractName();
      expect(AssertionHelpers.isValidContractName(contractName)).toBe(true);
    });
  });

  describe('AssertionHelpers', () => {
    it('should validate Stacks addresses correctly', () => {
      expect(AssertionHelpers.isValidAddress('SP2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB')).toBe(
        true,
      );
      expect(AssertionHelpers.isValidAddress('ST2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB')).toBe(
        true,
      );
      expect(AssertionHelpers.isValidAddress('INVALID')).toBe(false);
    });

    it('should compare addresses case-insensitively', () => {
      const addr1 = 'SP2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB';
      const addr2 = 'sp2vctz8vtjjcx4k5y84c4y1j2q6bgycvx5kqajnb';
      expect(AssertionHelpers.addressesEqual(addr1, addr2)).toBe(true);
    });

    it('should validate positive amounts', () => {
      expect(AssertionHelpers.isPositiveAmount(1000)).toBe(true);
      expect(AssertionHelpers.isPositiveAmount(0)).toBe(false);
      expect(AssertionHelpers.isPositiveAmount(-100)).toBe(false);
    });
  });

  describe('PerformanceTimer', () => {
    it('should measure elapsed time', () => {
      const timer = new PerformanceTimer();
      timer.start();

      // Simulate some work
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }

      const elapsed = timer.end();
      expect(elapsed).toBeGreaterThan(0);
    });

    it('should track elapsed time while running', () => {
      const timer = new PerformanceTimer();
      timer.start();

      setTimeout(() => {
        const elapsed = timer.elapsed();
        expect(elapsed).toBeGreaterThanOrEqual(0);
      }, 10);
    });
  });

  describe('GasCostTracker', () => {
    let tracker: GasCostTracker;

    beforeEach(() => {
      tracker = new GasCostTracker();
    });

    it('should record and retrieve gas costs', () => {
      tracker.recordCost('mint', 150);
      tracker.recordCost('transfer', 100);

      expect(tracker.getCost('mint')).toBe(150);
      expect(tracker.getCost('transfer')).toBe(100);
    });

    it('should calculate total gas cost', () => {
      tracker.recordCost('mint', 150);
      tracker.recordCost('transfer', 100);
      tracker.recordCost('burn', 50);

      expect(tracker.getTotalCost()).toBe(300);
    });

    it('should reset costs', () => {
      tracker.recordCost('mint', 150);
      tracker.reset();

      expect(tracker.getCost('mint')).toBeUndefined();
      expect(tracker.getTotalCost()).toBe(0);
    });
  });

  describe('MockContractState', () => {
    let state: MockContractState;

    beforeEach(() => {
      state = new MockContractState();
    });

    it('should set and get state', () => {
      state.setState('owner', 'SP2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB');
      expect(state.getState('owner')).toBe('SP2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB');
    });

    it('should update state with a function', () => {
      state.setState('balance', 1000);
      state.updateState('balance', (val) => val + 500);

      expect(state.getState('balance')).toBe(1500);
    });

    it('should return all state', () => {
      state.setState('owner', 'SP123');
      state.setState('totalSupply', 1000000);

      const allState = state.getAllState();
      expect(allState.owner).toBe('SP123');
      expect(allState.totalSupply).toBe(1000000);
    });

    it('should reset all state', () => {
      state.setState('owner', 'SP123');
      state.setState('totalSupply', 1000000);
      state.reset();

      expect(state.getAllState()).toEqual({});
    });
  });
});

