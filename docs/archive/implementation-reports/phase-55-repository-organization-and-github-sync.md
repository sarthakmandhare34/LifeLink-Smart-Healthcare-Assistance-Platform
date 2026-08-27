# Phase 55 — Repository Organization and GitHub Synchronization

## Objective

Review the existing LifeLink repository against the established ownership model: frontend code in `frontend`, server code in `backend`, schema and migration material in `database`, and cross-boundary contracts in `shared`. Preserve the current architecture and working behavior; remove only material that is demonstrably obsolete.

## Repository Classification

| Boundary                  | Tracked file count at review | Classification                     | Finding                                                                                                                                                                    |
| ------------------------- | ---------------------------: | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`               |                           77 | Browser application                | React entry points, components, contexts, feature pages, browser hooks, feature styles, and frontend regression tests are correctly located.                               |
| `backend/`                |                           46 | Server application                 | Express/tRPC runtime, authentication, assessment service, persistence helpers, controlled clinician services, realtime transport, and backend tests are correctly located. |
| `database/`               |                           25 | Persistence layer                  | Drizzle schema, relations, SQL migrations, and migration metadata are correctly located.                                                                                   |
| `shared/`                 |                            5 | Cross-boundary contracts           | Shared constants, errors, rail data, coordinates, and types are correctly located.                                                                                         |
| `scripts/`                |                            1 | Maintained developer utility       | The logo-cropping utility is not runtime code and is appropriately isolated.                                                                                               |
| `implementation-reports/` |        52 before this report | Documentation history              | Historical reports are non-runtime documentation and should remain separate from active source.                                                                            |
| Root configuration        |                           13 | Build and repository configuration | Package files, lockfiles, TypeScript/Vite/Vitest config, formatting config, README, and TODO history belong at the root.                                                   |

## Import and Configuration Review

The TypeScript project includes `frontend/src`, `backend`, `database`, and `shared`; it excludes generated output and tests from the production type-check. Vite uses `frontend` as its root, resolves `@` into `frontend/src`, resolves `@shared` into `shared`, and writes production browser output to `dist/public`. The server starts from `backend/_core/index.ts`.

No active import referring to the former `client`, `server`, or `drizzle` source roots was found. No tracked temporary, backup, log, source-map, or generated-runtime artifact was found within the active source boundaries.

## Deliberate Retention Decisions

No source relocation or deletion was performed. The structure already satisfies the requested boundary model, and deletion would either remove useful history or risk breaking an active dependency.

| Item                                     | Decision       | Reason                                                                                                                                                                                        |
| ---------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package-lock.json` and `pnpm-lock.yaml` | Retain         | Local npm and managed pnpm workflows are both documented and supported.                                                                                                                       |
| `scripts/crop_lifelink_logo.py`          | Retain         | Maintained development utility, correctly isolated from runtime application code.                                                                                                             |
| `implementation-reports/`                | Retain         | Project history and delivery evidence; no runtime impact.                                                                                                                                     |
| `MockDataContext.tsx`                    | Retain for now | It remains an explicit dependency of the session-only Settings preference view. It is not safe to remove until that feature is migrated or retired.                                           |
| Runtime-served logo reference            | Retain         | The browser source path is intentionally resolved by the deployed runtime. Adding duplicate image files to the application repository would be contrary to the project’s static-asset policy. |

## Documentation Changes

`README.md` now records the active repository tree, boundary rules, command workflow, controlled clinician scope, intentional file-retention decisions, and the validation standard. The documentation distinguishes database-backed patient operations from deliberately controlled clinician records and avoids characterizing the clinician workspace as a real medical system.

## Validation Plan

The final step for this phase is to run `pnpm run verify`, inspect repository status for only intentional documentation and checklist changes, then save a checkpoint. The checkpoint is the GitHub synchronization point and publishes the already-configured production release.
