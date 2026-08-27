# Phase 05 — Server-Side Gemini Assessment and Emergency Safety

## Scope

This phase replaces the final patient-facing in-memory assessment path with a protected, server-side assessment workflow. The browser now submits only the patient-entered symptom form. The server obtains the structured decision-support result, applies a deterministic emergency safety override, persists the normalized record for the signed-in patient, and emits a patient event. This implementation does **not** diagnose, prescribe, or represent the result as professional medical advice.

## File-by-File Implementation

| File | Change | Outcome |
|---|---|---|
| `server/assessmentService.ts` | Added the server-only assessment contract, Gemini structured-output request, response validation, comprehensive red-flag detection, and emergency override. | Gemini credentials remain server-side. A deterministic emergency response takes precedence over every model result. |
| `server/routers.ts` | Replaced the client-authoritative `assessment.create` mutation with protected `assessment.analyze`. | The client cannot persist arbitrary urgency, specialty, reasoning, or guidance as an authoritative assessment. The procedure persists the trusted server result and records `ASSESSMENT_COMPLETED`. |
| `server/db.ts` | Returned the inserted assessment identifier from `createPatientAssessment`. | The UI receives the persistent record identity instead of composing a local mock assessment. |
| `client/src/features/patient/AIAssessment.tsx` | Removed `MockDataContext`, `addAssessment`, and browser-local `analyzeSymptoms` usage. Wired the existing form, saved-history panel, result card, red emergency presentation, and 3D popup to `trpc.assessment.analyze`. | The patient screen uses one protected database-backed source of truth. It invalidates saved assessment history and dashboard summary after a successful analysis. |
| `server/assessment.validation.test.ts` | Updated validation coverage from the retired client-supplied result shape to the raw assessment-request contract. | The server accepts only bounded, required input fields before analysis. |
| `server/assessmentService.test.ts` | Added deterministic red-flag coverage, including archived vomiting-blood wording variants and server short-circuit behavior. | Tests do not call Gemini or transmit test symptom content to an external model. |
| `todo.md` | Marked the patient assessment persistence and server-side emergency-safety work complete. | The remaining master-spec work remains visible: discovery/maps, realtime approval and transport, full-route validation, and final delivery. |

## Safety and Data-Flow Controls

| Control | Implemented behavior |
|---|---|
| Server-only model access | `invokeLLM` is called only by `server/assessmentService.ts`; no client-side API key, direct provider URL, or browser `fetch` is used. |
| Structured result contract | Gemini is requested with a strict JSON schema, then the response is parsed and bounded with Zod before persistence. |
| Deterministic emergency layer | Red-flag text matching includes chest pain, breathing difficulty, major bleeding and archived hematemesis variants, loss of consciousness/seizure, potential stroke signs, overdose/poisoning/anaphylaxis, and suicide/self-harm wording. |
| Override precedence | A detected red flag immediately returns the controlled emergency result; the same safety check is retained after model normalization so a model cannot weaken emergency urgency. |
| Patient ownership | `assessment.analyze` and `assessment.list` are protected procedures whose records are scoped from the signed-in user in the server context. |
| Persistence and events | The normalized result is stored through `createPatientAssessment`, and `ASSESSMENT_COMPLETED` is written to the patient event log. |
| User communication | Existing disclaimers, red emergency semantic styling, result popup, and guidance to seek in-person emergency care remain intact. |

> The assessment remains decision support only. It cannot rule out illness, determine severity, or replace emergency services or a licensed clinician.

## Verification Results

| Check | Result |
|---|---|
| `pnpm check` | Passed with no TypeScript errors. |
| `pnpm test` | Passed: **4 test files, 11 tests**. Includes request validation, native password safety, logout behavior, and deterministic emergency-override tests. |
| `pnpm build` | Passed. Vite reported an existing advisory about a JavaScript chunk exceeding 500 kB after minification; it is not a build failure. |
| External Gemini invocation during verification | Not performed. The added emergency-path test short-circuits before any model request, and no user health data or fabricated clinical record was submitted. |
| Authenticated browser scenario | Requires a user-controlled native patient session. The protected route is not tested with invented credentials or test health data. |

## Deferred Work

The retired `client/src/services/aiAssessmentService.ts` is no longer imported by the patient assessment route. It can be removed in a later cleanup after confirming no other legacy screen relies on it. The next functional increment is controlled Mumbai mock-doctor discovery: specialty handoff, Central/Harbour/Western/locality filters, map markers, and the existing protected appointment-request flow. Strict persistent realtime transport remains pending explicit approval for reserved hosting usage.
