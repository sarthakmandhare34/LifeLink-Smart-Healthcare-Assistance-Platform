# LifeLink — Smart Healthcare Assistance Platform

LifeLink is a full-stack patient healthcare-assistance application. It provides secure patient accounts, patient-owned health records, an AI-assisted symptom-assessment workflow with safety controls, appointment requests, medicines and prescription history, realtime patient updates, and a controlled Mumbai Specialist Finder.

> **Important scope boundary:** LifeLink is not a medical diagnosis service. The Specialist Finder and doctor portal are intentionally development/mock-only in this phase. They must not be represented as real clinicians, verified availability, ratings, travel times, nearby providers, or medical recommendations.

## What Is Implemented

| Area | Status | Notes |
| --- | --- | --- |
| Patient registration and sign-in | Database-backed | Supports native email/password accounts and Google OAuth. |
| Patient dashboard and records | Database-backed | Profiles, Health Passport details, appointments, medicines, prescriptions, and assessment history are patient-owned. |
| AI Assessment | Server-side | Gemini runs server-side only, validates structured output, and has a deterministic emergency override plus a safe platform fallback. |
| Realtime updates | Implemented | Patient-scoped Server-Sent Events refresh relevant data after changes. |
| Specialist Finder | Controlled mock directory | Specialty, Mumbai rail-corridor, and station filters use controlled mock entries and reference markers only. |
| Maps and browser location | Privacy-bounded | The managed map shows controlled markers. Location is optional, page-local, and neither stored nor transmitted. |
| SOS actions | User-confirmed only | Users must confirm before LifeLink opens an SMS draft or the device dialer for 112. LifeLink never sends a message, places a call, or shares location automatically. |
| Doctor portal | Mock-only | Doctor login, profiles, availability, and related dashboard views remain deliberately mocked. |

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, CSS liquid-glass design system |
| Backend | Node.js, Express, tRPC, TypeScript |
| Database | MySQL with Drizzle ORM and migrations |
| Authentication | Native signed sessions plus Google OAuth with server-side state/nonce validation |
| AI | Server-only Gemini integration with strict validation and fallback behavior |
| Realtime | Authenticated Server-Sent Events |
| Maps | Managed Google Maps proxy; no personal Maps key is embedded in the frontend |
| Tests | Vitest, TypeScript checking, and production build validation |

## Repository Structure

```text
lifelink/
├── frontend/                 # Browser application
│   └── src/
│       ├── components/       # Reusable UI, branding, maps, layout
│       ├── context/          # Active React context providers
│       ├── features/         # Patient and mock-doctor screens
│       ├── hooks/            # Browser-side hooks
│       └── index.css         # Theme, responsive, liquid-glass, and motion rules
├── backend/                  # Express/tRPC server application
│   ├── routers/              # Patient feature routers
│   ├── _core/                # Server infrastructure, sessions, storage, maps
│   └── *.ts                  # Auth, assessment, discovery, realtime services
├── database/                 # Drizzle schema, relations, migrations, metadata
├── shared/                   # Cross-boundary types, constants, rail contracts
├── scripts/                  # Maintained project utilities
├── implementation-reports/   # Phase-by-phase implementation records
├── package.json              # Commands and dependencies
├── pnpm-lock.yaml            # Deployment lockfile
├── package-lock.json         # Local npm lockfile
└── todo.md                   # Completed implementation history and checklist
```

## Local Development

### Prerequisites

Install **Node.js 22 or later**, npm, and a MySQL-compatible database. Clone the repository, then install dependencies:

```bash
git clone https://github.com/sarthakmandhare34/LifeLink-Smart-Healthcare-Assistance-Platform.git
cd LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

Local npm commands are supported. The managed deployment uses pnpm and its frozen `pnpm-lock.yaml`; both lockfiles are intentionally retained.

### Environment Configuration

Create a private `.env` file for your own local environment. Do not commit it.

| Capability | Required local configuration |
| --- | --- |
| Native patient records | `DATABASE_URL`, `JWT_SECRET` |
| Direct Gemini assessment provider | `GEMINI_API_KEY` server-side only |
| Google OAuth | Google client ID/secret and a configured HTTPS callback URL |
| Managed maps, storage, and platform fallback | Hosting-platform configuration; never copy production credentials into source code |

> **Security rule:** Never put database URLs, JWT secrets, Gemini keys, Google OAuth secrets, session cookies, authorization codes, or platform credentials in GitHub, frontend code, screenshots, or chat.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server with file watching. |
| `npm test` | Run the Vitest suite. |
| `npm run check` | Run TypeScript checking. |
| `npm run build` | Create the production frontend and server bundle. |
| `npm run start` | Run a previously built production bundle. |
| `npm run verify` | Run checking, tests, and production build together. |
| `npm run db:push` | Generate and apply Drizzle migrations. Review database configuration first. |

For the managed project environment, equivalent pnpm commands are available:

```bash
pnpm run check
pnpm test
pnpm build
```

## Privacy and Safety Design

Patient ownership is enforced server-side. Patient routes derive identity from the signed session rather than trusting an identifier sent by the browser. The AI assessment is decision support only and applies deterministic emergency wording before model output can affect the result.

The optional browser-location control never stores or sends precise coordinates to LifeLink. It only orders visible controlled entries and centers the current map view in the browser session. The SOS controls require a user confirmation before opening the phone’s SMS composer or dialer; users remain in control of every external action.

## Responsive Interface

LifeLink supports wide desktop monitors, laptops, tablets, and mobile devices. Shared layout rules adapt workspace gutters, navigation, touch targets, dialogs, grids, forms, Specialist Finder filters, and map height across display sizes. Optional visual motion respects `prefers-reduced-motion`.

## Verification

Before a checkpoint is saved, the project is validated with TypeScript checking, Vitest, production build, and responsive browser checks. The current test suite contains regression coverage for authentication safety, assessment validation, realtime boundaries, controlled directory filters, map loading, SOS confirmations, motion preferences, and responsive layout rules.

## Development Notes

The project is structured deliberately around `frontend`, `backend`, `database`, and `shared` boundaries. Keep browser-only code inside `frontend`, server-only credentials and integrations inside `backend`, migrations/schema inside `database`, and shared contracts inside `shared`. Keep generated build output, dependency folders, logs, and private environment files out of Git.
