import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patient-facing health assessment records. These records are scoped to the
 * signed-in account and only the minimum data used by the assessment flow is kept.
 */
export const patientAssessments = mysqlTable("patientAssessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symptoms: text("symptoms").notNull(),
  age: int("age").notNull(),
  gender: varchar("gender", { length: 32 }).notNull(),
  conditions: text("conditions"),
  duration: varchar("duration", { length: 64 }).notNull(),
  urgency: mysqlEnum("urgency", ["LOW", "MODERATE", "EMERGENCY"]).notNull(),
  reason: text("reason").notNull(),
  specialty: varchar("specialty", { length: 160 }).notNull(),
  guidance: text("guidance").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PatientAssessment = typeof patientAssessments.$inferSelect;
export type InsertPatientAssessment = typeof patientAssessments.$inferInsert;
