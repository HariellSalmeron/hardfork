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

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)

;; helpers
(define-private (is-owner (sender principal))
  (is-eq sender (var-get contract-owner)))

;; utils
(define-read-only (get-owner) (var-get contract-owner))
(define-read-only (get-paused) (var-get paused))
(define-read-only (get-balance)
  ;; caller's STX balance (for reference)
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
    ;; ensure contract has sufficient balance
    (let ((bal (stx-get-balance tx-sender)))
      (asserts! (>= bal amount) (err ERR-INSUFFICIENT-BALANCE)))
    ;; perform transfer; use stx-transfer? to handle failure
    (match (stx-transfer? amount recipient tx-sender)
      success (ok success)
      failure (err failure))))

;; fallback receivable function
(define-public (receive-stx)
  (ok true)) ;; allows receiving STX

;; end treasury contract
