# Phase 06 — Controlled Mumbai Discovery and Maps Workflow

## Scope

This phase implements the patient-side discovery journey from an assessment specialty to controlled Mumbai development-directory entries. It intentionally retains mock clinician data and does not represent any entry as a verified practitioner, actual availability, a clinical recommendation, a rating, or a nearby result. The existing patient-owned appointment-request procedure remains the only scheduling action.

## File-by-File Implementation

| File | Change | Result |
|---|---|---|
| `server/mockDoctorDirectory.ts` | Added typed filter inputs, repository-owned filtering, and discovery facets for the fixed Mumbai scope, specialties, localities, and Central/Harbour/Western rail corridors. | The three development entries remain the sole source of discovery data. No provider API, real clinician details, ratings, reviews, credentials, or availability were introduced. |
| `server/routers/patient.ts` | Replaced the unfiltered directory procedure with protected `patientDiscovery.list` filters and `patientDiscovery.facets`. | Filtering occurs in the server contract, while patient appointment requests remain independently protected and doctor identifiers are still validated against the controlled directory. |
| `server/mockDoctorDirectory.test.ts` | Added directory filtering and facet regression coverage. | Confirms Central and Dermatology filters only return the approved mock records and facets contain only the fixed Mumbai values. |
| `client/src/features/patient/AIAssessment.tsx` | Updated both non-emergency “Find specialty” actions to send the recommended specialty as a route query parameter. | The assessment-to-discovery handoff preselects a relevant specialty without exposing or duplicating assessment content. |
| `client/src/features/patient/SpecialistFinder.tsx` | Added city-scope display, specialty/rail/locality/search filters, explicit development-directory disclosure, result count, selected-card handling, map pane, and retained appointment request date/time validation. | Cards, URL specialty state, and filters use the protected directory response. A map marker or card selection drives the same selected doctor state. |
| `client/src/components/MumbaiDoctorMap.tsx` | Added a Mumbai-centred wrapper around the supplied map component, using only mock-directory coordinates for markers and selected-card panning. | The map never requests browser geolocation and never calculates or displays a distance. |
| `client/src/components/Map.tsx` | Hardened proxy script loading to reuse a single request and report a load failure to consumers. | The shared map component remains proxy-backed, keyless from the user’s perspective, and does not add an external map library. |
| `client/src/discovery.css` | Added responsive discovery filters, glass directory/map layout, map sizing, and a transparent error state. | On small screens the map pane moves before the results and filters stack cleanly. |

## Data and Safety Boundaries

| Area | Implemented boundary |
|---|---|
| Directory scope | City is visibly fixed to **Mumbai**. Filters are limited to the controlled localities, specialties, and Central, Harbour, and Western rail corridors. |
| Clinical and provider claims | Every page surface labels the directory as a development mock. No real clinical identity, qualification, availability, review, rating, or suitability claim is displayed. |
| Location privacy | LifeLink does not request location permissions, determine proximity, or show a distance. The map displays only the repository-controlled marker coordinates. |
| Appointment integrity | A patient must select a future requested time. The existing protected server procedure validates the selected directory identifier and stores the request under the current patient. |
| Map service | The supplied proxy-backed component is used directly. No Google Maps key is requested or committed. |

## Verification Results

| Check | Result |
|---|---|
| Directory tests | Passed: Central-corridor and Dermatology filters return only the expected controlled mock entries; approved facets are asserted. |
| `pnpm check` | Passed with no TypeScript errors. |
| `pnpm test` | Passed: **5 test files, 13 tests**. |
| `pnpm build` | Passed. The existing advisory about a JavaScript chunk above 500 kB remains non-blocking. |
| Desktop visual check | `/patient/specialists` rendered all three controlled Mumbai entries, the disclosures, city/specialty/rail/locality controls, request-time input, map pane, and appointment actions. `/patient/specialists?specialty=Dermatology` rendered only the Chembur/Harbour mock entry. |
| Mobile visual check | At 375 × 812, the filters stacked, the specialty handoff remained selected, the map pane appeared before the result card, and the appointment action remained visible. |
| Hosted map-proxy probe | The managed proxy returned a successful JavaScript response when tested with the hosted LifeLink preview origin. The local screenshot renderer uses `127.0.0.1`, which the proxy does not approve; therefore it correctly shows an explicit temporary map-unavailable message rather than a misleading blank map. |
| Hosted authenticated marker interaction | Not automated, because no user-owned patient session or clinical data was created for validation. The marker/card synchronization is implemented but should be exercised in the hosted signed-in session by the account holder. |

## Remaining Work

The patient data and controlled discovery work are now complete for this increment. Strict event-driven realtime transport still requires a persistent hosting decision, because the current autoscaling environment is not suitable for a long-lived authenticated event stream. The next step is to obtain explicit approval before enabling reserved hosting or claiming realtime updates.
