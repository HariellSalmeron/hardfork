;; PreSaleContract
;; Early token sale at a discounted price.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-CONTRACT-PAUSED u101)
(define-constant ERR-NOT-WHITELISTED u102)
(define-constant ERR-EXCEEDS-ALLOCATION u103)
(define-constant ERR-INSUFFICIENT-PRESALE u104)
(define-constant ERR-INVALID-AMOUNT u105)
(define-constant ERR-MINT-FAILED u107)
(define-constant ERR-INSUFFICIENT-STX u108)

(define-constant PRESALE-PRICE u750000000)
(define-constant DEFAULT-MAX-PER-BUYER u1000)
(define-constant DEFAULT-PRESALE-ALLOCATION u25000)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var total-sold uint u0)
(define-data-var max-per-buyer uint DEFAULT-MAX-PER-BUYER)
(define-data-var total-allocation uint DEFAULT-PRESALE-ALLOCATION)
(define-data-var proceeds-recipient principal tx-sender)

(define-map whitelisted-buyers {buyer: principal} {allowed: bool})
(define-map purchases {buyer: principal} {purchased: uint})

(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-private (is-whitelisted (buyer principal))
  (match (map-get? whitelisted-buyers {buyer: buyer})
    entry (get allowed entry) false))

(define-read-only (get-owner)
  (var-get contract-owner))

(define-read-only (get-paused)
  (var-get paused))

(define-read-only (get-price)
  PRESALE-PRICE)

(define-read-only (get-max-per-buyer)
  (var-get max-per-buyer))

(define-read-only (get-total-sold)
  (var-get total-sold))

(define-read-only (get-total-allocation)
  (var-get total-allocation))

(define-read-only (get-purchased (buyer principal))
  (match (map-get? purchases {buyer: buyer})
    entry (get purchased entry) u0))

(define-read-only (get-allocation (buyer principal))
  (let ((purchased (get-purchased buyer)))
    (if (>= purchased (var-get max-per-buyer))
        u0
        (- (var-get max-per-buyer) purchased))))

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

(define-public (set-max-per-buyer (amount uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (var-set max-per-buyer amount)
    (ok true)))

(define-public (set-allocation (amount uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (var-set total-allocation amount)
    (ok true)))

(define-public (whitelist-buyer (buyer principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (map-set whitelisted-buyers {buyer: buyer} {allowed: true})
    (ok true)))

(define-public (remove-whitelist (buyer principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (map-set whitelisted-buyers {buyer: buyer} {allowed: false})
    (ok true)))

(define-public (set-proceeds-recipient (recipient principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set proceeds-recipient recipient)
    (ok true)))

(define-public (buy (token-amount uint))
  (let ((current-purchased (get-purchased tx-sender))
        (price (* token-amount PRESALE-PRICE)))
    (begin
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (is-whitelisted tx-sender) (err ERR-NOT-WHITELISTED))
      (asserts! (> token-amount u0) (err ERR-INVALID-AMOUNT))
      (asserts! (<= (+ current-purchased token-amount) (var-get max-per-buyer)) (err ERR-EXCEEDS-ALLOCATION))
      (asserts! (<= (+ (var-get total-sold) token-amount) (var-get total-allocation)) (err ERR-INSUFFICIENT-PRESALE))

      ;; STX check
      (asserts! (>= (stx-get-balance tx-sender) price) (err ERR-INSUFFICIENT-STX))

      ;; Transfer STX
      (asserts! (is-ok (stx-transfer? price tx-sender (var-get proceeds-recipient))) (err ERR-INSUFFICIENT-STX))

      ;; MINT TOKENS
      (asserts!
        (is-ok (contract-call? .barrel-token206 mint tx-sender token-amount))
        (err ERR-MINT-FAILED))

      ;; Record purchase
      (map-set purchases {buyer: tx-sender}
        {purchased: (+ current-purchased token-amount)})

      (var-set total-sold (+ (var-get total-sold) token-amount))

      (ok {
        buyer: tx-sender,
        tokens-purchased: token-amount,
        price: price
      }))))