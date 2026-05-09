;; PublicSaleContract
;; Open token sale at standard price.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-CONTRACT-PAUSED u101)
(define-constant ERR-INSUFFICIENT-ALLOCATION u102)
(define-constant ERR-INVALID-AMOUNT u103)
(define-constant ERR-EXCEEDS-LIMIT u104)

(define-constant PUBLIC-SALE-PRICE u1000000000) ;; 10 STX in microSTX
(define-constant MAX-PER-TX u500)
(define-constant DEFAULT-TOTAL-ALLOCATION u25000)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var total-sold uint u0)
(define-data-var total-allocation uint DEFAULT-TOTAL-ALLOCATION)

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

(define-public (buy (token-amount uint))
  (let ((available (get-available))
        (price (* token-amount PUBLIC-SALE-PRICE)))
    (begin
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts! (> token-amount u0) (err ERR-INVALID-AMOUNT))
      (asserts! (<= token-amount MAX-PER-TX) (err ERR-EXCEEDS-LIMIT))
      (asserts! (<= token-amount available) (err ERR-INSUFFICIENT-ALLOCATION))
      (var-set total-sold (+ (var-get total-sold) token-amount))
      (ok {
        buyer: tx-sender,
        tokens-purchased: token-amount,
        price: price,
        remaining: (- available token-amount)
      }))))
