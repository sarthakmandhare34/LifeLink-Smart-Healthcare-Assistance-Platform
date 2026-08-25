import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findOrCreateSyntheticDoctorUser: vi.fn(),
  createSessionToken: vi.fn(),
}));

vi.mock("./db", () => ({ findOrCreateSyntheticDoctorUser: mocks.findOrCreateSyntheticDoctorUser }));
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken: mocks.createSessionToken } }));

import { doctorAuthRouter } from "./doctorAuth";

function context() {
  const cookie = vi.fn();
  return {
    ctx: {
      user: null,
      req: { protocol: "https", headers: {} },
      res: { cookie },
    } as any,
    cookie,
  };
}

describe("synthetic doctor access endpoint", () => {
  beforeEach(() => {
    mocks.findOrCreateSyntheticDoctorUser.mockResolvedValue({
      id: 73,
      openId: "synthetic-doctor:mock-central-cardiology-dadar",
      role: "doctor",
    });
    mocks.createSessionToken.mockResolvedValue("signed-demo-doctor-session");
  });

  it("accepts the configured server-only code through the login endpoint without returning it", async () => {
    const configuredCode = process.env.LIFELINK_DEMO_DOCTOR_ACCESS_CODE;
    expect(typeof configuredCode).toBe("string");
    expect(configuredCode?.length ?? 0).toBeGreaterThanOrEqual(16);

    const { ctx, cookie } = context();
    const result = await doctorAuthRouter.createCaller(ctx).login({ accessCode: configuredCode! });

    expect(result).toMatchObject({ id: "mock-central-cardiology-dadar", isSynthetic: true });
    expect(JSON.stringify(result)).not.toContain(configuredCode!);
    expect(cookie).toHaveBeenCalledWith(expect.any(String), "signed-demo-doctor-session", expect.any(Object));
  });
});
