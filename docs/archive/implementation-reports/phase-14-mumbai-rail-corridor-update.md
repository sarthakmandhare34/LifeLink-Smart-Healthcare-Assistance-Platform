# Phase 14 — Mumbai Suburban Rail Corridor Update

## Purpose

This update replaces the earlier flat three-corridor label with the owner-supplied Mumbai suburban railway reference. The discovery experience now understands the **Western**, **Central**, and **Harbour** lines, their supplied travel-order branches, and shared stations as one station entity with multiple line associations.

## Implementation

| File                                                 | Change                                                                                            | Result                                                                                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/mumbaiRailNetwork.ts`                        | Added the normalized station registry and eight supplied corridor/branch sequences.               | Shared stations such as Dadar, CSMT, Kurla, Mahim Junction, Bandra, Andheri, and Goregaon retain one station record with all applicable lines. |
| `backend/mockDoctorDirectory.ts`                     | Added a station and full line associations to each controlled directory entry.                    | A directory entry can now match every corridor serving its station without changing the mock-doctor scope.                                     |
| `backend/routers/patient.ts`                         | Added validated optional station filtering to the protected discovery contract.                   | Railway-station filtering remains patient-authenticated and accepts only bounded text input.                                                   |
| `frontend/src/features/patient/SpecialistFinder.tsx` | Added a railway-station selector, shared-line labels, and synchronized corridor/station behavior. | Selecting a rail line narrows station choices; incompatible selections clear safely.                                                           |
| `frontend/src/components/MumbaiDoctorMap.tsx`        | Added the expandable rail guide below the map.                                                    | All supplied branches are shown in travel order; selecting a station applies the directory filter.                                             |
| `frontend/src/discovery.css`                         | Added responsive rail-guide, station, branch, and shared-station styling.                         | The guide remains scrollable and usable within the existing map pane.                                                                          |
| `backend/mockDoctorDirectory.test.ts`                | Added station and shared-association assertions.                                                  | Dadar verifies as Western + Central, while Wadala Road verifies as Harbour only.                                                               |

## Safety and Data Boundaries

> The station guide is a supplied reference for filtering a controlled development directory. It does **not** claim live train status, travel time, proximity, doctor availability, ratings, or GPS-derived “nearby” results.

Doctor profiles remain explicitly mocked. No healthcare record, real clinician, or patient location was added during this update.

## Verification

| Check                | Result                                                                                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shared-station model | Passed. Dadar is a single station with Western + Central associations; Wadala Road remains Harbour-only.                                                                                                                                   |
| Station filter       | Passed in the authenticated browser: selecting Dadar returned the one controlled Dadar entry.                                                                                                                                              |
| Corridor filter      | Passed in the authenticated browser: choosing Harbour cleared the incompatible Dadar filter, limited station choices to Harbour-served stations, displayed the three Harbour branches, and returned the two applicable controlled entries. |
| Map interaction      | Passed. Controlled map markers remained available and the map guide/filters remained synchronized.                                                                                                                                         |
| Automated validation | Passed: focused railway-directory tests, complete test suite, TypeScript validation, and production build.                                                                                                                                 |
| Test-data cleanup    | Passed. The disposable no-health-data verification account was deleted and a zero-count check confirmed removal.                                                                                                                           |

## Source

The station names, line associations, branch structure, and station ordering were supplied by the project owner in `pasted_content.txt` on 23 August 2026.
