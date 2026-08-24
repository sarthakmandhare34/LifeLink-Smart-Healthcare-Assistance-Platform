# Phase 35 — Five-Minute Inactivity Logout

## Implementation

The authenticated patient shell now registers an inactivity timer only while a patient is signed in. Mouse movement, keyboard input, mouse presses, touch starts, and scrolling reset the five-minute countdown. The timer is cleared and all listeners are removed when the shell unmounts, the user signs out, or the timeout fires.

On timeout, LifeLink calls the existing secure logout action, shows a clear notification, and returns the patient to `/login`. The redirect also occurs if a transient logout request error is encountered, preventing continued use of the protected workspace in that browser view.

## Verification

Focused fake-timer tests verify expiration, supported activity reset, single timeout behavior, and cleanup. Type checking, the full Vitest suite, and the production build completed successfully. No patient data, clinical workflow, SOS behavior, or server-side session contract was otherwise changed.
