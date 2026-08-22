# Phase 07 — Always-On Realtime and Protected Validation

## Scope

After explicit approval of always-on hosting, this phase adds a patient-scoped Server-Sent Events (SSE) transport to LifeLink. The stream uses the same signed session authentication as protected procedures, resumes from the persisted patient event log, and invalidates only the affected query caches in the signed-in patient shell. It does not transmit symptom text, profile contents, appointments, prescriptions, medicines, or any other clinical payload through the realtime channel.

## File-by-File Implementation

| File | Change | Result |
|---|---|---|
| `server/patientEventBus.ts` | Added a process-local event bus with per-patient channels and typed event payloads. | Live events can only be published and subscribed to under the same numeric patient identifier. |
| `server/patientRealtime.ts` | Added `/api/patient-events`, an authenticated SSE endpoint with keepalives, retry guidance, database backlog replay, and client disconnect cleanup. | The server derives the patient from the signed session; it never accepts a browser-supplied patient identifier. |
| `server/_core/index.ts` | Registered the SSE route before the tRPC and static application routes. | The always-on Node process serves the long-lived patient stream directly. |
| `server/db.ts` | Made `createPatientEvent` publish the event after persistence and changed catch-up ordering to ascending event IDs. | Reconnects receive event IDs in a stable order; data is first durable in the database, then delivered live. |
| `client/src/hooks/usePatientRealtime.ts` | Added one same-origin `EventSource` per signed-in patient shell, mapped only event types to targeted React Query invalidations. | Dashboard, profile, appointments, medicines, prescriptions, and assessment history refresh after relevant patient events without polling or cross-user broadcast. |
| `client/src/components/layout/AppShell.tsx` | Mounted the realtime hook once within the protected patient application shell. | Doctor routes do not mount the patient stream. |
| `server/patientRealtime.test.ts` | Added event-channel isolation and resume-ID validation tests. | The test proves an event for one patient is not delivered to a second patient channel. |
| `todo.md` | Recorded realtime completion, the approved disposable-account validation, cleanup, and clinician mock-boundary verification. | Remaining operational work is checkpoint and delivery only. |

## Realtime Security and Reliability Model

| Concern | Implemented control |
|---|---|
| Authentication | The SSE route calls the existing server authentication SDK on every connection. An unauthenticated request receives HTTP 401. |
| Ownership | The route fetches catch-up events only with the authenticated user ID and subscribes only to that user’s event channel. |
| Event content | The stream sends the event ID, type, entity reference, and timestamp. It does not send clinical data. |
| Reconnect | SSE `Last-Event-ID` or `lastEventId` is parsed only as a positive integer; persisted events after that ID are replayed in ascending order. |
| Connection lifecycle | A 25-second comment heartbeat keeps the long-lived connection active. Abort/close handlers remove the listener and interval. |
| Patient updates | The client invalidates only patient query caches associated with the received event type. It does not run interval polling. |
| Clinician boundary | `client/src/features/doctor/Login.tsx` remains a local mock flow that only navigates to the mock doctor dashboard. `Dashboard.tsx` retains static consultation counts and navigation-only controls, while `Profile.tsx` retains static default fields and a non-submitting button. None invoke patient authentication, database procedures, or realtime code. |

## Approved Temporary-Account Validation

The user approved a one-time temporary native patient account. It was created through the native registration procedure with only a disposable name, email, and password; no health passport fields, assessment, appointment, medicine, prescription, or other clinical data were supplied. The disposable signed session verified the protected Dermatology/Mumbai discovery response, a deliberately incomplete appointment request returning its validation error without persisting an appointment, and the authenticated SSE handshake. A separate request without a session received HTTP 401.

After validation, the temporary user and credential were removed using their unique disposable email. A verification query returned zero user and credential rows, and the local cookie jar and credential file were deleted. No temporary clinical or appointment data remains.

## Verification Results

| Check | Result |
|---|---|
| `pnpm check` | Passed with no TypeScript errors. |
| `pnpm test` | Passed: **6 test files, 15 tests**. This includes native password behavior, assessment safety, directory contracts, realtime patient-channel isolation, and resume-ID validation. |
| `pnpm build` | Passed. The existing Vite advisory for a JavaScript chunk above 500 kB remains non-blocking. |
| Protected discovery contract | The temporary signed session returned the controlled Chembur/Harbour Dermatology entry for the Mumbai Dermatology query. |
| Appointment safety | A request missing `scheduledAt` failed input validation and did not create an appointment. |
| Realtime authentication | The temporary signed session received the SSE retry prelude; an unauthenticated request was rejected with HTTP 401. |
| Responsive visual checks | Desktop and 375 × 812 specialist screenshots showed the filtered controls, controlled-directory disclosure, request-time control, result card, and the transparent local map-proxy fallback. |
| Doctor mock preservation | The clinician login, dashboard, profile, and schedule-related controls remain static or navigation-only. They do not call production patient authentication, profile, appointment, assessment, or realtime code. |

> The hosted maps proxy accepts the LifeLink hosted preview origin. The local screenshot renderer runs at `127.0.0.1`, which is not an approved maps-proxy origin; in that renderer the application shows a clear availability notice instead of suggesting that a map, location, or distance result was obtained.
