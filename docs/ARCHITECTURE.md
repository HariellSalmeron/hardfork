# Hard Fork Distillery Architecture & Design

## Project Overview

**Hard Fork Distillery** is a craft spirits company creating on‑chain control and governance mechanisms for barrel production on the Stacks blockchain. Our architecture bridges physical barrel aging with digital asset rights through SIP‑009 NFTs (BarrelNFTs) and SIP‑010 governance tokens, while legal title to the barrels remains with the production facility.

**Legal Disclaimer:**  At no time will Hard Fork tokenize the *legal ownership* of any barrel. Doing so is expressly prohibited by law. The smart contracts and tokens issued by Hard Fork represent governance rights, control over production/bottling decisions, and the ability to redeem bottles — they do not convey, imply, or vest any title or ownership in the physical barrels themselves.

**Core Mission**: Tokenize craft whiskey production, enabling distributed *control* over barrel production and governance via blockchain while managing physical production operations.  The underlying barrel assets remain legally owned by the production facility (Focus Distilling and Bottling); tokens and NFTs grant rights and privileges defined by the smart contracts but do not transfer title to the physical barrels.

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    HARD FORK ECOSYSTEM                    │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────────────────────────────────────┐ │
│  │   STACKS BLOCKCHAIN (Bitcoin Settlement Layer)      │ │
│  │                                                     │ │
│  │  ┌───────────────────────────────────────────────┐ │ │
│  │  │  SMART CONTRACTS (7 Core Contracts)           │ │ │
│  │  │                                               │ │ │
│  │  │  ┌──────────────┐   ┌─────────────────────┐  │ │ │
│  │  │  │ BarrelNFT    │   │ GovernanceToken     │  │ │ │
│  │  │  │ (SIP-009)    │   │ (SIP-010)           │  │ │ │
│  │  │  │ - Minting    │   │ - 250 per barrel    │  │ │ │
│  │  │  │ - Ownership  │   │ - Treasury + Sales  │  │ │ │
│  │  │  └──────────────┘   └─────────────────────┘  │ │ │
│  │  │                                               │ │ │
│  │  │  ┌──────────────┐   ┌─────────────────────┐  │ │ │
│  │  │  │ TreasuryCtx  │   │ ProductionBatchCtx  │  │ │ │
│  │  │  │ - Fund mgmt  │   │ - Batch creation    │  │ │ │
│  │  │  │ - Multisig   │   │ - NFT + token mint  │  │ │ │
│  │  │  └──────────────┘   └─────────────────────┘  │ │ │
│  │  │                                               │ │ │
│  │  │  ┌──────────────────────────────────────┐     │ │ │
│  │  │  │ Sale Mechanisms                      │     │ │ │
│  │  │  │ - PreSaleContract (7.5 STX/token)    │     │ │ │
│  │  │  │ - PublicSaleContract (10 STX/token)  │     │ │ │
│  │  │  │ - ALEX DEX Integration               │     │ │ │
│  │  │  └──────────────────────────────────────┘     │ │ │
│  │  │                                               │ │ │
│  │  │  ┌──────────────┐   ┌─────────────────────┐  │ │ │
│  │  │  │ BatchRegistry│   │ Utilities           │  │ │ │
│  │  │  │ - Metadata   │   │ - Constants         │  │ │ │
│  │  │  │ - Tracking   │   │ - Errors            │  │ │ │
│  │  │  └──────────────┘   │ - Helpers           │  │ │ │
│  │  │                     └─────────────────────┘  │ │ │
│  │  └───────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                            │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Physical Ops │  │ Community    │  │ Governance   │   │
│  │ - Production │  │ - Discord    │  │ - Token Vote │   │
│  │ - Barrels    │  │ - Twitter    │  │ - DAO        │   │
│  │ - Storage    │  │ - Updates    │  │ - Decisions  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Seven Core Smart Contracts

### 1. BarrelNFT Contract (SIP-009)
**File**: `contracts/barrel-nft.clar`

Represents *control rights* associated with a physical barrel on-chain (not legal title to the barrel).

**Key Data**:
```clarity
{
  barrel-id: uint,           # Unique barrel identifier
  batch-id: string,          # Batch name (e.g., "ACQUISITION-2026-001")
  owner: principal,          # Current owner address
  metadata: {
    distillery: string,      # Source distillery
    spirit-type: string,     # "whiskey", "bourbon", etc.
    age-statement: uint,     # Years aging
    entry-proof: uint,       # Entry proof (e.g., 120)
    fill-date: uint,         # Block height filled
    location: string,        # Storage location
    uri: string              # IPFS/HTTP metadata URI
  }
}
```

**Core Functions**:
- `mint(barrel-id, batch-id, owner, metadata)` - Create barrel NFT
- `transfer(barrel-id, from, to)` - Transfer ownership
- `get-owner(barrel-id)` - Query owner
- `get-metadata(barrel-id)` - Query barrel details
- `burn(barrel-id)` - Retire barrel (on bottling)

**Key Traits** (SIP-009):
- `get-owner`
- `get-balance`
- `transfer`

---

### 2. GovernanceToken Contract (SIP-010)
**File**: `contracts/governance-token.clar`

Represents voting and governance rights tied to a barrel’s production and distribution, distributed 250 per barrel.  These tokens give holders the ability to participate in decisions and to redeem bottles, but do not constitute ownership of the physical barrel itself.

**Token Economics**:
```
Per Barrel:         250 tokens
Public Allocation:  50,000 tokens (200 barrels)
Treasury Reserve:  12,500 tokens (50 barrels reserved)
─────────────────────────────────
Total Issued:      62,500 tokens
```

**Core Functions**:
- `transfer(amount, from, to, memo?)` - Send tokens
- `get-balance(owner)` - Query balance
- `get-total-supply()` - Query circulation
- `mint(amount, recipient)` - Create new tokens (admin only)
- `burn(amount, burner)` - Destroy tokens

**Metadata**:
```clarity
{
  name: "Hard Fork Governance Token",
  symbol: "HARDFORK",
  decimals: 8,
  total-supply: 62500 * 10^8,
  description: "Vote on barrel management, distribution, future governance"
}
```

---

### 3. TreasuryContract
**File**: `contracts/treasury.clar`

Manages funds from token sales and distributes to operations.

**Responsibilities**:
- Hold proceeds from presale (7.5 STX/token)
- Hold proceeds from public sale (10 STX/token)
- Multisig withdrawals for operational expenses
- Track reserve allocation
- Support token rebuys (future)

**Data Model**:
```clarity
{
  stx-balance: uint,              # STX held
  total-collected: uint,          # Cumulative STX from all sales
  withdrawn: uint,                # Cumulative withdrawals
  multisig-signers: [principal],  # Required signers (2-of-3)
  withdrawal-nonce: uint          # Prevent replay attacks
}
```

**Key Functions**:
- `deposit(amount, source)` - Accept STX deposit
- `propose-withdrawal(amount, recipient)` - Initiate multisig withdrawal
- `approve-withdrawal(nonce, approval-count)` - Execute if quorum met
- `get-balance()` - Query current balance

---

### 4. ProductionBatchContract (Factory)
**File**: `contracts/production-batch.clar`

Creates and manages production batches (barrels + tokens grouped).

**Batch Lifecycle**:
```
1. Create batch (e.g., "ACQUISITION-2026-001" for 250 jumpstart barrels)
2. Mint BarrelNFTs (one per barrel)
3. Mint GovernanceTokens (250 per barrel)
4. Allocate tokens to sales contracts
5. Activate sales for batch
6. Track batch completion
```

**Data Model**:
```clarity
{
  batch-id: string,              # Unique batch name
  barrel-count: uint,            # Number of barrels
  tokens-per-barrel: uint,       # 250 (fixed)
  total-tokens: uint,            # barrel-count * 250
  presale-amount: uint,          # Tokens reserved for presale
  public-amount: uint,           # Tokens for public sale
  treasury-amount: uint,         # Tokens in treasury
  minting-complete: bool,        # Finality flag
  created-at: uint               # Block height of creation
}
```

**Key Functions**:
- `create-batch(batch-id, barrel-count)` - Initialize batch
- `mint-barrels(batch-id, metadata-list)` - Create barrel NFTs
- `mint-tokens(batch-id)` - Create governance tokens
- `activate-sales(batch-id)` - Open presale/public sales
- `get-batch(batch-id)` - Query batch details

---

### 5. PreSaleContract
**File**: `contracts/presale.clar`

Early token sale at discounted price (7.5 STX per token).

**Parameters**:
- Price per token: 7.5 STX
- Allocation per batch: 25,000 tokens (100 barrels worth)
- Max per buyer: Configurable (e.g., 1,000 tokens)
- Duration: Start Month 6, Week 2

**Core Functions**:
- `buy(token-amount)` - Purchase tokens (sends STX, receives tokens)
- `whitelist-buyer(principal)` - Add eligible buyers (admin)
- `get-allocation(buyer)` - Query remaining allocation
- `pause()` / `resume()` - Admin control

**Prevention**:
- Prevent double-spend
- Validate sufficient STX sent
- Track cumulative per-buyer

---

### 6. PublicSaleContract
**File**: `contracts/public-sale.clar`

Open token sale at standard price (10 STX per token).

**Parameters**:
- Price per token: 10 STX
- Total allocation: 25,000 tokens (100 barrels worth)
- Max per transaction: 500 tokens
- Duration: Months 6+

**Core Functions**:
- `buy(token-amount)` - Purchase tokens (no whitelist)
- `get-available()` - Check remaining tokens
- `pause()` / `resume()` - Admin control

---

### 7. BatchRegistry
**File**: `contracts/batch-registry.clar`

Tracks all production batches and their metadata.

**Purpose**: Query historical data, verify barrel ownership, track production rhythm.

**Data Model**:
```clarity
{
  batches: {
    batch-id => {
      barrel-ids: [uint],
      metadata: {...},
      minting-date: uint,
      barrels-complete: uint
    }
  }
}
```

**Key Functions**:
- `register-batch(batch-id, barrel-count)` - Record new batch
- `add-barrel(batch-id, barrel-id, metadata)` - Log barrel in batch
- `get-batch-barrels(batch-id)` - Query barrels in batch
- `get-barrel-batch(barrel-id)` - Find which batch barrel belongs to

---

## Data Models

### BarrelNFT Metadata (On-Chain)
```json
{
  "barrel_id": "ACQN-2026-001-001",
  "batch": "ACQUISITION-2026-001",
  "distillery": "Unknown Distillery (aged purchase)",
  "spirit_type": "bourbon",
  "age_statement": 12,
  "entry_proof": 120,
  "fill_date": "block-height-12345",
  "location": "Hard Fork Warehouse - Zone A",
  "contract_address": "SP123456789...",
  "nft_uri": "ipfs://QmXxxx..."
}
```

### Token Economics
```
Jumpstart Barrels (Month 5):
  Physical Barrels: 250 aged barrels (pre-purchased)
  BarrelNFTs Minted: 250
  Total Tokens Minted: 62,500 (250 per barrel)
  
  Distribution:
    - Public Sales: 50,000 tokens (200 barrels)
      - Presale: 25,000 @ 7.5 STX = 187.5K STX
      - Public: 25,000 @ 10 STX = 250K STX
      - Subtotal: 437.5K STX
    - Treasury: 12,500 tokens (50 barrels reserved for DAO)

Monthly Production Batches (Starting Month 6):
  Barrels per Batch: 10
  Tokens per Batch: 2,500 (250 per barrel)
  
  Distribution:
    - Presale: 1,000 tokens
    - Public: 1,000 tokens
    - Treasury: 500 tokens
```

### Production Batch Workflow

```
Month 6, Week 1: Purchase grain + barrels
             ↓
Month 6, Week 2: Distill spirit + enter barrels (fill-date recorded)
             ↓
Month 6-12,+: Aging (monitoring temperature, evaporation, quality)
             ↓
Year 2-7: Continued aging (barrel-specific aging data updated)
             ↓
Year 7+: Bottling decision (convert barrel to ProductionComplete status)
             ↓
Year 7+: Distribution (transfer bottles to token holders, if decided)
```

## Authorization & Governance Model

### Role-Based Access Control

```
┌──────────────────────────────────────────┐
│  Founding CEO / Treasury Ops              │
├──────────────────────────────────────────┤
│ • Deploy contracts                        │
│ • Mint batches                            │
│ • Multisig withdrawals                    │
│ • Pause/resume sales                      │
│ • Approve production batches               │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Token Holder (DAO)                       │
├──────────────────────────────────────────┤
│ • Vote on governance (future)             │
│ • Propose batch decisions                 │
│ • Monitor barrel aging                    │
│ • Receive distribution info               │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Operations / Distillery                  │
├──────────────────────────────────────────┤
│ • Manage physical barrels                 │
│ • Provide aging updates                   │
│ • Record barrel metadata                  │
│ • Distill new batches                     │
└──────────────────────────────────────────┘
```

### Multisig Treasury
- **Signers**: CEO + 2 Operations leads
- **Threshold**: 2-of-3 required for withdrawal
- **Withdrawal limits**: No single limit; all reviewed
- **Nonce tracking**: Prevent replay attacks

---

## Critical Contract Dependencies

```
┌──────────────────────────────┐
│  ProductionBatch             │ <── Initiates batch creation
│  & BatchRegistry             │
└──────┬───────────────────────┘
       │
       ├──→ BarrelNFT (mints 1 per barrel)
       │
       └──→ GovernanceToken (mints 250 per barrel)
                │
                ├──→ TreasuryContract (reserve allocation)
                │
                ├──→ PreSaleContract (presale allocation)
                │
                └──→ PublicSaleContract (public allocation)

Deployment Order (Critical):
  1. TreasuryContract (others depend on it)
  2. BarrelNFT
  3. GovernanceToken
  4. ProductionBatchContract
  5. BatchRegistry
  6. PreSaleContract
  7. PublicSaleContract
```

---

## 6-Month Launch Timeline

### Month 0: Foundation & Architecture ✓
**Week 1-4**: Design all contracts, architecture approval, Git setup  
**Status**: Complete (current phase)

### Month 1: Core Contracts Development
**Week 1-4**: Implement BarrelNFT, GovernanceToken, TreasuryContract, ProductionBatch  
**Tests**: >80% coverage  
**Testnet**: All contracts running on local devnet

### Month 2: Sale Mechanisms & Audit Prep
**Week 1-4**: Implement PreSaleContract, PublicSaleContract, audit documentation  
**Code Freeze**: Begin audit preparation  
**Operations**: Jumpstart barrel acquisition finalized

### Month 3: Security Audit
**Week 1-4**: Professional security audit via external firm  
**Timeline**: 4 weeks  
**Deliverable**: Preliminary findings, remediation plan

### Month 4: Remediation & Re-audit
**Week 1-4**: Fix critical/high findings, clean re-audit  
**Deliverable**: Final attestation letter, deployment ready

### Month 5: Mainnet Deployment
**Week 1-2**: Deploy all 7 contracts to Stacks mainnet  
**Week 3**: Tokenize 250 jumpstart barrels (mint NFTs + tokens)  
**Week 4**: Prepare for launch (test purchase flows)

### Month 6: Launch & First Production Batch
**Week 1-2**: Launch token sales (presale + public)  
**Target Revenue**: $50K+ from token sales  
**Week 3-4**: Deploy first monthly production batch (10 barrels)

---

## Deployment Checklist

### Pre-Deployment (Month 4)
- [ ] All contracts code-reviewed (3 rounds minimum)
- [ ] Security audit complete with clean attestation
- [ ] Test coverage >80% across all contracts
- [x] Gas costs analyzed and optimized (see [GAS_OPTIMIZATION.md](GAS_OPTIMIZATION.md))
- [ ] Deployment scripts tested on testnet
- [ ] Mainnet RPC endpoints configured
- [ ] Emergency response runbook prepared

### Deployment (Month 5)
```
1. Deploy TreasuryContract
   ✓ Verify deployment address
   ✓ Fund with initial balance

2. Deploy BarrelNFT
   ✓ Verify token standard compatibility
   ✓ Test mint function

3. Deploy GovernanceToken
   ✓ Verify SIP-010 compliance
   ✓ Test transfer mechanics

4. Deploy ProductionBatchContract
   ✓ Link to above 3 contracts
   ✓ Test batch creation

5. Deploy BatchRegistry
   ✓ Link to BarrelNFT
   ✓ Test batch tracking

6. Deploy PreSaleContract
   ✓ Link to GovernanceToken & TreasuryContract
   ✓ Set price (7.5 STX)
   ✓ Configure allocation

7. Deploy PublicSaleContract
   ✓ Link to GovernanceToken & TreasuryContract
   ✓ Set price (10 STX)
   ✓ Configure allocation

8. Verify All Interlinks
   ✓ Test end-to-end purchase flow
   ✓ Verify token transfer from sales to buyer
   ✓ Verify STX transfer to treasury
```

---

## Security Framework

### Input Validation
- All external inputs validated (amounts, principals, strings)
- Prevent integer overflow/underflow
- Validate metadata format before storage
- Reject malformed batch IDs

### Authorization Checks
- Only contract owner can mint batches
- Only token holders can vote (future)
- Only approved signers can withdraw from treasury
- Explicit access control on all admin functions

### State Consistency
- Maintain invariant: total supply = public + treasury allocations
- Ensure 1:1 mapping between BarrelNFTs and GovernanceTokens
- Atomic batch creation (all or nothing)
- Nonce-based replay protection on treasury

### Emergency Procedures
- **If contract bug found**: Pause affected contract, freeze sales, assess severity
- **If deployment fails**: Roll back, debug, retry (no mainnet resets)
- **If sale breaks**: Pause immediately, refund affected buyers in full
- **If governance issue**: Escalate to multisig, document decision

---

## Performance & Scalability

### Gas Optimization Targets
- Batch minting: <10K gas per barrel
- Token transfer: <3K gas
- Presale purchase: <5K gas per transaction
- Treasury withdrawal: <8K gas per approval

### Limits & Capacity
- Max barrels per batch: 1,000 (no contract limit, but operations-driven)
- Max token supply: 1,000,000 (future flexibility)
- Monthly production rhythm: 10 barrels/month = 2,500 tokens/month
- Sales capacity: 50K tokens presale, 25K tokens public (first batch); repeatable

### Future Scaling (Months 7+)
- BottlingContract (decide when/how barrels are bottled)
- DistributionContract (ship bottles to token holders)
- GovernanceDAO (decentralized voting on key decisions)
- ALEX AMM integration (liquid token trading)

---


## References & External Links

### Project Documentation
- **[GAS_OPTIMIZATION.md](GAS_OPTIMIZATION.md)** - Gas optimization strategies for Stacks Clarity

### External Resources
- **Stacks Docs**: https://docs.stacks.co/
- **Clarity Language**: https://docs.stacks.co/clarity/
- **SIP-009 (NFT)**: https://github.com/stacksgov/sips/blob/main/sips/sip-009/
- **SIP-010 (Token)**: https://github.com/stacksgov/sips/blob/main/sips/sip-010/
- **ALEX DEX**: https://alexgo.io/
- **Clarinet SDK**: https://docs.hiro.so/stacks/clarinet-js-sdk
- **Smart Contract Auditor** (TBD): Professional firm, Stacks experience required

---

## Appendix: Contract Interaction Diagram

```
Token Purchase Flow (PreSale)
──────────────────────────────

1. Buyer calls PreSaleContract.buy(1000 tokens)
                           │
                           ├─→ Validate buyer whitelisted
                           ├─→ Validate 1000 funds available
                           │
                           ✓ 7,500 STX transferred from buyer
                           │
                           ├─→ TreasuryContract.deposit(7500)
                           │   [STX held in treasury]
                           │
                           └─→ GovernanceToken.transfer(1000, buyer)
                               [Tokens transferred to buyer]

Token Holder Governance Flow (Future)
──────────────────────────────────────

1. Token Holder proposes: "Bottle barrels for Year 2 distribution"
                │
                ├─→ DAO votes (weight = token balance)
                │
                ├─→ If approved:
                │   ├─→ BottlingContract.propose-batch()
                │   ├─→ Operations executes bottling
                │   └─→ DistributionContract.allocate-bottles()
                │
                └─→ Token holders receive distribution info
```

---


