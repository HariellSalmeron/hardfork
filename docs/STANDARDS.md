# SIP-009 (NFT) and SIP-010 (Token) Standards Research

## Overview

This document provides comprehensive research into the two main standards for hardFork: SIP-009 (Non-Fungible Tokens) and SIP-010 (Fungible Tokens) on the Stacks blockchain.

## SIP-009: Non-Fungible Token Standard

### Purpose
SIP-009 defines the interface and behavior for non-fungible tokens (NFTs) on Stacks, enabling unique, indivisible digital assets with transparent ownership.

### Key Characteristics
- **Uniqueness**: Each token is distinct and non-interchangeable
- **Ownership**: Single owner per token (or multi-sig contract)
- **Transferability**: Can be transferred between addresses
- **Metadata**: Can contain associated data (name, description, URI, properties)

### Core Traits and Functions

#### Asset Management
```
get-owner(id)           # Get current owner of specific NFT
get-balance(owner)      # Get count of NFTs owned by address
```

#### Transfer Operations
```
transfer(id, from, to)  # Transfer NFT from one address to another
```

#### Mint and Burn
```
mint(id, owner)         # Create new NFT (if implemented)
burn(id)                # Destroy NFT (if implemented)
```

### Metadata
NFTs support optional metadata URIs pointing to:
- Image or media files
- JSON metadata files
- Off-chain property data

### Use Cases
- **Digital Collectibles**: Unique items like trading cards, art pieces
- **Ownership Certificates**: Proof of ownership for physical/digital assets
- **Gaming Assets**: In-game items with verifiable ownership
- **Access Tokens**: NFTs representing membership or access rights
- **Real Estate**: Tokenized property ownership

### Security Considerations
- **Authorization**: Only owner can transfer their own NFT
- **Immutability**: Once minted, token ID is permanent
- **Access Control**: Implement proper permission checks
- **Blacklisting**: Consider if certain addresses should be restricted

### Contract Development Patterns
```clarity
;; Define NFT trait
(define-trait nft-std
  (
    (get-owner (uint) (response principal bool))
    (get-balance (principal) (response uint bool))
    (transfer (uint principal principal) (response bool (tuple (code uint))))
  )
)

;; Implementation example
(define-data-var nft-counter uint u0)
(define-map tokens uint principal)

(define-public (mint (to principal))
  (let ((token-id (var-get nft-counter)))
    (map-insert tokens token-id to)
    (var-set nft-counter (+ token-id u1))
    (ok token-id)
  )
)
```

## SIP-010: Fungible Token Standard

### Purpose
SIP-010 defines the interface for fungible tokens (cryptocurrencies, utility tokens) on Stacks, enabling transferable, divisible digital assets.

### Key Characteristics
- **Fungibility**: Each unit is identical and interchangeable
- **Divisibility**: Can be split into smaller units (like cents)
- **Balances**: Track cumulative amounts per address
- **Transfers**: Send fractional amounts between addresses
- **Supply**: Can be fixed, inflationary, or deflationary

### Core Traits and Functions

#### Balance and Supply
```
get-balance(owner)      # Get token balance of address
get-total-supply()      # Get total tokens in circulation
get-decimals()          # Get number of decimal places
get-name()              # Get token name
get-symbol()            # Get token symbol
get-token-uri()         # Get metadata URI
```

#### Transfer Operations
```
transfer(amount, from, to, memo?)  # Transfer tokens with optional memo
```

#### Mint and Burn
```
mint(amount, recipient)  # Create new tokens
burn(amount, burner)     # Destroy tokens
```

### Token Economics
- **Initial Supply**: Total tokens at launch
- **Minting**: Can create new tokens (if enabled)
- **Burning**: Can destroy tokens (deflationary)
- **Decimals**: Usually 8 (like Bitcoin) or 18 (Ethereum-compatible)

### Use Cases
- **Cryptocurrencies**: Digital money and medium of exchange
- **Utility Tokens**: In-app currency for games or platforms
- **Governance Tokens**: Voting power in DAOs
- **Staking Tokens**: Rewards and participation incentives
- **Payment Tokens**: Simplified payment methods

### Security Considerations
- **Overflow/Underflow**: Handle large number arithmetic carefully
- **Approval Mechanism**: Some standards include allowance-based transfers
- **Mint Authorization**: Only authorized addresses can create tokens
- **Burn Authorization**: Only authorized addresses can destroy tokens

### Contract Development Patterns
```clarity
;; Define token supply and balances
(define-data-var total-supply uint u1000000000)
(define-map balances principal uint)

;; Basic transfer function
(define-public (transfer (amount uint) (from principal) (to principal))
  (let ((from-balance (default-to u0 (map-get? balances from))))
    (if (>= from-balance amount)
      (begin
        (map-set balances from (- from-balance amount))
        (map-set balances to (+ (default-to u0 (map-get? balances to)) amount))
        (ok true)
      )
      (err (tuple (code u1)))
    )
  )
)
```

## Comparison: SIP-009 vs SIP-010

| Aspect | SIP-009 (NFT) | SIP-010 (Token) |
|--------|---------------|-----------------|
| **Fungibility** | Non-fungible (unique) | Fungible (identical) |
| **Divisibility** | Indivisible (whole units) | Divisible (fractional) |
| **Quantity per Owner** | Multiple unique tokens | Single balance amount |
| **Use Case** | Unique assets, collectibles | Currency, utility |
| **Tracking** | By ID | By address balance |

## Implementation Best Practices

### For NFTs (SIP-009)
1. Implement proper authorization checks
2. Track metadata and ownership clearly
3. Use maps for efficient token ID lookups
4. Consider gas optimization for batch operations
5. Document metadata URI format

### For Tokens (SIP-010)
1. Handle large numbers safely (avoid overflow)
2. Implement rounding behavior consistently
3. Use proper decimal handling
4. Track total supply accurately
5. Consider pause/freeze mechanisms for security

## Resources

### Official Specifications
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [SIP-010 Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)

### Documentation
- [Stacks Clarity Docs](https://docs.stacks.co/clarity)
- [Stacks SDK](https://github.com/hirosystems/stacks.js)
- [Stacks RPC API](https://docs.stacks.co/api)

### Example Implementations
- [Stacks Contracts v3](https://github.com/hirosystems/stacks-contracts)
- [Alex Finance](https://github.com/alexgo-io)

### Learning Resources
- [Clarity Language Guide](https://docs.stacks.co/clarity)
- [Stacks Smart Contracts Blog](https://www.stacks.co/blog)
- [Bitcoin DeFi Guides](https://www.stacks.co/what-is-stacks/defi)

## Implementation Checklist

- [ ] Review official SIP-009 specification
- [ ] Review official SIP-010 specification
- [ ] Study example implementations
- [ ] Understand Clarity syntax for both standards
- [ ] Design contract architecture based on needs
- [ ] Write comprehensive tests
- [ ] Implement security best practices
- [ ] Create detailed contract documentation
- [ ] Audit contract code for vulnerabilities

## Next Steps

1. Read the official SIP specifications
2. Study example contracts from Stacks community
3. Design your contract architecture based on project needs
4. See [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
