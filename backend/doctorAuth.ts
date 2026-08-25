import { timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { findOrCreateSyntheticDoctorUser } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { doctorDisplayName, doctorIdFromSyntheticOpenId, getWorkstationDoctor } from "./syntheticDoctor";

const doctorLoginInput = z.object({ accessCode: z.string().min(1).max(256) });

function matchesDemoDoctorAccessCode(accessCode: string) {
  const expected = ENV.demoDoctorAccessCode;
  if (expected.length < 16 || accessCode.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(accessCode), Buffer.from(expected));
}

function doctorSessionView(openId: string) {
  const doctorId = doctorIdFromSyntheticOpenId(openId);
  if (!doctorId) return null;
  const doctor = getWorkstationDoctor();
  if (doctor.id !== doctorId) return null;
  return {
    id: doctor.id,
    displayName: doctorDisplayName(doctor),
    specialty: doctor.specialty,
    locality: doctor.locality,
    isSynthetic: true as const,
  };
}

export const doctorAuthRouter = router({
  login: publicProcedure.input(doctorLoginInput).mutation(async ({ ctx, input }) => {
    if (!matchesDemoDoctorAccessCode(input.accessCode)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "The synthetic doctor access code is invalid." });
    }

    const doctor = getWorkstationDoctor();
    const user = await findOrCreateSyntheticDoctorUser(doctor);
    const token = await sdk.createSessionToken(user.openId, {
      name: doctorDisplayName(doctor),
      expiresInMs: ONE_YEAR_MS,
    });
    ctx.res.cookie(COOKIE_NAME, token, {
      ...getSessionCookieOptions(ctx.req),
      maxAge: ONE_YEAR_MS,
    });
    return doctorSessionView(user.openId);
  }),
  me: protectedProcedure.query(({ ctx }) => doctorSessionView(ctx.user.openId)),
});
