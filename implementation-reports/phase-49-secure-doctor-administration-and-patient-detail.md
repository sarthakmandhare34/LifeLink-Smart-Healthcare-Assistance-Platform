# Phase 49 — Secure Doctor Administration and Patient Detail

## Visual verification note

The doctor password reset screen requires a demo doctor email, new password, and the owner provisioning code; it explicitly states that passwords are not displayed or recovered. The doctor setup screen offers an owner-controlled action to provision remaining controlled directory doctors, with one-time credentials displayed only after the owner supplies the private provisioning code.

## Implementation status

Password administration, appointment-scoped patient-detail authorization, and controlled bulk account provisioning are implemented. The owner confirmed that the bulk setup action created and privately saved the separate directory-aligned specialist credentials.

| Workflow | Implemented behavior |
|---|---|
| Public doctor sign-in | The live doctor route now presents only individual demo doctor email/password fields and a patient sign-in link. |
| Controlled provisioning | The owner-only setup route creates accounts for the controlled specialist directory and returns one-time credentials only to the owner who supplies the private provisioning code. |
| Password administration | A signed doctor can change only their own password; a reset requires the owner provisioning code. Passwords are stored as hashes and cannot be recovered or displayed. |
| Appointment context | A patient must enter a booking reason. Only the assigned doctor can read it alongside the assigned patient’s most recent submitted assessment summaries. |
| Patient detail | The assigned doctor can review the limited Health Passport summary and medicines, but not email, phone, emergency contacts, or unrelated patient records. |
| Prescription creation | The assigned doctor can create an unsigned demo prescription only after confirming that patient’s appointment. The patient receives the existing prescription update event. |

The complete regression suite passed: **27 test files and 69 tests**. Type checking and the production build passed. The live doctor login page was also verified after deployment and contains only the expected individual credential form.

## Deployment verification note

Immediately after the `887da19f` checkpoint, the public `/doctor/setup` route still rendered the previous single-account page rather than the current bulk-provisioning interface. The local preview has the updated implementation. Bulk provisioning must wait until the public deployment reflects the current checkpoint, so the owner is not directed to the wrong setup flow.

The current preview route correctly renders **Create all remaining doctor logins** and can be used for the owner-controlled provisioning action while the public deployment refreshes.
