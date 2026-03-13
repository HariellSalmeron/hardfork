# Development Environment Setup

This guide covers setting up your development environment for the hardFork project.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## Installation Steps

### 1. Install Clarinet

Clarinet is the primary development environment for Stacks smart contracts.

**Option A: Using npm (Recommended)**
```bash
npm install --global @hirosystems/clarinet
# or ensure you have the latest release:
npm install --global @hirosystems/clarinet@latest
```

> Note: older Clarinet versions (pre‑2.x) may not provide a `test` subcommand.
> Earlier versions of Clarinet exposed a `test` subcommand; in 3.x and later
> it has been removed. Use the npm script described below (`npm run test`) or
> invoke `clarinet check` directly instead.


**Option C: Windows (PowerShell)**

If you're on Windows, you can install Node.js using `winget` or `choco` and then install Clarinet via `npm`.

```powershell
# Install Node.js (LTS) via winget
winget install OpenJS.NodeJS.LTS

# Or using Chocolatey
choco install nodejs-lts -y

# Install Clarinet globally
npm install --global @hirosystems/clarinet

# Verify installation
clarinet --version
```

I also included a helper PowerShell script at `scripts/setup-windows.ps1` to automate these checks and install steps.

**Option B: Using Homebrew (macOS/Linux)**
```bash
brew install clarinet
```

Verify installation:
```bash
clarinet --version
```

### 2. Install Stacks Wallet

Download the Stacks Wallet extension:
- [Stacks Wallet for Web](https://www.stacks.co/explore/discover-stacks-apps/stacks-wallet)
- Install as a browser extension in Chrome or Firefox

### 3. Configure Wallet

1. Create a new wallet or import an existing one
2. Switch to the appropriate network:
   - **Development**: Localhost (for local testing)
   - **Testnet**: Bitcoin testnet (for testing with real conditions)
   - **Mainnet**: Production (careful!)

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Network configuration
STACKS_API_URL=http://localhost:3999
BITCOIN_API_URL=http://localhost:18332

# Wallet configuration
MNEMONIC=<your-12-word-seed-phrase>
NETWORK=devnet  # or testnet, mainnet

# Contract deployment
DEPLOYMENT_ACCOUNT=<your-stx-address>
```

## Project Setup

### Initialize Clarinet Project

If you're starting from an empty repo, run:
```bash
clarinet new .
```

> **Warning:** using `clarinet new <name>` will create a subdirectory. To keep
> the project at the repository root, use `.` or skip this step if the layout is
> already in place. The repo comes pre‑scaffolded, so you may not need to run
> this command at all.

### Install Dependencies

```bash
npm install
```

## Local Development Server

Start the Clarinet development environment:

```bash
clarinet integrate
```

This will:
- Start a local Stacks blockchain
- Open a browser interface for testing
- Load your smart contracts for interaction

## Running Tests

Make sure your current working directory is the **project root** (`C:\hardFork` in this workspace).

Execute the test suite from there. The Clarinet CLI no longer includes a
`test` subcommand in versions 3.x and later; instead the project uses a
combined npm script that first runs `clarinet check` (which validates and
compiles contracts) and then executes the TypeScript unit tests with Vitest.

```bash
# run both the contract check and the JS unit tests
npm run test
```

> ⚠️ If you accidentally run `clarinet test` you will see:
> `error: unrecognized subcommand 'test'`.
> That means your installed Clarinet binary is a newer release with the
> command removed. Always use the npm script above, which works with any
> Clarinet version and handles the two-step process for you. Also make sure
> you're in the project root (`C:\hardFork`).

A direct `clarinet check` can be invoked separately:

```bash
npm run check   # simply compiles & validates contracts
```



## Project Structure

> Note: no source files exist yet. The following layout will be used when contracts are added.

```
contracts/         # Clarity contract files (.clar)
tests/            # Test files (.ts)
Clarinet.toml     # Clarinet project configuration
settings/         # Network and account settings
```

## Troubleshooting

### Clarinet not found
- Ensure Node.js is installed: `node --version`
- Try reinstalling: `npm install --global @hirosystems/clarinet`
- Check your PATH environment variable

### Wallet connection issues
- Ensure Stacks Wallet extension is installed
- Check that you're on the correct network
- Try disconnecting and reconnecting the wallet

### Contract compilation errors
- Review Clarity syntax (case-sensitive)
- Check for missing quotes or parentheses
- Consult [Clarity documentation](https://docs.stacks.co/clarity)

## Next Steps

1. Read [Architecture & Design](ARCHITECTURE.md)
2. Study [SIP Standards](STANDARDS.md)
3. Start implementing contracts in `contracts/`
