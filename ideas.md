# LifeLink — Reference Design Specification

## Chosen Approach: Figma Reference as Ground Truth

This implementation is a direct reproduction of the supplied Figma frame rather than an interpretation. The website presents a single centered translucent **200 × 100 px** rectangle with a **26 px** radius, a narrow **117° white-to-gray-to-white gradient border**, a diffuse indigo outer shadow, and a soft inset highlight. There is no text, image, logo, or secondary interface in the provided source.

| Design property | Ground-truth rule |
|---|---|
| Composition | An uncluttered transparent canvas with one isolated rectangular glass element. |
| Geometry | Fixed 200 × 100 px component, 26 px corner radius, centered without distortion. |
| Surface | `rgba(255, 255, 255, 0.10)` with a 6 px backdrop blur. |
| Border | 1 px transparent border carrying a 117° linear gradient from 80% white through 20% gray to 80% white. |
| Depth | Diffuse `rgba(31, 38, 135, 0.13)` indigo shadow and a low-contrast white inset glow. |
| Responsiveness | The component retains its measured geometry on all viewports and remains visibly centered with safe viewport padding. |
| Interaction | The supplied component has no interactive affordance; no artificial behavior will be added. |

## Style Decisions

- Preserve the original Figma color, opacity, corner radius, shadow values, and blur value exactly.
- Do not introduce generated imagery, decorative copy, navigation, or additional visual motifs that would diverge from the reference frame.
- Use a responsive flex container only to place the unmodified component within the browser viewport.

## Validation Notes

The supplied `frame.webp` preview presents a single transparent graphic whose outer indigo shadow is composited against a checkerboard transparency viewer. The browser canvas is white by default, so shadow intensity must be evaluated from its original alpha values rather than the preview checkerboard alone.

The reference frame is exported at twice the CSS scale of the supplied `code.jsx`: its visible panel measures approximately 400 × 200 image pixels while the source specifies a 200 × 100 CSS-pixel component. The implementation keeps the source-authoritative CSS dimensions, radius, blur, border, and shadows exactly, so it produces the intended layout at normal browser scale rather than mistakenly doubling all design values.

The visual browser comparison confirms a centered translucent white panel with the expected rounded outline, inset haze, and lower indigo shadow. The project contains no source image assets, and no external image URL is referenced by the implemented page.

The final browser and narrow 375 × 812 viewport checks show no surrounding UI, overflow, or missing content. The panel remains horizontally and vertically centered and retains its original measured 200 × 100 CSS-pixel geometry.

## Liquid-Glass Expansion

The original Figma rectangle is now the material reference for the supplied LifeLink application. The patient and clinician portals share **pearl-tinted translucent panels**, **117° spectral borders**, **soft indigo ambient shadows**, and **frosted navigation chrome** over a calm blue–aqua atmospheric background. Urgent medical states retain their red and amber semantic cues, while controls use the same glass depth without compromising text contrast or keyboard focus visibility.

The login route has been checked in the browser and displays the liquid-glass background, form card, text fields, and primary action correctly. Authenticated workspace validation will use the supplied demo account rather than introduce any fabricated user state.

The patient dashboard has been opened with the supplied demo account. Its sidebar, sticky header, primary bento cards, health-overview cards, alert band, and action controls all inherit the shared liquid-glass surfaces while retaining the original content hierarchy.

Direct browser navigation resets this frontend-only mock session, so authenticated page traversal is validated through the visible in-app navigation after the demo sign-in flow rather than by a full URL reload.

The AI assessment page has been inspected through in-app navigation. Its custom age, text, select, textarea, disclaimer, panel, and analysis action remain readable and receive the shared liquid-glass control treatment without changing the medical content or its safety disclaimer.

## Style Decisions

- The **LifeLink pulse-link mark** replaces generic plus glyphs at portal entry points, in sidebars, and in compact account contexts.
- The strongest spectral blue–aqua gradient is reserved for the mark, primary actions, and selected navigation; secondary actions remain pearlescent glass.
- Every primary surface follows the same material formula: pearl fill, 117° spectral edge, indigo ambient depth, and a restrained inset glint.

## Final Validation Notes

The refined doctor dashboard and patient login have been rechecked in the browser. The pulse-link mark is visible in clinician navigation, account contexts, and the patient entry point. A 375 × 812 clinician screenshot confirms that the compact navigation remains horizontally accessible, content cards stack without clipping, and the liquid-glass contrast remains legible.

## Assessment Reliability Decision

The previous assessment service called `localhost:3001`, which is unreachable from the deployed browser and caused a fetch failure. The service now uses a transparent, in-browser decision-support fallback that returns the existing result shape without external network access. It does not diagnose conditions; possible red-flag wording is directed to emergency guidance, and other responses explicitly retain the clinician-review disclaimer.

Browser validation uses the project’s supplied demo patient account in a fresh session; no real personal or health data is introduced for testing.

The assessment form has been reopened through in-app navigation in the authenticated demo session, with all required inputs available for the repaired submission check.

The browser test uses a non-sensitive demonstration entry solely to verify the application flow; it is not clinical advice, a diagnosis, or a representation of a real person’s health information.

The completed browser submission returned a visible LOW-urgency decision-support result and opened the existing assessment-result presentation without a fetch failure. The result retains explicit non-diagnostic language and guidance to seek clinician review if symptoms persist or worsen.

The final browser view confirms the result dialog, urgency badge, reasoning, disclaimer-aligned guidance, and follow-up actions remain visible after submission. The browser console contains no new output from the repaired flow.

## Persistent Data and Supplied Branding

LifeLink now stores signed-in users’ assessment records through protected database procedures. Demo-mode data remains visibly identified as session-only so simulated data is not mistaken for persistent private records. The user-supplied LifeLink artwork is stored as a managed project asset and used at the patient and clinician entry points and portal headers, while the existing compact pulse-link mark remains for small account contexts.

Browser inspection confirms the managed logo asset is referenced from the patient entry point through `/manus-storage/lifelink-logo_58814cff.jpg`; the supplied visual identity is therefore served by the project’s deployment-safe asset path rather than a local browser file.

The production build and test suite pass after the full-stack upgrade. The database verification query confirms both the `users` and `patientAssessments` tables exist. Browser checks confirm the supplied logo is visible at the patient entry point and clinician sidebar, and no browser-console errors were recorded on the clinician dashboard.

The secure sign-in action successfully routes from the patient entry point to the configured OAuth authorization endpoint. No assessment or other health record was submitted during validation, so the project database contains no agent-created test health data.

The authorization endpoint requires an authenticated account session before private assessment history can be viewed. The project-side routing and database tables have been validated; completing that account-specific view requires the account holder to sign in.

The secure authorization page has been reopened for the final account-scoped verification. No health data has been submitted by the agent while awaiting account authentication.

## Native Login-Only Decision

The patient and clinician experiences now keep people inside their dedicated LifeLink login pages. The UI no longer provides a button or text path to the external authorization screen, so Facebook, Microsoft, and Manus-branded options from that provider are not surfaced from within the LifeLink application.

## Master Handover Reconciliation — Initial Findings

The attached master handover confirms that **patient data must become real and database-backed**, while doctor accounts, dashboards, and availability remain explicitly mocked for this phase. It requires a patient journey from assessment to specialty, Mumbai geographic discovery, Central/Harbour/Western line filtering, map-based doctor selection, real appointment records, and authenticated realtime updates. It also forbids invented medical information, distances, reviews, ratings, or credentials.

The active project already has the approved liquid-glass LifeLink interface, routes, mock doctor views, a tRPC/Drizzle/MySQL foundation, and database-backed assessment storage. However, the active `MockDataContext` remains the in-memory source of truth for patient registration, login, profile, appointments, medicines, prescriptions, dashboard data, and doctor discovery. Only patient assessments currently have protected database procedures.

The supplied archive contains an earlier standalone Gemini assessment route. It validates input, calls Gemini server-side using `GEMINI_API_KEY`, validates the structured output, and applies a deterministic emergency override. The active project instead uses a browser-local decision-support fallback. This is the principal AI discrepancy to resolve without weakening emergency safeguards or exposing credentials.

The active specialist finder currently filters a small mock list by name or specialty and creates a mock appointment. It has no repository abstraction, Mumbai locality structure, Central/Harbour/Western line logic, marker layer, or map integration. The active project does include a generic proxy-backed `MapView` component, but it defaults to San Francisco and has no LifeLink doctor-discovery wiring.

## Database Migration Note

The initial patient-domain migration created all new tables successfully, but the final foreign-key statement failed because MySQL rejected the generated identifier as too long. The schema and migration now use the short explicit constraint name `rx_item_prescription_fk`; the remaining operation is a non-destructive foreign-key addition to the already-created prescription-item table.

## Phase 3 Entry-Flow Validation

The native registration and login pages have been checked in the browser after replacing their mock actions. Both retain the approved LifeLink liquid-glass presentation and only expose the patient account fields and native LifeLink actions. The registration screen contains no prefilled clinical data, and the login screen no longer displays a demo credential cue.

## Phase 3 Patient Foundation

Native patient registration and login now use a server-side salted-password credential record and the existing signed-session cookie infrastructure. Profile, Health Passport, dashboard summary, and assessment history use protected server procedures that derive ownership from the session. No patient, medicine, appointment, prescription, or assessment test record was inserted during the implementation or browser checks.

## Phase 4 Patient Records

Patient medicines, appointment requests/cancellations, and prescription history now call protected database procedures. The appointment and prescription presentation obtains doctor display data from a clearly labeled development-only mock directory; the doctor-account system itself remains untouched. Empty records remain empty, and no fixture medicine, prescription, appointment, rating, review, or patient clinical record was added to the database.

The specialist finder now creates a real patient-owned appointment request only after the patient selects a requested date and time. The application neither creates a prefilled appointment nor represents a mock directory entry as verified clinical availability.

The revised patient and clinician login pages have been inspected in the browser. Each page now shows only the supplied LifeLink branding, native account fields, and its local form action; neither entry point exposes an external authorization control or third-party brand name.

The pending external-account check was explicitly superseded by the native login-only direction. The database model remains in place, but the native screens no longer route users to a provider-hosted sign-in surface.

## Refined Supplied Logo Integration

The updated blue–aqua artwork now replaces the prior logo throughout the shared brand component. Its pale image field uses a restrained multiply blend with the existing blue–aqua liquid-glass atmosphere, allowing the background texture and color to continue through the mark without adding a separate framed image panel.

The blend treatment was refined to a feathered edge mask after visual inspection: it keeps the blue–aqua LifeLink mark and wordmark fully legible while softening the artwork’s pale border into the application background.

The presentation now uses a logo-focused crop of the supplied artwork rather than displaying the full background canvas. The cropped mark and wordmark retain a soft horizontal fade at their edges, which preserves the supplied branding while eliminating the separate-rectangle impression.

The revised logo treatment has been visually checked on both the patient login and clinician dashboard. The patient entry point presents the full supplied mark and wordmark without the original image canvas, while the clinician sidebar retains a compact, legible version against its glass surface.

The final 1280 × 720 visual pass confirms the new mark holds its contrast and hierarchy against the blue–aqua atmosphere in both contexts. The patient logo now transitions naturally into the glass card, while the clinician variant is compact enough for sidebar navigation.

## Phase 05 — Server-Side Assessment Decision

The prior browser-local symptom fallback has been superseded for the patient assessment route. The browser now sends only bounded form input through a protected procedure; the active server calls the injected Gemini capability with a strict JSON response schema, validates the returned result, stores the normalized assessment under the signed-in patient, and emits a patient event. No model credential, direct provider endpoint, or client-side result-authoring path is exposed in the UI.

Emergency safety is deterministic rather than model-dependent. The server checks broad red-flag symptom wording—including the archived haematemesis/vomiting-blood variants—before the model call and retains the same override after response normalization. Any matching assessment is returned as `EMERGENCY` with controlled, non-diagnostic immediate-care guidance, so the model cannot lower urgency. The existing red emergency panel, accessible result popup, and decision-support disclaimer remain the patient-facing presentation.

The test suite validates the input boundary plus the emergency patterns and model-bypass behavior without invoking Gemini. A full signed-in UI analysis should be performed only by the account holder using non-sensitive information; no health record or fabricated patient test data was created for this milestone.

## Phase 06 — Controlled Mumbai Discovery and Maps

Patient discovery now derives from one repository-owned development-only Mumbai directory. The user can filter the fixed city scope by specialty, locality, or Central/Harbour/Western rail corridor; a search parameter from the non-emergency assessment result preselects its recommended specialty. The UI labels every entry as a development mock and makes no claim that any entry is a verified clinician, a recommendation, actually available, or geographically near the patient.

The supplied map component is centred on Mumbai and creates markers only from the controlled directory coordinates. Marker clicks and cards share the same selected-doctor state, while selection pans the map. The workflow deliberately does not request browser location, calculate travel distance, or describe an entry as “nearby.” The local preview renderer is not an approved maps-proxy origin, so its transparent unavailable state is expected; the hosted LifeLink preview origin was independently accepted by the proxy.

## Phase 07 — Always-On Patient Realtime

With the user’s approval of always-on hosting, LifeLink now exposes one authenticated SSE stream per signed-in patient shell. The endpoint obtains the patient identity exclusively from the signed server session, replays that patient’s persisted events after the standard SSE resume identifier, and delivers only event metadata. New persisted events are then published to a process-local channel keyed by the same patient identifier. The browser uses the event type only to refresh relevant patient queries; it does not poll, receive clinical content over the stream, or share events between users.

The implementation was verified with a temporary native account that the user expressly approved. No health fields or records were created. It authenticated the protected Mumbai specialty response, rejected a deliberately incomplete appointment request without persistence, and opened the SSE stream. The account, its credential, its cookie jar, and its local credential record were removed immediately after validation. Doctor login remains a mock navigation flow and does not use the patient realtime system.

## Phase 08 — Dark Mode and Direct Gemini Assessment

The shared liquid-glass system now supplies real dark-mode values for cards, controls, app chrome, interactive states, assessment records, discovery fallback surfaces, and warning panels. Dark-mode checks covered patient and mock clinician entry routes on desktop and mobile. Short slide/fade entry motion is reserved for route content and is disabled wherever the browser requests reduced motion. The only assessment pending label now reflects a real request rather than an “AI engine” animation.

The supplied `GEMINI_API_KEY` is configured in the backend environment and is used by the protected assessment service through Gemini’s Interactions API. The browser still calls only `assessment.analyze`; the key never enters client source or network calls from the browser. Emergency phrase matching remains deterministic and can bypass or override model output. A user-approved disposable account submitted a non-clinical connectivity request through the protected route, then all account, assessment, event, session, and local credential artifacts were removed.
