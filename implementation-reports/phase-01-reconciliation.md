# LifeLink Master Handover — Phase 1 Reconciliation

**Status:** Completed inspection and reconciliation.  
**Implementation posture:** Preserve the existing LifeLink routes, liquid-glass UI, dark/light themes, 3D assessment popup, doctor mock screens, and working user flows. Make the smallest safe changes needed to move the patient experience from in-memory state to protected server-side persistence.

> The master handover makes the patient experience real and database-backed in this phase, while deliberately retaining **mock doctor accounts, profiles, dashboards, and availability**. Doctor discovery, however, begins now through a controlled mock-doctor repository, Mumbai geographic filters, maps, and real patient appointment records.

## Current Architecture

| Layer | Active implementation | Reconciliation result |
|---|---|---|
| Web client | React, TypeScript, React Router, existing LifeLink glass UI | **Preserve** |
| Server | Express, tRPC, Drizzle, MySQL | **Extend incrementally** |
| Current authentication | Framework-managed user identity is available server-side; native patient form is still mock-only | **Add native credential-backed patient auth without disturbing doctor mocks** |
| Patient persistence | `users` and `patientAssessments` are the only active tables | **Expand** |
| Doctor system | In-memory doctor users and screens | **Preserve as mock** |
| Discovery | Client-side name/specialty filtering over two mock doctors | **Replace with a mock repository interface and Mumbai workflow** |
| Maps | Generic proxy-backed `MapView` component exists but is unused | **Wire into discovery** |
| Realtime | No event transport is present | **Add authenticated event delivery** |
| AI assessment | Browser-local decision-support fallback | **Restore a server-side Gemini contract with deterministic emergency override** |

## File-by-File Findings

| File | Current behavior | Required action |
|---|---|---|
| `client/src/context/MockDataContext.tsx` | Holds the patient identity, profile, appointments, medicines, prescriptions, assessments, and doctor data in React state. It also supplies mock login and registration. | Keep it temporarily for doctor mock screens only. Replace patient consumers incrementally with typed tRPC queries and mutations. Remove hardcoded patient clinical seed records from the patient path. |
| `client/src/features/patient/Login.tsx` | Native form accepts the demo account through `MockDataContext`. | Replace with real credential validation and session establishment; retain the current LifeLink visual treatment. |
| `client/src/features/patient/Registration.tsx` | Performs local validation then creates an in-memory patient. | Connect to backend registration with duplicate-email validation, password hashing, patient record creation, and authentication. |
| `client/src/features/patient/Profile.tsx` | Persists name only in React state; phone is currently UI-only. | Use protected profile query/update procedures. Keep unsupported medical details empty rather than synthesizing them. |
| `client/src/features/patient/HealthPassport.tsx` | Reads and writes blood group, allergies, and conditions through the mock provider. | Read/write the real patient profile record with existing empty-state behavior. |
| `client/src/features/patient/Dashboard.tsx` | Derives all summaries from mock records and hardcodes the displayed appointment doctor. | Replace with database-backed patient summary queries; remove fixed doctor text and preserve empty states. |
| `client/src/features/patient/Appointments.tsx` | Uses patient-scoped mock records and mock-doctor lookup; cancellation is local only. | Create protected appointment records that reference a stable mock-doctor ID and support the existing status lifecycle. |
| `client/src/features/patient/MedicineCabinet.tsx` | Full medicine CRUD is React-state only. | Add protected medicine CRUD with the existing fields; low-stock remains a derived, not invented, UI state. |
| `client/src/features/patient/Prescriptions.tsx` | Read-only records come from a hardcoded mock list. | Add protected patient prescription retrieval. No prescription fixtures will be inserted as real patient data. |
| `client/src/features/patient/AIAssessment.tsx` | Preserves the existing emergency UI and 3D popup, but runs triage locally before writing an assessment. | Keep UI and popup; call a protected server-side assessment procedure, persist the normalized result, and pass specialty into discovery navigation. |
| `client/src/services/aiAssessmentService.ts` | Browser-local deterministic triage fallback with emergency phrases. | Move decision and emergency override to server. Retain an explicit non-diagnostic failure state; never expose an AI key. |
| `server/routers.ts` | Provides framework auth and protected assessment list/create procedures only. | Add compact feature routers for native patient auth, profile, dashboard, appointments, medicines, prescriptions, discovery, and events. |
| `server/db.ts` | Stores and retrieves users and assessments only. | Add patient-scoped repository helpers. Enforce ownership solely through server context, never caller-supplied patient IDs. |
| `drizzle/schema.ts` | Defines `users` and `patientAssessments`. | Add patient profile, medicine, appointment, prescription, prescription item, and event tables. Keep mock doctor data out of the patient-account schema for this phase. |
| `client/src/features/patient/SpecialistFinder.tsx` | Name/specialty filter over mock provider and a hardcoded future time. | Preserve screen intent but use a dedicated mock-doctor repository; add specialty, city, locality, and Mumbai line filters, map markers, selection, and an appointment request flow. |
| `client/src/components/Map.tsx` | Reusable Maps wrapper with an unrelated default center. | Use it with a Mumbai center and provider-sourced markers. No fabricated patient GPS or unsupported distance claims. |
| `client/src/features/doctor/*` | Existing doctor login, profile, dashboard, and availability are mock. | **Do not convert to real auth or persistence in this phase.** |
| Archived `backend/api/src/routes/assessment.ts` | Previous Gemini backend contract validates input, obtains a structured result, and overrides non-emergency model output for an explicit emergency pattern. | Reuse its safety architecture in the active tRPC server rather than reviving a separate server. Broaden only the deterministic emergency set already supported by the active fallback. |

## Requirement Status Matrix

| Master requirement | Current status | Minimal next change |
|---|---|---|
| Real patient registration and login | Mock | Native credential/session foundation |
| Patient profile and Health Passport | Mock | Protected patient-profile record and procedures |
| Database dashboard | Mock | Single patient summary query composed from owned records |
| Medicines | Mock CRUD | Protected medicine CRUD |
| Prescriptions | Mock read-only | Protected persistent retrieval, without fake records |
| Appointments | Mock | Real patient-owned records linked to mock-doctor IDs |
| Gemini backend + safety override | Missing from active server | Server-only structured assessment service, key request required |
| Assessment history | Partially real | Route all completed assessments through server assessment mutation |
| Realtime patient updates | Missing | Authenticated event channel with patient-scoped invalidation |
| Mumbai / Central / Harbour / Western discovery | Missing | Mock doctor repository, locality taxonomy, filters, and map markers |
| Map / doctor selection / appointment connection | Missing | Specialist finder extension using the existing Maps wrapper and appointment mutation |
| Doctor accounts | Mock | Preserve untouched |
| Light/dark themes, frosted glass, popups, routes | Existing | Preserve and validate throughout |

## Architecture Decisions for the Next Increment

The next implementation increment should add the patient-domain schema and tRPC contracts first. Patient-owned records will always derive ownership from the authenticated server context rather than from a client-provided patient ID. The mock doctor directory will move into a dedicated repository module so the discovery UI can later switch to a real doctor provider without a screen rewrite.

For AI, the archived Gemini route will be adapted into the existing server rather than run as a second backend. The integration requires a server-only Gemini credential. Until that credential is configured, the user interface must communicate service unavailability rather than silently represent a client-side result as Gemini output.

For realtime updates, the application needs an authenticated, patient-isolated event transport. A durable single-process deployment is the most appropriate option for a persistent WebSocket or Server-Sent Events channel; the project currently runs in the default autoscaling mode, so this production decision requires confirmation before enabling the realtime transport.

For doctor discovery, controlled mock doctor data is allowed by the handover. It will include only the required discovery fields and will be visibly identified as development data. The interface will not add ratings, reviews, credentials, outcomes, invented availability, or unsupported proximity claims. Exact distances will appear only when actual coordinates and a verified calculation are available; otherwise discovery will use the selected Mumbai locality and rail-corridor category.

## Verification Performed

| Check | Result |
|---|---|
| Active repository inspected | Completed |
| Attached handover read in full | Completed |
| Supplied archive extracted without running code | Completed |
| Archived Gemini safety route inspected | Completed |
| Active schema, tRPC router, DB helpers, mock provider, assessment UI, dashboard, discovery screen, authentication context, and map foundation inspected | Completed |
| External Maps wrapper constraints reviewed | Completed |
| Current route/data usage inventory performed | Completed |

## Phase 1 Output

The project is ready for a safe backend-foundation increment. The recommended build order is: patient schema and server ownership rules; native patient auth; profile/dashboard/history; appointments/medicines/prescriptions; server-side AI; realtime; then the Mumbai doctor-discovery map flow. This follows the master handover’s required patient-first architecture while retaining the doctor account system as mocked.

## Internal Sources

1. Attached LifeLink Master Project Handover Prompt: `/home/ubuntu/upload/pasted_content.txt`.
2. Active LifeLink source tree: `/home/ubuntu/lifelink`.
3. Supplied LifeLink archive source: `/home/ubuntu/lifelink-master-archive/LifeLink`.
