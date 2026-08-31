import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listDoctorAppointments: vi.fn(),
  updateDoctorAppointmentStatus: vi.fn(),
  createPatientEvent: vi.fn(),
  getDoctorAuthorizedPatientDetail: vi.fn(),
  createDoctorAuthorizedPrescription: vi.fn(),
}));

vi.mock("../db", () => ({
  listDoctorAppointments: mocks.listDoctorAppointments,
  updateDoctorAppointmentStatus: mocks.updateDoctorAppointmentStatus,
  createPatientEvent: mocks.createPatientEvent,
  getDoctorAuthorizedPatientDetail: mocks.getDoctorAuthorizedPatientDetail,
  createDoctorAuthorizedPrescription: mocks.createDoctorAuthorizedPrescription,
}));

import { doctorWorkspaceRouter } from "./doctor";

const DOCTOR_OPEN_ID = "synthetic-doctor:mock-central-cardiology-csmt";

function context(role: "doctor" | "user") {
  return {
    user: {
      id: role === "doctor" ? 73 : 12,
      openId: role === "doctor" ? DOCTOR_OPEN_ID : "native:patient",
      role,
      name: "Test user",
      email: null,
      loginMethod: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {},
    res: {},
  } as any;
}

describe("doctor workspace authorization", () => {
  beforeEach(() => {
    mocks.listDoctorAppointments.mockReset();
    mocks.updateDoctorAppointmentStatus.mockReset();
    mocks.createPatientEvent.mockReset();
    mocks.getDoctorAuthorizedPatientDetail.mockReset();
    mocks.createDoctorAuthorizedPrescription.mockReset();
  });

  it("uses the signed synthetic doctor identity instead of a browser-supplied doctor identifier", async () => {
    mocks.listDoctorAppointments.mockResolvedValue([
      { id: 22, scheduledAt: new Date("2026-08-25T10:00:00Z"), status: "Requested", createdAt: new Date(), patientId: 9, patientName: "Patient record" },
    ]);

    const patients = await doctorWorkspaceRouter.createCaller(context("doctor")).patients();

    expect(mocks.listDoctorAppointments).toHaveBeenCalledWith("mock-central-cardiology-csmt");
    expect(patients).toEqual([{ id: 9, name: "Patient record" }]);
  });

  it("keeps a second signed synthetic doctor on a separate appointment channel", async () => {
    mocks.listDoctorAppointments.mockResolvedValue([]);
    const secondDoctor = context("doctor");
    secondDoctor.user.openId = "synthetic-doctor:mock-western-general-practice-churchgate";

    await doctorWorkspaceRouter.createCaller(secondDoctor).appointments.list();

    expect(mocks.listDoctorAppointments).toHaveBeenCalledWith("mock-western-general-practice-churchgate");
    expect(mocks.listDoctorAppointments).not.toHaveBeenCalledWith("mock-central-cardiology-csmt");
  });

  it("exposes a patient-provided booking reason only on the signed doctor’s assigned appointment list", async () => {
    mocks.listDoctorAppointments.mockResolvedValue([{ id: 23, scheduledAt: new Date("2026-08-25T10:00:00Z"), status: "Requested", reason: "Review submitted symptom assessment", createdAt: new Date(), patientId: 9, patientName: "Patient record" }]);

    const appointments = await doctorWorkspaceRouter.createCaller(context("doctor")).appointments.list();

    expect(appointments[0]).toMatchObject({ reason: "Review submitted symptom assessment", patient: { id: 9 } });
  });

  it("rejects a patient session before any doctor data helper is called", async () => {
    await expect(doctorWorkspaceRouter.createCaller(context("user")).patients()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mocks.listDoctorAppointments).not.toHaveBeenCalled();
  });

  it("notifies only the affected patient after an authorized appointment decision", async () => {
    mocks.updateDoctorAppointmentStatus.mockResolvedValue({ userId: 9 });

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).appointments.updateStatus({ id: 22, status: "Confirmed" })).resolves.toEqual({ success: true });

    expect(mocks.updateDoctorAppointmentStatus).toHaveBeenCalledWith("mock-central-cardiology-csmt", 22, "Confirmed");
    expect(mocks.createPatientEvent).toHaveBeenCalledWith(9, "APPOINTMENT_UPDATED", "22");
  });

  it("allows a confirmed appointment to be marked completed through the signed clinician workspace", async () => {
    mocks.updateDoctorAppointmentStatus.mockResolvedValue({ userId: 9, status: "Completed" });

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).appointments.updateStatus({ id: 22, status: "Completed" })).resolves.toEqual({ success: true });

    expect(mocks.updateDoctorAppointmentStatus).toHaveBeenCalledWith("mock-central-cardiology-csmt", 22, "Completed");
    expect(mocks.createPatientEvent).toHaveBeenCalledWith(9, "APPOINTMENT_UPDATED", "22");
  });

  it("returns the minimum patient detail only through the signed doctor’s assigned appointment relationship", async () => {
    mocks.getDoctorAuthorizedPatientDetail.mockResolvedValue({ patient: { id: 9, name: "Patient record", bloodGroup: "Not recorded", allergies: [], conditions: [] }, appointments: [], medicines: [], assessments: [{ id: 3, symptoms: "Persistent cough", duration: "3 days", urgency: "MODERATE", reason: "Patient-provided context", specialty: "Pulmonology", guidance: "Seek review", createdAt: new Date() }] });

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).patientDetail({ patientId: 9 })).resolves.toMatchObject({ patient: { id: 9 } });
    expect(mocks.getDoctorAuthorizedPatientDetail).toHaveBeenCalledWith("mock-central-cardiology-csmt", 9);
  });

  it("creates an unsigned controlled-workspace prescription only through the signed clinician’s confirmed appointment relationship", async () => {
    mocks.createDoctorAuthorizedPrescription.mockResolvedValue(91);

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).prescriptions.create({ patientId: 9, clinicalNotes: "Review completed", items: [{ name: "Example medicine", dosage: "1 tablet", instructions: "Follow the documented care plan" }] })).resolves.toEqual({ id: 91, status: "UNSIGNED / CONTROLLED WORKSPACE" });

    expect(mocks.createDoctorAuthorizedPrescription).toHaveBeenCalledWith(expect.objectContaining({ doctorId: "mock-central-cardiology-csmt", patientUserId: 9 }));
    expect(mocks.createPatientEvent).toHaveBeenCalledWith(9, "PRESCRIPTION_CREATED", "91");
  });

  it("does not create a prescription when no confirmed appointment relationship is available", async () => {
    mocks.createDoctorAuthorizedPrescription.mockResolvedValue(null);

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).prescriptions.create({ patientId: 14, items: [{ name: "Example medicine", dosage: "1 tablet", instructions: "Follow the documented care plan" }] })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("does not return a patient detail record when no assignment exists", async () => {
    mocks.getDoctorAuthorizedPatientDetail.mockResolvedValue(null);
    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).patientDetail({ patientId: 14 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
