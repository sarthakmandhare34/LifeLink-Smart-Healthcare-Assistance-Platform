import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets, mockDoctorDirectory } from "./mockDoctorDirectory";
import { MUMBAI_RAIL_LINES, MUMBAI_RAIL_STATIONS, getMumbaiRailStation } from "@shared/mumbaiRailNetwork";
import { MUMBAI_STATION_COORDINATES } from "@shared/mumbaiStationCoordinates";

describe("controlled Mumbai development doctor directory", () => {
  it("creates exactly two mock listings for every owner-supplied station entity", () => {
    expect(mockDoctorDirectory).toHaveLength(MUMBAI_RAIL_STATIONS.length * 2);
    MUMBAI_RAIL_STATIONS.forEach((station) => {
      const entries = filterMockDoctorDirectory({ station: station.name });
      expect(entries).toHaveLength(2);
      entries.forEach((entry) => {
        expect(entry.isMock).toBe(true);
        expect(entry.railLines).toEqual(station.lines);
        expect(entry.latitude).toBeCloseTo(MUMBAI_STATION_COORDINATES[station.name].latitude, 3);
        expect(entry.longitude).toBeCloseTo(MUMBAI_STATION_COORDINATES[station.name].longitude, 3);
      });
    });
  });

  it("preserves supplied shared-station associations and filters both mock listings by line", () => {
    expect(filterMockDoctorDirectory({ station: "Dadar", railLine: "Western" })).toHaveLength(2);
    expect(filterMockDoctorDirectory({ station: "Dadar", railLine: "Central" })).toHaveLength(2);
    expect(getMumbaiRailStation("Dadar")?.lines).toEqual(["Western", "Central"]);
    expect(getMumbaiRailStation("Wadala Road")?.lines).toEqual(["Harbour"]);
  });

  it("provides at least three controlled specialty categories for every rail corridor", () => {
    MUMBAI_RAIL_LINES.forEach((railLine) => {
      const specialties = new Set(filterMockDoctorDirectory({ railLine }).map((entry) => entry.specialty));
      expect(specialties.size).toBeGreaterThanOrEqual(3);
    });
  });

  it("publishes only approved controlled facets and specialty-only free-text matching", () => {
    expect(getMockDoctorDirectoryFacets()).toMatchObject({
      city: "Mumbai",
      specialties: expect.arrayContaining(["Cardiology", "Dermatology", "General Practice", "Pediatrics"]),
      railLines: ["Central", "Harbour", "Western"],
    });
    expect(filterMockDoctorDirectory({ query: "cardio" })).toSatisfy((entries) => entries.length > 0 && entries.every((entry) => entry.specialty === "Cardiology"));
    expect(filterMockDoctorDirectory({ query: "western" })).toEqual([]);
  });
});
