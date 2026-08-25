import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createSyntheticDoctorCredential: vi.fn(),
  getSyntheticDoctorCredentialByEmail: vi.fn(),
  hashPatientPassword: vi.fn(),
  verifyPatientPassword: vi.fn(),
  createSessionToken: vi.fn(),
}));

vi.mock("./db", () => ({
  createSyntheticDoctorCredential: mocks.createSyntheticDoctorCredential,
  getSyntheticDoctorCredentialByEmail: mocks.getSyntheticDoctorCredentialByEmail,
}));
vi.mock("./nativePatientAuth", () => ({
  hashPatientPassword: mocks.hashPatientPassword,
  verifyPatientPassword: mocks.verifyPatientPassword,
}));
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken: mocks.createSessionToken } }));

import { doctorAuthRouter } from "./doctorAuth";

function context() {
  const cookie = vi.fn();
  return {
    ctx: { user: null, req: { protocol: "https", headers: {} }, res: { cookie } } as any,
    cookie,
  };
}

describe("synthetic doctor credentials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.hashPatientPassword.mockResolvedValue("hashed-separate-password");
    mocks.createSessionToken.mockResolvedValue("signed-demo-doctor-session");
  });

  it("provisions one controlled doctor with the configured server-only provisioning code without returning it", async () => {
    const provisioningCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    expect(provisioningCode?.length ?? 0).toBeGreaterThanOrEqual(16);
    mocks.createSyntheticDoctorCredential.mockResolvedValue({
      user: { id: 73, openId: "synthetic-doctor:mock-central-cardiology-dadar", role: "doctor" },
      doctorId: "mock-central-cardiology-dadar",
      email: "cardiology-demo@lifelink.example",
    });

    const result = await doctorAuthRouter.createCaller(context().ctx).provision({
      doctorId: "mock-central-cardiology-dadar",
      email: "cardiology-demo@lifelink.example",
      password: "SeparateDemoPass1!",
      provisioningCode: provisioningCode!,
    });

    expect(result).toMatchObject({ doctorId: "mock-central-cardiology-dadar" });
    expect(JSON.stringify(result)).not.toContain(provisioningCode!);
    expect(mocks.createSyntheticDoctorCredential).toHaveBeenCalledWith(expect.objectContaining({ email: "cardiology-demo@lifelink.example", passwordHash: "hashed-separate-password" }));
  });

  it("creates a session only for a doctor matching the supplied email and password", async () => {
    mocks.getSyntheticDoctorCredentialByEmail.mockResolvedValue({
      user: { id: 73, openId: "synthetic-doctor:mock-western-general-practice-dadar", role: "doctor" },
      credential: { doctorId: "mock-western-general-practice-dadar", passwordHash: "stored-hash" },
    });
    mocks.verifyPatientPassword.mockResolvedValue(true);
    const { ctx, cookie } = context();

    const result = await doctorAuthRouter.createCaller(ctx).login({ email: "general-demo@lifelink.example", password: "SeparateDemoPass1!" });

    expect(result).toMatchObject({ id: "mock-western-general-practice-dadar", isSynthetic: true });
    expect(cookie).toHaveBeenCalledWith(expect.any(String), "signed-demo-doctor-session", expect.any(Object));
  });
});
