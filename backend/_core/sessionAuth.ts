import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import type { User } from "../../database/schema";
import { ONE_YEAR_MS, COOKIE_NAME } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import * as db from "../db";
import { ENV } from "./env";

export type LocalSessionPayload = {
  openId: string;
  name: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

class LocalSessionAuth {
  private getSessionSecret() {
    if (ENV.cookieSecret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long.");
    }
    return new TextEncoder().encode(ENV.cookieSecret);
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    return new SignJWT({ openId, name: options.name || "LifeLink user" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(Math.floor(issuedAt / 1000))
      .setExpirationTime(Math.floor((issuedAt + expiresInMs) / 1000))
      .sign(this.getSessionSecret());
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<LocalSessionPayload | null> {
    if (!cookieValue) return null;
    try {
      const { payload } = await jwtVerify(
        cookieValue,
        this.getSessionSecret(),
        { algorithms: ["HS256"] }
      );
      if (!isNonEmptyString(payload.openId)) return null;
      return {
        openId: payload.openId,
        name: isNonEmptyString(payload.name) ? payload.name : "LifeLink user",
      };
    } catch {
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = parseCookieHeader(req.headers.cookie ?? "");
    const bearer = req.headers.authorization;
    const bearerToken =
      typeof bearer === "string" && bearer.startsWith("Bearer ")
        ? bearer.slice(7)
        : undefined;
    const session = await this.verifySession(
      cookies[COOKIE_NAME] ?? bearerToken
    );
    if (!session) throw ForbiddenError("Invalid or missing LifeLink session.");

    const user = await db.getUserByOpenId(session.openId);
    if (!user) throw ForbiddenError("LifeLink session user was not found.");

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }
}

export const sessionAuth = new LocalSessionAuth();
