import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets, mockDoctorDirectory } from "./mockDoctorDirectory";
import { getMumbaiRailStation } from "@shared/mumbaiRailNetwork";

describe("controlled Mumbai development doctor directory", () => {
  it("filters the repository-owned directory by Mumbai rail corridor and specialty", () => {
    expect(filterMockDoctorDirectory({ city: "Mumbai", railLine: "Central" })).toHaveLength(4);
    expect(filterMockDoctorDirectory({ station: "Dadar", railLine: "Western" })).toMatchObject([{ station: "Dadar", railLines: ["Central", "Western"] }]);
    expect(filterMockDoctorDirectory({ city: "Mumbai", specialty: "Dermatology" })).toMatchObject([
      { locality: "Chembur", railLine: "Harbour", isMock: true },
    ]);
  });

  it("publishes only the approved discovery facets", () => {
    expect(getMockDoctorDirectoryFacets()).toMatchObject({
      city: "Mumbai",
      specialties: expect.arrayContaining(["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "General Practice", "Gynecology", "Neurology", "Ophthalmology", "Orthopedics", "Pediatrics", "Psychiatry", "Pulmonology"]),
      localities: expect.arrayContaining(["Andheri", "Bandra", "Borivali", "Chembur", "Dadar", "Ghatkopar", "Kalyan", "Lower Parel", "Mulund", "Nerul", "Panvel", "Vashi"]),
      railLines: ["Central", "Harbour", "Western"],
    });
    expect(getMumbaiRailStation("Dadar")?.lines).toEqual(["Western", "Central"]);
    expect(getMumbaiRailStation("Wadala Road")?.lines).toEqual(["Harbour"]);
    expect(getMockDoctorDirectoryFacets().stations).toContainEqual(expect.objectContaining({ name: "Wadala Road", lines: ["Harbour"] }));
  });

  it("keeps every expanded entry explicitly mocked and linked to one of the supplied rail-station associations", () => {
    expect(mockDoctorDirectory).toHaveLength(12);
    mockDoctorDirectory.forEach((entry) => {
      expect(entry.isMock).toBe(true);
      expect(getMumbaiRailStation(entry.station)?.lines).toEqual(expect.arrayContaining(entry.railLines));
    });
  });

  it("restricts free-text directory search to specialty names", () => {
    expect(filterMockDoctorDirectory({ query: "pediat" })).toMatchObject([{ specialty: "Pediatrics", locality: "Bandra" }]);
    expect(filterMockDoctorDirectory({ query: "bandra" })).toEqual([]);
    expect(filterMockDoctorDirectory({ query: "western" })).toEqual([]);
  });
});
