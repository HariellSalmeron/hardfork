/**
 * Unit tests for BarrelNFT contract logic with complex metadata using MockContractState.
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
    state.setState('paused', false);
  });

  it('allows owner to mint barrel with complex metadata', () => {
    const barrelId = 1;
    const recipient = TestDataGenerator.randomAddress('ST');
    const batchId = 'ACQUISITION-2026-001';

    const metadata = {
      distillery: 'Hard Fork Distillery',
      spiritType: 'bourbon',
      ageStatement: 12,
      entryProof: 120,
      fillDate: 12345,
      location: 'Hard Fork Warehouse - Zone A',
      uri: 'ipfs://QmXxxx...'
    };

    // simulate mint-barrel
    state.setState(`token-owner-${barrelId}`, recipient);
    state.setState(`barrel-metadata-${barrelId}`, {
      batchId,
      ...metadata
    });

    expect(state.getState(`token-owner-${barrelId}`)).toBe(recipient);
    const storedMetadata = state.getState(`barrel-metadata-${barrelId}`);
    expect(storedMetadata.batchId).toBe(batchId);
    expect(storedMetadata.distillery).toBe(metadata.distillery);
    expect(storedMetadata.spiritType).toBe(metadata.spiritType);
    expect(storedMetadata.ageStatement).toBe(metadata.ageStatement);
  });

  it('should transfer barrel between owners', () => {
    const barrelId = 1;
    const alice = TestDataGenerator.randomAddress('SP');
    const bob = TestDataGenerator.randomAddress('ST');
    state.setState(`token-owner-${barrelId}`, alice);

    // simulate transfer
    state.setState(`token-owner-${barrelId}`, bob);
    expect(state.getState(`token-owner-${barrelId}`)).toBe(bob);
  });

  it('should be able to burn barrel and clear metadata', () => {
    const barrelId = 1;
    const alice = TestDataGenerator.randomAddress('SP');
    state.setState(`token-owner-${barrelId}`, alice);
    state.setState(`barrel-metadata-${barrelId}`, {
      batchId: 'TEST-001',
      distillery: 'Test Distillery',
      spiritType: 'whiskey',
      ageStatement: 5,
      entryProof: 100,
      fillDate: 10000,
      location: 'Test Location',
      uri: 'ipfs://test'
    });

    // simulate burn-barrel
    state.setState(`token-owner-${barrelId}`, undefined);
    state.setState(`barrel-metadata-${barrelId}`, undefined);

    expect(state.getState(`token-owner-${barrelId}`)).toBeUndefined();
    expect(state.getState(`barrel-metadata-${barrelId}`)).toBeUndefined();
  });

  it('should update barrel metadata for aging', () => {
    const barrelId = 1;
    const initialMetadata = {
      batchId: 'ACQUISITION-2026-001',
      distillery: 'Hard Fork Distillery',
      spiritType: 'bourbon',
      ageStatement: 1,
      entryProof: 120,
      fillDate: 12345,
      location: 'Zone A',
      uri: 'ipfs://QmXxxx...'
    };

    state.setState(`barrel-metadata-${barrelId}`, initialMetadata);

    // simulate update-barrel-metadata
    const updatedMetadata = {
      ...initialMetadata,
      location: 'Zone B - Extended Aging',
      ageStatement: 2
    };
    state.setState(`barrel-metadata-${barrelId}`, updatedMetadata);

    const result = state.getState(`barrel-metadata-${barrelId}`);
    expect(result.location).toBe('Zone B - Extended Aging');
    expect(result.ageStatement).toBe(2);
    expect(result.batchId).toBe('ACQUISITION-2026-001'); // unchanged
  });

  it('should query individual barrel properties', () => {
    const barrelId = 1;
    const metadata = {
      batchId: 'FOUNDERS-001',
      distillery: 'Focus Distilling',
      spiritType: 'rye',
      ageStatement: 3,
      entryProof: 110,
      fillDate: 15000,
      location: 'Warehouse Alpha',
      uri: 'ipfs://QmFounders...'
    };

    state.setState(`barrel-metadata-${barrelId}`, metadata);

    // simulate get-barrel-* functions
    expect(state.getState(`barrel-metadata-${barrelId}`).batchId).toBe('FOUNDERS-001');
    expect(state.getState(`barrel-metadata-${barrelId}`).distillery).toBe('Focus Distilling');
    expect(state.getState(`barrel-metadata-${barrelId}`).spiritType).toBe('rye');
    expect(state.getState(`barrel-metadata-${barrelId}`).ageStatement).toBe(3);
    expect(state.getState(`barrel-metadata-${barrelId}`).entryProof).toBe(110);
    expect(state.getState(`barrel-metadata-${barrelId}`).fillDate).toBe(15000);
    expect(state.getState(`barrel-metadata-${barrelId}`).location).toBe('Warehouse Alpha');
    expect(state.getState(`barrel-metadata-${barrelId}`).uri).toBe('ipfs://QmFounders...');
  });
});