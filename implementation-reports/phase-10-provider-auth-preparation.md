# Phase 10 — Google Sign-In Preparation

## Current State

LifeLink now prepares **Google sign-in only** beside the existing native email/password flows on both the login and registration pages. Apple controls, routes, server configuration, and activation requirements have been removed at the owner’s request.

Google is enabled only when the server has the configured Web application credentials and a permanent HTTPS callback origin. The native **Sign In**, **Register**, and secure email/password account behavior remain unchanged.

## Implemented Changes

| File | Change | Outcome |
|---|---|---|
| `database/schema.ts` | Restricts provider identity records to `google`. | The provider identity table now represents the approved Google-only scope. |
| `backend/_core/env.ts` | Retains only Google OAuth and public-base URL settings. | Apple credentials are no longer requested or read. |
| `backend/providerAuth.ts` | Replaced multi-provider handling with the Google authorization-code callback path. | Google state and nonce checks, server-side token verification, session creation, and safe email-conflict handling remain in place. |
| `backend/providerAuth.test.ts` | Simplified readiness coverage to Google and added a deployed-callback reachability check. | Tests validate provider availability, accepted client credentials without user data, and the configured public callback route. |
| `frontend/src/features/patient/Login.tsx` | Replaced the two-provider choice with **Continue with Google**. | Native email/password login remains first. |
| `frontend/src/features/patient/Registration.tsx` | Added the same prepared Google action under Create Account. | Users can choose Google at the start of either account journey once configured. |
| `frontend/src/index.css` | Updated the provider action layout to one full-width control. | The Google action is consistent on desktop and mobile. |

## Public Callback Configuration

The Google OAuth 2.0 **Web application** client must authorize the exact public callback URI associated with the deployed LifeLink backend:

```text
https://YOUR-DOMAIN/api/auth/google/callback
```

The three values below are held only in server configuration. They must never be copied to browser code or source control.

| Secret | Purpose |
|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | Identifies the Google Web application client. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Used only by the LifeLink backend when exchanging the authorization code. |
| `AUTH_PUBLIC_BASE_URL` | The exact HTTPS LifeLink origin, such as `https://your-domain.example`. |

> Do not use a changing preview domain. Google requires the callback URL to exactly match an authorized redirect URI.[1]

## Verification

| Check | Result |
|---|---|
| Google-only readiness and credential test | Passed; the Google token endpoint accepted the server credentials and rejected the intentionally invalid test code with `invalid_grant`, not `invalid_client`. No user data was sent. |
| Configured public callback route | Passed; the permanent public origin responds through LifeLink’s callback handler and safely redirects a request with no valid state to the login error route. |
| Native account preservation | Login and registration forms remain available before the Google action. |
| Current public bundle | Verified after public-access activation: the permanent domain now serves the current Google-only login page, with native email/password and one Google control. |
| Current public callback route | Verified: a request without a valid state is handled by LifeLink and redirects safely to the login error route rather than an external 404 page. |
| Google authorization start | Verified: Google accepts the permanent callback URI and opens its account-selection screen without `redirect_uri_mismatch`. |
| Provider identity aggregate | One Google provider identity is present after user-reported consent; only an aggregate count was reviewed, with no email, subject, or health data retrieved. |
| Final dashboard session | Owner-confirmed successful completion after consent. The user reports that Google sign-in now returns to and works within LifeLink; the sandbox browser remained separate at account selection, so no personal session information was inspected. |
| Provider account outcome | The new Google identity aggregate confirms provider-account creation rather than an existing native-email conflict. Existing native accounts still require explicit signed-in linking and are never silently claimed. |

## Live Verification Outcome

The permanent redirect URI has been accepted by Google. The owner confirmed the user-consented flow returns successfully to LifeLink, and the backend shows one Google provider identity through an aggregate-only query. Existing native accounts are deliberately not silently linked by email; any required linking must occur from an already authenticated native LifeLink session.

## First-Attempt Reliability Fix

The first attempt could fail when a user opened the app on a temporary preview hostname. The previous relative Google-start URL wrote the host-only OAuth state cookie to that preview host, while Google returned to the configured permanent domain; the callback therefore could not read the state cookie. LifeLink now exposes a safe, non-secret `googleAuthorizationStartUrl` through the provider-availability endpoint. Both patient entry pages navigate to that permanent origin before authorization begins, keeping the state cookie and callback on the same host from the first attempt.

## Reference

[1]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth 2.0 for Web Server Applications"
