;; GovernanceToken - SIP010

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-INSUFFICIENT-BALANCE u101)
(define-constant ERR-INSUFFICIENT-ALLOWANCE u102)
(define-constant ERR-NON-POSITIVE u103)
(define-constant ERR-CONTRACT-PAUSED u104)

;; configuration
(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var total-supply uint u0)

;; token metadata
(define-constant TOKEN-NAME "GovernanceToken")
(define-constant TOKEN-SYMBOL "GOV")
(define-constant TOKEN-DECIMALS u6)

;; balances and allowances
(define-map balances {owner: principal} {amount: uint})
(define-map allowances {owner: principal, spender: principal} {amount: uint})

;; delegation
(define-map delegation {delegator: principal} {delegatee: principal})

;; helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

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

;; delegation read
(define-read-only (get-delegated (delegator principal))
  (match (map-get? delegation {delegator: delegator})
    entry (get delegatee entry)
    delegator))

(define-read-only (get-voting-power (account principal))
  (get-balance account))

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
        (allow (get-allowance owner tx-sender))
        (bal (get-balance owner))
      )
      (asserts! (>= allow amount) (err ERR-INSUFFICIENT-ALLOWANCE))
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE))

      (set-allowance owner tx-sender (- allow amount))
      (set-balance owner (- bal amount))
      (set-balance recipient (+ (get-balance recipient) amount))

      (ok true))))

;; mint
(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-NON-POSITIVE))
    (set-balance recipient (+ (get-balance recipient) amount))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))

;; burn
(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-NON-POSITIVE))
    (let ((bal (get-balance tx-sender)))
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE))
      (set-balance tx-sender (- bal amount))
      (var-set total-supply (- (var-get total-supply) amount))
      (ok true))))

;; delegation
(define-public (delegate (delegatee principal))
  (begin
    (map-set delegation {delegator: tx-sender} {delegatee: delegatee})
    (ok true)))