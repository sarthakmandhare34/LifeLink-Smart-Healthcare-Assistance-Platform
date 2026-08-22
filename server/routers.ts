import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createPatientAssessment, getPatientAssessments } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const assessmentInput = z.object({
  symptoms: z.string().trim().min(1).max(10_000),
  age: z.number().int().min(0).max(120),
  gender: z.string().trim().min(1).max(32),
  conditions: z.string().trim().max(5_000).optional(),
  duration: z.string().trim().min(1).max(64),
  urgency: z.enum(["LOW", "MODERATE", "EMERGENCY"]),
  reason: z.string().trim().min(1).max(10_000),
  specialty: z.string().trim().min(1).max(160),
  guidance: z.string().trim().min(1).max(10_000),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  assessment: router({
    list: protectedProcedure.query(({ ctx }) => getPatientAssessments(ctx.user.id)),
    create: protectedProcedure.input(assessmentInput).mutation(async ({ ctx, input }) => {
      await createPatientAssessment({
        userId: ctx.user.id,
        symptoms: input.symptoms,
        age: input.age,
        gender: input.gender,
        conditions: input.conditions ?? null,
        duration: input.duration,
        urgency: input.urgency,
        reason: input.reason,
        specialty: input.specialty,
        guidance: input.guidance,
      });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
