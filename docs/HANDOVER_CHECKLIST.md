# LifeLink Local-Maintenance Handover Checklist

This checklist is the operational handover for the standalone LifeLink repository. Complete the items in order when creating a local or self-hosted environment.

## 1. Project and Dependency Setup

- [ ] Clone the repository into a private working directory.
- [ ] Install Node.js 22 or later and MySQL 8 or a compatible MySQL database.
- [ ] Run `npm install` from the project root.
- [ ] Copy `config/local-env.template` to `.env`.
- [ ] Confirm `.env` and `local-data/` are ignored by Git before adding any private values.

## 2. Required Security Configuration

- [ ] Set `DATABASE_URL` to the dedicated LifeLink MySQL database; do not reuse an unrelated database.
- [ ] Generate a random `JWT_SECRET` with at least 32 characters.
- [ ] Generate a private `LIFELINK_CLINICIAN_ADMIN_CODE` with at least 16 characters.
- [ ] Restrict database credentials to the LifeLink database and minimum required permissions.
- [ ] Store secrets outside source control and rotate them if they were ever shared or committed.
- [ ] Confirm production runs behind HTTPS so secure session cookies are enabled.

## 3. Database Setup

- [ ] Create the empty MySQL database and least-privilege application user.
- [ ] Review `database/schema.ts` and generated migration SQL.
- [ ] Run `npm run db:generate` only when the schema changes.
- [ ] Run `npm run db:migrate` against the intended database.
- [ ] Confirm the application database connection with a local health or sign-in test.
- [ ] Establish routine, encrypted backups for the database before accepting real records.

## 4. Optional Integrations

| Integration           | Checklist                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Gemini Assessment     | Add `GEMINI_API_KEY` to `.env`; verify the key remains server-only; set `GEMINI_MODEL` only to an available model.                          |
| Google OAuth          | Use an HTTPS public origin, add the direct Google client ID and secret, and register `/api/auth/google/callback` as the exact callback URL. |
| Google Maps           | Add an origin-restricted `VITE_GOOGLE_MAPS_API_KEY`; optionally add a Map ID. The directory must remain usable without the map.             |
| Profile-photo storage | Optionally set `LIFELINK_STORAGE_DIR` to an encrypted or access-controlled local volume outside source control.                             |

## 5. Functional Smoke Test

- [ ] Run `npm run dev` and open `http://localhost:3000`.
- [ ] Register a new test patient account with a non-production test email.
- [ ] Sign out and sign in with that same patient account.
- [ ] Verify that profile, Health Passport, emergency contacts, appointments, medicines, prescriptions, and assessment history remain scoped to that account.
- [ ] Verify the Specialist Finder filters work with the map disabled and that an appointment request can be created.
- [ ] Verify red-flag assessment text produces emergency guidance before any AI provider response.
- [ ] With owner authorization, provision a controlled clinician account and confirm it sees only its assigned appointment data.
- [ ] Verify a clinician can create a controlled prescription record only for an assigned appointment.
- [ ] Open a second signed-in test session and confirm events are not shared across patient or clinician identities.

## 6. Quality Gate

```bash
npm run check
npm test
npm run build
npm run verify
```

- [ ] Resolve all TypeScript errors.
- [ ] Resolve all failing tests.
- [ ] Review build warnings before release.
- [ ] Check desktop and mobile layouts in light and dark themes.
- [ ] Confirm no user-facing text describes controlled records as real or verified clinical services.

## 7. Ongoing Maintenance

- [ ] Review dependency updates on a scheduled basis and apply them in a dedicated test branch.
- [ ] Review database migrations before applying them to any shared or production database.
- [ ] Back up the database and private profile-photo storage before upgrades.
- [ ] Test native sign-in, appointment ownership, clinician isolation, AI emergency override, and realtime scope after every security-sensitive change.
- [ ] Keep this checklist and `docs/LOCAL_SETUP.md` current when adding integrations or changing local operations.

> **Do not use LifeLink to make a diagnosis, prescribe medical treatment, identify a real clinician, provide live availability, or trigger emergency services automatically.**
