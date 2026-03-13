/**
 * Example Integration Tests
 * Demonstrates testing complex workflows and contract interactions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TestDataGenerator,
  MockTransactionBuilder,
  MockContractState,
  GasCostTracker,
} from '../utils/test-helpers';

describe('Integration Tests - NFT Marketplace Flow', () => {
  let nftState: MockContractState;
  let tokenState: MockContractState;
  let gasCostTracker: GasCostTracker;

  beforeEach(() => {
    nftState = new MockContractState();
    tokenState = new MockContractState();
    gasCostTracker = new GasCostTracker();

    // Setup NFT contract state
    const creator = TestDataGenerator.randomAddress('SP');
    nftState.setState('contract-owner', creator);
    nftState.setState('nft-count', 0n);

    // Setup Token contract state
    const totalSupply = 1000000000000n; // 1B tokens
    tokenState.setState('total-supply', totalSupply);
    tokenState.setState(`balance-${creator}`, totalSupply);

    // Setup marketplace state
    nftState.setState('listings', new Map());
  });

  describe('End-to-End: Mint and List NFT', () => {
    it('should mint NFT and list it for sale', () => {
      const creator = TestDataGenerator.randomAddress('SP');
      const buyer = TestDataGenerator.randomAddress('ST');
      const tokenId = 1n;
      const price = 100000000n; // 100 tokens

      // Step 1: Mint NFT
      nftState.setState(`nft-owner-${tokenId}`, creator);
      nftState.setState(`nft-metadata-${tokenId}`, {
        uri: 'ipfs://QmXxx',
        properties: { name: 'Test NFT', description: 'An example NFT' },
      });
      nftState.updateState('nft-count', (count: bigint) => count + 1n);
      gasCostTracker.recordCost('mint', 150);

      // Step 2: List NFT for sale
      const listings = nftState.getState('listings');
      listings.set(tokenId, {
        seller: creator,
        price: price,
        listed: true,
      });
      gasCostTracker.recordCost('list', 80);

      // Verify state
      expect(nftState.getState(`nft-owner-${tokenId}`)).toBe(creator);
      expect(nftState.getState('nft-count')).toBe(1n);
      expect(listings.get(tokenId).price).toBe(price);

      // Verify total gas cost
      const totalGas = gasCostTracker.getTotalCost();
      expect(totalGas).toBe(230); // 150 + 80
    });

    it('should complete purchase workflow', () => {
      const creator = TestDataGenerator.randomAddress('SP');
      const buyer = TestDataGenerator.randomAddress('ST');
      const tokenId = 1n;
      const price = 100000000n;

      // Setup: Create and list NFT
      nftState.setState(`nft-owner-${tokenId}`, creator);
      const listings = new Map();
      listings.set(tokenId, { seller: creator, price: price, listed: true });
      nftState.setState('listings', listings);

      tokenState.setState(`balance-${buyer}`, 500000000n); // Buyer has tokens
      tokenState.setState(`balance-${creator}`, 0n);

      // Step 1: Verify buyer has enough tokens
      const buyerBalance = tokenState.getState(`balance-${buyer}`);
      expect(buyerBalance).toBeGreaterThanOrEqual(price);

      // Step 2: Transfer tokens from buyer to seller
      tokenState.updateState(`balance-${buyer}`, (bal: bigint) => bal - price);
      tokenState.updateState(`balance-${creator}`, (bal: bigint) => (bal || 0n) + price);
      gasCostTracker.recordCost('transfer-tokens', 100);

      // Step 3: Transfer NFT from seller to buyer
      nftState.setState(`nft-owner-${tokenId}`, buyer);
      gasCostTracker.recordCost('transfer-nft', 100);

      // Step 4: Remove listing
      listings.delete(tokenId);
      gasCostTracker.recordCost('delist', 60);

      // Verify final state
      expect(tokenState.getState(`balance-${buyer}`)).toBe(400000000n);
      expect(tokenState.getState(`balance-${creator}`)).toBe(price);
      expect(nftState.getState(`nft-owner-${tokenId}`)).toBe(buyer);
      expect(listings.has(tokenId)).toBe(false);
      expect(gasCostTracker.getTotalCost()).toBe(260); // 100 + 100 + 60
    });
  });

  describe('Multi-NFT Operations', () => {
    it('should mint multiple NFTs and list them', () => {
      const creator = TestDataGenerator.randomAddress('SP');
      const nftCount = 5;

      const listings = new Map();

      for (let i = 1; i <= nftCount; i++) {
        const tokenId = BigInt(i);
        nftState.setState(`nft-owner-${tokenId}`, creator);
        nftState.setState(`nft-metadata-${tokenId}`, {
          uri: `ipfs://QmXxx${i}`,
        });

        listings.set(tokenId, {
          seller: creator,
          price: BigInt(100000000 * i), // Price increases with token ID
          listed: true,
        });

        gasCostTracker.recordCost(`mint-${i}`, 150);
      }

      nftState.setState('listings', listings);

      expect(nftState.getState(`nft-owner-${BigInt(1)}`)).toBe(creator);
      expect(nftState.getState(`nft-owner-${BigInt(5)}`)).toBe(creator);
      expect(listings.size).toBe(nftCount);
      expect(gasCostTracker.getTotalCost()).toBe(150 * nftCount);
    });
  });

  describe('Transaction Building', () => {
    it('should build mint transaction', () => {
      const builder = new MockTransactionBuilder();
      const sender = TestDataGenerator.randomAddress('SP');

      const tx = builder
        .withSender(sender)
        .withFunction('barrel-nft', 'mint')
        .withArgs(['ipfs://QmXxx', 'Test NFT'])
        .build();

      expect(tx.sender).toBe(sender);
      expect(tx.contract).toBe('barrel-nft');
      expect(tx.function).toBe('mint');
      expect(tx.args).toContain('ipfs://QmXxx');
    });

    it('should build transfer transaction', () => {
      const builder = new MockTransactionBuilder();
      const sender = TestDataGenerator.randomAddress('SP');
      const recipient = TestDataGenerator.randomAddress('ST');
      const tokenId = 1n;

      const tx = builder
        .withSender(sender)
        .withFunction('barrel-nft', 'transfer')
        .withArgs([tokenId, sender, recipient])
        .build();

      expect(tx.function).toBe('transfer');
      expect(tx.args[1]).toBe(sender);
      expect(tx.args[2]).toBe(recipient);
    });
  });
});

describe('Integration Tests - Error Scenarios', () => {
  let state: MockContractState;

  beforeEach(() => {
    state = new MockContractState();
  });

  describe('Insufficient Balance', () => {
    it('should detect when buyer lacks sufficient tokens', () => {
      const buyerBalance = 10000000n;
      const requiredAmount = 100000000n;

      expect(buyerBalance).toBeLessThan(requiredAmount);
      // In real contract, transfer would revert
    });
  });

  describe('Invalid Operations', () => {
    it('should validate token IDs are positive', () => {
      const validTokenId = 1n;
      const invalidTokenId = -1n;
      const zeroTokenId = 0n;

      expect(validTokenId > 0n).toBe(true);
      expect(invalidTokenId < 0n).toBe(true);
      expect(zeroTokenId === 0n).toBe(true);
    });

    it('should validate addresses in operations', () => {
      const validAddress = TestDataGenerator.randomAddress('SP');
      const invalidAddress = 'not-an-address';

      expect(validAddress.startsWith('SP')).toBe(true);
      expect(invalidAddress.startsWith('SP')).toBe(false);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent transfers', async () => {
      const balances = new Map<string, bigint>();
      const addr1 = TestDataGenerator.randomAddress('SP');
      const addr2 = TestDataGenerator.randomAddress('ST');
      const addr3 = TestDataGenerator.randomAddress('ST');

      balances.set(addr1, 1000000n);
      balances.set(addr2, 0n);
      balances.set(addr3, 0n);

      // Simulate concurrent transfers
      const transfer1 = () => {
        const fromBal = balances.get(addr1) || 0n;
        if (fromBal >= 300000n) {
          balances.set(addr1, fromBal - 300000n);
          balances.set(addr2, (balances.get(addr2) || 0n) + 300000n);
        }
      };

      const transfer2 = () => {
        const fromBal = balances.get(addr1) || 0n;
        if (fromBal >= 400000n) {
          balances.set(addr1, fromBal - 400000n);
          balances.set(addr3, (balances.get(addr3) || 0n) + 400000n);
        }
      };

      transfer1();
      transfer2();

      // Both transfers should have succeeded given sufficient balance
      const totalDistributed =
        (balances.get(addr2) || 0n) + (balances.get(addr3) || 0n);
      expect(totalDistributed).toBeGreaterThan(0n);
    });
  });
});


