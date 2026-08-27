# Phase 46 — Connected Patient and Doctor Platform Reconciliation

## Audit outcome

LifeLink already has one Vite frontend, one Express/tRPC backend, one Drizzle/MySQL database boundary, and one patient-scoped SSE transport. Native and Google patient authentication, profile, assessment, medicine, appointment, prescription, and patient event records are database-backed. The controlled Mumbai directory is the single authoritative synthetic-doctor catalog and is shared by Specialist Finder, Maps, and patient appointments.

| Requirement area                               | Current implementation                                                                                                                                  | Reconciliation status         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Patient operational workflows                  | Protected tRPC procedures with patient-owned Drizzle records and patient-scoped SSE invalidation                                                        | Implemented                   |
| Gemini assessment safety                       | Server-only Gemini flow with deterministic emergency override and persisted assessment event                                                            | Implemented                   |
| Mumbai discovery                               | Controlled, synthetic Mumbai directory with Central, Harbour, and Western line metadata                                                                 | Implemented as mock directory |
| Synthetic doctor source                        | One controlled directory, but no stable doctor session or database identity                                                                             | Partial                       |
| Doctor workstation pages                       | Routes and visual shell exist, but dashboard, patients, appointments, assessments, consultation, and prescriptions contain static demonstration content | Mock only                     |
| Shared appointment workflow                    | Patient creates a real appointment, but doctor cannot securely view or update it                                                                        | Partial                       |
| Cross-portal realtime                          | Existing SSE streams protected patient event notifications only                                                                                         | Patient-only                  |
| Doctor authorization                           | No server-side doctor guard or relationship check exists                                                                                                | Missing                       |
| Consultations and doctor-created prescriptions | No shared persistence or authorization flow exists                                                                                                      | Missing                       |

## Selected first implementation increment

The first safe increment is a **synthetic doctor session, server-authorized shared appointment workspace, and reused SSE event delivery**. It will retain the controlled directory rather than create a second doctor dataset; derive the clinician identity from a signed server session; expose only appointments assigned to that synthetic doctor; allow only that doctor to accept or reject its assigned appointments; and notify the affected patient through the existing patient event mechanism.

This increment deliberately does not fabricate patients, assessments, prescriptions, consultations, medical histories, or doctor credentials. Doctor-created prescriptions, consultation persistence, and authorized patient-record access remain subsequent increments after the shared appointment relationship and doctor identity are verified.
