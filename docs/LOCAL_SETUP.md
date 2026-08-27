# Local LifeLink Setup

This guide runs LifeLink without Manus-managed authentication, storage, Maps proxy, or AI fallback services. The application uses native patient accounts, local JWT session cookies, MySQL-compatible storage, direct Google integrations where configured, and a local private upload directory.

## Prerequisites

Install Node.js 22 or later, npm 10 or later, and MySQL 8 or a compatible MySQL database. Create an empty database named `lifelink` and a database user with access only to that database.

## Configuration

Copy `config/local-env.template` to `.env`, replace every `change-me` value, and keep `.env` private. `JWT_SECRET` must have at least 32 random characters; `LIFELINK_CLINICIAN_ADMIN_CODE` must have at least 16 private characters. Do not share either value, clinician passwords, database credentials, OAuth client secrets, or Gemini credentials.

| Feature                               | Required variables                                  | Local behavior when omitted                                                       |
| ------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| Native patient and clinician sessions | `DATABASE_URL`, `JWT_SECRET`                        | The server cannot authenticate users.                                             |
| Clinician account administration      | `LIFELINK_CLINICIAN_ADMIN_CODE`                     | Provisioning and reset actions are unavailable.                                   |
| AI Assessment                         | `GEMINI_API_KEY`, optional `GEMINI_MODEL`           | Red-flag emergency guidance still works; non-emergency assessment is unavailable. |
| Google sign-in                        | `AUTH_PUBLIC_BASE_URL`, Google client ID and secret | Native email/password login remains available.                                    |
| Interactive Maps                      | `VITE_GOOGLE_MAPS_API_KEY`, optional map ID         | Directory filters and appointment requests remain available.                      |
| Profile photos                        | optional `LIFELINK_STORAGE_DIR`                     | Defaults to the ignored `local-data/uploads` directory.                           |

## Commands

```bash
npm install
cp config/local-env.template .env
# Edit .env before continuing.
npm run db:generate
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`. Run `npm run verify` before committing local changes. This command runs the TypeScript check, the Vitest suite, and the production build.

## Google OAuth Note

Google requires a registered HTTPS redirect URI. Pure `http://localhost:3000` development should use native email/password accounts. To test Google sign-in, expose the local application through a trusted HTTPS tunnel or deployment, set `AUTH_PUBLIC_BASE_URL` to that public origin, and register `<origin>/api/auth/google/callback` in the Google Cloud OAuth client.

## Optional Gemini Connectivity Test

The standard test suite intentionally skips network-dependent Gemini checks. After adding a valid local `GEMINI_API_KEY`, run `RUN_GEMINI_INTEGRATION_TESTS=true npm test` to verify the direct provider integration. This test sends only a fixed health-check prompt and no patient data.

## Safety and Privacy

The controlled specialist directory is synthetic and must not be presented as real clinicians, verified identities, ratings, live availability, navigation guidance, or medical recommendations. AI assessment is decision support only and does not diagnose or prescribe. Browser location is page-local and never persisted by LifeLink.
