;; BarrelToken - SIP010
;; Simple adaptation of the governance token for a single token named "$BARREL".
;; Replace constants as needed before deployment (owner, allocation sizes).

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-INSUFFICIENT-BALANCE u101)
(define-constant ERR-INSUFFICIENT-ALLOWANCE u102)
(define-constant ERR-NON-POSITIVE u103)
(define-constant ERR-CONTRACT-PAUSED u104)

;; configuration
(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var total-supply uint u0)
(define-data-var authorized-minter (optional principal) none)

;; token per barrel (adjust if you want a different per-barrel amount)
(define-constant TOKENS_PER_BARREL u250)

;; token metadata
(define-constant TOKEN-NAME "BarrelToken")
(define-constant TOKEN-SYMBOL "BARREL")
(define-constant TOKEN-DECIMALS u6)

;; balances and allowances
(define-map balances {owner: principal} {amount: uint})
(define-map allowances {owner: principal, spender: principal} {amount: uint})

;; helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-constant SALE-CONTRACT-PUBLIC-221 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.public-sale)
(define-constant SALE-CONTRACT-PRESALE-221 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.presale)
(define-constant SALE-CONTRACT-PUBLIC-224 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.public-sale224)
(define-constant SALE-CONTRACT-PRESALE-224 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.presale224)
(define-constant SALE-CONTRACT-PUBLIC-225 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.public-saleContract6)
(define-constant SALE-CONTRACT-PRESALE-225 'SPBE9FSXQHX9FPGDAHJYTXDZ9X99HQBH835A3Y1F.presaleContract6)

(define-private (is-sale-contract (sender principal))
  (or
    (is-eq sender SALE-CONTRACT-PUBLIC-221)
    (is-eq sender SALE-CONTRACT-PRESALE-221)
    (is-eq sender SALE-CONTRACT-PUBLIC-224)
    (is-eq sender SALE-CONTRACT-PRESALE-224)
    (is-eq sender SALE-CONTRACT-PUBLIC-225)
    (is-eq sender SALE-CONTRACT-PRESALE-225)))

(define-private (is-authorized-minter)
  (or
    (is-sale-contract contract-caller)
    (match (var-get authorized-minter)
      minter (or (is-eq tx-sender minter) (is-eq contract-caller minter))
      false)))

(define-private (get-balance (owner principal))
  (match (map-get? balances {owner: owner})
    entry (get amount entry)
    u0))

(define-private (set-balance (owner principal) (amt uint))
  (map-set balances {owner: owner} {amount: amt}))

(define-private (get-allowance (owner principal) (spender principal))
  (match (map-get? allowances {owner: owner, spender: spender})
    entry (get amount entry)
    u0))

(define-private (set-allowance (owner principal) (spender principal) (amt uint))
  (map-set allowances {owner: owner, spender: spender} {amount: amt}))

;; read-only
(define-read-only (get-name) TOKEN-NAME)
(define-read-only (get-symbol) TOKEN-SYMBOL)
(define-read-only (get-decimals) TOKEN-DECIMALS)
(define-read-only (get-total-supply) (var-get total-supply))

(define-read-only (get-balance-of (owner principal))
  (get-balance owner))

(define-read-only (get-allowance-of (owner principal) (spender principal))
  (get-allowance owner spender))

;; admin
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

;; token transfer
(define-public (transfer (recipient principal) (amount uint))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (asserts! (> amount u0) (err ERR-NON-POSITIVE))
    (let (
        (sender tx-sender)
        (bal (get-balance tx-sender))
      )
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE))
      (set-balance sender (- bal amount))
      (set-balance recipient (+ (get-balance recipient) amount))
      (ok true))))

;; approve spending
(define-public (approve (spender principal) (amount uint))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (set-allowance tx-sender spender amount)
    (ok true)))

;; transfer using allowance
(define-public (transfer-from (owner principal) (recipient principal) (amount uint))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (let (
        (spender (if (is-eq contract-caller tx-sender) tx-sender contract-caller))
        (allow (get-allowance owner (if (is-eq contract-caller tx-sender) tx-sender contract-caller)))
        (bal (get-balance owner))
      )
      (asserts! (>= allow amount) (err ERR-INSUFFICIENT-ALLOWANCE))
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE))

      (set-allowance owner spender (- allow amount))
      (set-balance owner (- bal amount))
      (set-balance recipient (+ (get-balance recipient) amount))

      (ok true))))

;; mint (owner or authorized minter)
(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (or (is-owner tx-sender) (is-authorized-minter)) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-NON-POSITIVE))
    (set-balance recipient (+ (get-balance recipient) amount))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))

;; mint for barrel (mints TOKENS_PER_BARREL tokens)
(define-public (mint-for-barrel (recipient principal))
  (begin
    (asserts! (or (is-owner tx-sender) (is-authorized-minter)) (err ERR-UNAUTHORIZED))
    (set-balance recipient (+ (get-balance recipient) TOKENS_PER_BARREL))
    (var-set total-supply (+ (var-get total-supply) TOKENS_PER_BARREL))
    (ok true)))

;; burn
(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-NON-POSITIVE))
    (let ((burner (if (is-eq contract-caller tx-sender) tx-sender contract-caller))
          (bal (get-balance (if (is-eq contract-caller tx-sender) tx-sender contract-caller))))
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE))
      (set-balance burner (- bal amount))
      (var-set total-supply (- (var-get total-supply) amount))
      (ok true))))

;; set authorized minter
(define-public (set-authorized-minter (minter principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set authorized-minter (some minter))
    (ok true)))
