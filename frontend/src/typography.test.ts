import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentSource = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8"
);
const globalStyles = readFileSync(
  new URL("./index.css", import.meta.url),
  "utf8"
);

describe("LifeLink typography", () => {
  it("loads Oxanium and applies it to the global body and heading hierarchy", () => {
    expect(documentSource).toContain("family=Oxanium");
    expect(globalStyles).toMatch(/font-family:\s*["']Oxanium["']/);
    expect(globalStyles).toMatch(/\.app-mobile-brand\s*\{[\s\S]*font-family:\s*["']Oxanium["']/);
  });
});
