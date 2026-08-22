# Liquid-Glass Redesign Checklist

## Native Sign-In Clarity

- [x] Make the existing patient login action explicitly read “Sign in” on the requested LifeLink page, without adding external providers or unrelated UI.
- [x] Validate the revised native sign-in page at desktop and mobile sizes.

## Dark Theme, Motion, and Gemini Configuration

- [x] Audit and correct inconsistent dark-theme tokens across patient and clinician surfaces.
- [x] Add restrained slide-in interface motion while respecting reduced-motion preferences.
- [x] Replace misleading or fake loading treatments with only real pending-state feedback.
- [x] Securely configure and validate the supplied Gemini credential server-side without exposing it to the client.
- [x] Add the server-only Gemini environment key to the backend configuration and use it only from the assessment service.
- [x] Verify the existing protected AI Assessment frontend mutation reaches the configured backend without a direct browser key or provider request.
- [x] Verify dark and light themes at desktop and mobile breakpoints.
- [x] Validate the protected AI Assessment submission through a user-approved no-data native account after the Gemini backend change.
- [x] Create the user-approved temporary native patient account for the no-data Gemini assessment validation.
- [x] Submit one non-clinical assessment through the protected frontend API and confirm a persisted backend response.
- [x] Remove the temporary account and its test assessment after validation.
- [x] Review a clinician route in dark mode at the mobile breakpoint to confirm shared tokens and contrast remain consistent.

- [x] Inspect the supplied LifeLink archive and identify its pages, shared layout, components, and assets.
- [x] Define a reusable liquid-glass token system that fits the existing content and behavior.
- [x] Apply the liquid-glass visual treatment across each relevant page and shared component.
- [x] Strengthen the shared brand mark and liquid-glass material rules after visual review.
- [x] Build the project and correct implementation or asset-loading issues.
- [x] Validate representative pages on desktop and mobile in the browser.
- [x] Save a delivery checkpoint and report the completed redesign.

## Assessment Submission Fix

- [x] Inspect the failing AI assessment service endpoint and the page-level error path.
- [x] Replace the unreachable request with a reliable, safety-conscious client-side fallback.
- [x] Build and submit an assessment in the browser to confirm a visible result is returned.
- [x] Save a checkpoint and report the fix.

## Persistent Data and Logo Integration

- [x] Upgrade the project to support database-backed persistent data.
- [x] Inspect the upgraded full-stack structure and model the patient data to persist.
- [x] Implement database storage and retrieval for the patient assessment workflow.
- [x] Confirm the secure account flow can display database-backed assessment history without inserting test health records. *(Superseded by the approved native login-only scope; no external account route is exposed from the application.)*
- [x] Prepare and upload the supplied LifeLink logo as a deployment-safe static asset.
- [x] Apply the supplied logo to the primary patient and clinician branding locations.
- [x] Build and validate persistence plus visual logo rendering in the browser.
- [x] Save a checkpoint and report the completed enhancement.

## Refined Logo Integration

- [x] Upload the newly supplied blue–aqua LifeLink logo as a managed static asset.
- [x] Replace the existing logo references with the new artwork across patient and clinician brand surfaces.
- [x] Blend the logo’s white artwork field into the liquid-glass background using an integrated presentation treatment.
- [x] Build and visually validate the refined logo on patient and clinician pages.
- [x] Save a checkpoint and report the refined branding update.

## Login Branding Simplification

- [x] Inspect the LifeLink login components and current secure sign-in handoff.
- [x] Remove controllable Facebook, Microsoft, and Manus-branded sign-in affordances from the LifeLink UI.
- [x] Preserve a clearly labeled LifeLink account experience without exposing third-party brand names in the app.
- [x] Build and validate the revised patient and clinician login pages.
- [x] Save a checkpoint and report the login-branding update. *(Consolidated into the native login-only delivery checkpoint.)*

## Native Login-Only Flow

- [x] Remove all native-page triggers that open the extended external authorization flow.
- [x] Keep patient and clinician authentication actions inside their respective LifeLink login pages.
- [x] Verify no third-party or Manus-branded sign-in route is reachable from the native login UI.
- [x] Build and visually validate the streamlined native login pages.
- [x] Save a checkpoint and report the login-only update.

## LifeLink Master Specification Reconciliation

- [x] Inspect the attached master handover content and supplied repository archive without replacing the active project.
- [x] Produce a specification-to-code reconciliation covering patient, doctor, AI, realtime, discovery, and map requirements.
- [x] Define database tables and secure patient ownership rules for profiles, appointments, medicines, prescriptions, assessments, and realtime events.
- [x] Replace patient-side in-memory data operations with database-backed tRPC flows while preserving the approved interface.
- [x] Persist patient registration, profile, dashboard summaries, appointments, medicines, prescriptions, and assessment history.
- [x] Route specialist appointment requests through the protected appointment procedure and invalidate patient data after success.
- [x] Remove the remaining patient assessment in-memory dependency and make the protected assessment result the sole patient history source.
- [x] Add visible mutation-error recovery states for medicine and appointment actions.
- [x] Persist native patient registration, profile, dashboard summary, and assessment history foundation without creating patient seed data.
- [x] Preserve the real AI assessment backend and emergency safety override without exposing credentials.
- [x] Add realtime invalidation or subscriptions for patient-facing record updates.
- [x] Add an authenticated patient SSE endpoint backed by the persisted patient event log and a process-local event bus.
- [x] Mount a single patient-side EventSource that invalidates only the current patient’s affected query caches.
- [x] Add realtime ownership and reconnect-contract regression tests without inserting patient records.
- [x] Begin specialty and Mumbai Central, Harbour, and Western rail-corridor doctor discovery with a maps workflow and appointment links.
- [x] Add protected directory filter and facet contracts sourced only from the controlled Mumbai mock directory.
- [x] Add assessment-specialty URL handoff, Mumbai locality and rail-corridor filters, and selection-synchronised map markers without GPS or fabricated distances.
- [x] Validate the filtered discovery layout at desktop and mobile breakpoints; map-proxy local-renderer fallback remains explicit and non-misleading.
- [x] Validate the authenticated specialty filter, a non-persisting appointment input error, and the realtime connection through the user-approved disposable native patient session without entering real health data.
- [x] Create the user-approved temporary native patient account and use no clinical fields or records during protected-flow validation.
- [x] Remove the temporary validation account after the agreed no-data checks without risking user records.
- [x] Keep all doctor accounts, profiles, dashboards, and availability explicitly mocked for this phase.
- [x] Add and run tests, build checks, browser validation, and phase-by-phase implementation reports.
- [x] Save a checkpoint and deliver the completed master-specification phase.
