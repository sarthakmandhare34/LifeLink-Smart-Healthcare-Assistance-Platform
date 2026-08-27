# Phase 23 — Deployment Lockfile Repair and Map Copy Removal

## Deployment Repair

The failed deployment was caused by a **pnpm frozen-lockfile configuration mismatch**, not by the Node.js `url.parse()` deprecation warning. The warning is emitted by a dependency path; it did not stop the deployment. The blocking error occurred because the package override metadata changed during npm local-development support while `pnpm-lock.yaml` still recorded the previous override configuration.

The pnpm lockfile has now been regenerated from the current package metadata. A production-equivalent installation confirms that the mismatch is resolved:

| Validation                       | Result                              |
| -------------------------------- | ----------------------------------- |
| `pnpm install --frozen-lockfile` | Passed; lockfile is current.        |
| `pnpm test`                      | Passed: 15 test files and 36 tests. |
| `pnpm build`                     | Passed.                             |

The npm local workflow remains available. `npm install`, `npm run dev`, and `npm run verify` continue to be documented and supported for a local checkout, while the production deployment can use pnpm’s frozen lockfile safely.

## Map Copy Removal

The remaining visible map readiness and browser-location guidance has been removed from `MumbaiDoctorMap`. The removed text was:

> “Interactive Google Maps view is ready. Select a directory card or marker to focus its controlled location.”

The browser-location variation of that status text was removed at the same time. Interactive marker creation, card/marker selection, optional page-local browser-location centering, retry fallback, and non-persistence behavior were not changed.

## Scope Boundary

The map continues to display only controlled development-directory markers. No visible copy removal changes the underlying safety boundary: the directory does not represent real clinicians, verified availability, actual provider locations, distance claims, ratings, or recommendations.
