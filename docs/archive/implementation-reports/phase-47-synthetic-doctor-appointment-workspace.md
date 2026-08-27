# Phase 47 — Synthetic Doctor Appointment Workspace

## Completed increment

This phase converts the first clinician-facing workflow from static demonstration content to a protected, connected appointment workspace without changing LifeLink’s established `frontend/`, `backend/`, `database/`, and `shared/` boundaries. The patient portal remains the source of real patient records. The clinician identity is deliberately synthetic and reuses one controlled Mumbai directory entry; no real doctor, credential, clinic affiliation, or patient medical record was introduced.

| Area                        | Result                                                                                                                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Synthetic doctor session    | A server-only access-code login establishes a signed session for one stable controlled-directory identity. The code is not returned by the API or bundled into the frontend.                                                                                      |
| Shared appointment workflow | The signed synthetic doctor can list only appointments whose stored `doctorId` matches that session, then accept or decline only pending requests assigned to that doctor.                                                                                        |
| Patient synchronization     | A doctor appointment decision creates the existing patient `APPOINTMENT_UPDATED` notification, so the patient stream invalidates and refetches the affected appointment data.                                                                                     |
| Doctor synchronization      | A patient appointment request creates a notification-only doctor event, delivered through a new authenticated SSE endpoint using the existing EventSource pattern.                                                                                                |
| Doctor UI                   | Login, shell identity, dashboard, appointments, patients, and profile now use protected tRPC data. Unsupported assessment, consultation, prescription, and patient-detail surfaces show explicit no-data/deferred states rather than fabricated clinical content. |

## Files changed and created

| Category      | Files                                                                                                                                                                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Database      | `database/schema.ts`; generated and applied `database/0006_parched_leper_queen.sql`; Drizzle metadata updated by generation.                                                                                                                                                                        |
| Backend       | `backend/db.ts`, `backend/doctorAuth.ts`, `backend/syntheticDoctor.ts`, `backend/patientEventBus.ts`, `backend/patientRealtime.ts`, `backend/routers.ts`, `backend/routers/doctor.ts`, `backend/routers/patient.ts`, `backend/_core/env.ts`, `backend/_core/index.ts`, and `backend/_core/trpc.ts`. |
| Frontend      | `frontend/src/features/doctor/Login.tsx`, `Dashboard.tsx`, `Appointments.tsx`, `Patients.tsx`, `PatientView.tsx`, `Prescriptions.tsx`, `Consultation.tsx`, `Assessments.tsx`, `Profile.tsx`, `frontend/src/components/layout/DoctorAppShell.tsx`, and `frontend/src/hooks/useDoctorRealtime.ts`.    |
| Tests         | `backend/doctorAuth.test.ts`, `backend/routers/doctor.test.ts`, and `backend/patientRealtime.test.ts`.                                                                                                                                                                                              |
| Removed files | None. Static doctor-only fabricated content was replaced in place with protected data or explicit unavailable states.                                                                                                                                                                               |

## Schema and migration

The migration adds the `doctor` user role and the `doctorEvents` table. `doctorEvents` contains only delivery routing fields: controlled `doctorId`, affected `patientUserId`, event type, entity ID, and timestamp. It does not contain assessment, prescription, profile, or other clinical payloads. The migration was reviewed and applied without destructive operations.

## Security and privacy controls

The backend determines the current doctor from the signed session open ID and validates it against the controlled synthetic directory. Browser clients cannot submit an arbitrary doctor identity to list or mutate appointments. Patient sessions are rejected by the doctor procedure guard. Doctor SSE delivery is scoped to the signed synthetic doctor channel; patient SSE remains scoped to the authenticated patient. The application sends notification-only event payloads and performs secure query refetches for data.

## Verification

Type checking passed. The full Vitest suite passed: **25 test files and 59 tests**. The production build passed. Dedicated coverage verifies the configured server-only doctor access code through the login endpoint without returning the code, server-side doctor-role enforcement, signed-doctor appointment scoping, patient notification after an authorized decision, and doctor event-channel isolation. The doctor login surface was visually checked at desktop and mobile widths.

## Known limitations and next increment

This phase intentionally does not claim completion of doctor-side Health Passport access, assessment review, consultation persistence, or prescription creation. Those workflows require their own minimum schema and server-side relationship checks before exposing patient records. The next increment should add authorized patient-detail reads, then implement doctor-created prescriptions and consultations with the same appointment relationship and SSE invalidation model.
