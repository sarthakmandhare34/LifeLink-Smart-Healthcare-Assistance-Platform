import { describe, expect, it } from "vitest";
import { googleAuthorizationStartUrlFromConfig, googleAvailabilityFromConfig } from "./providerAuth";

const completeConfig = {
  authPublicBaseUrl: "https://lifelink.example",
  googleOAuthClientId: "google-client",
  googleOAuthClientSecret: "google-secret",
};

describe("Google provider availability", () => {
  it("requires an HTTPS public callback origin and both Google credentials", () => {
    expect(googleAvailabilityFromConfig({ ...completeConfig, authPublicBaseUrl: "http://localhost:3000" })).toBe(false);
    expect(googleAvailabilityFromConfig({ ...completeConfig, googleOAuthClientSecret: "" })).toBe(false);
    expect(googleAvailabilityFromConfig(completeConfig)).toBe(true);
  });

  it("starts authorization at the permanent public origin so its state cookie returns to the same host", () => {
    expect(googleAuthorizationStartUrlFromConfig(completeConfig)).toBe("https://lifelink.example/api/auth/google");
    expect(googleAuthorizationStartUrlFromConfig({ ...completeConfig, authPublicBaseUrl: "http://localhost:3000" })).toBeNull();
  });

  it("accepts the configured server-only Google client credentials", async () => {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const publicBaseUrl = process.env.AUTH_PUBLIC_BASE_URL;
    expect(clientId).toBeTruthy();
    expect(clientSecret).toBeTruthy();
    expect(publicBaseUrl).toMatch(/^https:\/\//);

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId ?? "",
        client_secret: clientSecret ?? "",
        redirect_uri: `${publicBaseUrl}/api/auth/google/callback`,
        code: "lifelink-credential-validation-no-user-data",
        grant_type: "authorization_code",
      }),
    });
    const payload = await response.json() as { error?: string };
    expect(payload.error).not.toBe("invalid_client");
    expect(payload.error).toBe("invalid_grant");
  }, 20_000);

  it("serves the Google callback route on the configured public origin", async () => {
    const publicBaseUrl = process.env.AUTH_PUBLIC_BASE_URL;
    expect(publicBaseUrl).toMatch(/^https:\/\//);

    const response = await fetch(`${publicBaseUrl}/api/auth/google/callback`, {
      redirect: "manual",
    });

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get("location")).toContain("/login?authError=invalid_provider_state");
  }, 20_000);
});
