;; BatchRegistry contract
;; Tracks production batches, barrel assignments, and key registry metadata.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-CONTRACT-PAUSED u101)
(define-constant ERR-BATCH-EXISTS u102)
(define-constant ERR-BATCH-NOT-FOUND u103)
(define-constant ERR-BARREL-ALREADY-REGISTERED u104)
(define-constant ERR-INVALID-PARAMS u106)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)

(define-map batches {batch-id: uint}
  {
    metadata: (string-utf8 256),
    minting-date: uint,
    barrels-complete: uint,
    barrel-count: uint
  })

(define-map barrel-batch {barrel-id: uint}
  {
    batch-id: uint
  })

(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-private (batch-exists? (batch-id uint))
  (is-some (map-get? batches {batch-id: batch-id})))

(define-private (barrel-registered? (barrel-id uint))
  (is-some (map-get? barrel-batch {barrel-id: barrel-id})))

(define-read-only (get-owner)
  (var-get contract-owner))

(define-read-only (get-paused)
  (var-get paused))

(define-read-only (get-batch-info (batch-id uint))
  (map-get? batches {batch-id: batch-id}))

(define-read-only (get-batch-barrels-complete (batch-id uint))
  (match (map-get? batches {batch-id: batch-id})
    entry (some (get barrels-complete entry))
    none))

(define-read-only (get-barrel-batch (barrel-id uint))
  (map-get? barrel-batch {barrel-id: barrel-id}))

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

(define-public (register-batch (batch-id uint) (barrel-count uint) (metadata (string-utf8 256)))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (not (batch-exists? batch-id)) (err ERR-BATCH-EXISTS))
    (asserts! (> barrel-count u0) (err ERR-INVALID-PARAMS))

    (map-set batches {batch-id: batch-id}
      {
        metadata: metadata,
        minting-date: u0,
        barrels-complete: u0,
        barrel-count: barrel-count
      })
    (ok true)))

(define-public (add-barrel (batch-id uint) (barrel-id uint))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (batch-exists? batch-id) (err ERR-BATCH-NOT-FOUND))
    (asserts! (not (barrel-registered? barrel-id)) (err ERR-BARREL-ALREADY-REGISTERED))

    (let ((entry (unwrap! (map-get? batches {batch-id: batch-id}) (err ERR-BATCH-NOT-FOUND))))
      (map-set batches {batch-id: batch-id}
        {
          metadata: (get metadata entry),
          minting-date: (get minting-date entry),
          barrels-complete: (+ (get barrels-complete entry) u1),
          barrel-count: (get barrel-count entry)
        })
      (map-set barrel-batch {barrel-id: barrel-id} { batch-id: batch-id })
      (ok true))))
