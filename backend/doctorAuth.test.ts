import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createSyntheticDoctorCredential: vi.fn(),
  getSyntheticDoctorCredentialByEmail: vi.fn(),
  getSyntheticDoctorCredentialByUserId: vi.fn(),
  listSyntheticDoctorCredentialAccounts: vi.fn(),
  updateSyntheticDoctorPasswordByEmail: vi.fn(),
  updateSyntheticDoctorPasswordByUserId: vi.fn(),
  hashPatientPassword: vi.fn(),
  verifyPatientPassword: vi.fn(),
  createSessionToken: vi.fn(),
}));

vi.mock("./db", () => ({
  createSyntheticDoctorCredential: mocks.createSyntheticDoctorCredential,
  getSyntheticDoctorCredentialByEmail: mocks.getSyntheticDoctorCredentialByEmail,
  getSyntheticDoctorCredentialByUserId: mocks.getSyntheticDoctorCredentialByUserId,
  listSyntheticDoctorCredentialAccounts: mocks.listSyntheticDoctorCredentialAccounts,
  updateSyntheticDoctorPasswordByEmail: mocks.updateSyntheticDoctorPasswordByEmail,
  updateSyntheticDoctorPasswordByUserId: mocks.updateSyntheticDoctorPasswordByUserId,
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

function doctorContext() {
  return {
    user: { id: 73, openId: "synthetic-doctor:mock-central-cardiology-dadar", role: "doctor", name: "Demo doctor", email: null, loginMethod: null, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} },
    res: { cookie: vi.fn() },
  } as any;
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

  it("provisions only unprovisioned controlled doctors and never returns the owner code", async () => {
    const provisioningCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    mocks.createSyntheticDoctorCredential.mockResolvedValueOnce({ user: { id: 73 }, doctorId: "mock-central-cardiology-dadar", email: "first@demo.lifelink.test" }).mockResolvedValue(null);

    const result = await doctorAuthRouter.createCaller(context().ctx).provisionDirectory({ provisioningCode: provisioningCode! });

    expect(result.created).toHaveLength(1);
    expect(result.skipped).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toContain(provisioningCode!);
    expect(result.created[0]?.password).toMatch(/^LL-/);
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

  it("resets a password only when the configured owner provisioning code is supplied", async () => {
    const provisioningCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    mocks.updateSyntheticDoctorPasswordByEmail.mockResolvedValue(true);

    await expect(doctorAuthRouter.createCaller(context().ctx).resetPassword({ email: "cardiology-demo@lifelink.example", password: "NewSeparatePass1!", provisioningCode: provisioningCode! })).resolves.toEqual({ success: true });
    expect(mocks.updateSyntheticDoctorPasswordByEmail).toHaveBeenCalledWith("cardiology-demo@lifelink.example", "hashed-separate-password");
  });

  it("lists provisioned clinician emails only after owner authorization and never includes password hashes", async () => {
    const provisioningCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    mocks.listSyntheticDoctorCredentialAccounts.mockResolvedValue([{ doctorId: "mock-central-cardiology-dadar", email: "cardiology@lifelink.test" }]);

    const result = await doctorAuthRouter.createCaller(context().ctx).ownerAccounts({ provisioningCode: provisioningCode! });

    expect(result).toEqual([{ doctorId: "mock-central-cardiology-dadar", displayName: expect.any(String), email: "cardiology@lifelink.test" }]);
    expect(JSON.stringify(result)).not.toContain("passwordHash");
  });

  it("replaces a clinician password only with the owner provisioning code and returns the new password once", async () => {
    const provisioningCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    mocks.updateSyntheticDoctorPasswordByEmail.mockResolvedValue(true);

    const result = await doctorAuthRouter.createCaller(context().ctx).replacePassword({ email: "cardiology@lifelink.test", provisioningCode: provisioningCode! });

    expect(result.email).toBe("cardiology@lifelink.test");
    expect(result.password).toMatch(/^LL-/);
    expect(mocks.updateSyntheticDoctorPasswordByEmail).toHaveBeenCalledWith("cardiology@lifelink.test", "hashed-separate-password");
  });

  it("changes only the signed doctor’s own password after current-password verification", async () => {
    mocks.getSyntheticDoctorCredentialByUserId.mockResolvedValue({ userId: 73, passwordHash: "stored-hash" });
    mocks.verifyPatientPassword.mockResolvedValue(true);
    mocks.updateSyntheticDoctorPasswordByUserId.mockResolvedValue(true);

    await expect(doctorAuthRouter.createCaller(doctorContext()).changePassword({ currentPassword: "SeparateDemoPass1!", newPassword: "NewSeparatePass1!" })).resolves.toEqual({ success: true });
    expect(mocks.updateSyntheticDoctorPasswordByUserId).toHaveBeenCalledWith(73, "hashed-separate-password");
  });
});
