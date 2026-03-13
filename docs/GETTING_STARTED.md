# Getting Started with hardFork

Welcome to the hardFork project! This guide will help you get up and running quickly.

## What is hardFork?

hardFork is a team collaboration project building smart contracts on the Stacks blockchain. We're implementing:

- **NFT Smart Contracts** (SIP-009 Standard)
- **Token Smart Contracts** (SIP-010 Standard)

## Before You Start

1. **Review the Project Documentation**
   - Read [README.md](../README.md) for overview
   - Check [Architecture & Design](ARCHITECTURE.md)
   - Study [SIP Standards](STANDARDS.md)

2. **Set Up Your Development Environment**
   - Follow [Dev Setup Guide](DEV_SETUP.md)
   - Install Clarinet (no other language is required yet)
   - Configure Stacks Wallet
   - Run local development server

3. **Understand the Codebase**
   - Contracts are in `contracts/` (Clarity language)
   - Tests are in `tests/` (TypeScript)
   - Documentation is in `docs/`

## Key Technologies

### Stacks Blockchain
At this early stage no programming language work is required.  We're simply preparing the tooling (Clarinet & wallet) so code can be written later.

Stacks allows programmable transactions on Bitcoin using Clarity smart contracts.

**Resources:**
- [Stacks Official Site](https://www.stacks.co/)
- [Stacks Documentation](https://docs.stacksco/)

### Clarity Language
*(There is no Clarity development required at this time; contracts will come later.)*

Clarity is the language that will eventually be used for smart contracts on Stacks, and you can review the documentation if you wish to prepare early.

**Resources:**
- [Clarity Language Guide](https://docs.stacks.co/clarity)
- [Clarity Function Reference](https://docs.stacks.co/clarity/functions)

### Clarinet Development Tool
Clarinet is the integrated development environment for Stacks contracts.

**Resources:**
- [Clarinet Documentation](https://docs.stacks.co/clarinet/)
- [Clarinet GitHub](https://github.com/hirosystems/clarinet)

## Development Workflow

*(Development steps will be added later once contracts are ready.)*

When you begin writing code, the typical workflow will be:

1. Create a contract (`contracts/your-contract.clar`)
2. Write tests (`tests/your-contract.test.ts`)
3. Run the built-in checks and unit tests (`npm run test`)
4. Deploy to testnet (configured in `Clarinet.toml`)
5. Submit pull request

## SIP Standards Overview

### SIP-009: NFT Standard
Defines the interface for non-fungible tokens on Stacks.

**Key Traits:**
- `mint`, `transfer`, `burn` operations
- Metadata management
- Ownership and authorization

### SIP-010: Token Standard
Defines the interface for fungible tokens on Stacks.

**Key Traits:**
- `transfer`, `transfer-memo` operations
- Balance tracking
- Minting and burning

**See [STANDARDS.md](STANDARDS.md) for deeper research**

## Project Structure

```
hardFork/
├── contracts/           # Smart contract source files
│   └── *.clar          # Clarity contract files
├── tests/              # Test files
│   └── *.test.ts       # TypeScript test files
├── scripts/            # Deployment and utility scripts
├── docs/               # Documentation
│   ├── ARCHITECTURE.md   # Design documentation
│   ├── STANDARDS.md      # SIP standards research
│   └── DEV_SETUP.md      # Setup instructions
└── Clarinet.toml       # Clarinet project configuration
```

## First Steps Checklist

- [ ] Read this entire guide
- [ ] Complete [Dev Setup](DEV_SETUP.md)
- [ ] Run `clarinet integrate` to start local blockchain
- [ ] Explore [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] Study [STANDARDS.md](STANDARDS.md)
- [ ] Review existing contracts in `contracts/`
- [ ] Run tests: `npm run test`

## Useful Commands

```bash
# Initialize development server
clarinet integrate

# Run all tests (contract check + JS unit tests)
npm run test

# Check contract syntax only
clarinet check

# Deploy contract
clarinet deploy

# View Smart Contract Interaction interface
clarinet console
```

## Need Help?

- **Documentation**: Read the docs/ folder
- **Clarinet Docs**: https://docs.stacks.co/clarinet
- **Clarity Reference**: https://docs.stacks.co/clarity
- **GitHub Issues**: Create an issue in the repository

## Next: Architecture Overview

Once you're set up, proceed to [ARCHITECTURE.md](ARCHITECTURE.md) to understand the project design.
