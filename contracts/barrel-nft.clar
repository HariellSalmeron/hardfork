;; Barrel NFT - SIP009

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-NON-EXISTENT-TOKEN u101)
(define-constant ERR-CONTRACT-PAUSED u102)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var next-token-id uint u1)

(define-data-var facility principal tx-sender)

(define-map token-owner {id: uint} {owner: principal})
(define-map token-uri {id: uint} {uri: (string-utf8 256)})
(define-map token-approvals {id: uint} {approved: principal})

;; helpers

(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-private (token-exists? (id uint))
  (is-some (map-get? token-owner {id: id})))

;; read-only

(define-read-only (get-owner (id uint))
  (match (map-get? token-owner {id: id})
    entry (some (get owner entry))
    none))

(define-read-only (get-uri (id uint))
  (match (map-get? token-uri {id: id})
    entry (some (get uri entry))
    none))

(define-read-only (get-approved (id uint))
  (match (map-get? token-approvals {id: id})
    entry (some (get approved entry))
    none))

(define-read-only (get-facility)
  (var-get facility))

;; admin

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

;; mint

(define-public (mint (recipient principal) (uri (string-utf8 256)))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))

    (let ((token-id (var-get next-token-id)))
      (map-set token-owner {id: token-id} {owner: recipient})
      (map-set token-uri {id: token-id} {uri: uri})
      (var-set next-token-id (+ token-id u1))
      (ok token-id))))

;; approve

(define-public (approve (token-id uint) (approved principal))
  (let ((owner (unwrap! (get-owner token-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-set token-approvals {id: token-id} {approved: approved})
      (ok true))))

;; transfer

(define-public (transfer (token-id uint) (recipient principal))
  (let (
        (owner (unwrap! (get-owner token-id) (err ERR-NON-EXISTENT-TOKEN)))
        (approval (map-get? token-approvals {id: token-id}))
      )
    (begin
      (asserts!
        (or
          (is-eq owner tx-sender)
          (match approval
            entry (is-eq (get approved entry) tx-sender)
            false))
        (err ERR-UNAUTHORIZED))

      (map-set token-owner {id: token-id} {owner: recipient})
      (map-delete token-approvals {id: token-id})

      (ok true))))

;; burn

(define-public (burn (token-id uint))
  (let ((owner (unwrap! (get-owner token-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-delete token-owner {id: token-id})
      (map-delete token-uri {id: token-id})
      (map-delete token-approvals {id: token-id})
      (ok true))))