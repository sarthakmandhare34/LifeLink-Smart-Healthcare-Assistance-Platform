# Phase 10 — Google and Apple Provider Sign-In Preparation

## Current State

LifeLink now presents **Google** and **Apple** controls alongside the existing native email/password form. The controls are intentionally disabled with a visible preparation notice until the owner supplies provider credentials and one permanent HTTPS callback origin. This prevents a button from opening a malformed or unauthenticated third-party flow.

The native `Sign In` and `Register` paths are unchanged. Google and Apple are an additional sign-in method, not a replacement for the LifeLink account experience.

## File-by-File Changes

| File | Change | Safety outcome |
|---|---|---|
| `database/schema.ts` | Added `patientProviderIdentities`, keyed by `(provider, subject)` with a cascading relation to the patient user. | A provider identity is separate from a password credential and cannot be shared by two LifeLink accounts. |
| `database/0003_big_black_bird.sql` | Added the reviewed migration for the provider identity table and foreign key. | The migration was non-destructive and was applied successfully. |
| `backend/_core/env.ts` | Added server-only Google, Apple, and public-origin configuration fields. | No provider secret is exposed to the frontend. |
| `backend/db.ts` | Added provider-identity lookup, safe provider-patient creation, and an email-conflict guard. | An unauthenticated provider callback cannot silently merge into an existing native patient account merely by matching email. |
| `backend/providerAuth.ts` | Added provider availability checks, state/nonce generation and validation, Google/Apple authorization start routes, token exchange/identity-token validation logic, session issuance, and failure redirects. | State is bound to an HttpOnly cookie, provider tokens are verified server-side, and only verified provider identities can create a patient session. |
| `backend/_core/index.ts` | Registered the Google and Apple provider routes. | Callback routes are served by the backend, not the browser. |
| `backend/routers.ts` | Added a public availability query that returns booleans only. | The login page learns only whether a provider is configured; it never sees credentials. |
| `backend/providerAuth.test.ts` | Added provider-readiness tests with synthetic values only. | Tests do not call Google or Apple and do not use owner credentials. |
| `frontend/src/features/patient/Login.tsx` | Added Google and Apple controls below native sign-in. | Controls remain visibly unavailable until setup is complete. |
| `frontend/src/index.css` | Added responsive provider-control styling. | The native and provider choices remain readable at desktop and mobile sizes. |

## Activation Checklist for the Owner

| Provider | Owner configuration | Secret fields to supply in LifeLink settings |
|---|---|---|
| Google | In Google Cloud Console, create an OAuth 2.0 **Web application** client and register the exact callback `https://YOUR-DOMAIN/api/auth/google/callback`. Request only `openid`, `email`, and `profile`. | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `AUTH_PUBLIC_BASE_URL`. |
| Apple | In the Apple Developer portal, enable Sign in with Apple for a primary App ID; create a **Services ID**; associate it with the App ID; and register the exact domain plus `https://YOUR-DOMAIN/api/auth/apple/callback` return URL. Create a Sign in with Apple private key. | `APPLE_CLIENT_ID` (Services ID), `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (complete `.p8` content), and `AUTH_PUBLIC_BASE_URL`. |

> Use the published LifeLink domain or a custom domain. Do **not** register a temporary preview domain, because the callback value must exactly match the provider registration and may change between preview sessions.[1] [2]

## Account Ownership Rules

Provider-created accounts can be created after a verified Google or Apple callback. If a verified provider email already belongs to an existing native LifeLink account, the system stops and returns the user to the login page rather than silently joining the accounts. This protects health-record ownership. A signed-in account-linking setting can be added later as a separate verified flow.

## Verification Performed

| Check | Result |
|---|---|
| Schema migration | Generated, reviewed, and applied successfully. It creates only the provider-identity table and user foreign key. |
| Type check | Passed. |
| Regression suite | Passed: **8 test files, 19 tests**, including the new provider configuration tests. |
| Production build | Passed. The existing non-blocking JavaScript chunk-size advisory remains. |
| Unconfigured provider routes | `/api/auth/google` and `/api/auth/apple` returned HTTP 503 with an explicit not-configured response. |
| Native login UI | The existing native form remains present; Google and Apple controls are visible and honestly inactive until credentials are configured. |
| Live provider callback | Pending owner credentials and permanent domain registration. No real provider token or patient account was created. |

## References

[1]: https://developers.google.com/identity/protocols/oauth2/web-server "Google OAuth 2.0 for Web Server Applications"
[2]: https://developer.apple.com/documentation/signinwithapple/configuring-your-environment-for-sign-in-with-apple "Apple — Configuring Your Environment for Sign in with Apple"
