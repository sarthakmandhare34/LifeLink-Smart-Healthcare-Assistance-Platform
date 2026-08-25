# Liquid-Glass Redesign Checklist

## Native Sign-In Clarity

- [x] Make the existing patient login action explicitly read “Sign in” on the requested LifeLink page, without adding external providers or unrelated UI.
- [x] Validate the revised native sign-in page at desktop and mobile sizes.
- [x] Inspect the current auth architecture and provider requirements for Google and Apple sign-in alongside native LifeLink accounts.
- [x] Add prepared Google and Apple sign-in controls without removing native email/password registration and login.
- [x] Configure required provider credentials and callback settings without exposing secrets to the browser.
- [x] Verify successful provider callback, provider-account creation, and native-login regression paths; preserve the existing safe conflict policy for native accounts. *(Owner confirmed the first-try provider callback/dashboard flow; provider-identity and native sign-in regression coverage were previously completed.)*
- [x] Remove Apple provider controls, routes, configuration fields, and activation requirements from the Google-only scope.
- [x] Add the prepared Google OAuth entry point to both native login and registration pages without removing email/password flows.
- [x] Update provider documentation and tests for the streamlined Google-only activation path.
- [x] Register the configured LifeLink Google callback URL in the Google Cloud OAuth client to resolve the verified redirect mismatch.
- [x] Complete one real Google consent/callback validation after the corrected redirect URI is saved. *(Owner confirmed Google sign-in works.)*
- [x] Resolve the reported public Google callback 404 by aligning `AUTH_PUBLIC_BASE_URL` with a deployment that serves the current LifeLink backend route.
- [x] Resolve the new Railway 404 at the configured `lifelink-rqrpkqmn.manus.space` callback domain before resuming Google consent.
- [x] Observe one complete public Google sign-in through consent returning to `/patient/dashboard`. *(Owner explicitly confirmed the protected patient dashboard opened.)*
- [x] Verify the authenticated public Google session through `auth.me` or equivalent protected state after callback completion. *(Owner-confirmed protected dashboard route is the non-sensitive equivalent state; no personal data was inspected.)*
- [x] Diagnose and fix the reported first-attempt Google sign-in failure so the initial authorization flow is reliable. *(Permanent-origin start URL repair is deployed; owner explicitly confirmed first-try success.)*
- [x] Observe one full first-attempt Google sign-in after the permanent-origin start-url fix returning to `/patient/dashboard` without a second try. *(Owner explicitly confirmed first-try dashboard success.)*
- [x] Verify the protected public session after that first-attempt callback without exposing personal data. *(Owner-confirmed protected dashboard route; no personal data was inspected.)*
- [x] Reattach the permanent LifeLink domain to the latest deployment; it currently serves outdated provider metadata without the new Google registration start URL.
- [x] Restore public access to the permanent LifeLink domain; it currently shows a platform permission screen instead of the application on `/login` and `/patient/specialists`.
- [x] Require explicit registration for a new Google account, while allowing Google sign-in only for an existing registered LifeLink account.
- [x] Confirm the verified provider flow created a new Google provider identity rather than triggering a native-account conflict; secure signed-in linking is not required for this completed path.
- [x] Publish the current Google-only LifeLink implementation to the permanent `lifelink-rqrpkqmn.manus.space` domain before completing live OAuth verification.
- [x] Change the permanent LifeLink deployment from reserved access to public access so Google can reach the callback without a platform sign-in wall.
- [x] Prepare inactive-safe Google and Apple authorization routes with CSRF state validation and no provider secret embedded in client code.
- [x] Add provider identity storage and email-confirmed linking rules that preserve existing native patient records.
- [x] Show Google and Apple sign-in controls with an honest unavailable state until provider credentials and a public callback domain are configured.
- [x] Document exact owner credential, Apple configuration, and callback-domain activation steps.
- [x] Refine public patient login and registration light/dark themes for consistent contrast, glass surfaces, and provider-control readability.
- [x] Verify successful native registration and existing-account sign-in both redirect patients to the protected LifeLink dashboard.
- [x] Complete a no-health-data disposable native registration and confirm the authenticated dashboard route.
- [x] Complete a no-health-data sign-in using that existing disposable native account and confirm the authenticated dashboard route.
- [x] Add the LifeLink logo to the upper-left patient sidebar with responsive light/dark presentation.
- [x] Replace the sidebar brand tile with a clean LifeLink mark and name only, without the supplied artwork slogan.
- [x] Verify the user-applied white background adjustment on the reusable LifeLink logo component and publish it if visually consistent.
- [x] Re-verify the white-background reusable LifeLink logo on every surface that uses it and document the affected views.
- [x] Visually verify the reusable LifeLink logo in the doctor shell/sidebar and add that route to the logo verification report.
- [x] Save a dedicated checkpoint for the verified reusable LifeLink logo white-background adjustment.
- [x] Increase dark-mode contrast and separation for the reusable LifeLink logo without changing its light-mode presentation.
- [x] Replace every temporary emoji-style or synthetic LifeLink brand mark with the newly supplied official logo artwork across public, patient, clinician, and map-related surfaces.
- [x] Fix the public delivery route for the new official LifeLink logo asset; the permanent domain currently renders its image as broken despite the current deployment.
- [x] Enlarge and reframe the official full LifeLink lockup so the icon, name, and tagline are clearly legible on every full-wordmark surface.
- [x] Confirm that compact sidebar/profile marks intentionally use the official symbol crop without a tagline, matching the owner's prior “mark + name only” sidebar requirement; all full-wordmark surfaces show icon, name, and tagline.

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
- [x] Repair the outdated server-side Gemini generation endpoint/schema contract, retain the deterministic emergency override, and fall back safely when the configured provider is temporarily unavailable.

## Project Boundaries and Layout Architecture

- [x] Inventory current frontend, backend, database, shared, build, and test files against the requested frontend/backend/database boundary structure.
- [x] Create a safe target structure and update all build, import, API, environment, database, and test paths before moving implementation files.
- [x] Move frontend-owned source, backend-owned source, and database schema/migration source into logical project boundaries without breaking runtime behavior.
- [x] Refine the responsive patient shell, login, registration, dashboard, and assessment layout to the supplied page architecture while preserving real backend flows.
- [x] Run type checking, tests, production build, and responsive route verification after reorganization.
- [x] Document the final structure, changed path contracts, layout reconciliation, and verification results.
- [x] Align the existing native patient login and registration information hierarchy to the supplied entry-page architecture without changing their real tRPC flows.
- [x] Align the AI Assessment workflow heading, form hierarchy, and result context to the supplied dedicated workflow architecture without changing its protected Gemini mutation.
- [x] Re-verify the completed Phase 09 report after the final entry/workflow layout checks.

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
- [x] Update the Mumbai discovery and maps area with the user-supplied Western, Central, and Harbour railway station corridors, branches, and shared-station associations.
- [x] Remove the long visible Mumbai station-reference guide and locality filter; reword railway prompts around where the patient lives, retain requested visit date/time, and refine the controlled-directory live-map presentation.
- [x] Expand the clearly labeled controlled Mumbai development directory across more specialty categories and areas, and add an optional browser-only location permission flow that sorts and centers controlled map entries without storing precise location or claiming real doctors/availability.
- [x] Redo and independently re-verify the controlled specialty and browser-only location update before assigning its rebuilt version to the permanent domain.
- [x] Restrict the Specialist Finder free-text search to specialty names only and update its placeholder and guidance.
- [x] Diagnose and fix the reported interactive Mumbai map loading failure while preserving controlled-directory and browser-location privacy safeguards. *(Owner confirmed the interactive map renders after the managed-proxy loader repair.)*
- [x] Restore the permanent LifeLink domain’s HTTPS availability; it currently returns an SSL protocol error that blocks public map and OAuth verification.
- [x] Ensure each supported station has two explicitly labeled mock development-directory entries and each rail corridor has at least three specialty categories, without claiming real clinicians or availability.
- [x] Reconcile the uploaded LifeLink feature inventory against the implemented product and provide a security-safe inventory of configured integration purposes.
- [x] Make the local LifeLink checkout runnable with standard npm install, npm run dev, npm test, and npm run build commands, without changing application behavior.
- [x] Remove the Specialist Finder section beneath the map and reduce the controlled mock doctor directory to an orderly specialty-balanced set across Central, Harbour, and Western corridors.
- [x] Repair the pnpm frozen-lockfile override mismatch that blocks deployment while retaining validated npm local development commands.
- [x] Remove the remaining visible controlled-map guidance copy while retaining interactive marker selection and browser-location privacy behavior.
- [x] Audit the current frontend, backend, database, and shared folder structure against the uploaded LifeLink checklist and report implemented, mock-only, and pending areas.
- [x] Consolidate the duplicate legacy frontend context modules into one active context folder without changing application behavior.
- [x] Recluster the controlled mock specialty directory around connected Mumbai interchange stations while retaining Central, Harbour, and Western coverage.
- [x] Add safe user-initiated SOS actions that prepare an emergency-contact message and open an ambulance-call confirmation without automatic calling or messaging.
- [x] Require an explicit in-app confirmation before opening either an emergency-contact SMS composer or an ambulance-call dialer.
- [x] Add refined, reduced-motion-safe interface animations across LifeLink’s shared surfaces and key interactions.
- [x] Slow and soften the shared LifeLink animation timings and stagger cadence while retaining responsive interaction feedback.
- [x] Refine shared LifeLink layouts, navigation, controls, and dialogs for seamless mobile, tablet, laptop, and desktop use.
- [x] Rewrite the README with accurate LifeLink architecture, setup, safety, and workflow guidance, then remove only verified-unused repository files.
- [x] Refine the patient dashboard with stable branding, visible mobile navigation labels, clearer section separation, responsive card orientation, and polished typography.
- [x] Add a validated emergency-contact phone number field to the Health Passport and use it only in the user-confirmed SOS message draft flow.
- [x] Replace the outdated GitHub Figma/Manus repository description with a concise accurate LifeLink project summary.
- [x] Fix the mobile navigation drawer so its width, logo placement, and full menu labels remain visible without clipping or excessive blank space.
- [x] Audit the restored repository and move only genuinely misplaced files into the appropriate frontend, backend, database, or shared boundary.
- [x] Update affected imports, configuration, scripts, and documentation so the organized structure remains fully functional.
- [x] Verify the reorganized project with type checking, tests, production build, and a concise structure report.
- [x] Remove Mumbai specialist discovery from the GitHub repository description while retaining a concise accurate LifeLink summary.
- [x] Audit the current frontend, backend, database, and shared folder structure against the uploaded LifeLink checklist and report implemented, mock-only, and pending areas.
- [x] Refine the patient dashboard Quick Actions card with aligned action rows, clear visual hierarchy, and responsive glass-surface spacing matching the supplied reference.
- [x] Add a secure optional circular patient profile-photo control with validated upload, patient-only persistence, and a graceful initial-based fallback.
- [x] Add regression coverage and validate the refined dashboard on mobile and desktop before publishing.
- [x] Integrate the requested Oxanium font across the LifeLink interface and tune heading/body weights for readable responsive healthcare workflows.
- [x] Add a five-minute authenticated-session inactivity timeout that clears the existing LifeLink session and returns the patient to login.
- [x] Add lifecycle regression coverage for activity reset, timeout cleanup, and secure logout behavior.
- [x] Add a restrained blurred official LifeLink logo background layer that preserves readable foreground content in light and dark modes.
- [x] Validate the blurred-logo background on responsive login and patient dashboard views before publishing.
- [x] Add focused Specialist Finder filtering and sorting controls that preserve the controlled-directory scope.
- [x] Improve Specialist Finder loading and data-failure states with friendly recovery guidance.
- [x] Add regression coverage and validate the Specialist Finder enhancement before publishing.

- [x] Redesign the complete Specialist Finder filter, sort, empty, and retry interface to match the LifeLink glass visual system.
- [x] Validate the redesigned Specialist Finder at desktop and mobile breakpoints, including the controlled-directory and error-recovery states.

- [x] Remove the oversized Specialist Finder Refine results / Sort / Clear filters toolbar while retaining the essential directory filters.
- [x] Validate the streamlined Specialist Finder on desktop and mobile before publishing.
