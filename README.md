# LifeLink — Smart Healthcare Assistance Platform

LifeLink is a full-stack patient healthcare-assistance application. It provides secure patient accounts, patient-owned health records, AI-assisted symptom assessment with safety controls, appointment requests, medicine and prescription history, realtime updates, and a controlled Mumbai Specialist Finder.

> **Clinical boundary:** LifeLink is not a diagnosis service. Its specialist directory and clinician workspace use **controlled synthetic records** for this phase. They must never be represented as verified clinicians, live availability, ratings, travel-time guidance, nearby providers, medical recommendations, or real medical orders.

## Implemented Scope

| Area | Current implementation | Boundary |
| --- | --- | --- |
| Patient registration and sign-in | Native email/password accounts and configured Google OAuth entry points | Patient accounts are database-backed. |
| Patient records | Profile, Health Passport, emergency contacts, appointments, medicines, prescription history, and assessment history | Data is scoped to the signed-in patient account. |
| AI Assessment | Server-only Gemini integration, schema validation, platform fallback, deterministic emergency override | Decision support only; not diagnosis or treatment. |
| Realtime | Authenticated patient and clinician Server-Sent Events with persisted event backlogs | Events are identity-scoped and notification-only. |
| Specialist Finder | Mumbai-only controlled directory with specialty, corridor, station, and specialty-text filters | Entries are synthetic controlled records. |
| Maps and browser location | Managed Google Maps proxy, synchronized controlled markers, optional page-local browser location | Location is neither stored nor sent to LifeLink. |
| Clinician workspace | Separate controlled account, assigned-appointment access, decision workflow, patient detail, and controlled prescription records | No real clinician identity or medical-order claim. |
| SOS actions | User-confirmed dialer or SMS-draft actions only | LifeLink does not automatically call, send messages, dispatch services, or share location. |

## Repository Structure

The repository deliberately uses the established **frontend / backend / database / shared** structure. Browser code remains in `frontend`, server code remains in `backend`, schema and migrations remain in `database`, and only cross-boundary contracts remain in `shared`.

```text
lifelink/
├── frontend/                         # Browser application only
│   ├── index.html                    # Vite entry document
│   ├── public/                       # Small public runtime files only
│   └── src/
│       ├── _core/                    # Browser auth helpers
│       ├── components/               # Reusable UI, branding, maps, and layout
│       ├── context/                  # Active React context providers
│       ├── features/                 # Entry, patient, and controlled-clinician screens
│       ├── hooks/                    # Browser-side hooks, including realtime and inactivity
│       ├── lib/                      # tRPC and browser integration helpers
│       ├── App.tsx                   # React route map
│       ├── main.tsx                  # React bootstrap
│       └── index.css                 # Theme, responsive, glass, and motion system
├── backend/                          # Express and tRPC server only
│   ├── _core/                        # Sessions, OAuth, runtime, storage, and server infrastructure
│   ├── routers/                      # Patient and clinician tRPC routers
│   ├── assessmentService.ts          # Server-only assessment decision support
│   ├── db.ts                         # Database helpers and ownership checks
│   ├── doctorAuth.ts                 # Controlled clinician authentication and owner recovery
│   ├── mockDoctorDirectory.ts        # Controlled Mumbai directory source
│   └── patientRealtime.ts            # Authenticated SSE endpoints
├── database/                         # Drizzle schema, relations, SQL migrations, and metadata
├── shared/                           # Shared types, constants, and Mumbai rail contracts
├── scripts/                          # Maintained developer utilities
├── implementation-reports/           # Historical, phase-by-phase delivery records
├── README.md                         # Active repository guide
├── package.json                      # npm and pnpm command definitions
├── package-lock.json                 # Local npm lockfile
├── pnpm-lock.yaml                    # Managed deployment lockfile
├── tsconfig.json                     # Frontend/backend/database/shared type-check scope
├── vite.config.ts                    # Frontend root, aliases, and production output
└── vitest.config.ts                  # Regression-test configuration
```

### File Ownership Rules

| Location | What belongs there | What does not belong there |
| --- | --- | --- |
| `frontend/` | React pages, browser hooks, feature-local styles, client tRPC use, public runtime files | Database credentials, server-only API keys, backend handlers, schema files. |
| `backend/` | Express routes, tRPC procedures, authentication, server integrations, persistence helpers | Browser UI, browser storage state, public secrets. |
| `database/` | Drizzle schema, relations, migration SQL, migration metadata | UI components, API routers, browser utilities. |
| `shared/` | Cross-boundary constants, types, validation-adjacent rail contracts | Feature-specific UI or server implementation details. |
| Root configuration | Build, package, TypeScript, Vite, Vitest, formatting, and Git configuration | Feature modules or patient data. |

## Local Development

### Prerequisites

Install **Node.js 22 or later**, npm, and a MySQL-compatible database. Clone the repository and install the chosen package-manager lockfile:

```bash
git clone https://github.com/sarthakmandhare34/LifeLink-Smart-Healthcare-Assistance-Platform.git
cd LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

The repository intentionally keeps **both** lockfiles. `package-lock.json` supports local npm use; `pnpm-lock.yaml` supports the managed deployment. Do not remove either lockfile unless the package-management policy changes for the whole project.

### Environment Configuration

Create a private local environment file. Do not commit it.

| Capability | Required local configuration |
| --- | --- |
| Database-backed patient records | `DATABASE_URL`, `JWT_SECRET` |
| Direct Gemini provider | `GEMINI_API_KEY` on the server only |
| Google OAuth | Client ID, client secret, and a configured HTTPS callback URL |
| Managed maps, storage, and fallback services | Hosting-platform configuration; do not copy production credentials into source code |
| Controlled clinician administration | Private provisioning code; never treat it as a clinician password |

> **Security rule:** Never commit or expose database URLs, JWT secrets, Gemini keys, Google OAuth secrets, clinician credentials, owner provisioning codes, session cookies, authorization codes, or platform credentials.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server with file watching. |
| `npm test` | Run the Vitest regression suite. |
| `npm run check` | Run TypeScript checking. |
| `npm run build` | Build the frontend and server production artifacts. |
| `npm run start` | Run the previously built production bundle. |
| `npm run verify` | Run type checking, tests, and the production build together. |
| `npm run db:push` | Generate and apply Drizzle migrations after reviewing the target database. |

Equivalent `pnpm` commands are supported in the managed project environment:

```bash
pnpm run check
pnpm test
pnpm run build
pnpm run verify
```

## Privacy, Safety, and Controlled-Directory Design

Patient identity is derived from the signed session rather than a browser-supplied patient identifier. Patient data helpers use patient ownership predicates, and clinician detail/prescription access is restricted to the controlled clinician account assigned to the appointment. The assessment service applies deterministic emergency wording before model output can affect the result.

The optional browser-location control remains page-local. It only changes ordering and map center for visible controlled entries; it is not persisted or transmitted. The map has a graceful unavailable state, so directory filtering and appointment requests remain usable if maps cannot load.

## Repository Maintenance Policy

The current source audit found no safe code relocation or deletion that would improve the structure without risking an active dependency. In particular, the following items are intentionally retained:

| Retained item | Reason |
| --- | --- |
| `package-lock.json` and `pnpm-lock.yaml` | Both are required by supported local npm and managed pnpm workflows. |
| `scripts/crop_lifelink_logo.py` | Maintained project utility for the LifeLink brand asset workflow. |
| `implementation-reports/` | Historical implementation records; they are documentation, not runtime code. |
| `frontend/src/context/MockDataContext.tsx` | Still used by the deliberately session-only Settings screen. It must not be removed until Settings is migrated or retired. |
| Runtime-managed logo path | The active logo background path is resolved by the deployed runtime. Keep the source reference; do not add duplicate large media files to the repository. |

Generated build output, dependencies, caches, logs, and private environment files remain ignored. Do not relocate active files out of their current top-level boundary unless all imports, configuration, tests, and build commands are updated together.

## Verification Standard

Before saving a checkpoint, run `npm run verify` (or the equivalent pnpm command) and review the affected public and protected routes. The suite includes regression coverage for authentication boundaries, assessment validation, realtime isolation, controlled-directory filters, map loader behavior, emergency confirmations, motion preferences, responsive layouts, dark-mode contrast, and active UI wording.

The latest repository-organization audit is recorded in [`implementation-reports/phase-55-repository-organization-and-github-sync.md`](implementation-reports/phase-55-repository-organization-and-github-sync.md).
