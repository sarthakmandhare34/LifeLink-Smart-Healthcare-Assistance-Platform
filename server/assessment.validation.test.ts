import { describe, expect, it } from "vitest";
import { assessmentInput } from "./routers";

describe("assessment persistence input", () => {
  const validAssessment = {
    symptoms: "Mild headache for one day",
    age: 30,
    gender: "Other",
    conditions: "",
    duration: "< 24 hours",
    urgency: "LOW" as const,
    reason: "A local decision-support check did not detect emergency wording.",
    specialty: "General Practice",
    guidance: "Contact a clinician if symptoms persist or worsen.",
  };

  it("accepts a complete assessment record", () => {
    expect(assessmentInput.parse(validAssessment)).toEqual(validAssessment);
  });

  it("rejects invalid assessment ages and unknown urgency values", () => {
    expect(() => assessmentInput.parse({ ...validAssessment, age: 121 })).toThrow();
    expect(() => assessmentInput.parse({ ...validAssessment, urgency: "UNKNOWN" })).toThrow();
  });
});
