/**
 * Test Helpers and Utilities for hardFork Testing Framework
 * Provides common utilities for unit tests, contract tests, and integration tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * Mock Stacks Transaction Builder Helper
 * Use this to create mock transactions for testing
 */
export class MockTransactionBuilder {
  private txData: Record<string, any> = {};

  withSender(address: string): this {
    this.txData.sender = address;
    return this;
  }

  withFunction(contractName: string, functionName: string): this {
    this.txData.contract = contractName;
    this.txData.function = functionName;
    return this;
  }

  withArgs(args: any[]): this {
    this.txData.args = args;
    return this;
  }

  build() {
    return this.txData;
  }
}

/**
 * Test Data Generator for Common Stacks Types
 */
export const TestDataGenerator = {
  /**
   * Generate a random Stacks address
   */
  randomAddress: (version: string = 'SP'): string => {
    const randomHex = Math.random().toString(16).substring(2, 34).padEnd(32, '0');
    return `${version}${randomHex.toUpperCase()}`;
  },

  /**
   * Generate random token amount (in satoshis)
   */
  randomAmount: (min = 1000, max = 1000000): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Generate random NFT token ID
   */
  randomTokenId: (): bigint => {
    return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  },

  /**
   * Generate a sample contract name
   */
  randomContractName: (): string => {
    const adjectives = ['test', 'sample', 'mock', 'demo'];
    const nouns = ['contract', 'token', 'nft', 'vault'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}-${noun}`;
  },
};

/**
 * Assertion Helpers
 */
export const AssertionHelpers = {
  /**
   * Assert that a value is a valid Stacks address
   */
  isValidAddress: (address: string): boolean => {
    return /^(SP|ST)[0-9A-Z]{30,}$/.test(address);
  },

  /**
   * Assert that a value is a valid contract name
   */
  isValidContractName: (name: string): boolean => {
    return /^[a-z0-9-]{1,40}$/.test(name);
  },

  /**
   * Assert that a BigInt amount is positive
   */
  isPositiveAmount: (amount: bigint | number): boolean => {
    return amount > 0;
  },

  /**
   * Assert that two addresses are equivalent
   */
  addressesEqual: (addr1: string, addr2: string): boolean => {
    return addr1.toUpperCase() === addr2.toUpperCase();
  },
};

/**
 * Performance Testing Utilities
 */
export class PerformanceTimer {
  private startTime: number = 0;

  start(): void {
    this.startTime = performance.now();
  }

  end(): number {
    return performance.now() - this.startTime;
  }

  elapsed(): number {
    return performance.now() - this.startTime;
  }
}

/**
 * Gas Cost Estimator (mock)
 * Use to track and assert gas costs in tests
 */
export class GasCostTracker {
  private costs: Map<string, number> = new Map();

  recordCost(operation: string, gasCost: number): void {
    this.costs.set(operation, gasCost);
  }

  getCost(operation: string): number | undefined {
    return this.costs.get(operation);
  }

  getTotalCost(): number {
    return Array.from(this.costs.values()).reduce((sum, cost) => sum + cost, 0);
  }

  reset(): void {
    this.costs.clear();
  }
}

/**
 * Mock Contract State Manager
 * Simulate contract state changes for testing
 */
export class MockContractState {
  private state: Map<string, any> = new Map();

  setState(key: string, value: any): void {
    this.state.set(key, value);
  }

  getState(key: string): any {
    return this.state.get(key);
  }

  updateState(key: string, updater: (value: any) => any): void {
    const currentValue = this.state.get(key);
    this.state.set(key, updater(currentValue));
  }

  getAllState(): Record<string, any> {
    return Object.fromEntries(this.state);
  }

  reset(): void {
    this.state.clear();
  }
}
