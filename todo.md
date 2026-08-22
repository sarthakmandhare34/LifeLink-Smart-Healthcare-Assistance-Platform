# Liquid-Glass Redesign Checklist

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
- [ ] Add realtime invalidation or subscriptions for patient-facing record updates.
- [ ] Begin specialty and Mumbai Central, Harbour, and Western rail-corridor doctor discovery with a maps workflow and appointment links.
- [ ] Keep all doctor accounts, profiles, dashboards, and availability explicitly mocked for this phase.
- [ ] Add and run tests, build checks, browser validation, and phase-by-phase implementation reports.
- [ ] Save a checkpoint and deliver the completed master-specification phase.
