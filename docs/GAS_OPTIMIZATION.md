# Gas Optimization Strategies for Stacks Clarity

## Overview

Gas optimization in Stacks is critical for reducing transaction costs and improving contract efficiency. This guide documents research and strategies specific to Stacks' Clarity language and cost model.

---

## 1. Understanding Stacks Gas Model

### Key Differences from Ethereum

**Stacks uses "Proof of Transfer" (PoX)**:
- Gas costs are different from Ethereum
- Measured in "execution weight" not EVM gas
- Lower overall transaction costs
- Calculated based on operations, data storage, and memory usage

**Cost Factors**:
- **Bytecode execution**: Fixed cost per operation
- **Memory access**: Cost per byte read/written
- **Storage operations**: Most expensive (map reads/writes)
- **Network propagation**: Included in total cost

### Typical Gas Ranges (Estimated for BarrelNFT)

| Operation | Estimated Cost | Notes |
|-----------|----------------|-------|
| Basic transfer | 500-1000 | Simple token/NFT transfer |
| Map write (first time) | 2000-3000 | Creating new map entry |
| Map update | 1000-2000 | Updating existing entry |
| Batch mint (10 items) | 8000-12000 | Multiple writes |
| Contract call | 500-1500 | Function invocation |
| Storage read | 500-1000 | Map lookup |

---

## 2. Clarity-Specific Optimization Techniques

### 2.1 Variable & Type Optimization

**Avoid Large Types When Possible**
```clarity
;; ❌ Inefficient: Using large tuple for simple value
(define-map user-balances principal (tuple (balance uint) (name (string-ascii 50))))

;; ✅ Efficient: Separate simple state, optional metadata
(define-map user-balances principal uint)
(define-map user-metadata principal (tuple (name (string-ascii 50))))
```

**Use Smaller Integer Types When Appropriate**
```clarity
;; ❌ Inefficient: Always uint256-scale
(define-map counters principal uint)  ;; For small numbers

;; ✅ Efficient: Use appropriate size
;; Note: Clarity doesn't have sized ints, but minimize data
(define-map counters-v2 principal uint)  ;; Same cost, but document the range
```

**String Optimization**
```clarity
;; ❌ Inefficient: Large string buffers
(define-map metadata principal (string-utf8 500))

;; ✅ Efficient: Only store what you need
(define-map metadata principal (string-utf8 128))
```

### 2.2 Storage Access Optimization

**Batch Operations Reduce Calls**
```clarity
;; ❌ Inefficient: 3 separate map operations
(define-public (mint-barrel (owner principal))
  (let ((id1 (var-get next-token-id))
        (id2 (+ id1 u1))
        (id3 (+ id2 u1)))
    (map:insert barrels id1 {owner: owner, uri: "uri1"})  ;; Cost: 2000
    (map:insert barrels id2 {owner: owner, uri: "uri2"})  ;; Cost: 2000
    (map:insert barrels id3 {owner: owner, uri: "uri3"})  ;; Cost: 2000
    (var-set next-token-id (+ id3 u1))))                  ;; Total: ~6000+

;; ✅ Efficient: Batch helper reducing overhead
(define-public (batch-mint-barrels (owners (list 100 principal)))
  ;; Single transaction, multiple operations
  ;; Amortizes setup costs
)
```

**Use `map?` for Exists Check Before Update**
```clarity
;; ❌ Inefficient: Always writes
(define-public (update-data (key principal) (value uint))
  (map-set data key value))  ;; Always costs same as update even if new

;; ✅ Efficient: Check before writing
(define-public (update-data-safe (key principal) (value uint))
  (let ((exists (map-get? data key)))
    (match exists
      some (map-set data key value)  ;; Update existing
      none (map-set data key value))))  ;; Could log this differently
```

### 2.3 Function Call Optimization

**Minimize Contract Calls**
```clarity
;; ❌ Inefficient: Multiple cross-contract calls
(define-public (buy-tokens (amount uint))
  (let ((price (contract-call? .price-contract get-price)))
    (let ((total (contract-call? .math-contract multiply price amount)))
      (contract-call? .token-contract transfer-tokens total))))

;; ✅ Efficient: Reduce external calls
(define-public (buy-tokens-v2 (amount uint))
  (let ((total (* PRICE amount)))  ;; Use constants when possible
    (contract-call? .token-contract transfer-tokens total)))
```

**Reuse Values Instead of Re-calling**
```clarity
;; ❌ Inefficient: Multiple reads of same data
(define-public (process-transfer (from principal) (to principal) (amount uint))
  (let ((balance1 (map-get? balances from))
        (totalSupply1 (var-get total-supply))
        (balance2 (map-get? balances from))  ;; Redundant!
        (totalSupply2 (var-get total-supply)))
    (ok true)))

;; ✅ Efficient: Read once, use multiple times
(define-public (process-transfer-v2 (from principal) (to principal) (amount uint))
  (let ((balance (map-get? balances from))
        (supply (var-get total-supply)))
    ;; Use balance and supply as needed
    (ok true)))
```

### 2.4 Logic Optimization

**Use Short-Circuit Evaluation**
```clarity
;; ❌ Inefficient: Evaluates both conditions always
(define-public (execute (id uint) (sender principal))
  (and (is-some (map-get? listings id))
       (is-equal sender (get-owner id))))

;; ✅ Efficient: Stop early if first check fails
(define-public (execute-v2 (id uint) (sender principal))
  (match (map-get? listings id)
    some (is-equal sender (get-owner id))
    none false))
```

**Avoid Unnecessary Data Transformations**
```clarity
;; ❌ Inefficient: Creating intermediate tuple
(define-public (create-barrel (uri (string-utf8 100)))
  (let ((barrel {id: (var-get next-id), uri: uri, owner: tx-sender}))
    (map-set barrels (var-get next-id) barrel)))

;; ✅ Efficient: Direct structure
(define-public (create-barrel-v2 (uri (string-utf8 100)))
  (map-set barrels (var-get next-id) {uri: uri, owner: tx-sender}))
```

---

## 3. Contract Architecture Optimization

### 3.1 Data Structure Design

**Flatten Hierarchies**
```clarity
;; ❌ Inefficient: Nested lookups
(define-map accounts principal (tuple (profile (tuple (name (string-utf8 50))
                                                       (bio (string-utf8 200))
                                                       (verified bool)))))

;; ✅ Efficient: Flat structure
(define-map account-names principal (string-utf8 50))
(define-map account-bios principal (string-utf8 200))
(define-map account-verified principal bool)
```

**Use Composite Keys for Relationships**
```clarity
;; ❌ Inefficient: Separate maps, complex joins
(define-map user-nfts principal (list 1000 uint))
(define-map nft-metadata uint (tuple (owner principal) (uri (string-utf8 100))))

;; ✅ Efficient: Directional lookups
(define-map nft-owner uint principal)           ;; nft-id -> owner
(define-map nft-metadata uint (string-utf8 100)) ;; nft-id -> uri
(define-map owner-nfts (tuple (owner principal) (nft-id uint)) bool)
```

### 3.2 Clarity-Specific Patterns

**Pre-compute Where Possible**
```clarity
;; ❌ Inefficient: Compute total on every read
(define-read-only (get-total-supply)
  (fold + (map get-balance (get-all-holders))))

;; ✅ Efficient: Store computed value
(define-data-var total-supply uint u0)

(define-public (mint (to principal) (amount uint))
  (begin
    (map-set balances to (+ (get-balance to) amount))
    (var-set total-supply (+ (var-get total-supply) amount))))
```

**Use Constants for Magic Numbers**
```clarity
;; ✅ Best Practice
(define-constant MAX-WHITELIST-SIZE u1000)
(define-constant BARREL-PRICE u500000000)  ;; 5 STX in microSTX
(define-constant DECIMALS u6)

(define-read-only (get-price) BARREL-PRICE)
```

**Memoization for Expensive Computations**
```clarity
;; ✅ Cache expensive calculations
(define-data-var discounted-price-cache uint u0)
(define-data-var price-cache-block uint u0)

(define-read-only (get-discounted-price)
  (let ((current-block block-height))
    (if (is-eq (var-get price-cache-block) current-block)
      (var-get discounted-price-cache)
      (let ((price (expensive-calculation)))
        (begin
          (var-set discounted-price-cache price)
          (var-set price-cache-block current-block)
          price)))))
```

---

## 4. BarrelNFT-Specific Optimizations

### For BarrelNFT Contract

**Batch Minting**
```clarity
;; Goal: Batch mint <10K gas per barrel

;; Key: Single transaction multiple writes
(define-public (batch-mint-barrels (uris (list 100 (string-utf8 100))))
  (let ((start-id (var-get next-token-id)))
    (fold batch-mint-helper
          uris
          {index: u0, start-id: start-id})))

;; Result: ~10 barrels in ~80-100K total gas
;; = ~8-10K per barrel (amortized setup costs)
```

**Efficient Transfers**
```clarity
;; Goal: Token transfer <3K gas
;; Key: Direct map operations, minimal validation

(define-public (transfer (token-id uint) (sender principal) (receiver principal))
  (let ((owner (unwrap! (map-get? nft-owner token-id) (err ERR-NOT-FOUND))))
    (if (is-eq owner sender)
      (begin
        (map-set nft-owner token-id receiver)
        (ok true))
      (err ERR-UNAUTHORIZED))))

;; Reduces to: 1 map read (~500) + 1 map write (~500) + checks (~500) = ~1500
```

**PreSale Purchase Optimization**
```clarity
;; Goal: Presale purchase <5K gas per transaction
;; Key: Batch all checks, single storage write

(define-public (presale-buy (token-amount uint) (proof (list 200 (buff 32))))
  (let (
    (buyer tx-sender)
    (price (var-get presale-price))
    (total (* token-amount price)))
    (asserts! (is-whitelisted buyer proof) (err ERR-NOT-WHITELISTED))
    (asserts! (>= total (stx-get-balance)) (err ERR-INSUFFICIENT-FUNDS))
    (asserts! (< (get-purchased buyer) PRESALE-LIMIT) (err ERR-LIMIT-EXCEEDED))
    (begin
      (map-set presale-purchases buyer (+ (get-purchased buyer) token-amount))
      (ok total))))
```

**Treasury Withdrawal Optimization**
```clarity
;; Goal: Treasury withdrawal <8K gas per approval
;; Key: Minimal re-validation on withdrawal

(define-data-var withdrawal-nonce uint u0)
(define-map pending-withdrawals uint (tuple
  (requester principal)
  (amount uint)
  (timestamp uint)
  (approvals (list 10 principal))))

(define-public (approve-withdrawal (request-id uint) (approver principal))
  (let ((request (unwrap! (map-get? pending-withdrawals request-id) (err ERR-NOT-FOUND))))
    (asserts! (is-member approver TREASURY-SIGNERS) (err ERR-NOT-SIGNER))
    (map-update pending-withdrawals request-id
      (tuple
        (requester (get requester request))
        (amount (get amount request))
        (timestamp (get timestamp request))
        (approvals (append (get approvals request) approver))))))
```

---

## 5. Testing & Validation

### Gas Cost Testing

**Track Costs During Development**
```typescript
// In tests/contracts/contract.test.ts
describe('Gas Cost Analysis - BarrelNFT', () => {
  it('should mint barrel within 10K gas budget', () => {
    gasCostTracker.recordCost('mint-single', 150);  // Estimated
    expect(gasCostTracker.getCost('mint-single')).toBeLessThan(10000);
  });

  it('should transfer in <3K gas', () => {
    gasCostTracker.recordCost('transfer', 100);
    expect(gasCostTracker.getCost('transfer')).toBeLessThan(3000);
  });

  it('should batch mint 10 barrels efficiently', () => {
    const totalGas = 150 * 10;
    const perBarrel = totalGas / 10;
    expect(perBarrel).toBeLessThan(1000);
  });
});
```

### Profiling Commands

```bash
# Use Clarinet to profile gas usage
clarinet check  # Analyzes contracts for potential issues
clarinet console  # Test functions interactively

# Monitor costs in deployments
clarinet integrate
# Then test functions and observe execution time
```

---

## 6. Common Pitfalls to Avoid

### Pitfall 1: Unnecessary Map Iterations
```clarity
;; ❌ DON'T: Iterate over all entries
(define-read-only (get-total-balance)
  (fold + (map-keys balances)))

;; ✅ DO: Pre-compute and update on changes
(define-data-var total-balance uint u0)
```

### Pitfall 2: Storing Redundant Data
```clarity
;; ❌ DON'T: Store data that can be computed
(define-map nft-count (tuple (owner principal)) uint)

;; ✅ DO: Compute using indexed lookups
(define-map owner-nft-index principal (list 1000 uint))
```

### Pitfall 3: Oversized Buffers
```clarity
;; ❌ DON'T: Store unused data
(define-map metadata uint (string-utf8 1000))

;; ✅ DO: Only store needed data
(define-map metadata uint (string-utf8 256))
```

### Pitfall 4: Complex Tuple Updates
```clarity
;; ❌ DON'T: Update entire tuple
(map-update data key
  (tuple
    (field1 (get field1 existing))
    (field2 (get field2 existing))
    (field3 new-value)))

;; ✅ DO: Keep simple types when frequent updates
(define-map field1-data uint uint)
(define-map field3-data uint uint)
```

---

## 7. Performance Benchmarks

### Expected Gas Targets (BarrelNFT)

| Operation | Target | Strategy |
|-----------|--------|----------|
| Single Mint | <1000 | Direct map write + counter update |
| Batch Mint (10) | <10000 | Single transaction, fold operation |
| Token Transfer | <3000 | Map read/write + validation |
| Presale Buy | <5000 | Whitelist check + state update |
| Treasury Approval | <8000 | Map update + signer validation |

### Monitoring

Use the testing framework to track:
```bash
npm run test:report  # Generates gas cost reports
```

Monitor in production:
```bash
# Via Stacks blockchain explorer
# https://explorer.stacks.co/
# Track actual costs vs. estimated
```

---

## 8. Tools & Resources for Optimization

### Stacks-Specific Tools
- **Clarinet**: https://github.com/hirosystems/clarinet
  - `clarinet check` - Static analysis
  - `clarinet integrate` - Test against real chain
  - `clarinet console` - Interactive testing

- **Stacks Explorer**: https://explorer.stacks.co/
  - Monitor actual gas costs
  - Compare contract sizes
  - Verify cost targets

### Analysis Tools
- **Clarity REPL**: Test functions locally
- **Clarinet SDK**: Programmatic contract testing
- **Cost Calculator**: Estimate costs before deployment

### Documentation
- [Stacks Gas Model](https://docs.stacks.co/)
- [Clarity Performance Guide](https://docs.stacks.co/clarity/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

---

## 9. Implementation Checklist

- [ ] Profile all critical functions in BarrelNFT
- [ ] Validate mint operations stay <10K gas per barrel
- [ ] Confirm transfers <3K gas
- [ ] Test presale flow <5K gas
- [ ] Verify treasury operations <8K gas
- [ ] Document actual vs. estimated costs
- [ ] Create gas optimization report
- [ ] Add to CI/CD pipeline
- [ ] Monitor production costs

---

## 10. Next Steps

1. **Implement BarrelNFT** with these optimization principles
2. **Profile actual costs** during development
3. **Compare against targets** and adjust if needed
4. **Document learnings** for token and governance contracts
5. **Create cost optimization guide** for future contracts

