# Phase 24 — Folder Structure and Uploaded Checklist Audit

## Direct Answer

The project is **properly divided into `frontend`, `backend`, `database`, and `shared` responsibilities**. The active application code follows that boundary. Root-level files are only project configuration, package locks, tooling configuration, documentation, and the TODO tracker; they are correctly kept at the root rather than placed inside runtime folders.

The implementation is not a literal copy of every technology named in the uploaded checklist. In particular, it uses **Drizzle with MySQL**, not Prisma, and it uses **Server-Sent Events (SSE)**, not WebSockets. Those are deliberate architecture choices and are fully connected across the frontend and backend.

## Folder Structure Status

| Folder | Responsibility | Current contents | Status |
| --- | --- | --- | --- |
| `frontend/` | Browser application | React entry point, routes, patient and doctor views, UI components, theme, client tRPC access, map components, CSS, client-only hooks. | **Correctly organized.** |
| `frontend/src/features/patient/` | Patient screens | Registration, login, dashboard, profile, health passport, medicine cabinet, prescriptions, appointments, emergency, AI assessment, Specialist Finder, settings. | **Correctly organized.** |
| `frontend/src/features/doctor/` | Doctor-phase screens | Mock login, dashboard, appointments, patients, consultations, prescriptions, profile, settings. | **Correctly isolated as mock UI.** |
| `backend/` | Server application | Express/tRPC router, authentication, Google provider flow, Gemini assessment service, database helpers, SSE event handling, controlled directory, storage routes. | **Correctly organized.** |
| `backend/routers/` | Server feature routers | Patient auth, profile, dashboard, medicine, appointments, prescriptions, discovery. | **Correctly separated by feature.** |
| `backend/_core/` | Server infrastructure | Request context, secure environment access, cookies, tRPC, OAuth integration, storage, maps, server bootstrap. | **Correctly treated as infrastructure.** |
| `database/` | Persistent data layer | Drizzle schema, relations, migrations, migration metadata, Drizzle config. | **Correctly organized.** |
| `shared/` | Cross-boundary contracts | Shared types/constants, Mumbai rail network, station reference coordinates, shared errors. | **Correctly organized.** |
| Project root | Tooling and documents | `package.json`, `pnpm-lock.yaml`, `package-lock.json`, Vite/TypeScript/Vitest configuration, README, reports, TODO. | **Correctly kept at root.** |

## Small Cleanup Opportunities

Two small legacy organization items remain. They do not break the application and do not violate frontend/backend/database boundaries, but they can be cleaned up in a future housekeeping pass.

| Item | Current state | Recommendation |
| --- | --- | --- |
| `frontend/src/context/` and `frontend/src/contexts/` | Both folders exist. The active entry point uses `context/ThemeContext` and `context/MockDataContext`; `contexts/ThemeContext` is an older duplicate-style location. | Consolidate to a single `context/` folder after checking and removing the unused duplicate safely. |
| `frontend/src/context/MockDataContext.tsx` | Still powers emergency/settings mock-era UI state. | Keep it clearly isolated until those areas are fully migrated to backend persistence; do not treat it as real patient data. |
| `backend/index.ts` | A legacy server-side file remains beside the active `_core/index.ts` bootstrap. | Retain until a targeted unused-file review confirms removal will not affect tooling. |

## Uploaded Checklist Reconciliation

| Checklist area | Current status | Clarification |
| --- | --- | --- |
| Patient registration, login, logout, session, protected routes | **Complete** | Native patient auth is database-backed with protected server routes. |
| Google login and callback | **Implemented; final real-consent observation pending** | Secure Google flow, callback, state/nonce validation, and register-first handling are implemented. A real account-owner consent callback still needs direct verification. |
| Google account linking | **Not a self-service feature** | The safety policy intentionally prevents silent linking to an existing native account. Provider identities are stored only after verified provider registration/sign-in handling. |
| Apple login/callback/linking | **Intentionally excluded** | The approved scope is Google-only OAuth. |
| Doctor auth and doctor platform | **Mock-only by design** | Doctor screens exist, but no real doctor identity, availability, or doctor database is claimed. |
| Patient profile and health passport | **Complete** | Profile, blood group, allergies, conditions, and emergency contacts have patient-owned persistence. |
| Patient dashboard | **Complete** | Summary, appointments, assessment data, and patient-facing actions are implemented. |
| Medicines | **Complete** | Patient-owned medicine create/read/update/delete workflow is persisted. |
| Prescriptions | **Implemented with mock/ demo clinical state** | The patient-facing records are persisted, while the issuing doctor and clinical workflow remain mock phase. |
| Settings | **Partially complete** | Theme is complete. Some settings/emergency state remains in the legacy mock frontend context pending a future persistence pass. |
| AI assessment | **Complete** | Validated input, server-only Gemini processing/fallback, result normalization, emergency override, modal/inline treatment, and assessment history persistence are implemented. |
| Emergency system | **Complete for assessment safety** | Deterministic emergency detection and persistent emergency assessment result are active. A full external emergency-service integration is not part of the current scope. |
| Specialist Finder | **Complete as controlled mock discovery** | Specialty search, Central/Harbour/Western filtering, shared-station associations, controlled markers, and appointment requests are implemented. |
| Nearby/suitable real doctors, real availability, distance | **Intentionally not implemented** | The directory uses clearly labeled controlled mock entries only. Browser location is optional, page-local, not stored, and does not imply real nearby providers or travel distances. |
| Maps and location | **Implemented with controlled privacy boundaries** | Managed Google map, synchronized mock markers, line/specialty filters, marker/card selection, safe fallback/retry, and optional browser-only centering are present. |
| Appointment request and persistence | **Complete** | Patient-owned appointment requests persist, using controlled mock doctor IDs. |
| Appointment cancellation/status | **Implemented where supported** | Current status changes apply to patient-owned appointment records; no real provider scheduling is claimed. |
| Realtime | **Complete using SSE** | Authenticated, patient-scoped event delivery and query invalidation are implemented. WebSockets are not used. |
| Backend and database | **Complete with Drizzle + MySQL** | Node.js, Express, TypeScript, tRPC, Drizzle ORM, MySQL, secure ownership checks, and secret boundaries are active. |
| Prisma architecture | **Not used** | Drizzle is the selected ORM; this is an intentional technology difference from the uploaded outline. |
| UI, themes, glass system, responsive design | **Complete** | Purple/indigo liquid-glass design, light/dark themes, brand components, focus behavior, reduced-motion-aware motion, and responsive layouts are present. |
| Testing and verification | **Complete with noted live checks pending** | Automated suite currently passes 15 test files / 36 tests, and production build passes. Direct owner-controlled Google consent/session evidence remains pending. |

## Important Remaining Work

The main remaining work is **verification that requires the account owner**, not basic folder reorganization or core implementation. Google OAuth must be completed with the owner’s own account in the browser so the public callback and protected dashboard session can be observed safely. Real doctor accounts, real doctor availability, live provider data, actual nearby-doctor claims, WebSockets, Apple login, and Prisma are future-scope decisions rather than incomplete bugs.

## Conclusion

The project meets the requested **frontend / backend / database / shared** division in its active code. The main folder-level recommendation is a small future cleanup of duplicate legacy frontend context locations. The largest feature boundaries remain deliberately controlled: doctor data is mock-only and patient location is never stored or used to claim real medical-provider proximity.
