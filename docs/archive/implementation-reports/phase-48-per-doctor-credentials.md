# Phase 48 — Per-Doctor Synthetic Credentials

## Visual verification note

The separate synthetic doctor sign-in route presents email and password fields only. The controlled account-setup route presents a controlled directory selector, separate demo email, separate password, and owner-only provisioning code fields. Both routes state that no real clinician account is represented and do not display the provisioning value.

## Completed implementation

The prior single workstation access-code login has been replaced by per-doctor synthetic credentials. The existing `LIFELINK_DEMO_DOCTOR_ACCESS_CODE` stays server-only and is now an **owner provisioning code**, not a doctor sign-in password. It authorizes creation of one credential for one controlled directory doctor at a time. Each new account receives a separate email and password; only a salted password hash is stored.

The schema adds `syntheticDoctorCredentials`, with unique user, controlled doctor ID, and email fields. The non-destructive migration `database/0007_many_luminals.sql` was reviewed and applied. The same signed-session pattern remains in use, but the session’s synthetic open ID now resolves to any valid controlled directory doctor instead of one hard-coded workstation identity.

| Workflow             | Result                                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account provisioning | `/doctor/setup` lists controlled directory doctors and requires a unique email, unique password, and the owner provisioning code.                           |
| Doctor sign-in       | `/doctor/login` accepts that doctor’s email and password. The provisioning code is not accepted as a sign-in password.                                      |
| Workspace isolation  | Every workspace derives its doctor ID from the signed session. Appointment list, patient list, status updates, and SSE notifications are scoped to that ID. |
| Directory identity   | The controlled directory remains the only clinician source. The interface continues to disclose that each account is synthetic and not a real clinician.    |

## Safe administration

Create each controlled demo doctor account separately at `/doctor/setup`. Select the intended controlled doctor, choose an email and a password unique to that account, then enter the private owner provisioning code. Give the doctor only their separate email/password; do not share the provisioning code. A doctor with account A cannot use account B’s password and cannot access account B’s assigned appointments.

## Verification

Type checking passed. The complete Vitest suite passed: **26 test files and 63 tests**. The production build passed. Focused coverage verifies that provisioning requires the configured server-only code without returning it, that valid email/password credentials create a signed session for the matching doctor, and that different signed doctor identities request separate appointment channels. The doctor sign-in and account-setup pages were visually checked without entering a secret.
