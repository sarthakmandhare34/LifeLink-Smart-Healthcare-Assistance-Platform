# LifeLink

LifeLink is a locally maintainable, full-stack healthcare-assistance platform. It supports native patient accounts, patient-owned health records, appointment requests, medicine and prescription history, AI-assisted symptom assessment, authenticated realtime updates, a controlled Mumbai Specialist Finder, and a separate controlled clinician workspace.

> **Clinical and directory boundary:** LifeLink is not a diagnosis, medical-order, emergency-dispatch, or provider-verification service. The Specialist Finder and clinician workspace use controlled synthetic records. They must never be described as real clinicians, verified identities, live availability, ratings, recommendations, or navigation guidance.

## Technology

| Layer          | Technology                                                                              |
| -------------- | --------------------------------------------------------------------------------------- |
| Frontend       | React 19, TypeScript, Vite, CSS, React Query, tRPC client                               |
| Backend        | Node.js, Express, TypeScript, tRPC server, Server-Sent Events                           |
| Database       | MySQL-compatible database, Drizzle ORM, SQL migrations                                  |
| Authentication | Native email/password accounts, local JWT session cookies, optional direct Google OAuth |
| AI             | Optional direct Gemini API, invoked only from the backend                               |
| Maps           | Optional direct Google Maps JavaScript API                                              |
| Testing        | Vitest and TypeScript validation                                                        |

## Current Features

| Area                | Current behavior                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patient accounts    | Registration and email/password sign-in create and authenticate database-backed patient accounts.                                                    |
| Patient portal      | Profile, Health Passport, emergency contacts, appointments, medicines, prescriptions, and assessment history are scoped to the signed-in patient.    |
| AI Assessment       | A deterministic emergency override is applied before optional Gemini analysis. Without a Gemini key, non-emergency assessment is safely unavailable. |
| Realtime updates    | Patient and clinician event streams are session-bound and scoped to their assigned records.                                                          |
| Specialist Finder   | Mumbai-only controlled directory with specialty, corridor, station, and text filters plus protected appointment-request behavior.                    |
| Maps and location   | Optional map markers sync with controlled entries. Browser location is page-local, optional, and is never persisted by LifeLink.                     |
| Clinician workspace | Controlled accounts can access only their assigned appointments and associated patient data, then create controlled prescription records.            |
| Emergency actions   | User-confirmed dialer and SMS-draft actions only; LifeLink does not automatically call, message, dispatch, or share location.                        |

## Repository Structure

```text
lifelink/
├── frontend/                 # Browser application: React routes, UI, styles, hooks, and client integrations
│   └── src/
│       ├── _core/            # Browser authentication hook
│       ├── components/       # Shared UI, self-contained branding, maps, and layout
│       ├── context/          # Theme provider
│       ├── features/         # Entry, patient, and controlled-clinician screens
│       ├── hooks/            # Browser hooks, including realtime and inactivity controls
│       ├── lib/              # Browser tRPC and utility helpers
│       ├── App.tsx           # Route map
│       ├── main.tsx          # React bootstrap
│       └── index.css         # Responsive design, themes, motion, and glass surfaces
├── backend/                  # Express/tRPC server, local sessions, local storage, and business logic
│   ├── _core/                # Context, cookies, local session auth, runtime, and tRPC primitives
│   ├── routers/              # Patient and controlled-clinician API routers
│   ├── assessmentService.ts  # Server-only Gemini decision-support integration
│   ├── db.ts                 # Database helpers and ownership predicates
│   ├── localStorage.ts       # Private local profile-photo storage
│   └── mockDoctorDirectory.ts# Controlled Mumbai directory source
├── database/                 # Drizzle schema, relations, migration SQL, and migration metadata
├── shared/                   # Cross-boundary types, constants, and Mumbai rail contracts
├── config/                   # Non-secret local configuration templates
├── docs/                     # Current setup, maintenance, and handover guidance
├── scripts/                  # Optional development utilities
├── package.json              # Commands and dependency manifest
├── package-lock.json         # npm lockfile
├── pnpm-lock.yaml            # pnpm lockfile
├── tsconfig.json             # TypeScript project configuration
├── vite.config.ts            # Vite configuration
└── vitest.config.ts          # Test configuration
```

## Local Setup

Use **one** package manager consistently in your local clone. npm is the primary documented workflow.

```bash
git clone <your-repository-url>
cd lifelink
npm install
cp config/local-env.template .env
# Edit .env securely before the next command.
npm run db:generate
npm run db:migrate
npm run dev
```

The application starts at `http://localhost:3000`. Complete configuration guidance is in [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md), and the delivery checklist is in [docs/HANDOVER_CHECKLIST.md](docs/HANDOVER_CHECKLIST.md).

## Environment Variables

Copy `config/local-env.template` to `.env`; do not commit it. The table below describes the configuration purpose without exposing secret values.

| Variable                        | Required                         | Purpose                                                                                     |
| ------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                  | Yes                              | MySQL-compatible application database connection string.                                    |
| `JWT_SECRET`                    | Yes                              | Private local session-signing secret; use 32 or more random characters.                     |
| `LIFELINK_CLINICIAN_ADMIN_CODE` | Yes for clinician administration | Private code for controlled clinician account provisioning and password administration.     |
| `GEMINI_API_KEY`                | Optional                         | Enables server-side AI Assessment for non-emergency submissions.                            |
| `GEMINI_MODEL` | Optional | Selects the Gemini model; defaults to the project’s verified `gemini-3.6-flash` identifier. |
| `RUN_GEMINI_INTEGRATION_TESTS` | Optional | Set to `true` only to run direct Gemini connectivity tests with a configured key. |
| `AUTH_PUBLIC_BASE_URL`          | Optional                         | HTTPS public origin used only for direct Google OAuth callbacks.                            |
| `GOOGLE_OAUTH_CLIENT_ID`        | Optional                         | Direct Google OAuth client identifier.                                                      |
| `GOOGLE_OAUTH_CLIENT_SECRET`    | Optional                         | Direct Google OAuth client secret, stored only on the server.                               |
| `VITE_GOOGLE_MAPS_API_KEY`      | Optional                         | Browser Maps API key restricted to your approved origins.                                   |
| `VITE_GOOGLE_MAP_ID`            | Optional                         | Google Maps Map ID for advanced map rendering.                                              |
| `LIFELINK_STORAGE_DIR`          | Optional                         | Local path for private profile-photo files; defaults to `local-data/uploads`.               |

## Commands

| Command               | Purpose                                                        |
| --------------------- | -------------------------------------------------------------- |
| `npm run dev`         | Start the local Express and Vite development server.           |
| `npm run check`       | Run TypeScript checking without generating files.              |
| `npm test`            | Run the Vitest regression suite.                               |
| `npm run build`       | Build the frontend and backend production artifacts.           |
| `npm run start`       | Run the previously built production server.                    |
| `npm run db:generate` | Generate a Drizzle migration after schema review.              |
| `npm run db:migrate`  | Apply reviewed migrations to the configured database.          |
| `npm run verify`      | Run TypeScript checking, tests, and production build together. |

## Security and Maintenance

Patient identity is derived from the signed local session rather than a browser-supplied patient ID. Database helpers and clinician routes enforce patient ownership or controlled appointment assignment. Profile photos are stored locally in an ignored private directory and are served only to the owning patient through an authenticated route.

Never commit `.env`, database credentials, session secrets, clinician administration codes, clinician passwords, patient data, OAuth secrets, or Gemini credentials. Back up the MySQL database and private local storage before schema changes or deployments. Run `npm run verify` before every commit.

## Documentation

| Document                                                                     | Purpose                                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)                                   | Detailed local environment, database, OAuth, Maps, AI, and storage setup.           |
| [docs/HANDOVER_CHECKLIST.md](docs/HANDOVER_CHECKLIST.md)                     | Final local-maintenance setup, security, testing, and operational checklist.        |
| [config/local-env.template](config/local-env.template)                       | Safe configuration template with placeholders only.                                 |
| [docs/archive/implementation-reports/](docs/archive/implementation-reports/) | Historical delivery reports; they are not the current implementation specification. |
