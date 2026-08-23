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
| Current public bundle | Pending publication of the current Google-only source to the permanent domain. The previously published bundle was confirmed to be older because it still displayed Apple controls. |
| Live Google callback | Pending one user-consented sign-in after the current source is published. No Google account or patient record has been created during validation. |

## Reference

[1]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth 2.0 for Web Server Applications"
