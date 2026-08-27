# Phase 09 — Project Boundary Reorganization Plan

## Target Source Structure

```text
lifelink/
├── frontend/                 # React/Vite application only
│   ├── index.html
│   ├── public/
│   └── src/
├── backend/                  # Express, tRPC, auth, LLM, realtime, tests
│   ├── _core/
│   ├── routers/
│   ├── db.ts
│   ├── assessmentService.ts
│   └── *.test.ts
├── database/                 # Drizzle schema, relations, migrations, metadata
│   ├── schema.ts
│   ├── relations.ts
│   ├── migrations/
│   └── meta/
├── shared/                   # Cross-boundary constants and TypeScript types
├── implementation-reports/   # Change and verification records
├── package.json              # Root workspace scripts and dependencies
├── vite.config.ts            # Root tooling configuration pointing to frontend/
├── vitest.config.ts          # Root test configuration pointing to backend/
└── database/drizzle.config.ts
```

## Compatibility Rules

| Boundary | Migration rule                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend | Move the existing `client/` contents to `frontend/`. Internal relative imports remain stable; the single tRPC type import changes from `server/routers` to `backend/routers`.                                                                          |
| Backend  | Move the existing `server/` tree to `backend/`. Internal relative imports stay stable. Update only root-crossing imports: schema references to `database/`, the legacy storage helper import, and the Vite template location.                          |
| Database | Move the entire Drizzle directory to `database/`, including migration history and metadata. Move the Drizzle config beside it and update its schema/output paths. No schema or data migration is generated because this is a filesystem-only refactor. |
| Shared   | Keep `shared/` at the root because it is intentionally consumed by both frontend and backend. It is neither frontend-only nor backend-only.                                                                                                            |
| Tooling  | Keep package, TypeScript, Vite, and Vitest configuration at root. Update their source-directory aliases, includes, build entry points, Vite root, public directory, and test discovery patterns.                                                       |

## Safety Sequence

1. Update all path-bearing configuration and source imports in one coordinated patch.
2. Move the three source trees using version-control-aware filesystem moves.
3. Run TypeScript checks first to identify any missed import.
4. Run the full test suite and production build.
5. Restart the full-stack service and visually verify representative patient and clinician routes.

The patient layout changes are kept separate from the filesystem move. This isolates path-risk from presentation-risk and allows the existing patient authentication, tRPC, database ownership, Gemini, and realtime flow to remain testable while the navigation and dashboard hierarchy are refined.

## Completed Reorganization

| Former location | New location | Responsibility                                                                                                                                                       |
| --------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client/`       | `frontend/`  | React application, Vite entry document, public configuration, components, patient/doctor feature views, contexts, hooks, and tRPC client.                            |
| `server/`       | `backend/`   | Express startup, tRPC routers, native authentication, patient event stream, Gemini assessment service, storage helpers, mock discovery directory, and backend tests. |
| `drizzle/`      | `database/`  | Drizzle schema, relations, migrations, migration metadata, and Drizzle configuration.                                                                                |
| `shared/`       | `shared/`    | Cross-boundary constants, shared types, and error definitions. This directory remains at root because it is intentionally used by both the frontend and backend.     |

The former `client`, `server`, and `drizzle` directories no longer exist. No database schema operation or data migration was applied, because the change was limited to source-file locations and import/configuration contracts.

## Reconnected Path Contracts

| Concern                           | Updated contract                                                                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development and production server | `package.json` now launches and bundles `backend/_core/index.ts`.                                                                                                            |
| Frontend build                    | Vite root and public directory now point to `frontend/`; `@` resolves to `frontend/src`.                                                                                     |
| Type checking                     | `tsconfig.json` includes `frontend`, `backend`, `database`, and `shared`; the frontend-to-tRPC type import now uses `backend/routers`.                                       |
| Database tooling                  | `database/drizzle.config.ts` points to `database/schema.ts` and writes generated migration output under `database/`; the root database script passes this config explicitly. |
| Backend schema access             | Database types are imported from `database/schema` by the database repository, auth context, SDK, and shared type entry point.                                               |
| Tests                             | Vitest discovers tests under `backend/**/*.test.ts` and preserves the frontend alias.                                                                                        |
| Development template              | The backend Vite bridge resolves `frontend/index.html`, so the Express/Vite integration continues to serve the moved client application.                                     |

## Layout Reconciliation

The patient shell now follows the supplied architecture: its sidebar presents Dashboard, AI Assessment, Appointments, Medicines, Prescriptions, Health Passport, Specialists, Profile, Settings, and a persistent red **SOS Emergency** action in that order. The utility header now includes a page context/title, theme switcher, named profile control, and sign-out action.

On narrower desktop widths, the sidebar becomes icon-only. On mobile, it becomes an accessible slide-in drawer controlled from the header rather than a horizontal navigation strip. The existing protected outlet, signed-in realtime hook, theme behavior, and patient routes remain intact.

The dashboard was simplified from a rigid bento presentation into a summary-first workspace: an assessment card and today’s-care card use a responsive 60/40 relationship; the health summary uses auto-fitting stat cards; and upcoming care, latest records, and quick actions form focused lower sections. All values remain sourced from the existing protected dashboard query, and empty states are shown when records do not exist.

## Entry and Assessment Layout Completion

| Screen              | Implemented hierarchy                                                                                                                                                                                                | Preserved contract                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Native login        | Logo, **Welcome back** title, concise health-workspace subtitle, email/password fields, clear **Sign In** action, and native registration link.                                                                      | `patientAuth.login` remains the sole sign-in mutation; no external-provider control or browser key was introduced.                             |
| Native registration | Logo, **Create your patient account** title, Personal information and Secure sign-in sections, and a clear Create Account action.                                                                                    | `patientAuth.register` receives the same validated name, email, and password values, then invalidates auth and opens the protected dashboard.  |
| AI Assessment       | Dedicated workflow header, assessment history, symptoms-first form hierarchy, grouped demographic/duration fields, disclaimer, protected submission button, inline emergency treatment, and accessible result popup. | `assessment.analyze` remains the protected server-side Gemini route; the deterministic emergency behavior and specialty handoff are unchanged. |

These three screens were explicitly rendered at desktop and 375 × 812 mobile widths. Registration stacks its personal-information fields on mobile; the assessment form stacks age/gender, keeps rounded full-width select controls, and preserves readable emergency/disclaimer treatment.

## Verification Results

| Check                       | Result                                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type check                  | Passed after the boundary move and dashboard/shell refactor.                                                                                                              |
| Backend tests               | Passed: **7 test files, 17 tests**. Test discovery now runs from `backend/`.                                                                                              |
| Production build            | Passed with the moved frontend Vite root and backend entry point. The existing non-blocking large-chunk advisory remains.                                                 |
| Full-stack restart          | Passed with `backend/_core/index.ts`; Express and Vite started successfully from the reorganized paths.                                                                   |
| Desktop visual check        | Native login and signed-in dashboard rendered from the new structure, including sidebar order, utility title/account controls, summary cards, and SOS treatment.          |
| Mobile visual check         | Dashboard, AI Assessment, and Specialist Finder rendered without horizontal scrolling or fixed-height clipping. The header menu control is visible for the mobile drawer. |
| Entry/workflow visual check | Login, registration, and AI Assessment rendered at desktop and mobile widths with the supplied hierarchy and real native/protected forms intact.                          |
| Data boundaries             | No patient data was created, modified, or removed during the filesystem/layout refactor. Doctor pages remain mock-only.                                                   |
