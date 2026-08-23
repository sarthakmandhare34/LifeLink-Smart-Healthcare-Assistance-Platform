import { randomBytes, timingSafeEqual } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { ProviderAccountConflictError, resolveProviderPatient, type ExternalAuthProvider } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";

const PROVIDER_STATE_COOKIE = "lifelink_provider_oauth_state";
const STATE_MAX_AGE_MS = 10 * 60 * 1000;
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const APPLE_JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

type ProviderAvailability = Record<ExternalAuthProvider, boolean>;
type StoredState = { provider: ExternalAuthProvider; state: string; nonce: string; expiresAt: number };
type VerifiedProviderProfile = { provider: ExternalAuthProvider; subject: string; email: string; name: string | null };

function getPublicBaseUrl() {
  try {
    const parsed = new URL(ENV.authPublicBaseUrl);
    return parsed.protocol === "https:" ? parsed.origin.replace(/\/$/, "") : "";
  } catch {
    return "";
  }
}

export function providerAvailabilityFromConfig(config: {
  authPublicBaseUrl: string;
  googleOAuthClientId: string;
  googleOAuthClientSecret: string;
  appleClientId: string;
  appleTeamId: string;
  appleKeyId: string;
  applePrivateKey: string;
}): ProviderAvailability {
  let hasBase = false;
  try {
    hasBase = new URL(config.authPublicBaseUrl).protocol === "https:";
  } catch { /* An empty or invalid public origin must keep providers unavailable. */ }
  return {
    google: hasBase && Boolean(config.googleOAuthClientId && config.googleOAuthClientSecret),
    apple: hasBase && Boolean(config.appleClientId && config.appleTeamId && config.appleKeyId && config.applePrivateKey),
  };
}

export function getProviderAvailability(): ProviderAvailability {
  return providerAvailabilityFromConfig(ENV);
}

function callbackUrl(provider: ExternalAuthProvider) {
  return `${getPublicBaseUrl()}/api/auth/${provider}/callback`;
}

function storeState(req: Request, res: Response, provider: ExternalAuthProvider) {
  const stored: StoredState = {
    provider,
    state: randomBytes(32).toString("base64url"),
    nonce: randomBytes(32).toString("base64url"),
    expiresAt: Date.now() + STATE_MAX_AGE_MS,
  };
  res.cookie(PROVIDER_STATE_COOKIE, Buffer.from(JSON.stringify(stored)).toString("base64url"), {
    ...getSessionCookieOptions(req),
    maxAge: STATE_MAX_AGE_MS,
  });
  return stored;
}

function clearState(req: Request, res: Response) {
  res.clearCookie(PROVIDER_STATE_COOKIE, { ...getSessionCookieOptions(req), maxAge: -1 });
}

function getState(req: Request, provider: ExternalAuthProvider, receivedState: string | undefined) {
  if (!receivedState) return null;
  const raw = parseCookieHeader(req.headers.cookie ?? "")[PROVIDER_STATE_COOKIE];
  if (!raw) return null;
  try {
    const stored = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as StoredState;
    if (stored.provider !== provider || stored.expiresAt < Date.now()) return null;
    const expected = Buffer.from(stored.state);
    const actual = Buffer.from(receivedState);
    return expected.length === actual.length && timingSafeEqual(expected, actual) ? stored : null;
  } catch {
    return null;
  }
}

function callbackInput(req: Request, key: string) {
  const queryValue = req.query[key];
  if (typeof queryValue === "string") return queryValue;
  const bodyValue = req.body?.[key];
  return typeof bodyValue === "string" ? bodyValue : undefined;
}

function redirectWithError(res: Response, code: string) {
  res.redirect(302, `/login?authError=${encodeURIComponent(code)}`);
}

async function exchangeGoogleCode(code: string, nonce: string): Promise<VerifiedProviderProfile> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: ENV.googleOAuthClientId,
      client_secret: ENV.googleOAuthClientSecret,
      redirect_uri: callbackUrl("google"),
      grant_type: "authorization_code",
    }),
  });
  const data = await response.json().catch(() => null) as { id_token?: string } | null;
  if (!response.ok || !data?.id_token) throw new Error("Google token exchange failed");
  const { payload } = await jwtVerify(data.id_token, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: ENV.googleOAuthClientId,
  });
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!payload.sub || !email || payload.email_verified !== true || payload.nonce !== nonce) throw new Error("Google identity could not be verified");
  return { provider: "google", subject: payload.sub, email, name: typeof payload.name === "string" ? payload.name : null };
}

async function createAppleClientSecret() {
  const privateKey = await importPKCS8(ENV.applePrivateKey.replace(/\\n/g, "\n"), "ES256");
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: ENV.appleKeyId })
    .setIssuer(ENV.appleTeamId)
    .setSubject(ENV.appleClientId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey);
}

async function exchangeAppleCode(code: string, nonce: string, requestedName: string | null): Promise<VerifiedProviderProfile> {
  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: ENV.appleClientId,
      client_secret: await createAppleClientSecret(),
      code,
      grant_type: "authorization_code",
      redirect_uri: callbackUrl("apple"),
    }),
  });
  const data = await response.json().catch(() => null) as { id_token?: string } | null;
  if (!response.ok || !data?.id_token) throw new Error("Apple token exchange failed");
  const { payload } = await jwtVerify(data.id_token, APPLE_JWKS, { issuer: "https://appleid.apple.com", audience: ENV.appleClientId });
  const email = typeof payload.email === "string" ? payload.email : "";
  const emailVerified = payload.email_verified === true || payload.email_verified === "true";
  if (!payload.sub || !email || !emailVerified || payload.nonce !== nonce) throw new Error("Apple identity could not be verified");
  return { provider: "apple", subject: payload.sub, email, name: requestedName };
}

async function establishProviderSession(req: Request, res: Response, profile: VerifiedProviderProfile) {
  const user = await resolveProviderPatient(profile);
  const token = await sdk.createSessionToken(user.openId, { name: user.name || "LifeLink Patient", expiresInMs: ONE_YEAR_MS });
  res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
  res.redirect(302, "/patient/dashboard");
}

function startProvider(req: Request, res: Response, provider: ExternalAuthProvider) {
  if (!getProviderAvailability()[provider]) {
    res.status(503).json({ error: `${provider} sign-in is not configured yet.` });
    return;
  }
  const stored = storeState(req, res, provider);
  const authorizeUrl = new URL(provider === "google" ? "https://accounts.google.com/o/oauth2/v2/auth" : "https://appleid.apple.com/auth/authorize");
  if (provider === "google") {
    authorizeUrl.search = new URLSearchParams({ client_id: ENV.googleOAuthClientId, redirect_uri: callbackUrl("google"), response_type: "code", scope: "openid email profile", state: stored.state, nonce: stored.nonce, prompt: "select_account" }).toString();
  } else {
    authorizeUrl.search = new URLSearchParams({ client_id: ENV.appleClientId, redirect_uri: callbackUrl("apple"), response_type: "code id_token", response_mode: "form_post", scope: "name email", state: stored.state, nonce: stored.nonce }).toString();
  }
  res.redirect(302, authorizeUrl.toString());
}

async function finishProvider(req: Request, res: Response, provider: ExternalAuthProvider) {
  const state = getState(req, provider, callbackInput(req, "state"));
  clearState(req, res);
  if (!state) return redirectWithError(res, "invalid_provider_state");
  const providerError = callbackInput(req, "error");
  const code = callbackInput(req, "code");
  if (providerError || !code) return redirectWithError(res, "provider_sign_in_cancelled");
  try {
    let profile: VerifiedProviderProfile;
    if (provider === "google") {
      profile = await exchangeGoogleCode(code, state.nonce);
    } else {
      const rawUser = callbackInput(req, "user");
      let name: string | null = null;
      try {
        const parsed = rawUser ? JSON.parse(rawUser) as { name?: { firstName?: string; lastName?: string } } : undefined;
        name = [parsed?.name?.firstName, parsed?.name?.lastName].filter(Boolean).join(" ") || null;
      } catch { /* Apple user name is optional and only sent on first consent. */ }
      profile = await exchangeAppleCode(code, state.nonce, name);
    }
    await establishProviderSession(req, res, profile);
  } catch (error) {
    console.warn(`[ProviderAuth] ${provider} callback failed`, error instanceof Error ? error.name : "unknown");
    redirectWithError(res, error instanceof ProviderAccountConflictError ? "account_exists" : "provider_sign_in_failed");
  }
}

export function registerProviderAuthRoutes(app: Express) {
  app.get("/api/auth/google", (req, res) => startProvider(req, res, "google"));
  app.get("/api/auth/apple", (req, res) => startProvider(req, res, "apple"));
  app.get("/api/auth/google/callback", (req, res) => { void finishProvider(req, res, "google"); });
  app.post("/api/auth/apple/callback", (req, res) => { void finishProvider(req, res, "apple"); });
}
