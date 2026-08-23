import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets } from "./mockDoctorDirectory";
import { getMumbaiRailStation } from "@shared/mumbaiRailNetwork";

describe("controlled Mumbai development doctor directory", () => {
  it("filters the repository-owned directory by Mumbai rail corridor and specialty", () => {
    expect(filterMockDoctorDirectory({ city: "Mumbai", railLine: "Central" })).toHaveLength(1);
    expect(filterMockDoctorDirectory({ station: "Dadar", railLine: "Western" })).toMatchObject([{ station: "Dadar", railLines: ["Central", "Western"] }]);
    expect(filterMockDoctorDirectory({ city: "Mumbai", specialty: "Dermatology" })).toMatchObject([
      { locality: "Chembur", railLine: "Harbour", isMock: true },
    ]);
  });

  it("publishes only the approved discovery facets", () => {
    expect(getMockDoctorDirectoryFacets()).toMatchObject({
      city: "Mumbai",
      specialties: ["Cardiology", "Dermatology", "General Practice"],
      localities: ["Andheri", "Chembur", "Dadar"],
      railLines: ["Central", "Harbour", "Western"],
    });
    expect(getMumbaiRailStation("Dadar")?.lines).toEqual(["Western", "Central"]);
    expect(getMumbaiRailStation("Wadala Road")?.lines).toEqual(["Harbour"]);
    expect(getMockDoctorDirectoryFacets().stations).toContainEqual(expect.objectContaining({ name: "Wadala Road", lines: ["Harbour"] }));
  });
});
