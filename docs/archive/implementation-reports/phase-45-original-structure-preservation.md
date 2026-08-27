# Phase 45 — Original Structure Preservation Baseline

## Authoritative project tree

The current LifeLink project already uses the authoritative root boundaries `frontend/`, `backend/`, `database/`, `shared/`, `implementation-reports/`, and `scripts/`. The application build is intentionally rooted at `frontend/`; Vite aliases `@` to `frontend/src` and `@shared` to `shared`. Backend runtime starts from `backend/_core/index.ts`, while schema and migrations remain under `database/`.

No `client/`, `server/`, alternate frontend root, alternate backend root, or replacement shared architecture was found. Those directories must not be introduced as a cleanup action.

## Preservation rules

Future work must organize only inside the existing boundaries:

- `frontend/src`: patient and doctor features, reusable components, layouts, browser hooks, services, types, and frontend libraries.
- `backend`: protected routes, tRPC contracts, persistence helpers, authentication, realtime, server-only Gemini work, and storage integration.
- `database`: Drizzle schema, relations, configuration, migrations, and snapshots.
- `shared`: cross-boundary constants, domain types, and Mumbai rail/location definitions.
- `implementation-reports`: historical implementation evidence only.

The real patient flows, patient-owned database records, protected Gemini assessment, SSE updates, Google authentication, controlled Mumbai discovery, browser-location privacy boundary, Maps, confirmation-gated SOS actions, and intentionally mock doctor flows remain in scope and must be preserved.

## Cleanup decision

The audit found no verified obsolete source implementation requiring deletion. Historical reports and the logo-cropping utility are retained because they are neither duplicate active implementations nor proven obsolete. This pass therefore records safeguards rather than forcing a destructive reorganization.
