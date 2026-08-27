import { z } from "zod";
import { ENV } from "./_core/env";

export const assessmentRequestInput = z.object({
  symptoms: z.string().trim().min(1).max(10_000),
  age: z.number().int().min(0).max(120),
  gender: z.string().trim().min(1).max(32),
  conditions: z.string().trim().max(5_000).optional(),
  duration: z.string().trim().min(1).max(64),
});

export type AssessmentRequest = z.infer<typeof assessmentRequestInput>;

const assessmentResultSchema = z.object({
  urgency: z.enum(["LOW", "MODERATE", "EMERGENCY"]),
  specialty: z.string().trim().min(1).max(160),
  reason: z.string().trim().min(1).max(10_000),
  guidance: z.string().trim().min(1).max(10_000),
});

export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

const EMERGENCY_PATTERNS = [
  /chest pain|chest pressure|crushing chest/i,
  /difficulty breathing|shortness of breath|can(?:not|'t) breathe/i,
  /severe bleeding|coughing blood|vomit(?:ing|ed|s)?\s+blood|blood\s+(?:in\s+(?:my\s+)?)?vomit(?:ing|ed|s)?|throw(?:ing)?\s+up\s+blood|threw\s+up\s+blood|hematemesis/i,
  /unconscious|loss of consciousness|fainting|seizure/i,
  /face droop|slurred speech|sudden weakness|one-sided weakness/i,
  /overdose|poisoning|anaphylaxis|severe allergic reaction/i,
  /suicid(?:al|e)|self[- ]harm/i,
];

const ASSESSMENT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    urgency: { type: "string", enum: ["LOW", "MODERATE", "EMERGENCY"] },
    specialty: { type: "string" },
    reason: { type: "string" },
    guidance: { type: "string" },
  },
  required: ["urgency", "specialty", "reason", "guidance"],
  additionalProperties: false,
} as const;

/** Gemini's generate-content schema dialect does not accept `additionalProperties`. */
const GEMINI_ASSESSMENT_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    urgency: { type: "STRING", enum: ["LOW", "MODERATE", "EMERGENCY"] },
    specialty: { type: "STRING" },
    reason: { type: "STRING" },
    guidance: { type: "STRING" },
  },
  required: ["urgency", "specialty", "reason", "guidance"],
} as const;

const ASSESSMENT_SYSTEM_INSTRUCTION =
  "You are LifeLink's health-triage decision-support assistant. Do not diagnose, prescribe, claim certainty, or replace professional care. Return only the requested JSON. Use short, calm, non-diagnostic reasoning. If potentially urgent, choose MODERATE or EMERGENCY and direct the person to appropriate in-person care. For EMERGENCY, guidance must say to seek emergency care or contact a local emergency number now.";

export function hasEmergencyPattern(symptoms: string) {
  return EMERGENCY_PATTERNS.some(pattern =>
    pattern.test(symptoms.trim().toLowerCase())
  );
}

export function emergencyOverride(): AssessmentResult {
  return {
    urgency: "EMERGENCY",
    specialty: "Emergency Care",
    reason:
      "A deterministic safety check detected symptom wording that may indicate an emergency. This tool cannot determine severity or make a diagnosis.",
    guidance:
      "Seek immediate in-person emergency care or contact your local emergency number now. Do not rely on this screen for diagnosis or treatment.",
  };
}

function parseModelContent(content: string | unknown[]) {
  if (typeof content !== "string")
    throw new Error("Gemini returned a non-text assessment response.");
  return assessmentResultSchema.parse(JSON.parse(content));
}

function assessmentPrompt(input: AssessmentRequest) {
  return JSON.stringify({
    symptoms: input.symptoms,
    age: input.age,
    gender: input.gender,
    existingConditions: input.conditions ?? "",
    symptomDuration: input.duration,
  });
}

async function invokeConfiguredGemini(input: AssessmentRequest) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(ENV.geminiModel)}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": ENV.geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${ASSESSMENT_SYSTEM_INSTRUCTION}\n\nPatient-provided information:\n${assessmentPrompt(input)}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: GEMINI_ASSESSMENT_RESPONSE_SCHEMA,
        },
      }),
    }
  );

  if (!response.ok)
    throw new Error("Gemini assessment request was unavailable.");
  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content =
    payload.candidates
      ?.flatMap(candidate => candidate.content?.parts ?? [])
      .map(part => part.text ?? "")
      .join("") ?? "";
  return parseModelContent(content);
}

/**
 * Server-only decision support. The project owner's Gemini credential is used
 * only on the backend. A deterministic red-flag override always outranks model output.
 */
export async function analyzeAssessmentWithGemini(
  input: AssessmentRequest
): Promise<AssessmentResult> {
  if (hasEmergencyPattern(input.symptoms)) return emergencyOverride();

  if (!ENV.geminiApiKey) {
    throw new Error(
      "AI assessment is unavailable. Configure GEMINI_API_KEY on the local server before using this feature."
    );
  }
  try {
    return await invokeConfiguredGemini(input);
  } catch {
    throw new Error(
      "AI assessment is temporarily unavailable. Please try again later or seek professional care if you are concerned."
    );
  }
}
