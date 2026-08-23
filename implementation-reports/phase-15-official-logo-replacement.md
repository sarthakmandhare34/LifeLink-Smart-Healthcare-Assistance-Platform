# Phase 15 — Official LifeLink Logo Replacement

## Objective

This phase replaces the temporary synthetic LifeLink pulse mark with the owner-supplied official LifeLink artwork. The approved artwork is now the single source for both full wordmark usage and compact identity treatments, so the interface no longer presents an emoji-style or separately drawn healthcare symbol as the product logo.

## Files Updated

| File | Change |
| --- | --- |
| `frontend/src/components/brand/LifeLinkLogo.tsx` | Uses the owner-supplied deployment asset at `/manus-storage/lifelink-official-logo_71a0ddff.jpg`. It supports a full wordmark and a compact symbol crop, with the owner-selected `307 × 173` entry-page display size scoped to authentication surfaces. |
| `frontend/src/components/brand/LifeLinkMark.tsx` | Replaced the synthetic linked-pulse CSS construction with the compact crop of the same official artwork. |
| `frontend/src/components/layout/AppShell.tsx` | Replaced the patient sidebar's synthetic mark/name pairing and profile mark with official-logo treatments. |
| `frontend/src/components/layout/DoctorAppShell.tsx` | Replaced the clinician profile's synthetic mark with the official-logo compact treatment. |
| `frontend/src/index.css` | Preserves the full official wordmark for entry and sidebar surfaces, provides a compact crop for avatar-sized contexts, and retains the dark-mode white frame/separation treatment. |
| `frontend/src/components/layout/AppShell.test.ts` | Updates the branding regression assertion to reference the official supplied asset. |

## Verification

| Check | Result |
| --- | --- |
| Patient login | Verified visually in light mode; the full official wordmark is fully visible and proportionate. |
| Patient registration | Verified visually in light mode; the same full official wordmark is used. |
| Clinician login | Verified visually in light mode; the same full official wordmark is used. |
| Patient login dark mode | Verified visually; the official artwork remains readable inside its high-contrast framed presentation. |
| Automated validation | `pnpm test` and `pnpm build` completed successfully after the final sizing change. |

## Scope Boundaries

This update changes only application branding presentation. It does not modify patient records, clinical decision-support behavior, provider authentication policy, Google credentials, map data, doctor-directory status, or session handling.
