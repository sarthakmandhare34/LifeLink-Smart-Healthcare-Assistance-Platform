# Phase 40 — File Organization Plan

## Audit conclusion

The active application is already correctly separated into `frontend`, `backend`, `database`, and `shared`. The reorganization therefore avoids risky wholesale moves of framework plumbing, database migrations, API routes, or deployment configuration.

| Finding                                                                             | Safe action                                                                                                 |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Specialist Finder has a feature-specific stylesheet at `frontend/src/discovery.css` | Move it beside the feature under `frontend/src/features/patient/` and update its import and test reference. |
| Browser OAuth helper is a root frontend source file                                 | Move it into `frontend/src/lib/` as an authentication utility and update the consuming hook.                |
| Implementation records are split between `implementation-reports/` and `reports/`   | Consolidate the later records into the documented `implementation-reports/` folder.                         |
| `backend/index.ts` is a stale unused server entrypoint                              | Remove it only after confirming package scripts use `backend/_core/index.ts`.                               |

## Safeguards

The planned change keeps frontend pages, components, hooks, services, and browser utilities inside `frontend`; server code and protected integration logic inside `backend`; schema and migrations inside `database`; and cross-boundary contracts inside `shared`. After each move, imports and tests will be updated, then type checking, the full test suite, and production build will verify the restored project remains operational.

## Completed organization

The Specialist Finder stylesheet now sits alongside its feature component at `frontend/src/features/patient/specialistFinder.css`. The browser OAuth helper now resides in `frontend/src/lib/auth.ts`. All phase records are consolidated under `implementation-reports/`, matching the documented repository tree. The unused `backend/index.ts` legacy server entrypoint was removed; active package scripts already use `backend/_core/index.ts`.

Type checking, the full Vitest suite, and the production build passed after the changes. The Specialist Finder was also rendered in the browser after its stylesheet move, confirming the feature’s visual structure remained intact.
