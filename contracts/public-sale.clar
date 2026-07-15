;; PublicSaleContract
;; Open token sale at standard price.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-CONTRACT-PAUSED u101)
(define-constant ERR-INSUFFICIENT-ALLOCATION u102)
(define-constant ERR-INVALID-AMOUNT u103)
(define-constant ERR-EXCEEDS-LIMIT u104)
(define-constant ERR-MINT-FAILED u106)
(define-constant ERR-INSUFFICIENT-STX u107)

(define-constant PUBLIC-SALE-PRICE u10000000) ;; 0.1 STX in microSTX (for testing)
(define-constant MAX-PER-TX u500)
(define-constant DEFAULT-TOTAL-ALLOCATION u25000)
(define-constant PUBLIC-SALE-PRINCIPAL 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.public-sale206)
(define-constant BARREL-TOKEN-PRINCIPAL 'STC5KHM41H6WHAST7MWWDD807YSPRQKJ68T330BQ.barrel-token206)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var total-sold uint u0)
(define-data-var total-allocation uint DEFAULT-TOTAL-ALLOCATION)
(define-data-var proceeds-recipient principal PUBLIC-SALE-PRINCIPAL)

(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-read-only (get-owner)
  (var-get contract-owner))

(define-read-only (get-paused)
  (var-get paused))

(define-read-only (get-price)
  PUBLIC-SALE-PRICE)

(define-read-only (get-total-sold)
  (var-get total-sold))

(define-read-only (get-total-allocation)
  (var-get total-allocation))

(define-read-only (get-available)
  (let ((sold (var-get total-sold))
        (allocation (var-get total-allocation)))
    (if (>= sold allocation)
        u0
        (- allocation sold))))

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

(define-public (set-allocation (amount uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (var-set total-allocation amount)
    (ok true)))

(define-public (set-proceeds-recipient (recipient principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set proceeds-recipient recipient)
    (ok true)))

(define-public (buy (token-amount uint))
  (let ((available (get-available))
        (price (* token-amount PUBLIC-SALE-PRICE)))
    (begin
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (> token-amount u0) (err ERR-INVALID-AMOUNT))
      (asserts! (<= token-amount MAX-PER-TX) (err ERR-EXCEEDS-LIMIT))
      (asserts! (<= token-amount available) (err ERR-INSUFFICIENT-ALLOCATION))
      
      ;; Check buyer has sufficient STX
      (asserts! (>= (stx-get-balance tx-sender) price) (err ERR-INSUFFICIENT-STX))
      
      ;; Transfer STX from buyer to proceeds recipient (contract itself by default)
      (asserts! (is-ok (stx-transfer? price tx-sender (var-get proceeds-recipient))) (err ERR-INSUFFICIENT-STX))
      
      ;; Mint tokens to buyer via barrel-token contract
      (asserts! (is-ok (contract-call? .barrel-token206 mint tx-sender token-amount)) (err ERR-MINT-FAILED))
      
      ;; Record sale
      (var-set total-sold (+ (var-get total-sold) token-amount))
      (ok {
        buyer: tx-sender,
        tokens-purchased: token-amount,
        price: price,
        remaining: (- available token-amount)
      }))))

(define-public (sell (token-amount uint))
  (let ((price (* token-amount PUBLIC-SALE-PRICE)))
    (begin
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (> token-amount u0) (err ERR-INVALID-AMOUNT))
      (asserts! (<= token-amount MAX-PER-TX) (err ERR-EXCEEDS-LIMIT))
      (asserts! (>= (stx-get-balance PUBLIC-SALE-PRINCIPAL) price) (err ERR-INSUFFICIENT-STX))

      ;; Transfer tokens from seller to this contract
      (asserts! (is-ok (contract-call? .barrel-token206 transfer-from tx-sender PUBLIC-SALE-PRINCIPAL token-amount)) (err ERR-CROSS-CONTRACT-CALL-FAILED))

      ;; Burn the returned tokens from the contract's balance
      (asserts! (is-ok (contract-call? .barrel-token206 burn token-amount)) (err ERR-CROSS-CONTRACT-CALL-FAILED))

      ;; Refund STX to seller
      (asserts! (is-ok (stx-transfer? price PUBLIC-SALE-PRINCIPAL tx-sender)) (err ERR-INSUFFICIENT-STX))

      (var-set total-sold (- (var-get total-sold) token-amount))
      (ok {
        seller: tx-sender,
        tokens-sold: token-amount,
        refund: price
      }))))
