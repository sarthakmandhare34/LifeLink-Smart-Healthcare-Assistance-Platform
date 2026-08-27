# Phase 17 — Specialty-Only Directory Search

## Objective

The Specialist Finder search field was simplified at the owner's request so free-text matching is limited to specialty names. Station, corridor, locality, directory name, and hospital text no longer match through this field. Rail corridor and station remain available as their dedicated residence-oriented filters.

## Files Updated

| File                                                 | Change                                                                                                                                                                                                     |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/features/patient/SpecialistFinder.tsx` | Replaced the multi-field placeholder with **“Search by specialty…”** and added explicit guidance that free-text matches specialties only while Mumbai area and station remain dedicated residence filters. |
| `backend/mockDoctorDirectory.ts`                     | Restricted the controlled-directory `query` predicate to `doctor.specialty`.                                                                                                                               |
| `backend/mockDoctorDirectory.test.ts`                | Added coverage demonstrating that a specialty fragment returns the relevant controlled entry while locality and rail-corridor text return no free-text matches.                                            |

## Verification

| Check                   | Result                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Specialty filtering     | A unique specialty fragment returns the expected controlled entry.                                                                    |
| Non-specialty free text | Locality and corridor terms return no results through the free-text field.                                                            |
| Desktop visual review   | The field visibly reads **“Search by specialty…”** and the surrounding residence filters remain unchanged.                            |
| Automated validation    | All 14 test files and 35 tests passed, including deterministic local Google callback-route coverage, and the production build passed. |

## Scope Boundary

This adjustment does not change controlled directory data, appointments, live-map behavior, browser-location privacy handling, patient records, or clinician status. Directory entries remain explicitly labeled mock development data.
