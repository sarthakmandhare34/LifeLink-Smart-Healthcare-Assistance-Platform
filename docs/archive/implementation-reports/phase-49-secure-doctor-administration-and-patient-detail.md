# Phase 49 — Secure Clinician Administration and Patient Detail

## Visual verification note

The clinician password reset screen requires a clinician email, new password, and the owner provisioning code; it explicitly states that passwords are not displayed or recovered. The clinician setup screen offers an owner-controlled action to provision remaining controlled-directory accounts, with one-time credentials displayed only after the owner supplies the private provisioning code.

## Implementation status

Password administration, appointment-scoped patient-detail authorization, and controlled bulk account provisioning are implemented. A later database audit found **zero persisted clinician credentials**, so the historical assertion that credentials had been created was incorrect. The current owner-only recovery screen can create missing accounts, list provisioned emails after owner-code validation, and generate a replacement one-time password without exposing stored hashes.

| Workflow                 | Implemented behavior                                                                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public clinician sign-in | The live clinician route presents only individual clinician email/password fields and a patient sign-in link.                                                                                  |
| Controlled provisioning  | The owner-only setup route creates accounts for the controlled specialist directory and returns one-time credentials only to the owner who supplies the private provisioning code.             |
| Password administration  | A signed clinician can change only their own password; a reset requires the owner provisioning code. Passwords are stored as hashes and cannot be recovered or displayed.                      |
| Appointment context      | A patient must enter a booking reason. Only the assigned clinician can read it alongside the assigned patient’s most recent submitted assessment summaries.                                    |
| Patient detail           | The assigned clinician can review the limited Health Passport summary and medicines, but not email, phone, emergency contacts, or unrelated patient records.                                   |
| Prescription creation    | The assigned clinician can create an unsigned controlled-workspace prescription only after confirming that patient’s appointment. The patient receives the existing prescription update event. |

Focused clinician and directory coverage, the full regression suite, type checking, and the production build passed. The live clinician login page contains only the expected individual credential form.

## Deployment verification note

The current `/doctor/setup` route provides **Create all clinician logins** and **View provisioned emails**. Account creation and credential copying remain an owner-controlled action; credentials, passwords, and provisioning codes are never placed in documentation or chat.
