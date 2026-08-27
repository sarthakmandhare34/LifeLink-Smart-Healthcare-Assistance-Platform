import { describe, expect, it } from "vitest";
import { storageGet } from "./localStorage";

describe("local private storage URLs", () => {
  it("returns an authenticated local route for a normalized private file key", async () => {
    await expect(storageGet("patient-profile-photos/42/avatar.png")).resolves.toEqual({
      key: "patient-profile-photos/42/avatar.png",
      url: "/api/local-storage/patient-profile-photos/42/avatar.png",
    });
  });

  it("rejects traversal segments before they can reach the local file system", async () => {
    await expect(storageGet("patient-profile-photos/42/../../.env")).rejects.toThrow(
      "Invalid local storage key.",
    );
  });
});
