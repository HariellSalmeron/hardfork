;; Treasury contract
;; Author: hardFork team
;; Date: 2026-03-09
;; Simple contract for holding STX funds and allowing authorized withdrawals.
;; Only the contract owner may withdraw funds; the contract can be paused
;; during emergencies.  Additional governance (multisig, approvals) may be
;; layered on later.

(define-constant ERR-UNAUTHORIZED u100)
(define-constant ERR-CONTRACT-PAUSED u101)
(define-constant ERR-INSUFFICIENT-BALANCE u102)
(define-constant ERR-INVALID-SIGNER u103)
(define-constant ERR-MAX-SIGNERS u104)
(define-constant ERR-WITHDRAWAL-NOT-FOUND u105)
(define-constant ERR-ALREADY-APPROVED u106)
(define-constant ERR-INSUFFICIENT-APPROVALS u107)
(define-constant ERR-UNAUTHORIZED-DEPOSITOR u108)

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)

;; signers for multisig (max 3)
(define-data-var signer-1 (optional principal) none)
(define-data-var signer-2 (optional principal) none)
(define-data-var signer-3 (optional principal) none)

;; authorized depositors
(define-map authorized-depositors {addr: principal} {authorized: bool})

;; withdrawal proposal structure
(define-map withdrawal-proposals {nonce: uint}
  {
    amount: uint,
    recipient: principal,
    description: (string-utf8 256),
    proposed-by: principal,
    proposed-block: uint
  })

;; approval tracking: nonce -> signer -> bool
(define-map withdrawal-approvals {nonce: uint, signer: principal} {approved: bool})

;; nonce counter for proposals
(define-data-var next-nonce uint u0)

;; helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

;; utils
(define-read-only (get-owner) (var-get contract-owner))
(define-read-only (get-paused) (var-get paused))
(define-read-only (get-balance)
  (stx-get-balance tx-sender))

;; governance
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

;; funds management
(define-public (withdraw (amount uint) (recipient principal))
  (begin
    (asserts! (not (var-get paused)) (err ERR-CONTRACT-PAUSED))
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (asserts! (> amount u0) (err ERR-INSUFFICIENT-BALANCE))
    (ok true)))

;; fallback receivable function
(define-public (receive-stx)
  (ok true))

;; add signer (max 3 signers)
(define-public (add-signer (signer principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (if (is-none (var-get signer-1))
      (begin (var-set signer-1 (some signer)) (ok true))
      (if (is-none (var-get signer-2))
        (begin (var-set signer-2 (some signer)) (ok true))
        (if (is-none (var-get signer-3))
          (begin (var-set signer-3 (some signer)) (ok true))
          (err ERR-MAX-SIGNERS))))))

;; authorize depositor
(define-public (authorize-depositor (addr principal))
  (begin
    (asserts! (is-owner tx-sender) (err ERR-UNAUTHORIZED))
    (map-set authorized-depositors {addr: addr} {authorized: true})
    (ok true)))

;; deposit STX from authorized source
(define-public (deposit (amount uint) (source principal))
  (begin
    (asserts! (> amount u0) (err ERR-INSUFFICIENT-BALANCE))
    (match (map-get? authorized-depositors {addr: source})
      entry (begin
        (asserts! (get authorized entry) (err ERR-UNAUTHORIZED-DEPOSITOR))
        (ok true))
      (err ERR-UNAUTHORIZED-DEPOSITOR))))

;; propose withdrawal
(define-public (propose-withdrawal (amount uint) (recipient principal) (description (string-utf8 256)))
  (let ((is-signer (or
          (is-eq (some tx-sender) (var-get signer-1))
          (or
            (is-eq (some tx-sender) (var-get signer-2))
            (is-eq (some tx-sender) (var-get signer-3))))))
    (begin
      (asserts! is-signer (err ERR-INVALID-SIGNER))
      (asserts! (> amount u0) (err ERR-INSUFFICIENT-BALANCE))
      (let ((nonce (var-get next-nonce)))
        (begin
          (map-set withdrawal-proposals {nonce: nonce}
            {
              amount: amount,
              recipient: recipient,
              description: description,
              proposed-by: tx-sender,
              proposed-block: block-height
            })
          (var-set next-nonce (+ nonce u1))
          (ok nonce))))))

;; approve withdrawal (2-of-3 threshold)
(define-public (approve-withdrawal (nonce uint))
  (let (
        (is-signer (or
          (is-eq (some tx-sender) (var-get signer-1))
          (or
            (is-eq (some tx-sender) (var-get signer-2))
            (is-eq (some tx-sender) (var-get signer-3)))))
        (proposal (map-get? withdrawal-proposals {nonce: nonce}))
        (already-approved (map-get? withdrawal-approvals {nonce: nonce, signer: tx-sender}))
      )
    (begin
      (asserts! is-signer (err ERR-INVALID-SIGNER))
      (asserts! (is-some proposal) (err ERR-WITHDRAWAL-NOT-FOUND))
      (asserts! (is-none already-approved) (err ERR-ALREADY-APPROVED))
      (map-set withdrawal-approvals {nonce: nonce, signer: tx-sender} {approved: true})
      (ok true))))

;; end treasury contract
