# LifeLink Local Development

LifeLink can be run from a local checkout with **npm**. The project uses Node.js, TypeScript, React/Vite, Express, Drizzle, and MySQL. The commands below do not expose or create any production credentials.

## Prerequisites

Install **Node.js 22 or later**, npm, and a MySQL-compatible database. Then clone the repository and open the project directory.

```bash
git clone https://github.com/sarthakmandhare34/LifeLink-Smart-Healthcare-Assistance-Platform.git
cd LifeLink-Smart-Healthcare-Assistance-Platform
npm install
```

`npm install` creates or uses `package-lock.json` for repeatable local dependency installation. The managed hosting environment retains its existing package-manager metadata, but the standard npm commands below are supported for a local checkout.

## Configure Local Environment

Create a local `.env` file on your own machine and fill only the values for your own local environment. The project intentionally does not ship a managed environment file or any credential values.

| Capability | Local requirement |
| --- | --- |
| Native patient accounts, profiles, appointments, medicines, prescriptions, and assessment history | `DATABASE_URL` and `JWT_SECRET` |
| AI assessment with direct Gemini | Your own server-only `GEMINI_API_KEY` |
| Google OAuth | A Google OAuth client plus a public HTTPS callback URL; localhost alone is not accepted by Google |
| Managed map proxy, storage branding, and platform LLM fallback | Hosting-platform configuration; do not copy platform credentials from production |

> **Security rule:** Keep `.env` private. Never place database URLs, JWT secrets, Gemini keys, Google OAuth secrets, or platform keys in GitHub, frontend code, screenshots, or chat.

## Run Locally

Start the local development server:

```bash
npm run dev
```

The server reports its local URL in the terminal, normally `http://localhost:3000`. The command is cross-platform because the project scripts use `cross-env`.

Use the remaining standard npm commands as follows:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with file watching. |
| `npm test` | Run the automated Vitest suite. |
| `npm run check` | Run TypeScript type checking. |
| `npm run build` | Build the frontend and server for production. |
| `npm run start` | Run a previously built production bundle. |
| `npm run db:push` | Generate and apply Drizzle migrations to the database named by `DATABASE_URL`. Review database settings before running it. |
| `npm run verify` | Run type checking, tests, and the production build in sequence. |

## Local Feature Boundaries

The Mumbai Specialist Finder is a **controlled development directory**. It contains mock entries only, including marker reference points; it does not represent real doctors, live availability, reviews, recommendations, or actual provider locations.

The browser-location option is opt-in and stays in the page session. The application does not persist or transmit a user’s precise browser coordinates.

Google OAuth and managed Maps require their own configured services. Native email/password development flows can still be used locally once MySQL and the session secret are configured.
