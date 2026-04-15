# Hard Fork Distillery - Smart Contract Deployment Guide

## Prerequisites
- **Stacks Wallet** with STX (testnet)
- **Clarinet CLI** installed
- **Project Setup** complete

---

## Step 1: Check Your STX Balance

### View Testnet Balance
Visit: https://explorer.stacks.co/?chain=testnet
Search for your address: `STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ`

**Required Balance:** ~0.5 STX total for all 3 contracts

---

## Step 2: Prepare Deployment Configuration

### Check Deployment Plan
Your `deployments/default.testnet-plan.yaml` contains:
```yaml
network: testnet
stacks-node: "https://api.testnet.hiro.so"
expected-sender: STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ
```

### Verify Contract Costs
- **barrel-nft:** ~0.073 STX
- **governance-token:** ~0.056 STX
- **treasury:** ~0.020 STX
- **Total:** ~0.149 STX

---

## Step 3: Deploy to Testnet

### Command to Deploy
```bash
clarinet deployments apply --testnet
```

### What Happens During Deployment
1. **Validation:** Clarinet checks contract syntax
2. **Transaction Creation:** Generates deployment transactions
3. **Broadcast:** Sends to testnet mempool
4. **Confirmation:** Waits for block inclusion
5. **Verification:** Confirms successful deployment

---

## Step 4: Monitor Deployment

### Check Transaction Status
After running the command, you'll see:
```
Transaction broadcasted: abc123...
Transaction broadcasted: def456...
Transaction broadcasted: ghi789...
```

### View on Explorer
- Visit: https://explorer.stacks.co/?chain=testnet
- Search transaction IDs to track progress
- Wait for 1-2 confirmations

---

## Step 5: Verify Deployment Success

### Check Contract Addresses
Once deployed, contracts will be at:
```
STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.barrel-nft
STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.governance-token
STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.treasury
```

### Test Contract Calls
Use Clarinet console to test:
```bash
clarinet console
```

Then test functions:
```clarity
(contract-call? .barrel-nft get-owner u1)
(contract-call? .governance-token get-total-supply)
(contract-call? .treasury get-balance)
```

---

## Step 6: Update Frontend Configuration

### Update Contract Addresses
In `frontend/src/config.ts`:
```typescript
export const TESTNET_CONTRACTS = {
  barrelNft: 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.barrel-nft',
  governanceToken: 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.governance-token',
  treasury: 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.treasury'
}
```

---

## Step 7: Initialize Contracts (Post-Deployment)

### Mint Founder Tokens
```clarity
(contract-call? .governance-token mint-founder tx-sender)
```
**Cost:** ~0.01 STX
**Result:** 20,000 governance tokens minted

### Set Facility Address (Barrel NFT)
```clarity
(contract-call? .barrel-nft set-facility 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ)
```

---

## Step 8: Test Full Workflow

### Mint First Barrel NFT
```clarity
(contract-call? .barrel-nft mint-barrel
  u1
  "ACQUISITION-2026-001"
  tx-sender
  {
    distillery: "Hard Fork Distillery",
    spirit-type: "Bourbon",
    age-statement: u0,
    entry-proof: u120,
    fill-date: u100000,
    location: "Kentucky Warehouse A",
    uri: "ipfs://Qm..."
  })
```

### Mint Governance Tokens for Barrel
```clarity
(contract-call? .governance-token mint tx-sender u200)
```

---

## Cost Breakdown

| Action | STX Cost | Purpose |
|--------|----------|---------|
| Deploy barrel-nft | ~0.073 | Contract deployment |
| Deploy governance-token | ~0.056 | Contract deployment |
| Deploy treasury | ~0.020 | Contract deployment |
| Mint founder tokens | ~0.010 | Initial token allocation |
| Mint barrel NFT | ~0.005 | Create first NFT |
| Mint governance tokens | ~0.005 | Token distribution |
| **Total** | **~0.169 STX** | Complete setup |

---

## Troubleshooting

### Insufficient Balance
```
Error: transaction rejected - insufficient balance
```
**Solution:** Get more testnet STX from https://explorer.stacks.co/faucet?chain=testnet

### Contract Already Exists
```
Error: ContractAlreadyExists
```
**Solution:** Contracts are already deployed - skip redeployment

### Transaction Timeout
```
Error: transaction timed out
```
**Solution:** Wait and check explorer, or rebroadcast

---

## Alternative: Local Testing First

### Use Devnet (Free)
```bash
clarinet console
```
- Test all functions locally
- No STX required
- Instant feedback

### Use Testnet Sandbox
```bash
clarinet integrate
```
- Local testnet environment
- No real STX needed
- Full integration testing

---

## Security Notes

- **Never deploy to mainnet** without extensive testing
- **Backup private keys** securely
- **Verify all addresses** before transactions
- **Test on devnet first** always
- **Monitor gas costs** for mainnet deployment

---

## Next Steps After Deployment

1. **Frontend Integration:** Connect your React app to deployed contracts
2. **User Testing:** Allow users to interact with contracts
3. **Community Launch:** Open governance to token holders
4. **Physical Operations:** Begin barrel acquisition and tokenization
5. **Mainnet Migration:** Plan mainnet deployment when ready

---

*Remember: Testnet deployments are permanent but use worthless STX. Mainnet deployments are final and use real value.*