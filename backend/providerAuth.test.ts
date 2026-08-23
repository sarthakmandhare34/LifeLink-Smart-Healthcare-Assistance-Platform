import { describe, expect, it } from "vitest";
import { providerAvailabilityFromConfig } from "./providerAuth";

const completeConfig = {
  authPublicBaseUrl: "https://lifelink.example",
  googleOAuthClientId: "google-client",
  googleOAuthClientSecret: "google-secret",
  appleClientId: "com.example.lifelink",
  appleTeamId: "team-id",
  appleKeyId: "key-id",
  applePrivateKey: "-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----",
};

describe("provider availability", () => {
  it("requires an HTTPS public callback origin and both Google credentials", () => {
    expect(providerAvailabilityFromConfig({ ...completeConfig, authPublicBaseUrl: "http://localhost:3000" }).google).toBe(false);
    expect(providerAvailabilityFromConfig({ ...completeConfig, googleOAuthClientSecret: "" }).google).toBe(false);
    expect(providerAvailabilityFromConfig(completeConfig).google).toBe(true);
  });

  it("requires the complete Apple server-side signing configuration", () => {
    expect(providerAvailabilityFromConfig({ ...completeConfig, applePrivateKey: "" }).apple).toBe(false);
    expect(providerAvailabilityFromConfig(completeConfig).apple).toBe(true);
  });
});
