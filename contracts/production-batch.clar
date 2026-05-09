;; ProductionBatchContract - Factory for Batch Creation
;; This contract orchestrates the creation of production batches, minting BarrelNFTs
;; and corresponding GovernanceTokens in a coordinated manner.
;; Each batch represents a coherent group of barrels with unified metadata,
;; supporting presale, public sale, and treasury allocations.

;; Error constants
(define-constant ERR-UNAUTHORIZED u200)
(define-constant ERR-BATCH-EXISTS u201)
(define-constant ERR-BATCH-NOT-FOUND u202)
(define-constant ERR-INVALID-PARAMS u203)
(define-constant ERR-MINTING-IN-PROGRESS u204)
(define-constant ERR-BATCH-ALREADY-COMPLETE u205)
(define-constant ERR-CONTRACT-PAUSED u206)
(define-constant ERR-INVALID-ALLOCATION u207)

;; Configuration constants
(define-constant TOKENS-PER-BARREL u250)
(define-constant PRESALE-PRICE u750000000) ;; 7.5 STX (in microSTX)
(define-constant PUBLIC-SALE-PRICE u1000000000) ;; 10 STX (in microSTX)

;; Batch status tracking
(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var next-batch-id uint u0)

;; Batch metadata storage
(define-map batches {batch-id: uint}
  {
    name: (string-utf8 256),              ;; Human-readable batch name (e.g., "ACQUISITION-2026-001")
    barrel-count: uint,                   ;; Number of barrels in batch
    tokens-per-barrel: uint,              ;; Tokens per barrel (fixed at 250)
    total-tokens: uint,                   ;; barrel-count * tokens-per-barrel
    presale-allocation: uint,             ;; Tokens reserved for presale
    public-allocation: uint,              ;; Tokens reserved for public sale
    treasury-allocation: uint,            ;; Tokens reserved for treasury
    barrel-ids: (list 1000 uint),         ;; List of minted barrel IDs
    minting-complete: bool,               ;; Finality flag
    created-at: uint,                     ;; Block height of creation
    created-by: principal                 ;; Batch creator
  })

;; Barrel metadata template per batch
(define-map barrel-metadata-template {batch-id: uint}
  {
    distillery: (string-utf8 256),
    spirit-type: (string-utf8 256),
    age-statement: uint,
    entry-proof: uint,
    fill-date: uint,
    location: (string-utf8 256),
    uri: (string-utf8 256)
  })

;; Track which batches have been minted
(define-map batch-minting-status {batch-id: uint}
  {
    barrels-minted: uint,                 ;; Number of barrels minted so far
    tokens-minted: bool                   ;; Whether tokens have been minted
  })

;; Helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-private (batch-exists? (batch-id uint))
  (is-some (map-get? batches {batch-id: batch-id})))

(define-private (validate-batch-id (batch-id uint))
  (ok (begin
    (asserts! (< batch-id (var-get next-batch-id)) (err ERR-BATCH-NOT-FOUND))
    true)))

;; Read-only functions

(define-read-only (get-batch-info (batch-id uint))
  (map-get? batches {batch-id: batch-id}))

(define-read-only (get-barrel-template (batch-id uint))
  (map-get? barrel-metadata-template {batch-id: batch-id}))

(define-read-only (get-minting-status (batch-id uint))
  (map-get? batch-minting-status {batch-id: batch-id}))

(define-read-only (get-next-batch-id)
  (var-get next-batch-id))

(define-read-only (get-contract-owner)
  (var-get contract-owner))

(define-read-only (is-paused)
  (var-get paused))

;; Admin functions

(define-public (set-owner (new-owner principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set contract-owner new-owner)
    (ok true)))

(define-public (pause)
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set paused true)
    (ok true)))

(define-public (unpause)
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set paused false)
    (ok true)))

;; Core batch creation function
(define-public (create-batch
    (batch-name (string-utf8 256))
    (barrel-count uint)
    (presale-percentage uint)
    (public-percentage uint)
    (distillery (string-utf8 256))
    (spirit-type (string-utf8 256))
    (age-statement uint)
    (entry-proof uint)
    (location (string-utf8 256))
    (uri (string-utf8 256)))
  (let
    (
      (batch-id (var-get next-batch-id))
      (total-tokens (* barrel-count TOKENS-PER-BARREL))
      (presale-tokens (/ (* total-tokens presale-percentage) u100))
      (public-tokens (/ (* total-tokens public-percentage) u100))
      (treasury-tokens (- total-tokens (+ presale-tokens public-tokens)))
    )
    (begin
      ;; Validate inputs
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
      (asserts! (> barrel-count u0) (err ERR-INVALID-PARAMS))
      (asserts! (<= (+ presale-percentage public-percentage) u100) (err ERR-INVALID-ALLOCATION))
      (asserts! (> (len batch-name) u0) (err ERR-INVALID-PARAMS))
      (asserts! (> (len distillery) u0) (err ERR-INVALID-PARAMS))
      (asserts! (> age-statement u0) (err ERR-INVALID-PARAMS))
      (asserts! (> entry-proof u0) (err ERR-INVALID-PARAMS))

      ;; Store batch metadata
      (map-set batches {batch-id: batch-id}
        {
          name: batch-name,
          barrel-count: barrel-count,
          tokens-per-barrel: TOKENS-PER-BARREL,
          total-tokens: total-tokens,
          presale-allocation: presale-tokens,
          public-allocation: public-tokens,
          treasury-allocation: treasury-tokens,
          barrel-ids: (list),
          minting-complete: false,
          created-at: u0,
          created-by: tx-sender
        })

      ;; Store barrel metadata template
      (map-set barrel-metadata-template {batch-id: batch-id}
        {
          distillery: distillery,
          spirit-type: spirit-type,
          age-statement: age-statement,
          entry-proof: entry-proof,
          fill-date: u0,
          location: location,
          uri: uri
        })

      ;; Initialize minting status
      (map-set batch-minting-status {batch-id: batch-id}
        {
          barrels-minted: u0,
          tokens-minted: false
        })

      ;; Increment batch ID for next batch
      (var-set next-batch-id (+ batch-id u1))

      (ok batch-id)
    )))

;; Mint barrels for a batch (called by admin)
;; batch-start-id: the first barrel ID to mint
;; barrel-count: how many barrels to mint in this transaction
(define-public (mint-batch-barrels
    (batch-id uint)
    (barrel-start-id uint)
    (barrel-count uint)
    (owner principal))
  (let
    (
      (batch (unwrap! (map-get? batches {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND)))
      (template (unwrap! (map-get? barrel-metadata-template {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND)))
      (status (unwrap! (map-get? batch-minting-status {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND)))
    )
    (begin
      ;; Validate preconditions
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
      (asserts! (not (get minting-complete batch)) (err ERR-BATCH-ALREADY-COMPLETE))
      (asserts! (> barrel-count u0) (err ERR-INVALID-PARAMS))
      (asserts! (<= (+ (get barrels-minted status) barrel-count) (get barrel-count batch)) (err ERR-INVALID-PARAMS))

      ;; Store updated status
      (map-set batch-minting-status {batch-id: batch-id}
        {
          barrels-minted: (+ (get barrels-minted status) barrel-count),
          tokens-minted: (get tokens-minted status)
        })

      ;; Return success - in production, this would mint barrels via contract-call
      ;; to the barrel-nft contract. The actual barrel minting is coordinated externally.
      ;; For now, we track that barrels should be minted with these parameters.
      (ok {
        barrels-to-mint: barrel-count,
        starting-id: barrel-start-id,
        owner: owner,
        batch-metadata: template,
        batch-name: (get name batch)
      })
    )))

;; Mark barrels as minted and finalize batch
(define-public (finalize-batch-minting (batch-id uint))
  (let
    (
      (batch (unwrap! (map-get? batches {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND)))
      (status (unwrap! (map-get? batch-minting-status {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND)))
    )
    (begin
      ;; Validate preconditions
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
      (asserts! (not (get minting-complete batch)) (err ERR-BATCH-ALREADY-COMPLETE))
      (asserts! (>= (get barrels-minted status) (get barrel-count batch)) (err ERR-INVALID-PARAMS))

      ;; Mark batch as complete
      (map-set batches {batch-id: batch-id}
        (merge batch {
          minting-complete: true
        }))

      (ok true)
    )))

;; Get allocation breakdown for a batch
(define-read-only (get-batch-allocation (batch-id uint))
  (match (map-get? batches {batch-id: batch-id})
    batch (ok {
      total-tokens: (get total-tokens batch),
      presale-allocation: (get presale-allocation batch),
      public-allocation: (get public-allocation batch),
      treasury-allocation: (get treasury-allocation batch),
      presale-price: PRESALE-PRICE,
      public-price: PUBLIC-SALE-PRICE
    })
    (err ERR-BATCH-NOT-FOUND)))

;; Get batch summary
(define-read-only (get-batch-summary (batch-id uint))
  (match (map-get? batches {batch-id: batch-id})
    batch (ok {
      id: batch-id,
      name: (get name batch),
      barrel-count: (get barrel-count batch),
      total-tokens: (get total-tokens batch),
      minting-complete: (get minting-complete batch),
      created-at: (get created-at batch),
      created-by: (get created-by batch)
    })
    (err ERR-BATCH-NOT-FOUND)))
