# Development Timeline & Milestones

This document outlines the planned schedule for the hardFork project, broken into phases with key milestones. The timeline assumes a start date of March 2026 and is flexible but provides structure for development, auditing, testing, and launch.

---

## Phase 0: Preparation (Completed)
- Setup Clarinet environment and Stacks wallet
- Research SIP-009 and SIP-010 standards
- Architect initial system design
- Establish development workflow and automated testing (Vitest)
- Gas optimization research and documentation
- Community documentation of technical decisions

## Phase 1: Core Development (Months 1–2)
**Goals**: Build core smart contracts and foundational infrastructure.

- [x] Implement `barrel-nft.clar` basic SIP-009 NFT contract
- [ ] Develop `barrel-token.clar` SIP-010 fungible token contract
- [ ] Create `treasury.clar` contract for funds management
- [ ] Add ownership & admin controls to contracts
- [ ] Expand tests: unit, contract, and integration tests
- [ ] Enable Clarinet environment and validate contracts on Devnet
- [ ] Begin gas profiling to ensure targets are met

**Milestones:**
1. `barrel-nft` contract passes all local tests
2. All three core contracts compile and deploy on Devnet
3. Gas cost for mint/transfer within targets

## Phase 2: Security & Audit (Month 3)
**Goals**: Harden contracts and prepare for external review.

- [ ] Perform three rounds of internal code review
- [ ] Prepare audit package (code, documentation, test results)
- [ ] Engage third-party security auditor with Stacks expertise
- [ ] Remediate any issues reported by auditor
- [ ] Increase test coverage to >90% across contracts

**Milestones:**
1. Audit initiated with chosen firm
2. Audit report received and action items completed
3. Contracts approved for mainnet deployment

## Phase 3: Beta & Community Testing (Months 4–5)
**Goals**: Open contracts to community for feedback and stress testing.

- [ ] Deploy finalized contracts to Devnet staging environment
- [ ] Run community bug bounty and testing campaigns
- [ ] Collect feedback on UX and gas costs
- [ ] Iterate on contracts based on community input
- [ ] Update documentation and guides
- [ ] Prepare deployment scripts and mainnet configuration

**Milestones:**
1. Community beta launched with token distribution tests
2. All critical bugs fixed and retested
3. Deployment readiness checklist complete

## Phase 4: Launch (Month 6)
**Goals**: Deploy to mainnet and initiate presale/public sale.

- [ ] Execute mainnet deployment via Clarinet scripts
- [ ] Monitor initial transactions and costs
- [ ] Launch presale smart contract offering
- [ ] Enable token trading and liquidity pools (e.g. ALEX)
- [ ] Announce launch and provide support channels

**Milestones:**
1. Contracts live on mainnet with verified source
2. First tokens minted and transferred successfully
3. Presale proceeds received in treasury

## Phase 5: Post-Launch & Scaling (Months 7+)   
**Goals**: Expand features and maintain system.

- [ ] Develop additional contracts (Bottling, Distribution, DAO)
- [ ] Integrate with DeFi platforms (ALEX AMM, etc.)
- [ ] Implement governance/token-holder voting
- [ ] Continue optimizations and gas cost monitoring
- [ ] Maintain audits for new code
- [ ] Support community growth and tooling

**Milestones:**
1. Bottling and distribution functionality deployed
2. Token holders vote on first governance proposal
3. Seamless integration with external platforms

---

## Milestone Tracking & Reporting
- Progress will be tracked via GitHub milestones and issues
- Weekly status updates to the team and community
- Major milestone announcements documented in `CHANGELOG.md`

---

*Last updated: March 5, 2026*