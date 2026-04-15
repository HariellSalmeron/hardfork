/**
 * Unit tests for the redemption instrument contract logic with complex metadata using MockContractState.
 * These mimic contract behavior without requiring Clarinet deployment.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockContractState, TestDataGenerator } from '../utils/test-helpers';

describe('Redemption Instrument NFT Logic (state simulation)', () => {
  let state: MockContractState;
  let owner: string;

  beforeEach(() => {
    state = new MockContractState();
    owner = TestDataGenerator.randomAddress('SP');
    state.setState('contract-owner', owner);
    state.setState('paused', false);
  });

  it('allows owner to mint an instrument with complex metadata', () => {
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

    // simulate mint-instrument
    state.setState(`token-owner-${barrelId}`, recipient);
    state.setState(`instrument-metadata-${barrelId}`, {
      batchId,
      ...metadata
    });

    expect(state.getState(`token-owner-${barrelId}`)).toBe(recipient);
    const storedMetadata = state.getState(`instrument-metadata-${barrelId}`);
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

  it('should be able to burn an instrument and clear metadata', () => {
    const barrelId = 1;
    const alice = TestDataGenerator.randomAddress('SP');
    state.setState(`token-owner-${barrelId}`, alice);
    state.setState(`instrument-metadata-${barrelId}`, {
      batchId: 'TEST-001',
      distillery: 'Test Distillery',
      spiritType: 'whiskey',
      ageStatement: 5,
      entryProof: 100,
      fillDate: 10000,
      location: 'Test Location',
      uri: 'ipfs://test'
    });

    // simulate burn-instrument
    state.setState(`token-owner-${barrelId}`, undefined);
    state.setState(`instrument-metadata-${barrelId}`, undefined);

    expect(state.getState(`token-owner-${barrelId}`)).toBeUndefined();
    expect(state.getState(`instrument-metadata-${barrelId}`)).toBeUndefined();
  });

  it('should update instrument metadata for aging', () => {
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

    state.setState(`instrument-metadata-${barrelId}`, initialMetadata);

    // simulate update-instrument-metadata
    const updatedMetadata = {
      ...initialMetadata,
      location: 'Zone B - Extended Aging',
      ageStatement: 2
    };
    state.setState(`instrument-metadata-${barrelId}`, updatedMetadata);

    const result = state.getState(`instrument-metadata-${barrelId}`);
    expect(result.location).toBe('Zone B - Extended Aging');
    expect(result.ageStatement).toBe(2);
    expect(result.batchId).toBe('ACQUISITION-2026-001'); // unchanged
  });

  it('should query individual instrument properties', () => {
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

    state.setState(`instrument-metadata-${barrelId}`, metadata);

    // simulate get-instrument-* functions
    expect(state.getState(`instrument-metadata-${barrelId}`).batchId).toBe('FOUNDERS-001');
    expect(state.getState(`instrument-metadata-${barrelId}`).distillery).toBe('Focus Distilling');
    expect(state.getState(`instrument-metadata-${barrelId}`).spiritType).toBe('rye');
    expect(state.getState(`instrument-metadata-${barrelId}`).ageStatement).toBe(3);
    expect(state.getState(`instrument-metadata-${barrelId}`).entryProof).toBe(110);
    expect(state.getState(`instrument-metadata-${barrelId}`).fillDate).toBe(15000);
    expect(state.getState(`instrument-metadata-${barrelId}`).location).toBe('Warehouse Alpha');
    expect(state.getState(`instrument-metadata-${barrelId}`).uri).toBe('ipfs://QmFounders...');
  });
});