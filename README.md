# hardFork - Stacks NFT & Token Project

A Stacks blockchain project implementing both NFT (SIP-009) and token (SIP-010) standards.

## Project Overview

This is a team collaboration project for developing smart contracts on Stacks that support both NFT and token functionality.

## Quick Links

- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [SIP Standards Research](docs/STANDARDS.md)
- [Development Setup](docs/DEV_SETUP.md)
- [Testing Framework & Guide](docs/TESTING.md)
- [Gas Optimization Strategies](docs/GAS_OPTIMIZATION.md)
- [Technical Decisions (Community Manager)](docs/COMMUNITY_TECHNICAL_DECISIONS.md)
- [Contributing](CONTRIBUTING.md)

## Technology Stack

- **Blockchain**: Stacks (Bitcoin settlement layer)
- **Smart Contract Language**: (none yet — contracts will be written in Clarity later)
- **Development**: Clarinet (Stacks development environment)
- **Wallet**: Stacks Wallet

> ⚠️ At the moment the project doesn't require any programming languages; you're just setting up Clarinet and the Stacks Wallet. Clarity coding comes later.
- **Standards**: SIP-009 (NFT), SIP-010 (Token)

## Task Checklist

### Week 1-2 Completed ✓
- [x] Development environment setup (Clarinet, Stacks wallet)
- [x] SIP-009 and SIP-010 standards deep dive
- [x] Architecture design and documentation
- [x] Automated testing framework setup (Vitest with 44 tests)
- [x] Gas optimization strategies research
- [x] Technical decisions documentation for community

### Week 3-6 (In Progress)
- [ ] Smart contract implementation (BarrelNFT, Token, Treasury)
- [ ] Additional testing and validation
- [ ] Security audit preparation
- [ ] Testnet deployment and testing

For a detailed schedule and milestone list, see [Development Timeline & Milestones](docs/DEVELOPMENT_TIMELINE.md)

## Getting Started

1. **Review** the [Getting Started Guide](docs/GETTING_STARTED.md)
2. **Set Up** your development environment with Clarinet
3. **Read** the standards documentation in `docs/STANDARDS.md`
4. **Review** the architecture in `docs/ARCHITECTURE.md`

## Repository Structure

```
hardFork/                # project root - avoid creating a named subdirectory
├── contracts/          # Clarity smart contracts
├── tests/             # Test files
├── scripts/           # Deployment and utility scripts
├── docs/              # Documentation and research
├── settings/          # Clarinet network/account configs
└── .github/           # GitHub configuration
```

> ⚠️ Do **not** run `clarinet new hardFork` from inside this repo; it creates a
> nested `hardFork/` directory and breaks the structure. Use `clarinet new .` or
> skip the command if the repository is already scaffolded.

## Team Communication

- Use GitHub Issues for tracking work
- Create feature branches for development
- Submit pull requests for code review before merging
