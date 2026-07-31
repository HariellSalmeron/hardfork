;; Placeholder treasury contract to unblock Clarinet parsing.
(define-constant ERR-UNAUTHORIZED u100)
(define-read-only (get-owner)
  tx-sender)
