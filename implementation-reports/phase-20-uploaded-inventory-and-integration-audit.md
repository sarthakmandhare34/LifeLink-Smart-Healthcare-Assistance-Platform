# Phase 20 — Uploaded Inventory and Integration Audit

## Scope and Method

This audit reconciles the uploaded LifeLink feature inventory with the **active repository source**, the exposed application router, and the current automated validation run. It deliberately records configuration **names and purposes only**. It does not print, copy, inspect, or attach any secret value, token, database connection string, OAuth authorization code, user information, or health data.

> **Important:** A feature described in a prior checkpoint is not treated as complete unless the corresponding active source confirms it. This audit found two release-integrity discrepancies that should be resolved before representing them as delivered.

## Reconciliation Summary

| Uploaded inventory area | Active implementation status | Notes |
| --- | --- | --- |
| Patient authentication | **Implemented** | Native registration, sign-in, logout, session cookies, and protected patient routes are part of the active server router. |
| Google authentication | **Implemented, live consent still pending** | Google authorization, state/nonce protection, token exchange, verified ID-token checks, registration-first behavior, and dashboard redirect are in `backend/providerAuth.ts`. A real owner-controlled consent journey remains a required verification step. |
| Apple authentication | **Intentionally excluded** | Apple routes return an inactive response. The agreed project scope is Google-only OAuth; no Apple key or Apple sign-in should be expected. |
| Patient profile, dashboard, medicines, prescriptions, and appointments | **Implemented as patient-owned backend features** | The active tRPC router exposes dedicated protected routers for each of these areas. Persistent patient data and event creation were built in earlier phases. |
| AI health assessment | **Implemented with a corrective item identified** | Input validation, deterministic emergency-wording override, structured result persistence, history, and patient event emission are active. However, the current `assessmentService.ts` still calls the older Gemini `v1beta/interactions` contract. The direct provider request should be updated/revalidated before relying on it in production. |
| Emergency safety | **Implemented** | Red-flag wording triggers a deterministic `EMERGENCY` result before model output can be used; the result is persisted through the protected assessment path. |
| Doctor platform | **Deliberately mock-only** | Doctor registration, sign-in, dashboard, profile, patients, availability, and prescriptions remain mock-phase UI/data; no real doctor identity or availability is claimed. |
| Mumbai specialist finder | **Partially implemented** | Specialty and rail-line filtering, controlled mock listing labels, map synchronization, and appointment request linkage are present. The active directory contains **12** mock listings, not the requested 200 listings. |
| Two listings per supplied station | **Not present in active source** | `backend/mockDoctorDirectory.ts` currently contains 12 entries. It does not yet provide two entries for each of the 100 supplied normalized station entities. |
| Three specialties per corridor | **Present in the 12-entry directory** | Central, Harbour, and Western each have multiple controlled specialty categories, but this does not substitute for the requested station-by-station coverage. |
| Maps and location privacy | **Partially implemented** | The application uses the managed Google Maps proxy and has a browser-only location-control design. The active loader does not contain the expected anonymous-CORS, post-load namespace check, or retry handling described in the latest checkpoint history; that implementation/deployment mismatch needs reconciliation. |
| Realtime | **Implemented using SSE** | The product uses authenticated Server-Sent Events and patient-scoped cache invalidation/event handling. WebSocket transport is not the active transport. |
| Backend and database | **Implemented with an architectural variation** | The backend is Node.js, Express, TypeScript, tRPC, Drizzle ORM, and MySQL. The uploaded inventory names Prisma, but the actual project deliberately uses **Drizzle**, not Prisma. |
| UI and responsive design | **Implemented** | The purple/indigo liquid-glass system, light/dark themes, motion safeguards, branding, and responsive patient/clinician layouts are active. |
| Automated verification | **Passing** | `pnpm test` completed successfully: **14 test files, 32 tests passed**. This confirms current regression coverage, but it does not make the 12-entry directory equivalent to the requested 200-entry model. |

## Release-Integrity Findings

The active repository identifies a material mismatch with the description attached to checkpoint `d4a8d112`: the tracked `backend/mockDoctorDirectory.ts` currently holds only 12 entries and does not import or use the station-coordinate module described in that checkpoint. The active map loader also lacks the reported map reliability additions. These are not cosmetic differences; they affect the stated scope of the Specialist Finder.

The safest next action is a targeted source reconciliation: compare the intended 200-entry directory and map-loader fix against the active `main` branch, restore or reimplement the missing code, rerun tests/build, and then create a replacement checkpoint. This audit does not silently modify the implementation.

## Integration and API-Key Inventory

| Configuration name | Classification | Used for | Exposure boundary |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Direct server-side Google Gemini request for AI assessment generation. | Server only; the browser must never receive it. |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client identifier | Identifies LifeLink to Google during sign-in and ID-token verification. | Used by the server; the identifier itself is not equivalent to a client secret. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Secret | Server-side Google authorization-code exchange. | Server only; never embed in the frontend. |
| `AUTH_PUBLIC_BASE_URL` | Public deployment configuration | Forms the HTTPS Google callback URL and permanent OAuth start URL. | Server configuration; not a credential. |
| `JWT_SECRET` | Secret | Signs and verifies LifeLink session cookies/tokens. | Server only. |
| `DATABASE_URL` | Secret connection configuration | Connects the backend to the MySQL patient-data database. | Server only. |
| `BUILT_IN_FORGE_API_KEY` | Secret platform credential | Authenticates server-side calls to the managed platform services, including LLM fallback, map proxy services, storage, data helpers, and notifications where invoked. | Server only. |
| `BUILT_IN_FORGE_API_URL` | Service endpoint configuration | Base URL for the managed platform services. | Server configuration; not a secret by itself. |
| `VITE_FRONTEND_FORGE_API_KEY` | Browser-visible managed-proxy credential | Used by the Google Maps proxy script loader. It is a platform proxy credential, not a personal Google Maps key. | Browser-exposed by design; it must remain origin/service-restricted by the managed platform. |
| `VITE_FRONTEND_FORGE_API_URL` | Browser-visible endpoint configuration | Base URL used by the browser to request the managed map proxy. | Browser-visible; not a secret by itself. |
| `VITE_APP_ID` and `OAUTH_SERVER_URL` | Platform identity/service configuration | Support the platform OAuth/session SDK. | Application configuration, not a user API key. |
| `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` | Analytics configuration | Enable usage analytics routing. | Browser-visible identifiers; not secrets. |
| `OWNER_OPEN_ID` and `OWNER_NAME` | Platform ownership metadata | Identify the project owner for system-level behavior. | Server configuration; not API credentials. |

There is **no personal Google Maps API key**, **no Mapbox key**, and **no Apple OAuth credential** required by the active LifeLink design. Maps are routed through the managed proxy, and Apple sign-in is intentionally disabled. Direct Gemini use is server-side only, with the managed platform LLM used as a server-side fallback when that code path is selected.

## Security Confirmation

No secret values were included in this audit. Do not paste any of the listed secret values into chat, source code, GitHub commits, frontend variables, screenshots, or issue trackers. If a secret is ever exposed, rotate it through the project’s secret settings immediately.

## Source Evidence

| Evidence | What it establishes |
| --- | --- |
| Uploaded `pasted_content.txt` | The requested product inventory and future-boundary requirements. |
| `backend/routers.ts` | The active patient/profile/dashboard/medicine/appointment/prescription/discovery/assessment route surface. |
| `backend/providerAuth.ts` | Google-only OAuth flow, state/nonce validation, server-side code exchange, and register-first policy. |
| `backend/assessmentService.ts` | Server-only Gemini credential boundary, deterministic emergency override, and the current direct-provider contract needing correction. |
| `backend/mockDoctorDirectory.ts` | The active 12-entry controlled directory and its mock-only declarations. |
| `frontend/src/components/Map.tsx` | Managed map-proxy loader and browser-visible proxy configuration boundary. |
| `backend/_core/env.ts` | Runtime configuration-name inventory without exposing values. |
| `pnpm test` output | Current automated validation result: 14 files and 32 tests passing. |
