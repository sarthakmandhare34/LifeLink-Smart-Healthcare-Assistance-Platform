# Phase 51 — Workspace Entry Motion and Verification

## Live route checks

The live patient destination (`/login`) renders the patient sign-in interface, and the live clinician destination (`/doctor/login`) renders the separate clinician email/password form. Both workspace destinations are reachable and retain the intended patient-versus-clinician boundary. The entry selector was also rechecked with the concise clinician card and reduced-motion-safe switching transition.

## Remaining verification

Clinician credentials are private to the owner. The owner-only `/doctor/setup` page is open for account creation, email retrieval, or one-time password replacement. An owner takeover is required to submit a credential and confirm the assigned-appointment view without exposing it in chat.
