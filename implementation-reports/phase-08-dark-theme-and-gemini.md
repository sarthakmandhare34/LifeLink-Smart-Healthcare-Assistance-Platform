# Phase 08 — Dark Theme, Motion, and Gemini Assessment Refinement

## Scope

This phase corrects shared dark-mode surface inconsistencies, introduces restrained page-entry motion, removes a misleading AI-engine loading label, and connects the user-provided Gemini credential to the existing protected AI Assessment backend. The credential remains server-only and is never rendered, logged, or sent to browser code.

## File-by-File Implementation

| File | Change | Result |
|---|---|---|
| `server/_core/env.ts` | Added a server-only `geminiApiKey` mapping from `GEMINI_API_KEY`. | The assessment service can access the configured credential while frontend bundles cannot. |
| `server/assessmentService.ts` | Replaced the configured-key branch with Gemini’s direct Interactions API using `gemini-3.6-flash`, JSON schema output, and minimal thinking. The existing platform LLM route stays as a server-side fallback only when no configured Gemini key exists. | The AI Assessment screen continues calling the same protected tRPC mutation. Deterministic emergency checks run before any model request and remain authoritative after parsing. |
| `server/geminiKey.test.ts` | Added model-catalog and schema-constrained, no-patient-content verification calls. | The configured secret was accepted and the direct Interactions API returned the expected typed JSON. |
| `client/src/features/patient/AIAssessment.tsx` | Replaced the promotional “AI Engine” pending copy with “Analyzing your symptoms…” and converted hard-coded warning colors into theme-aware disclaimer classes. | The only remaining loading messages reflect actual request or saved-history pending states. The warning banner is readable in dark mode. |
| `client/src/index.css` | Added dark liquid-surface tokens, dark variants for controls, sidebar/header, hover states, emergency/warning panels, and saved assessment surfaces. Added short slide/fade content entry motion and a full reduced-motion override. | Dark patient and clinician screens now use coherent indigo glass surfaces, readable inputs, and accessible warning contrast. The page motion is non-essential and disabled for reduced-motion users. |
| `client/src/discovery.css` | Added dark variants for mock-directory, filter, and map-error surfaces. | Mumbai discovery fallback and filters remain visually consistent in dark mode. |
| `implementation-reports/gemini-api-integration-notes.md` | Recorded provider model availability and direct API guidance. | The backend uses the current documented Interactions API rather than an unavailable legacy model endpoint. |

## Gemini Request Path

```text
Patient assessment screen
  → protected tRPC assessment.analyze mutation
  → server assessment service
  → direct Gemini Interactions API with your GEMINI_API_KEY
  → schema validation and deterministic emergency override
  → patient-owned assessment record and realtime event
  → server response to the existing screen
```

The client never sends a Gemini credential or makes a direct provider request. Your key is the active configured key. If no key were present, the existing server-only platform Gemini helper would be the fallback; it is not used while your configured key is available.

## No-Data End-to-End Validation

The user approved a temporary native patient account for verification. It used a disposable `example.invalid` email and submitted only the explicit non-clinical phrase “No symptoms are reported. This is a technical connection validation only.” The protected `assessment.analyze` request completed through the configured Gemini backend and returned a persisted result. The temporary account was then deleted; cascade cleanup removed its credential, assessment, and event. A follow-up database check found zero matching user, credential, and assessment records. The local cookie jar and temporary credentials were also removed.

## Verification Results

| Check | Result |
|---|---|
| Gemini credential catalog check | Passed without sending patient content. |
| Gemini schema-constrained generation check | Passed against the direct Interactions API with a non-clinical typed JSON request. |
| Protected end-to-end assessment mutation | Passed through the authenticated native session; the configured Gemini backend returned a persisted response. |
| Dark-mode desktop review | Patient login and assessment surfaces reviewed with corrected dark glass, input, warning, header, sidebar, and button contrast. |
| Dark-mode mobile review | Patient login/assessment and mock clinician login reviewed at 375 × 812. |
| Light-mode review | Login and assessment routes remained intact at desktop and mobile sizes. |
| Motion and loading behavior | Slide/fade motion was added under `prefers-reduced-motion: no-preference`; reduced motion disables it. The AI pending label now describes only the real in-flight request. |
| Type check | Passed. |
| Test suite | Passed: **7 files, 17 tests**, including direct credential and schema-generation checks. |
| Production build | Passed. The existing advisory about a JavaScript chunk above 500 kB remains non-blocking. |

## References

[1]: [Google Gemini API — Structured output](https://ai.google.dev/gemini-api/docs/structured-output)

[2]: [Google Gemini API — Thinking controls](https://ai.google.dev/gemini-api/docs/thinking)
