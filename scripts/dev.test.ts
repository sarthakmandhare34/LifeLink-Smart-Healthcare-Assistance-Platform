import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("local development shortcuts", () => {
  const wrapper = readFileSync(resolve(process.cwd(), "scripts/dev.mjs"), "utf8");

  it("documents browser, help, restart, and quit shortcuts", () => {
    expect(wrapper).toContain("o + Enter");
    expect(wrapper).toContain("h + Enter");
    expect(wrapper).toContain("r + Enter");
    expect(wrapper).toContain("q + Enter");
  });

  it("keeps the existing LifeLink server command intact", () => {
    expect(wrapper).toContain("cross-env NODE_ENV=development tsx watch backend/_core/index.ts");
  });
});
