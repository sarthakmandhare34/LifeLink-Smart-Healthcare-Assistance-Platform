import { timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createSyntheticDoctorCredential, getSyntheticDoctorCredentialByEmail } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { hashPatientPassword, verifyPatientPassword } from "./nativePatientAuth";
import { doctorDisplayName, doctorIdFromSyntheticOpenId, getSyntheticDoctor, syntheticDoctorOpenId } from "./syntheticDoctor";
import { mockDoctorDirectory } from "./mockDoctorDirectory";

const credentialInput = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(10).max(128),
});

const provisionInput = credentialInput.extend({
  doctorId: z.string().trim().min(1).max(80),
  provisioningCode: z.string().min(1).max(256),
});

function normalizedEmail(email: string) {
  return email.trim().toLowerCase();
}

/** The existing secret now protects account provisioning; it is never used for doctor sign-in or returned to clients. */
function matchesProvisioningCode(value: string) {
  const expected = ENV.demoDoctorAccessCode;
  if (expected.length < 16 || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

function doctorSessionView(openId: string) {
  const doctorId = doctorIdFromSyntheticOpenId(openId);
  const doctor = doctorId ? getSyntheticDoctor(doctorId) : null;
  if (!doctor) return null;
  return {
    id: doctor.id,
    displayName: doctorDisplayName(doctor),
    specialty: doctor.specialty,
    locality: doctor.locality,
    isSynthetic: true as const,
  };
}

async function establishDoctorSession(
  ctx: { req: Parameters<typeof getSessionCookieOptions>[0]; res: { cookie: (name: string, value: string, options: Record<string, unknown>) => void } },
  openId: string,
) {
  const session = doctorSessionView(openId);
  if (!session) throw new TRPCError({ code: "FORBIDDEN", message: "Synthetic doctor session is not valid." });
  const token = await sdk.createSessionToken(openId, { name: session.displayName, expiresInMs: ONE_YEAR_MS });
  ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
  return session;
}

export const doctorAuthRouter = router({
  directory: publicProcedure.query(() => mockDoctorDirectory.map((doctor) => ({
    id: doctor.id,
    displayName: doctorDisplayName(doctor),
    specialty: doctor.specialty,
    locality: doctor.locality,
    railLine: doctor.railLine,
    isSynthetic: true as const,
  }))),
  provision: publicProcedure.input(provisionInput).mutation(async ({ input }) => {
    if (!matchesProvisioningCode(input.provisioningCode)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "The provisioning code is invalid." });
    }
    const doctor = getSyntheticDoctor(input.doctorId);
    if (!doctor) throw new TRPCError({ code: "NOT_FOUND", message: "Selected controlled demo doctor was not found." });
    const created = await createSyntheticDoctorCredential({
      doctor,
      email: normalizedEmail(input.email),
      passwordHash: await hashPatientPassword(input.password),
    });
    if (!created) throw new TRPCError({ code: "CONFLICT", message: "This demo doctor or email already has credentials. Use the doctor sign-in page." });
    return { doctorId: doctor.id, email: created.email, displayName: doctorDisplayName(doctor) };
  }),
  login: publicProcedure.input(credentialInput).mutation(async ({ ctx, input }) => {
    const record = await getSyntheticDoctorCredentialByEmail(normalizedEmail(input.email));
    const valid = record ? await verifyPatientPassword(input.password, record.credential.passwordHash) : false;
    const doctorId = record ? doctorIdFromSyntheticOpenId(record.user.openId) : null;
    if (!record || !valid || record.user.role !== "doctor" || !doctorId || record.credential.doctorId !== doctorId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid demo doctor email or password." });
    }
    return establishDoctorSession(ctx, record.user.openId);
  }),
  me: protectedProcedure.query(({ ctx }) => doctorSessionView(ctx.user.openId)),
});
