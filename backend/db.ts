import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertPatientAssessment,
  InsertUser,
  doctorEvents,
  patientAppointments,
  patientAssessments,
  patientCredentials,
  patientEmergencyContacts,
  patientEvents,
  patientMedicines,
  patientProviderIdentities,
  patientPrescriptionItems,
  patientPrescriptions,
  patientProfiles,
  users,
} from "../database/schema";
import type { MockDoctorDirectoryEntry } from "./mockDoctorDirectory";
import { ENV } from './_core/env';
import { randomUUID } from "node:crypto";
import { publishDoctorEvent, publishPatientEvent, type DoctorEventType, type PatientEventType } from "./patientEventBus";
import { storageGet } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type ExternalAuthProvider = "google";

export class ProviderAccountConflictError extends Error {
  constructor() {
    super("An account with this verified email already exists. Sign in with your existing method before linking a new provider.");
    this.name = "ProviderAccountConflictError";
  }
}

export class ProviderRegistrationRequiredError extends Error {
  constructor() {
    super("No LifeLink account is linked to this Google account. Please register first.");
    this.name = "ProviderRegistrationRequiredError";
  }
}

function normalizeProviderEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getUserByProviderIdentity(provider: ExternalAuthProvider, subject: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db
    .select({ user: users })
    .from(patientProviderIdentities)
    .innerJoin(users, eq(patientProviderIdentities.userId, users.id))
    .where(and(eq(patientProviderIdentities.provider, provider), eq(patientProviderIdentities.subject, subject)))
    .limit(1);
  return rows[0]?.user ?? null;
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(users).where(eq(users.email, normalizeProviderEmail(email))).limit(1);
  return rows[0] ?? null;
}

export async function resolveProviderPatient(input: {
  provider: ExternalAuthProvider;
  subject: string;
  email: string;
  name: string | null;
}, options: { allowNewProviderAccount: boolean }) {
  const existingIdentityUser = await getUserByProviderIdentity(input.provider, input.subject);
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (existingIdentityUser) {
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, existingIdentityUser.id));
    return existingIdentityUser;
  }

  const email = normalizeProviderEmail(input.email);
  if (await findUserByEmail(email)) throw new ProviderAccountConflictError();
  if (!options.allowNewProviderAccount) throw new ProviderRegistrationRequiredError();
  const openId = `provider:${randomUUID()}`;
  await db.insert(users).values({
    openId,
    name: input.name,
    email,
    loginMethod: `${input.provider}-oauth`,
    role: "user",
    lastSignedIn: new Date(),
  });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Provider patient account could not be created");
  await db.insert(patientProviderIdentities).values({ userId: user.id, provider: input.provider, subject: input.subject, email });
  await db.insert(patientProfiles).values({ userId: user.id, allergiesJson: "[]", conditionsJson: "[]" });
  return user;
}

export async function createPatientAssessment(assessment: InsertPatientAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const result = await db.insert(patientAssessments).values(assessment);
  return Number(result[0].insertId);
}

export async function getPatientAssessments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(patientAssessments)
    .where(eq(patientAssessments.userId, userId))
    .orderBy(desc(patientAssessments.createdAt));
}

export async function createNativePatient(input: { name: string; email: string; passwordHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const existing = await getNativePatientByEmail(input.email);
  if (existing) return null;

  const openId = `native:${randomUUID()}`;
  await db.insert(users).values({
    openId,
    name: input.name,
    email: input.email,
    loginMethod: "native-patient",
    role: "user",
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Patient account could not be created");

  await db.insert(patientCredentials).values({
    userId: user.id,
    email: input.email,
    passwordHash: input.passwordHash,
  });
  await db.insert(patientProfiles).values({
    userId: user.id,
    allergiesJson: "[]",
    conditionsJson: "[]",
  });
  return user;
}

export async function getNativePatientByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const rows = await db
    .select({ user: users, credential: patientCredentials })
    .from(patientCredentials)
    .innerJoin(users, eq(patientCredentials.userId, users.id))
    .where(eq(patientCredentials.email, email))
    .limit(1);
  return rows[0] ?? null;
}

/** Ensures the signed synthetic workstation identity is a real, stable backend user. */
export async function findOrCreateSyntheticDoctorUser(doctor: MockDoctorDirectoryEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const openId = `synthetic-doctor:${doctor.id}`;
  const existing = await getUserByOpenId(openId);
  if (existing) {
    if (existing.role !== "doctor") {
      await db.update(users).set({ role: "doctor", lastSignedIn: new Date() }).where(eq(users.id, existing.id));
    }
    return { ...existing, role: "doctor" as const };
  }

  await db.insert(users).values({
    openId,
    name: `Demo ${doctor.specialty} Specialist — ${doctor.station}`,
    email: null,
    loginMethod: "synthetic-demo-doctor",
    role: "doctor",
    lastSignedIn: new Date(),
  });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Synthetic doctor user could not be created");
  return user;
}

function parseList(value: string | null | undefined) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [] as string[];
  }
}

export async function getPatientProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const rows = await db
    .select({ user: users, profile: patientProfiles })
    .from(users)
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const contacts = await db
    .select()
    .from(patientEmergencyContacts)
    .where(eq(patientEmergencyContacts.userId, userId))
    .orderBy(desc(patientEmergencyContacts.createdAt));

  const avatar = row.profile?.avatarKey ? await storageGet(row.profile.avatarKey) : null;

  return {
    id: row.user.id,
    name: row.user.name ?? "",
    email: row.user.email ?? "",
    bloodGroup: row.profile?.bloodGroup ?? "",
    phone: row.profile?.phone ?? "",
    avatarUrl: avatar?.url ?? null,
    allergies: parseList(row.profile?.allergiesJson),
    conditions: parseList(row.profile?.conditionsJson),
    emergencyContacts: contacts.map((contact) => ({
      id: String(contact.id),
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    })),
  };
}

export async function updatePatientProfile(
  userId: number,
  input: { name?: string; bloodGroup?: string; phone?: string; allergies?: string[]; conditions?: string[] }
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  if (input.name !== undefined) {
    await db.update(users).set({ name: input.name }).where(eq(users.id, userId));
  }

  const values: Record<string, string | null> = {};
  if (input.bloodGroup !== undefined) values.bloodGroup = input.bloodGroup || null;
  if (input.phone !== undefined) values.phone = input.phone || null;
  if (input.allergies !== undefined) values.allergiesJson = JSON.stringify(input.allergies);
  if (input.conditions !== undefined) values.conditionsJson = JSON.stringify(input.conditions);
  if (Object.keys(values).length > 0) {
    await db.update(patientProfiles).set(values).where(eq(patientProfiles.userId, userId));
  }

  return getPatientProfile(userId);
}

export async function updatePatientAvatarKey(userId: number, avatarKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(patientProfiles).set({ avatarKey }).where(eq(patientProfiles.userId, userId));
  return getPatientProfile(userId);
}

export type PatientEmergencyContactInput = {
  name: string;
  relationship: string;
  phone: string;
};

export async function createPatientEmergencyContact(userId: number, input: PatientEmergencyContactInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(patientEmergencyContacts).values({ userId, ...input });
  return Number(result[0].insertId);
}

export async function updateOwnedPatientEmergencyContact(
  userId: number,
  contactId: number,
  input: PatientEmergencyContactInput
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db
    .update(patientEmergencyContacts)
    .set(input)
    .where(and(eq(patientEmergencyContacts.id, contactId), eq(patientEmergencyContacts.userId, userId)));
  return Number(result[0].affectedRows) > 0;
}

export async function getPatientDashboard(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [profile, assessments, medicines, appointments, prescriptions] = await Promise.all([
    getPatientProfile(userId),
    db.select().from(patientAssessments).where(eq(patientAssessments.userId, userId)).orderBy(desc(patientAssessments.createdAt)).limit(1),
    db.select().from(patientMedicines).where(eq(patientMedicines.userId, userId)).orderBy(desc(patientMedicines.updatedAt)),
    db.select().from(patientAppointments).where(eq(patientAppointments.userId, userId)).orderBy(desc(patientAppointments.scheduledAt)),
    db.select().from(patientPrescriptions).where(eq(patientPrescriptions.userId, userId)).orderBy(desc(patientPrescriptions.issuedAt)),
  ]);

  return {
    profile,
    latestAssessment: assessments[0] ?? null,
    medicines,
    appointments,
    prescriptions,
  };
}

export async function createPatientEvent(
  userId: number,
  type: PatientEventType,
  entityId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(patientEvents).values({ userId, type, entityId: entityId ?? null });
  const event = {
    id: Number(result[0].insertId),
    userId,
    type,
    entityId: entityId ?? null,
    createdAt: new Date(),
  };
  publishPatientEvent(event);
  return event;
}

export async function getPatientEventsSince(userId: number, lastEventId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const where = lastEventId
    ? and(eq(patientEvents.userId, userId), gt(patientEvents.id, lastEventId))
    : eq(patientEvents.userId, userId);
  return db.select().from(patientEvents).where(where).orderBy(patientEvents.id);
}

export async function createDoctorEvent(
  doctorId: string,
  patientUserId: number,
  type: DoctorEventType,
  entityId?: string,
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(doctorEvents).values({ doctorId, patientUserId, type, entityId: entityId ?? null });
  const event = {
    id: Number(result[0].insertId),
    doctorId,
    patientUserId,
    type,
    entityId: entityId ?? null,
    createdAt: new Date(),
  };
  publishDoctorEvent(event);
  return event;
}

export async function getDoctorEventsSince(doctorId: string, lastEventId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const where = lastEventId
    ? and(eq(doctorEvents.doctorId, doctorId), gt(doctorEvents.id, lastEventId))
    : eq(doctorEvents.doctorId, doctorId);
  return db.select().from(doctorEvents).where(where).orderBy(doctorEvents.id);
}

export async function listPatientMedicines(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(patientMedicines).where(eq(patientMedicines.userId, userId)).orderBy(desc(patientMedicines.updatedAt));
}

export async function createPatientMedicine(
  userId: number,
  input: Omit<typeof patientMedicines.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(patientMedicines).values({ userId, ...input });
  return Number(result[0].insertId);
}

export async function updateOwnedPatientMedicine(
  userId: number,
  medicineId: number,
  input: Partial<Omit<typeof patientMedicines.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.update(patientMedicines).set(input).where(and(eq(patientMedicines.id, medicineId), eq(patientMedicines.userId, userId)));
  return Number(result[0].affectedRows) > 0;
}

export async function removeOwnedPatientMedicine(userId: number, medicineId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.delete(patientMedicines).where(and(eq(patientMedicines.id, medicineId), eq(patientMedicines.userId, userId)));
  return Number(result[0].affectedRows) > 0;
}

export async function listPatientAppointments(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(patientAppointments).where(eq(patientAppointments.userId, userId)).orderBy(desc(patientAppointments.scheduledAt));
}

export async function createPatientAppointment(userId: number, doctorId: string, scheduledAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(patientAppointments).values({ userId, doctorId, scheduledAt, status: "Requested" });
  return Number(result[0].insertId);
}

export async function cancelOwnedPatientAppointment(userId: number, appointmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db
    .update(patientAppointments)
    .set({ status: "Cancelled" })
    .where(and(eq(patientAppointments.id, appointmentId), eq(patientAppointments.userId, userId)));
  return Number(result[0].affectedRows) > 0;
}

export async function listDoctorAppointments(doctorId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db
    .select({
      id: patientAppointments.id,
      scheduledAt: patientAppointments.scheduledAt,
      status: patientAppointments.status,
      createdAt: patientAppointments.createdAt,
      patientId: users.id,
      patientName: users.name,
    })
    .from(patientAppointments)
    .innerJoin(users, eq(patientAppointments.userId, users.id))
    .where(eq(patientAppointments.doctorId, doctorId))
    .orderBy(patientAppointments.scheduledAt);
}

export async function updateDoctorAppointmentStatus(
  doctorId: string,
  appointmentId: number,
  status: "Confirmed" | "Cancelled",
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db
    .select({ userId: patientAppointments.userId, status: patientAppointments.status })
    .from(patientAppointments)
    .where(and(eq(patientAppointments.id, appointmentId), eq(patientAppointments.doctorId, doctorId)))
    .limit(1);
  const appointment = rows[0];
  if (!appointment || (appointment.status !== "Requested" && appointment.status !== "Pending")) return null;

  await db
    .update(patientAppointments)
    .set({ status })
    .where(and(eq(patientAppointments.id, appointmentId), eq(patientAppointments.doctorId, doctorId)));
  return { userId: appointment.userId };
}

export async function listPatientPrescriptions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const prescriptions = await db
    .select()
    .from(patientPrescriptions)
    .where(eq(patientPrescriptions.userId, userId))
    .orderBy(desc(patientPrescriptions.issuedAt));
  const ids = prescriptions.map((prescription) => prescription.id);
  const items = ids.length
    ? await db.select().from(patientPrescriptionItems).where(inArray(patientPrescriptionItems.prescriptionId, ids))
    : [];

  return prescriptions.map((prescription) => ({
    ...prescription,
    items: items.filter((item) => item.prescriptionId === prescription.id),
  }));
}
