import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listDoctorAppointments: vi.fn(),
  updateDoctorAppointmentStatus: vi.fn(),
  createPatientEvent: vi.fn(),
}));

vi.mock("../db", () => ({
  listDoctorAppointments: mocks.listDoctorAppointments,
  updateDoctorAppointmentStatus: mocks.updateDoctorAppointmentStatus,
  createPatientEvent: mocks.createPatientEvent,
}));

import { doctorWorkspaceRouter } from "./doctor";

const DOCTOR_OPEN_ID = "synthetic-doctor:mock-central-cardiology-dadar";

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
  });

  it("uses the signed synthetic doctor identity instead of a browser-supplied doctor identifier", async () => {
    mocks.listDoctorAppointments.mockResolvedValue([
      { id: 22, scheduledAt: new Date("2026-08-25T10:00:00Z"), status: "Requested", createdAt: new Date(), patientId: 9, patientName: "Patient record" },
    ]);

    const patients = await doctorWorkspaceRouter.createCaller(context("doctor")).patients();

    expect(mocks.listDoctorAppointments).toHaveBeenCalledWith("mock-central-cardiology-dadar");
    expect(patients).toEqual([{ id: 9, name: "Patient record" }]);
  });

  it("rejects a patient session before any doctor data helper is called", async () => {
    await expect(doctorWorkspaceRouter.createCaller(context("user")).patients()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mocks.listDoctorAppointments).not.toHaveBeenCalled();
  });

  it("notifies only the affected patient after an authorized appointment decision", async () => {
    mocks.updateDoctorAppointmentStatus.mockResolvedValue({ userId: 9 });

    await expect(doctorWorkspaceRouter.createCaller(context("doctor")).appointments.updateStatus({ id: 22, status: "Confirmed" })).resolves.toEqual({ success: true });

    expect(mocks.updateDoctorAppointmentStatus).toHaveBeenCalledWith("mock-central-cardiology-dadar", 22, "Confirmed");
    expect(mocks.createPatientEvent).toHaveBeenCalledWith(9, "APPOINTMENT_UPDATED", "22");
  });
});
