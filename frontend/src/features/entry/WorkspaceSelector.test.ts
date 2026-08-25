import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const selectorSource = readFileSync(resolve(process.cwd(), "frontend/src/features/entry/WorkspaceSelector.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "frontend/src/App.tsx"), "utf8");

describe("workspace selector entry flow", () => {
  it("keeps separate patient and doctor login destinations", () => {
    expect(selectorSource).toContain('navigate("/login")');
    expect(selectorSource).toContain('navigate("/doctor/login")');
    expect(appSource).toContain('<Route path="/" element={<WorkspaceSelector />} />');
  });

  it("labels the doctor path as a controlled clinician workspace", () => {
    expect(selectorSource).toContain("Controlled clinician workspace");
    expect(selectorSource).toContain("do not represent verified clinicians");
    expect(selectorSource).toContain("separate email and password");
  });
});
