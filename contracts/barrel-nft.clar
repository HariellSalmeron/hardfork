;; Product Redemption Instrument NFT - SIP009 with Complex Metadata
;; This contract issues digital instruments for whiskey governance, production control,
;; and bottled product redemption rights.
;; Hard Fork retains operational control over production, aging, bottling, and distribution.
;; These instruments represent governance participation and the ability to redeem bottled whiskey.
;; They do not confer, imply, or vest legal ownership of any physical barrel.
;; Physical barrel ownership remains exclusively with Focus Distilling and Bottling.
;; The instruments are not backed by barrel value; they are linked to bottled product outcomes.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-NON-EXISTENT-TOKEN u101)
(define-constant ERR-CONTRACT-PAUSED u102)
(define-constant ERR-INVALID-METADATA u103)

;; redemption instrument metadata structure
(define-map instrument-metadata {instrument-id: uint}
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
(define-data-var production-facility principal tx-sender) ;; Focus Distilling and Bottling retains legal title to physical barrels

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

(define-read-only (get-production-facility)
  ;; Returns the legal production facility that retains physical barrel ownership.
  (var-get production-facility))

(define-read-only (get-physical-asset-owner)
  ;; The production facility is the exclusive legal owner of the underlying barrels.
  (var-get production-facility))

;; redemption instrument-specific read-only functions
(define-read-only (get-instrument-metadata (instrument-id uint))
  (map-get? instrument-metadata {instrument-id: instrument-id}))

(define-read-only (get-instrument-batch (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get batch-id metadata))
    none))

(define-read-only (get-instrument-distillery (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get distillery metadata))
    none))

(define-read-only (get-instrument-spirit-type (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get spirit-type metadata))
    none))

(define-read-only (get-instrument-age-statement (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get age-statement metadata))
    none))

(define-read-only (get-instrument-entry-proof (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get entry-proof metadata))
    none))

(define-read-only (get-instrument-fill-date (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get fill-date metadata))
    none))

(define-read-only (get-instrument-location (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
    metadata (some (get location metadata))
    none))

(define-read-only (get-instrument-uri (instrument-id uint))
  (match (map-get? instrument-metadata {instrument-id: instrument-id})
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
    ;; Set the production facility that retains legal title to the underlying barrels.
    ;; Hard Fork retains operational control via the smart contract and governance rights.
    (var-set production-facility new-facility)
    (ok true)))

;; core redemption instrument functions
(define-public (mint-instrument
    (instrument-id uint)
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
    (asserts! (not (token-exists? instrument-id)) (err ERR-INVALID-METADATA))

    ;; validate metadata
    (asserts! (> (len (get distillery metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get spirit-type metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get age-statement metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get entry-proof metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (get fill-date metadata) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get location metadata)) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len (get uri metadata)) u0) (err ERR-INVALID-METADATA))

    ;; set ownership and metadata
    (map-set token-owner {id: instrument-id} {owner: owner})
    (map-set instrument-metadata {instrument-id: instrument-id}
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

    (ok instrument-id)))

;; transfer instrument ownership of the NFT token only
(define-public (transfer (instrument-id uint) (recipient principal))
  (let (
        (owner (unwrap! (get-owner instrument-id) (err ERR-NON-EXISTENT-TOKEN)))
        (approval (map-get? token-approvals {id: instrument-id}))
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

      (map-set token-owner {id: instrument-id} {owner: recipient})
      (map-delete token-approvals {id: instrument-id})

      (ok true))))

;; approve transfer
(define-public (approve (instrument-id uint) (approved principal))
  (let ((owner (unwrap! (get-owner instrument-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-set token-approvals {id: instrument-id} {approved: approved})
      (ok true))))

;; burn instrument (retire on bottling/redemption)
(define-public (burn-instrument (instrument-id uint))
  (let ((owner (unwrap! (get-owner instrument-id) (err ERR-NON-EXISTENT-TOKEN))))
    (begin
      (asserts! (is-eq owner tx-sender) (err ERR-UNAUTHORIZED))
      (map-delete token-owner {id: instrument-id})
      (map-delete instrument-metadata {instrument-id: instrument-id})
      (map-delete token-approvals {id: instrument-id})
      (ok true))))

;; update instrument metadata (admin only, for aging updates)
(define-public (update-instrument-metadata
    (instrument-id uint)
    (new-location (string-utf8 256))
    (new-age-statement uint))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (token-exists? instrument-id) (err ERR-NON-EXISTENT-TOKEN))

    (let ((current-metadata (unwrap! (get-instrument-metadata instrument-id) (err ERR-NON-EXISTENT-TOKEN))))
      (map-set instrument-metadata {instrument-id: instrument-id}
        (merge current-metadata {
          location: new-location,
          age-statement: new-age-statement
        }))
      (ok true))))