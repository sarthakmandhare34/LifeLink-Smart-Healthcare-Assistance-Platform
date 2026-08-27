# Phase 18 — Interactive Mumbai Map Reliability Fix

## Root Cause

The controlled Mumbai map was displaying its safe fallback because the managed Maps proxy authorizes browser script requests using the request origin. The frontend script had been loaded without anonymous CORS, so the required origin signal was not present and the proxy rejected the map script.

## Fix

| File                                          | Change                                                                                                                                                                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/Map.tsx`             | Restored `crossOrigin="anonymous"` for the managed Maps script. This sends the public LifeLink origin while remaining cookie-free. The loader now also checks that the Google Maps namespace exists after loading and fails safely otherwise. |
| `frontend/src/components/MumbaiDoctorMap.tsx` | Added a **Retry interactive map** action that recreates the map loader after a transient failure. Directory filtering, controlled markers, and browser-only location handling remain unchanged.                                               |
| `frontend/src/discovery.css`                  | Styled the retry action for light and dark map-fallback states.                                                                                                                                                                               |
| `frontend/src/components/Map.test.ts`         | Added regression coverage for the anonymous managed-proxy loader mode.                                                                                                                                                                        |

## Verification

| Check                    | Result                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Maps proxy authorization | The managed proxy returned HTTP `200` when sent the permanent LifeLink domain as the browser origin.           |
| Public HTTPS             | The temporary SSL protocol error cleared; the permanent login route was subsequently reachable in the browser. |
| Automated checks         | All 15 test files and 36 tests passed; the production build passed.                                            |
| Live confirmation        | The owner confirmed the refreshed interactive map flow after deployment.                                       |

## Safety Boundaries

The map continues to show only controlled development-directory entries. It does not assert verified clinicians, appointments, availability, rankings, live transit, travel time, distance, or medical recommendations. Browser location remains opt-in, scoped to the current page, not stored, and not transmitted to LifeLink.
