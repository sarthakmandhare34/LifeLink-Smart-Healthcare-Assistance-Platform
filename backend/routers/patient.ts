import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  cancelOwnedPatientAppointment,
  createPatientAppointment,
  createNativePatient,
  createPatientMedicine,
  createPatientEvent,
  getNativePatientByEmail,
  getPatientDashboard,
  getPatientProfile,
  listPatientAppointments,
  listPatientMedicines,
  listPatientPrescriptions,
  removeOwnedPatientMedicine,
  updateOwnedPatientMedicine,
  updatePatientProfile,
} from "../db";
import { filterMockDoctorDirectory, getMockDoctorById, getMockDoctorDirectoryFacets } from "../mockDoctorDirectory";
import { hashPatientPassword, verifyPatientPassword } from "../nativePatientAuth";
import { getSessionCookieOptions } from "../_core/cookies";
import { sdk } from "../_core/sdk";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";

const registrationInput = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
});

const loginInput = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

const profileInput = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  bloodGroup: z.string().trim().max(12).optional(),
  phone: z.string().trim().max(32).optional(),
  allergies: z.array(z.string().trim().min(1).max(160)).max(50).optional(),
  conditions: z.array(z.string().trim().min(1).max(160)).max(50).optional(),
});

function normalizedEmail(email: string) {
  return email.trim().toLowerCase();
}

async function establishNativeSession(
  ctx: { req: Parameters<typeof getSessionCookieOptions>[0]; res: { cookie: (name: string, value: string, options: Record<string, unknown>) => void } },
  user: { openId: string; name: string | null }
) {
  const token = await sdk.createSessionToken(user.openId, {
    name: user.name || "LifeLink Patient",
    expiresInMs: ONE_YEAR_MS,
  });
  ctx.res.cookie(COOKIE_NAME, token, {
    ...getSessionCookieOptions(ctx.req),
    maxAge: ONE_YEAR_MS,
  });
}

export const patientAuthRouter = router({
  register: publicProcedure.input(registrationInput).mutation(async ({ ctx, input }) => {
    const email = normalizedEmail(input.email);
    const passwordHash = await hashPatientPassword(input.password);
    const user = await createNativePatient({ name: input.name, email, passwordHash });
    if (!user) {
      throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists." });
    }
    await establishNativeSession(ctx, user);
    return { id: user.id, name: user.name ?? "", email: user.email ?? "" };
  }),

  login: publicProcedure.input(loginInput).mutation(async ({ ctx, input }) => {
    const record = await getNativePatientByEmail(normalizedEmail(input.email));
    const isValid = record ? await verifyPatientPassword(input.password, record.credential.passwordHash) : false;
    if (!record || !isValid || record.user.loginMethod !== "native-patient") {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
    }
    await establishNativeSession(ctx, record.user);
    return { id: record.user.id, name: record.user.name ?? "", email: record.user.email ?? "" };
  }),
});

export const patientProfileRouter = router({
  get: protectedProcedure.query(({ ctx }) => getPatientProfile(ctx.user.id)),
  update: protectedProcedure.input(profileInput).mutation(async ({ ctx, input }) => {
    const profile = await updatePatientProfile(ctx.user.id, input);
    await createPatientEvent(ctx.user.id, "PROFILE_UPDATED", String(ctx.user.id));
    return profile;
  }),
});

export const patientDashboardRouter = router({
  summary: protectedProcedure.query(({ ctx }) => getPatientDashboard(ctx.user.id)),
});

const medicineInput = z.object({
  name: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(120),
  frequency: z.string().trim().min(1).max(120),
  schedule: z.string().trim().min(1).max(120),
  startDate: z.string().trim().max(10).optional(),
  endDate: z.string().trim().max(10).optional(),
  quantity: z.number().int().min(0).max(1_000_000).optional(),
  expiry: z.string().trim().max(10).optional(),
});

export const patientMedicineRouter = router({
  list: protectedProcedure.query(({ ctx }) => listPatientMedicines(ctx.user.id)),
  create: protectedProcedure.input(medicineInput).mutation(async ({ ctx, input }) => {
    const id = await createPatientMedicine(ctx.user.id, {
      ...input,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      quantity: input.quantity ?? null,
      expiry: input.expiry ?? null,
    });
    await createPatientEvent(ctx.user.id, "MEDICINE_UPDATED", String(id));
    return { id };
  }),
  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive(), values: medicineInput.partial() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await updateOwnedPatientMedicine(ctx.user.id, input.id, input.values);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Medicine record not found." });
      await createPatientEvent(ctx.user.id, "MEDICINE_UPDATED", String(input.id));
      return { success: true } as const;
    }),
  remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const removed = await removeOwnedPatientMedicine(ctx.user.id, input.id);
    if (!removed) throw new TRPCError({ code: "NOT_FOUND", message: "Medicine record not found." });
    await createPatientEvent(ctx.user.id, "MEDICINE_UPDATED", String(input.id));
    return { success: true } as const;
  }),
});

const appointmentInput = z.object({
  doctorId: z.string().trim().min(1).max(80),
  scheduledAt: z.coerce.date(),
});

export const patientAppointmentRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const appointments = await listPatientAppointments(ctx.user.id);
    return appointments.map((appointment) => ({
      ...appointment,
      doctor: getMockDoctorById(appointment.doctorId),
    }));
  }),
  request: protectedProcedure.input(appointmentInput).mutation(async ({ ctx, input }) => {
    const doctor = getMockDoctorById(input.doctorId);
    if (!doctor) throw new TRPCError({ code: "NOT_FOUND", message: "Selected development directory doctor was not found." });
    if (input.scheduledAt.getTime() <= Date.now()) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Appointment time must be in the future." });
    }
    const id = await createPatientAppointment(ctx.user.id, doctor.id, input.scheduledAt);
    await createPatientEvent(ctx.user.id, "APPOINTMENT_UPDATED", String(id));
    return { id, status: "Requested" as const };
  }),
  cancel: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const cancelled = await cancelOwnedPatientAppointment(ctx.user.id, input.id);
    if (!cancelled) throw new TRPCError({ code: "NOT_FOUND", message: "Appointment record not found." });
    await createPatientEvent(ctx.user.id, "APPOINTMENT_UPDATED", String(input.id));
    return { success: true } as const;
  }),
});

export const patientPrescriptionRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const prescriptions = await listPatientPrescriptions(ctx.user.id);
    return prescriptions.map((prescription) => ({
      ...prescription,
      doctor: getMockDoctorById(prescription.doctorId),
    }));
  }),
});

const discoveryInput = z.object({
  city: z.literal("Mumbai").optional(),
  specialty: z.string().trim().min(1).max(160).optional(),
  railLine: z.enum(["Central", "Harbour", "Western"]).optional(),
  locality: z.string().trim().min(1).max(160).optional(),
  query: z.string().trim().min(1).max(160).optional(),
}).optional();

export const patientDiscoveryRouter = router({
  facets: protectedProcedure.query(() => getMockDoctorDirectoryFacets()),
  list: protectedProcedure.input(discoveryInput).query(({ input }) => filterMockDoctorDirectory(input)),
});
