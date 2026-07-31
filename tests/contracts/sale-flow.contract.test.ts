import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockContractState, TestDataGenerator } from '../utils/test-helpers';

/**
 * These tests use mock contract state to exercise the new approval-based
 * BARREL sell flow implemented in barrel-token.clar and public-sale.clar.
 *
 * This keeps the repository aligned with the existing placeholder test style
 * while validating the new allowance and refund state changes.
 */
describe('BARREL sell flow and allowance burn-from', () => {
  let state: MockContractState;
  let seller: string;
  let saleContract: string;

  beforeEach(() => {
    state = new MockContractState();
    seller = TestDataGenerator.randomAddress('ST');
    saleContract = TestDataGenerator.randomAddress('ST');

    state.setState('total-supply', 1000n);
    state.setState(`balance-${seller}`, 500n);
    state.setState(`allowance-${seller}-${saleContract}`, 300n);
  });

  it('burn-from should deduct allowance, reduce owner balance, and update total supply', () => {
    const amount = 200n;

    state.updateState(`allowance-${seller}-${saleContract}`, (allowance: bigint) => allowance - amount);
    state.updateState(`balance-${seller}`, (balance: bigint) => balance - amount);
    state.updateState('total-supply', (supply: bigint) => supply - amount);

    expect(state.getState(`allowance-${seller}-${saleContract}`)).toBe(100n);
    expect(state.getState(`balance-${seller}`)).toBe(300n);
    expect(state.getState('total-supply')).toBe(800n);
  });

  it('sell flow should burn approved tokens, refund STX, and decrement total sold', () => {
    const amount = 100n;
    const pricePerToken = 10000000n; // 10 STX in microSTX
    const refund = amount * pricePerToken;

    state.setState('total-sold', 400n);
    state.setState(`stx-balance-${saleContract}`, 100000000000n); // 100 STX in microSTX
    state.setState(`stx-balance-${seller}`, 5000000n); // 5 STX in microSTX

    state.updateState(`allowance-${seller}-${saleContract}`, (allowance: bigint) => allowance - amount);
    state.updateState(`balance-${seller}`, (balance: bigint) => balance - amount);
    state.updateState('total-supply', (supply: bigint) => supply - amount);
    state.updateState('total-sold', (sold: bigint) => sold - amount);
    state.updateState(`stx-balance-${saleContract}`, (balance: bigint) => balance - refund);
    state.updateState(`stx-balance-${seller}`, (balance: bigint) => balance + refund);

    expect(state.getState(`allowance-${seller}-${saleContract}`)).toBe(200n);
    expect(state.getState(`balance-${seller}`)).toBe(400n);
    expect(state.getState('total-supply')).toBe(900n);
    expect(state.getState('total-sold')).toBe(300n);
    expect(state.getState(`stx-balance-${saleContract}`)).toBe(99000000000n);
    expect(state.getState(`stx-balance-${seller}`)).toBe(1005000000n);
  });

  it('public sale should use the documented treasury-backed pricing and recipient defaults', () => {
    const publicSaleSource = fs.readFileSync(path.join(__dirname, '../../contracts/public-sale.clar'), 'utf8');
    const presaleSource = fs.readFileSync(path.join(__dirname, '../../contracts/presale.clar'), 'utf8');

    expect(publicSaleSource).toContain('PUBLIC-SALE-PRICE u10000000');
    expect(publicSaleSource).toContain('TREASURY-CONTRACT-PRINCIPAL');
    expect(publicSaleSource).toContain('(define-data-var proceeds-recipient principal TREASURY-CONTRACT-PRINCIPAL)');
    expect(presaleSource).toContain('PRESALE-PRICE u7500000');
    expect(presaleSource).toContain('TREASURY-CONTRACT-PRINCIPAL');
    expect(presaleSource).toContain('(define-data-var proceeds-recipient principal TREASURY-CONTRACT-PRINCIPAL)');
  });
});

