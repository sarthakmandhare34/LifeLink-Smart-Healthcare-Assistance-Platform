# LifeLink Master Handover — Phase 2 Architecture

**Status:** Design complete; no patient clinical data has been invented or inserted.  
**Scope:** Real patient platform foundation, mock doctor boundary, server-side AI restoration plan, authenticated realtime design, and Mumbai discovery interfaces.

## Design Principles

The active tRPC/Drizzle/MySQL server remains the single backend. The archived standalone assessment server will not be restored as a parallel process; its Gemini prompt contract and deterministic safety-overrides will be migrated into an active server-side service. Patient ownership always derives from the authenticated server context, never from a browser-supplied `patientId`.

The mocked doctor system stays out of patient-authentication and patient-record persistence. A dedicated mock-doctor repository will expose the same interface that a future database or API provider can implement, so the discovery screen does not need to be rewritten later.

## Patient Persistence Model

| Table                      | Purpose                                                                                                                                       | Ownership / security                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `users`                    | Existing framework identity record. Native patient accounts will use an internal, generated identity value without exposing it to the client. | Server-only lookup                                                         |
| `patientCredentials`       | Native account email and salted password hash. No plaintext passwords.                                                                        | Unique email; server-only hash comparison                                  |
| `patientProfiles`          | Existing Health Passport fields: blood group, allergies, conditions, optional phone, and timestamps.                                          | One profile per authenticated user                                         |
| `patientEmergencyContacts` | Existing emergency-contact structure from the UI.                                                                                             | Patient-scoped CRUD                                                        |
| `patientMedicines`         | Existing medicine fields and derived low-stock state.                                                                                         | Patient-scoped CRUD                                                        |
| `patientAppointments`      | Real patient appointment records linked to a stable mock-doctor ID, date/time, status, and timestamps.                                        | Patient-scoped read/request/cancel                                         |
| `patientPrescriptions`     | Patient-visible prescription header from a mock doctor.                                                                                       | Patient-scoped read-only in this phase                                     |
| `patientPrescriptionItems` | Medicine name, dosage, and instructions for a prescription.                                                                                   | Parent-record ownership enforced by server query                           |
| `patientAssessments`       | Existing normalized assessment result and history.                                                                                            | Already patient-scoped; extend through server analysis procedure           |
| `patientEvents`            | Small patient-scoped domain-event log for delivery and client invalidation.                                                                   | Events are created server-side and queried only for the authenticated user |

### Native Patient Authentication

The native patient form will register and log in against protected tRPC procedures. Registration validates input and stores only a salted password hash. Login verifies that hash server-side and uses the project’s existing signed session-cookie mechanism to establish the user context. This preserves the existing backend authentication plumbing while allowing the native patient forms to become real.

The current mock doctor login remains unchanged. It must not share patient credentials and must not be represented as production access.

## Server Contracts

| Router area        | Procedures                                                                                 | Notes                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `patientAuth`      | `register`, `login`, `logout`, `me`                                                        | Native patient identity; explicit duplicate and invalid-credential errors                                               |
| `patientProfile`   | `get`, `update`, `listEmergencyContacts`, `saveEmergencyContact`, `removeEmergencyContact` | Existing Profile and Passport fields only                                                                               |
| `patientDashboard` | `summary`                                                                                  | Composes profile, upcoming appointment, active medicines, latest assessment, and prescriptions without invented metrics |
| `medicine`         | `list`, `create`, `update`, `remove`                                                       | Existing Medicine Cabinet fields only                                                                                   |
| `appointment`      | `list`, `request`, `cancel`                                                                | Doctor identifier resolves through mock repository; patient ID always comes from context                                |
| `prescription`     | `list`, `get`                                                                              | Read-only patient retrieval during this phase                                                                           |
| `assessment`       | `analyze`, `list`                                                                          | Server-side Gemini call, deterministic safety override, persistence, and specialty result                               |
| `doctorDiscovery`  | `filters`, `search`, `getById`                                                             | Mock repository abstraction; Mumbai / rail-corridor query inputs                                                        |
| `patientEvents`    | `listSince`, `stream`                                                                      | Authenticated events only for the calling patient                                                                       |

## Realtime Delivery Options

The master handover requires authenticated, patient-isolated events rather than client polling. Two viable delivery approaches are below; activation requires an explicit hosting decision before implementing the persistent transport.

| Approach                              | How it behaves                                                                                                                                | Tradeoffs                                                                                          | Cost / setup                                                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistent authenticated event stream | A connected patient receives `PROFILE_UPDATED`, `APPOINTMENT_UPDATED`, `PRESCRIPTION_CREATED`, and `ASSESSMENT_COMPLETED` events immediately. | Meets the realtime requirement and avoids polling; requires a continuously running server process. | Uses the managed always-on hosting option. Usage is metered, with a full-utilization ceiling of about **$37.50/month** for 1 vCPU and 0.5 GB RAM before the included $10 monthly usage credit; actual use can be lower. |
| Request-time refresh only             | Views refresh when the patient revisits a page or explicitly refetches.                                                                       | Lower operational overhead, but it does **not** meet the handover’s realtime requirement.          | Works with the current default hosting mode.                                                                                                                                                                            |

The recommended route is the persistent authenticated event stream because the handover expressly requires event-driven patient updates. Its channel will never accept a caller-supplied patient ID; the server derives the subscriber and every event scope from the signed user session.

## Doctor Discovery Architecture

```text
Assessment specialty
        ↓
DoctorDiscoveryRepository
        ↓
MockMumbaiDoctorRepository
        ↓
city + locality + Central/Harbour/Western filter
        ↓
Map markers + selected doctor
        ↓
Real patient appointment request
```

The mock repository will return only: stable doctor ID, display name, specialty, clinic or hospital label, Mumbai locality, rail-corridor category, coordinate pair, and availability label. It will contain no reviews, ratings, efficacy claims, patient counts, or fabricated clinical credentials. It will be visibly designated as development mock data.

When a patient comes from an assessment result, the specialty query parameter will prefill the discovery filter. Without browser geolocation, the screen will ask the patient to select a Mumbai locality and line category; it will not claim exact distance. If real browser coordinates are later permitted, any distance will be calculated from real coordinates and labeled accordingly.

## Verification Plan

| Area                          | Verification                                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native patient authentication | Registration, duplicate email, invalid credentials, session persistence, logout, protected-route backend rejection                                    |
| Patient ownership             | Two test accounts cannot retrieve or mutate each other’s profile, medicine, appointment, prescription, or assessment data                             |
| Data domains                  | Empty states render when the database has no record; no client clinical fixtures are used for patient UI                                              |
| AI                            | Key remains server-only; malformed model output is rejected; deterministic red flags override lower model urgency                                     |
| Realtime                      | A signed patient connection receives only their own event type and causes only relevant query invalidation                                            |
| Discovery                     | Specialty, Mumbai, locality, Central/Harbour/Western filters affect both list and marker set; selection creates a real patient appointment request    |
| UI                            | Light and dark themes, emergency-red semantics, popup accessibility, reduced motion, desktop/tablet/mobile layouts, and existing routes remain intact |

## Implementation Order

The next increment will add schema and server repositories first, generate and review one migration, apply it, and then wire native patient authentication, profile, dashboard, and assessment history. Appointments, medicines, prescriptions, doctor discovery, and maps will follow as separately testable increments. Realtime transport is isolated behind the event log and will activate only after the required hosting decision.

## Internal Sources

1. Attached LifeLink Master Project Handover Prompt: `/home/ubuntu/upload/pasted_content.txt`.
2. Active LifeLink source: `/home/ubuntu/lifelink`.
3. Persistent hosting reference: `/home/ubuntu/skills/persistent-computing/references/reserved-hosting-reference.md`.
