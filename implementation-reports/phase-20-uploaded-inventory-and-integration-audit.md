# Phase 20 — Uploaded Inventory and Integration Audit

## Scope and Method

This report reconciles the uploaded LifeLink inventory with the synchronized active source at checkpoint `93b47ed2`, the exposed application routes, and the current validation run. It lists configuration **names and purposes only**. It does not reveal, copy, inspect, or attach secret values, tokens, database connection strings, OAuth codes, user data, or health data.

## Reconciliation Summary

| Uploaded inventory area | Current status | Notes |
| --- | --- | --- |
| Patient registration, sign-in, logout, session, and protected routes | **Implemented** | Native patient authentication is database-backed and protected by server-managed sessions. |
| Google sign-in and registration | **Implemented; owner-controlled live consent verification remains** | Google uses a permanent HTTPS callback, state/nonce validation, server-side code exchange, ID-token verification, and a register-first policy. A real consent journey must be completed only by the account owner. |
| Apple sign-in | **Intentionally excluded** | The agreed scope is Google-only OAuth. Apple routes are inactive and no Apple credential is required. |
| Patient profile, dashboard, passport, medicines, prescriptions, and appointments | **Implemented** | These are exposed as protected patient routers and persist patient-owned records. |
| AI assessment, safety override, result, and history | **Implemented** | Request validation, a deterministic emergency override, server-only Gemini generation, structured result validation, persistence, and history are active. A server-side platform fallback protects patients from temporary direct-provider failures. |
| Doctor platform | **Deliberately mock-only** | Doctor sign-in, dashboard, profile, availability, and related clinical workflow are not real doctor accounts in this phase. |
| Specialist Finder | **Implemented as a controlled development directory** | Free text searches specialty names; residence-oriented rail corridor/station filtering and appointment-request linkage are present. |
| Mumbai directory coverage | **Implemented** | The active directory creates **200 explicitly labeled mock listings**, exactly two for each of the 100 supplied normalized station entities. |
| Corridor specialty coverage | **Implemented** | Every Central, Harbour, and Western corridor has at least three specialty categories. Shared stations retain their multi-line associations. |
| Maps and location privacy | **Implemented with one direct live-view verification pending** | The managed Google Maps proxy loader uses anonymous CORS, verifies the Maps namespace after load, and has a non-misleading retry/fallback experience. Browser location is opt-in, page-local, and is neither stored nor sent to the server. |
| Realtime | **Implemented using SSE** | Authenticated Server-Sent Events and patient-scoped cache invalidation are active. The product does not currently use WebSocket transport. |
| Backend/database architecture | **Implemented with an intentional variation** | The application is Node.js, Express, TypeScript, tRPC, Drizzle ORM, and MySQL. The uploaded inventory names Prisma, but the active project intentionally uses **Drizzle** instead. |
| UI system | **Implemented** | The purple/indigo liquid-glass system, responsive layouts, light/dark themes, approved brand treatment, and reduced-motion-aware interactions are present. |
| Automated validation | **Passing** | The synchronized suite passes: **15 test files and 36 tests**. The production build passes. |

## Deliberate Product Boundaries

The directory is a **development-only controlled mock directory**. Its listings are not real doctors, qualifications, availability, ratings, reviews, appointment commitments, medical recommendations, or live clinician locations. The map marker coordinates are station reference points used for mock entries. They do not identify patients or actual provider locations.

The remaining direct-verification work is not a code change: an owner must sign in on the permanent public site, complete Google consent with their own account if they wish to test it, and allow the agent to observe only the resulting protected route—not personal data. The interactive map also awaits one direct authenticated permanent-page observation, despite the owner’s prior confirmation that it works.

## Integration and API-Key Inventory

| Configuration name | Classification | Used for | Exposure boundary |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Server-side Google Gemini request for AI-assessment generation. | Server only; never sent to the browser. |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client identifier | Identifies LifeLink to Google during authorization and token validation. | Used by the server; an identifier is not a client secret. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Secret | Server-side Google authorization-code exchange. | Server only. |
| `AUTH_PUBLIC_BASE_URL` | Public deployment configuration | Forms the permanent HTTPS Google callback and authorization-start URLs. | Server configuration; not a credential. |
| `JWT_SECRET` | Secret | Signs and verifies LifeLink sessions. | Server only. |
| `DATABASE_URL` | Secret connection configuration | Connects the server to the MySQL patient-data database. | Server only. |
| `BUILT_IN_FORGE_API_KEY` | Secret platform credential | Authenticates server-side platform requests, including LLM fallback, map services, storage, data helpers, and notifications where invoked. | Server only. |
| `BUILT_IN_FORGE_API_URL` | Service endpoint configuration | Base URL for managed platform services. | Server configuration; not secret by itself. |
| `VITE_FRONTEND_FORGE_API_KEY` | Browser-visible managed-proxy credential | Requests the managed Google Maps proxy script. It is not a personal Google Maps key. | Browser-visible by design; restricted by the managed proxy. |
| `VITE_FRONTEND_FORGE_API_URL` | Browser-visible endpoint configuration | Base URL used by the browser to request the managed map proxy. | Browser-visible; not a secret by itself. |
| `VITE_APP_ID` and `OAUTH_SERVER_URL` | Platform identity/service configuration | Support the platform session and OAuth SDK. | Application configuration, not user API keys. |
| `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` | Analytics configuration | Route usage analytics. | Browser-visible identifiers, not secrets. |
| `OWNER_OPEN_ID` and `OWNER_NAME` | Ownership metadata | Support owner-level platform behavior. | Server configuration, not API credentials. |

There is **no personal Google Maps API key**, **no Mapbox key**, and **no Apple OAuth credential** in the LifeLink design. Maps are delivered through the configured managed proxy. Direct Gemini access and its fallback run server-side only.

## Security Confirmation

No secret values appear in this report. Do not place any secret in frontend code, a GitHub commit, a screenshot, a support ticket, or chat. If any secret is exposed, rotate it through the project secret settings immediately.

## Evidence

| Evidence | Establishes |
| --- | --- |
| Uploaded `pasted_content.txt` | The requested inventory and intended boundaries. |
| `backend/routers.ts` | Active patient/profile/dashboard/medicine/appointment/prescription/discovery/assessment route surface. |
| `backend/providerAuth.ts` | Google-only OAuth security flow and register-first behavior. |
| `backend/assessmentService.ts` | Server-only Gemini generation, deterministic emergency override, and fallback behavior. |
| `backend/mockDoctorDirectory.ts` and `shared/mumbaiStationCoordinates.ts` | Two mock entries per supplied station and controlled station-reference coordinates. |
| `frontend/src/components/Map.tsx` | Managed map-proxy loader, anonymous-CORS setting, and post-load Maps namespace check. |
| `backend/_core/env.ts` | Configuration-name inventory without secret values. |
| Current validation | `pnpm test` passed 15 files / 36 tests; `pnpm build` passed. |
