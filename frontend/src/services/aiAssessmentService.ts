/**
 * Assessment service note: deployment-safe local decision support. It does not
 * diagnose medical conditions and intentionally routes possible red flags to
 * emergency guidance instead of attempting clinical conclusions in the browser.
 */

interface AssessmentPayload {
  symptoms: string;
  age: number;
  gender: string;
  conditions: string;
  duration: string;
}

interface AssessmentResponse {
  urgency: "LOW" | "MODERATE" | "EMERGENCY";
  recommendedSpecialty: string;
  reason: string;
  guidance: string;
}

const RED_FLAG_PATTERNS = [
  /chest pain|chest pressure|crushing chest/i,
  /difficulty breathing|shortness of breath|can(?:not|'t) breathe/i,
  /severe bleeding|coughing blood|vomiting blood/i,
  /unconscious|loss of consciousness|fainting|seizure/i,
  /face droop|slurred speech|sudden weakness|one-sided weakness/i,
  /overdose|poisoning|anaphylaxis|severe allergic reaction/i,
  /suicid(?:al|e)|self[- ]harm/i,
];

const PROMPT_REVIEW_PATTERNS = [
  /high fever|persistent fever|worsening|severe pain|dehydrat|confusion/i,
  /pregnan|infant|newborn|immunocompromised/i,
];

const SPECIALTY_MATCHES: Array<{ pattern: RegExp; specialty: string }> = [
  { pattern: /skin|rash|eczema|hive/i, specialty: "Dermatology" },
  { pattern: /headache|migraine|dizz|numb|tingl/i, specialty: "Neurology" },
  {
    pattern: /heart|chest|palpitation|blood pressure/i,
    specialty: "Cardiology",
  },
  { pattern: /cough|breath|asthma|lung/i, specialty: "Pulmonology" },
  {
    pattern: /stomach|abdominal|nausea|vomit|diarrh/i,
    specialty: "Gastroenterology",
  },
  { pattern: /joint|back pain|muscle|bone/i, specialty: "General Practice" },
];

function hasPattern(value: string, patterns: RegExp[]) {
  return patterns.some(pattern => pattern.test(value));
}

function recommendSpecialty(summary: string) {
  return (
    SPECIALTY_MATCHES.find(({ pattern }) => pattern.test(summary))?.specialty ??
    "General Practice"
  );
}

/**
 * Returns transparent, local decision-support guidance without network access.
 * A server-backed, clinically validated system can replace this service later.
 */
export const analyzeSymptoms = async (
  payload: AssessmentPayload
): Promise<AssessmentResponse> => {
  const summary = `${payload.symptoms} ${payload.conditions}`.trim();
  const specialty = recommendSpecialty(summary);

  if (hasPattern(summary, RED_FLAG_PATTERNS)) {
    return {
      urgency: "EMERGENCY",
      recommendedSpecialty: "Emergency Care",
      reason:
        "This local decision-support check detected symptom wording that can be associated with an emergency. It cannot assess severity or make a diagnosis.",
      guidance:
        "Seek immediate in-person emergency care or contact your local emergency number now. Do not rely on this screen for diagnosis or treatment.",
    };
  }

  const isLongDuration = payload.duration === "> 1 week";
  const hasKnownCondition = payload.conditions.trim().length > 0;
  const needsPromptReview =
    hasPattern(summary, PROMPT_REVIEW_PATTERNS) ||
    isLongDuration ||
    (hasKnownCondition && payload.duration !== "< 24 hours") ||
    payload.age >= 65;

  if (needsPromptReview) {
    return {
      urgency: "MODERATE",
      recommendedSpecialty: specialty,
      reason:
        "This local decision-support check suggests a clinician should review the reported symptoms soon. It does not identify a condition or replace professional assessment.",
      guidance:
        "Arrange a timely consultation with a licensed clinician. Seek urgent help sooner if symptoms worsen, new red-flag symptoms appear, or you feel unsafe.",
    };
  }

  return {
    urgency: "LOW",
    recommendedSpecialty: specialty,
    reason:
      "No emergency-related terms were detected by the local decision-support check. This is not a diagnosis and cannot rule out a health problem.",
    guidance:
      "Monitor how you feel and consider contacting a licensed clinician if symptoms persist, worsen, or you are concerned.",
  };
};
