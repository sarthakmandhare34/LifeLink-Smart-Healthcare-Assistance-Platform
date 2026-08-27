import { expect, it } from "vitest";
import { GOOGLE_MAPS_SCRIPT_URL, MAPS_SCRIPT_CROSS_ORIGIN } from "./Map";

it("uses direct Google Maps configuration with anonymous CORS", () => {
  expect(GOOGLE_MAPS_SCRIPT_URL).toBe(
    "https://maps.googleapis.com/maps/api/js"
  );
  expect(MAPS_SCRIPT_CROSS_ORIGIN).toBe("anonymous");
});
