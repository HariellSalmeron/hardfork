# Testing Framework Setup & Guide

## Overview

The hardFork project uses **Vitest** as the primary testing framework, with support for:
- **Unit Tests**: Testing utility functions and helpers
- **Contract Tests**: Testing Clarity smart contracts (using Clarinet SDK)
- **Integration Tests**: Testing complex workflows and contract interactions

## Setup Complete ✓

The testing infrastructure includes:

### Installed Dependencies
- `vitest@^3.2.4` - Test runner
- `vitest-environment-clarinet@^2.3.0` - Clarinet testing environment
- `@hirosystems/clarinet-sdk@^3.6.0` - Clarinet SDK for contract testing
- `typescript@^5.9.3` - TypeScript support

### Directory Structure
```
tests/
├── placeholder.test.ts           # Framework verification
├── unit/
│   └── utilities.test.ts         # Utility function tests
├── contracts/
│   └── contract.test.ts          # Contract tests (BarrelNFT, Token)
├── integration/
│   └── workflows.test.ts         # Integration & workflow tests
└── utils/
    └── test-helpers.ts           # Testing utilities & helpers
```

### Configuration Files
- **vitest.config.js** - Vitest configuration with coverage settings
- **package.json** - Test scripts defined

## Running Tests

### Run all tests
```bash
npm test
```
This runs `npm run check` (Clarinet check) followed by unit tests.

### Run unit tests only
```bash
npm run test:unit
```

### Run tests with coverage report
```bash
npm run test:report
```
Generates coverage reports in: `text`, `json`, `html`, `lcov` formats

### Watch mode (auto-run on file changes)
```bash
npm run test:watch
```
Watches both test files and contract files for changes.

## Test Helpers & Utilities

The `tests/utils/test-helpers.ts` file provides:

### MockTransactionBuilder
```typescript
const tx = new MockTransactionBuilder()
  .withSender('SP2VCTZ8VTJJCX4K5Y84C4Y1J2Q6BGYCVX5KQAJNB')
  .withFunction('barrel-nft', 'mint')
  .withArgs(['ipfs://QmXxx', 'NFT Metadata'])
  .build();
```

### TestDataGenerator
```typescript
// Generate random data for tests
const address = TestDataGenerator.randomAddress('SP');
const amount = TestDataGenerator.randomAmount(1000, 10000);
const tokenId = TestDataGenerator.randomTokenId();
const contractName = TestDataGenerator.randomContractName();
```

### AssertionHelpers
```typescript
// Validate data
AssertionHelpers.isValidAddress(address);
AssertionHelpers.isValidContractName(name);
AssertionHelpers.isPositiveAmount(amount);
AssertionHelpers.addressesEqual(addr1, addr2);
```

### PerformanceTimer
```typescript
const timer = new PerformanceTimer();
timer.start();
// ... code to measure ...
const elapsed = timer.end(); // Returns elapsed time in ms
```

### GasCostTracker
```typescript
const tracker = new GasCostTracker();
tracker.recordCost('mint', 150);
tracker.recordCost('transfer', 100);
const total = tracker.getTotalCost(); // 250
```

### MockContractState
```typescript
const state = new MockContractState();
state.setState('owner', 'SP123');
state.updateState('balance', (val) => val + 100);
state.getAllState(); // Returns all state as object
state.reset(); // Clear all state
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { TestDataGenerator } from '../utils/test-helpers';

describe('My Utility', () => {
  it('should do something', () => {
    const address = TestDataGenerator.randomAddress('SP');
    expect(address).toBeDefined();
  });
});
```

### Contract Test Example (with state mock)
```typescript
describe('NFT Contract', () => {
  let contractState: MockContractState;

  beforeEach(() => {
    contractState = new MockContractState();
    contractState.setState('nft-count', 0n);
  });

  it('should mint NFT', () => {
    contractState.updateState('nft-count', (count) => count + 1n);
    expect(contractState.getState('nft-count')).toBe(1n);
  });
});
```

### Integration Test Example
```typescript
describe('NFT Marketplace', () => {
  it('should complete purchase workflow', () => {
    // Setup
    const seller = TestDataGenerator.randomAddress('SP');
    const buyer = TestDataGenerator.randomAddress('ST');
    
    // Execute
    // ... perform operations ...
    
    // Assert
    expect(finalState).toBe(expectedState);
  });
});
```

## Test File Naming Conventions

- **Test files**: `*.test.ts` or `*.spec.ts`
- **Utilities**: Imported from `tests/utils/`
- **Organization**:
  - `tests/unit/` - Unit tests for utility functions
  - `tests/contracts/` - Smart contract tests
  - `tests/integration/` - Integration & workflow tests

## Enabling Clarinet Environment Tests

When ready to test actual Clarity contracts:

1. Uncomment in `vitest.config.js`:
```javascript
// Change from 'node' to:
environment: 'clarinet',
```

2. Deploy contracts to Devnet:
```bash
npm run integrate
```

3. Write tests using Clarinet SDK:
```typescript
import { Clarinet } from '@hirosystems/clarinet-sdk';

describe('Clarity Contract', () => {
  it('should execute contract function', async () => {
    // Use Clarinet to test actual contract
  });
});
```

## Coverage Goals

The project aims for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check coverage reports after running:
```bash
npm run test:report
```

## Best Practices

1. **Arrange-Act-Assert Pattern**
   ```typescript
   // Arrange - Setup
   const state = new MockContractState();
   
   // Act - Execute
   state.setState('value', 100);
   
   // Assert - Verify
   expect(state.getState('value')).toBe(100);
   ```

2. **Use beforeEach for Setup**
   ```typescript
   beforeEach(() => {
     // Initialize test state before each test
   });
   ```

3. **Test Edge Cases**
   - Empty/null values
   - Invalid inputs
   - Boundary conditions
   - Concurrent operations

4. **Keep Tests Focused**
   - One assertion per test (or related assertions)
   - Clear, descriptive test names
   - Independent tests (no test interdependencies)

5. **Use Helpers**
   - Leverage `TestDataGenerator` for realistic test data
   - Use `MockContractState` to simulate contract state
   - Use `GasCostTracker` for gas cost analysis

## Next Steps

As contracts are developed:
1. Create contract tests in `tests/contracts/`
2. Add integration tests in `tests/integration/`
3. Run coverage reports: `npm run test:report`
4. Update this guide with specific contract testing examples
5. Enable Clarinet environment when contracts are deployed

## Troubleshooting

### Tests not running
```bash
npm install  # Reinstall dependencies
npm test     # Run tests
```

### Import errors in tests
- Ensure test files are in `tests/` directory
- Check file extensions are `.ts` for TypeScript
- Import helpers from `../utils/test-helpers`

### Coverage not generating
```bash
npm run test:report
# Check coverage/ directory for HTML report
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Clarinet SDK Documentation](https://github.com/hirosystems/clarinet/tree/develop/components/clarinet-sdk)
- [Stacks Testing Best Practices](https://docs.stacks.co/smart-contracts/testing)
