import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  new URL("./index.css", import.meta.url),
  "utf8"
);

describe("LifeLink background branding", () => {
  it("uses self-contained brand gradients as a subtle, non-interactive blurred background layer", () => {
    expect(globalStyles).toMatch(/radial-gradient\s*\(\s*circle at 50% 42%/);
    expect(globalStyles).toContain("pointer-events: none");
    expect(globalStyles).toContain("filter: blur(30px)");
    expect(globalStyles).toMatch(/#root\s*\{[\s\S]*position:\s*relative[\s\S]*z-index:\s*1/);
  });
});
