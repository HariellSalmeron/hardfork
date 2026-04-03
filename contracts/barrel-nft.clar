;; Barrel NFT - SIP009 with Complex Metadata

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-NON-EXISTENT-TOKEN u101)
(define-constant ERR-CONTRACT-PAUSED u102)
(define-constant ERR-INVALID-METADATA u103)

;; barrel metadata structure
(define-map barrel-metadata {barrel-id: uint}
  {
    batch-id: (string-utf8 256),      ;; Batch name (e.g., "ACQUISITION-2026-001")
    distillery: (string-utf8 256),    ;; Source distillery
    spirit-type: (string-utf8 256),   ;; "whiskey", "bourbon", etc.
    age-statement: uint,              ;; Years aging
    entry-proof: uint,                ;; Entry proof (e.g., 120)
    fill-date: uint,                  ;; Block height filled
    location: (string-utf8 256),      ;; Storage location
    uri: (string-utf8 256)            ;; IPFS/HTTP metadata URI
  })

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var facility principal tx-sender)

(define-map token-owner {id: uint} {owner: principal})
(define-map token-approvals {id: uint} {approved: principal})

;; helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

(define-private (token-exists? (id uint))
  (is-some (map-get? token-owner {id: id})))

;; read-only functions
(define-read-only (get-owner (id uint))
  (match (map-get? token-owner {id: id})
    entry (some (get owner entry))
    none))

(define-read-only (get-approved (id uint))
  (match (map-get? token-approvals {id: id})
    entry (some (get approved entry))
    none))

(define-read-only (get-facility)
  (var-get facility))

;; barrel-specific read-only functions
(define-read-only (get-barrel-metadata (barrel-id uint))
  (map-get? barrel-metadata {barrel-id: barrel-id}))

(define-read-only (get-barrel-batch (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get batch-id metadata))
    none))

(define-read-only (get-barrel-distillery (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get distillery metadata))
    none))

(define-read-only (get-barrel-spirit-type (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get spirit-type metadata))
    none))

(define-read-only (get-barrel-age-statement (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get age-statement metadata))
    none))

(define-read-only (get-barrel-entry-proof (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get entry-proof metadata))
    none))

(define-read-only (get-barrel-fill-date (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get fill-date metadata))
    none))

(define-read-only (get-barrel-location (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get location metadata))
    none))

(define-read-only (get-barrel-uri (barrel-id uint))
  (match (map-get? barrel-metadata {barrel-id: barrel-id})
    metadata (some (get uri metadata))
    none))

;; admin functions
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

(define-public (set-facility (new-facility principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (var-set facility new-facility)
    (ok true)))

;; core barrel NFT functions
(define-public (mint-barrel
    (barrel-id uint)
    (batch-id (string-utf8 256))
    (owner principal)
    (metadata {
      distillery: (string-utf8 256),
      spirit-type: (string-utf8 256),
      age-statement: uint,
      entry-proof: uint,
      fill-date: uint,
      location: (string-utf8 256),
      uri: (string-utf8 256)
    }))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (asserts! (not (token-exists? barrel-id)) (err ERR-INVALID-METADATA))

    ;; validate metadata
    (asserts! (> (len (get distillery metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get spirit-type metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get age-statement metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get entry-proof metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get fill-date metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get location metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get uri metadata)) u0) (err ERR-INVALID-METADATA))

    ;; set ownership and metadata
    (map-set token-owner {id: barrel-id} {owner: owner})
    (map-set barrel-metadata {barrel-id: barrel-id}
      {
        batch-id: batch-id,
        distillery: (get distillery metadata),
        spirit-type: (get spirit-type metadata),
        age-statement: (get age-statement metadata),
        entry-proof: (get entry-proof metadata),
        fill-date: (get fill-date metadata),
        location: (get location metadata),
        uri: (get uri metadata)
      })

    (ok barrel-id)))

;; transfer ownership
(define-public (transfer (barrel-id uint) (recipient principal))
  (let (
        (owner (unwrap! (get-owner barrel-id) (err ERR-NON-EXISTENT-TOKEN)))
        (approval (map-get? token-approvals {id: barrel-id}))
      )
    (begin
      (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
      (asserts!
        (or
          (is-eq owner tx-sender)
          (match approval
            entry (is-eq (get approved entry) tx-sender)
            false))
        (err ERR-UNAUTHORIZED))

      (map-set token-owner {id: barrel-id} {owner: recipient})
      (map-delete token-approvals {id: barrel-id})

      (ok true))))

;; approve transfer
(define-public (approve (barrel-id uint) (approved principal))
  (let ((owner (unwrap! (get-owner barrel-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-set token-approvals {id: barrel-id} {approved: approved})
      (ok true))))

;; burn barrel (retire on bottling)
(define-public (burn-barrel (barrel-id uint))
  (let ((owner (unwrap! (get-owner barrel-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-delete token-owner {id: barrel-id})
      (map-delete barrel-metadata {barrel-id: barrel-id})
      (map-delete token-approvals {id: barrel-id})
      (ok true))))

;; update barrel metadata (admin only, for aging updates)
(define-public (update-barrel-metadata
    (barrel-id uint)
    (new-location (string-utf8 256))
    (new-age-statement uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (token-exists? barrel-id) (err ERR-NON-EXISTENT-TOKEN))

    (let ((current-metadata (unwrap! (get-barrel-metadata barrel-id) (err ERR-NON-EXISTENT-TOKEN))))
      (map-set barrel-metadata {barrel-id: barrel-id}
        (merge current-metadata {
          location: new-location,
          age-statement: new-age-statement
        }))
      (ok true))))