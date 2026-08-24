# Phase 29 — README and Repository Cleanup

## README Refresh

The root README is now a complete LifeLink guide. It explains the product scope, implemented modules, privacy/safety boundaries, stack, repository structure, local npm workflow, pnpm deployment workflow, required local environment categories, verification commands, responsive support, and developer organization rules.

The new documentation explicitly distinguishes database-backed patient functionality from mock-only doctor/discovery content. It also records the browser-location and SOS boundaries so local contributors do not accidentally represent mock providers or user-controlled actions as live services.

## Repository Cleanup

Only files verified as stale and unreferenced were removed. Active source, build configuration, dependency lockfiles, migrations, shared contracts, scripts, reports, and tests were retained.

| Removed file | Reason |
| --- | --- |
| `.gitkeep` | Empty root placeholder with no directory-preservation purpose or source/tooling reference. |
| `ideas.md` | Historical design notes contained obsolete architecture and implementation claims that conflicted with the active project. |
| `template.json` | Stale static-template snapshot that described a different `client/` / static-only project and was not used by the current full-stack build. |

## Retained Structure

| Directory | Role |
| --- | --- |
| `frontend/` | React application, components, features, styles, client hooks, and tests. |
| `backend/` | Express/tRPC services, auth, assessment, discovery, realtime, and server tests. |
| `database/` | Drizzle schema, relations, migration files, and migration metadata. |
| `shared/` | Shared contracts, constants, rail network, and station-reference types. |
| `scripts/` | Maintained project utilities. |
| `implementation-reports/` | Historical phase reports and verification records. |

## Validation

The repository was searched for references to the removed artifacts; none remain outside historical documentation. Type checking, the full test suite, and the production build all passed after cleanup. The final tracked project structure contains active source, configuration, documentation, tests, scripts, and reports only.
