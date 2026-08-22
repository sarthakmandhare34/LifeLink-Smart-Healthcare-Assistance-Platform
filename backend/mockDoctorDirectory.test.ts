import { describe, expect, it } from "vitest";
import { filterMockDoctorDirectory, getMockDoctorDirectoryFacets } from "./mockDoctorDirectory";

describe("controlled Mumbai development doctor directory", () => {
  it("filters the repository-owned directory by Mumbai rail corridor and specialty", () => {
    expect(filterMockDoctorDirectory({ city: "Mumbai", railLine: "Central" })).toHaveLength(1);
    expect(filterMockDoctorDirectory({ city: "Mumbai", specialty: "Dermatology" })).toMatchObject([
      { locality: "Chembur", railLine: "Harbour", isMock: true },
    ]);
  });

  it("publishes only the approved discovery facets", () => {
    expect(getMockDoctorDirectoryFacets()).toEqual({
      city: "Mumbai",
      specialties: ["Cardiology", "Dermatology", "General Practice"],
      localities: ["Andheri", "Chembur", "Dadar"],
      railLines: ["Central", "Harbour", "Western"],
    });
  });
});
