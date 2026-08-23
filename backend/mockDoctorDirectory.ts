/**
 * Development-only doctor directory. These entries are intentionally mock data;
 * they are not practitioner credentials, real availability, ratings, or reviews.
 */
import { MUMBAI_RAIL_LINES, MUMBAI_RAIL_STATIONS, type MumbaiRailLine } from "@shared/mumbaiRailNetwork";

export type MockDoctorDirectoryEntry = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  locality: string;
  city: "Mumbai";
  /** The primary corridor shown on the card. `railLines` preserves shared-station associations. */
  railLine: MumbaiRailLine;
  railLines: readonly MumbaiRailLine[];
  station: string;
  latitude: number;
  longitude: number;
  isMock: true;
};

export type MockDoctorDirectoryFilters = {
  city?: "Mumbai";
  specialty?: string;
  railLine?: MumbaiRailLine;
  station?: string;
  locality?: string;
  query?: string;
};

export const mockDoctorDirectory: MockDoctorDirectoryEntry[] = [
  {
    id: "mock-mumbai-central-cardiology",
    name: "Mock Cardiology Specialist",
    specialty: "Cardiology",
    hospital: "LifeLink development directory",
    locality: "Dadar",
    city: "Mumbai",
    railLine: "Central",
    railLines: ["Central", "Western"],
    station: "Dadar",
    latitude: 19.0186,
    longitude: 72.8446,
    isMock: true,
  },
  {
    id: "mock-mumbai-western-general-practice",
    name: "Mock General Practice Specialist",
    specialty: "General Practice",
    hospital: "LifeLink development directory",
    locality: "Andheri",
    city: "Mumbai",
    railLine: "Western",
    railLines: ["Western", "Harbour"],
    station: "Andheri",
    latitude: 19.1197,
    longitude: 72.8464,
    isMock: true,
  },
  {
    id: "mock-mumbai-harbour-dermatology",
    name: "Mock Dermatology Specialist",
    specialty: "Dermatology",
    hospital: "LifeLink development directory",
    locality: "Chembur",
    city: "Mumbai",
    railLine: "Harbour",
    railLines: ["Harbour"],
    station: "Chembur",
    latitude: 19.0522,
    longitude: 72.9005,
    isMock: true,
  },
];

function normalized(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

/** Filters only the controlled development directory; no external provider data is queried. */
export function filterMockDoctorDirectory(filters: MockDoctorDirectoryFilters = {}) {
  const specialty = normalized(filters.specialty);
  const locality = normalized(filters.locality);
  const station = normalized(filters.station);
  const query = normalized(filters.query);

  return mockDoctorDirectory.filter((doctor) => {
    if (filters.city && doctor.city !== filters.city) return false;
    if (filters.railLine && !doctor.railLines.includes(filters.railLine)) return false;
    if (station && doctor.station.toLowerCase() !== station) return false;
    if (specialty && doctor.specialty.toLowerCase() !== specialty) return false;
    if (locality && doctor.locality.toLowerCase() !== locality) return false;
    if (query && ![doctor.name, doctor.specialty, doctor.hospital, doctor.locality, doctor.station, ...doctor.railLines].some((field) => field.toLowerCase().includes(query))) return false;
    return true;
  });
}

export function getMockDoctorDirectoryFacets() {
  return {
    city: "Mumbai" as const,
    specialties: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.specialty))).sort(),
    localities: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.locality))).sort(),
    railLines: MUMBAI_RAIL_LINES,
    stations: MUMBAI_RAIL_STATIONS,
  };
}

export function getMockDoctorById(id: string) {
  return mockDoctorDirectory.find((doctor) => doctor.id === id) ?? null;
}
