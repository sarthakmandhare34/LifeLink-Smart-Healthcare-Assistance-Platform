import { describe, expect, it } from "vitest";
import { analyzeAssessmentWithGemini, emergencyOverride, hasEmergencyPattern } from "./assessmentService";

describe("deterministic emergency assessment safety", () => {
  it.each(["vomiting blood", "I threw up blood", "blood in my vomit", "hematemesis"]) (
    "recognizes the archived emergency wording variation: %s",
    (symptoms) => expect(hasEmergencyPattern(symptoms)).toBe(true),
  );

  it("returns the emergency override before any model result can lower urgency", () => {
    expect(emergencyOverride()).toMatchObject({
      urgency: "EMERGENCY",
      specialty: "Emergency Care",
    });
  });

  it("short-circuits a red-flag assessment to the emergency override", async () => {
    await expect(analyzeAssessmentWithGemini({
      symptoms: "vomiting blood",
      age: 30,
      gender: "Other",
      conditions: "",
      duration: "< 24 hours",
    })).resolves.toMatchObject({ urgency: "EMERGENCY", specialty: "Emergency Care" });
  });
});
