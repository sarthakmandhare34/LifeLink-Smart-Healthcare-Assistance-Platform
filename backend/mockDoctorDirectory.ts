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
  {
    id: "mock-mumbai-western-pediatrics",
    name: "Mock Pediatrics Specialist",
    specialty: "Pediatrics",
    hospital: "LifeLink development directory",
    locality: "Bandra",
    city: "Mumbai",
    railLine: "Western",
    railLines: ["Western", "Harbour"],
    station: "Bandra",
    latitude: 19.0596,
    longitude: 72.8295,
    isMock: true,
  },
  {
    id: "mock-mumbai-central-orthopedics",
    name: "Mock Orthopedics Specialist",
    specialty: "Orthopedics",
    hospital: "LifeLink development directory",
    locality: "Mulund",
    city: "Mumbai",
    railLine: "Central",
    railLines: ["Central"],
    station: "Mulund",
    latitude: 19.1726,
    longitude: 72.9565,
    isMock: true,
  },
  {
    id: "mock-mumbai-harbour-psychiatry",
    name: "Mock Psychiatry Specialist",
    specialty: "Psychiatry",
    hospital: "LifeLink development directory",
    locality: "Vashi",
    city: "Mumbai",
    railLine: "Harbour",
    railLines: ["Harbour"],
    station: "Vashi",
    latitude: 19.0771,
    longitude: 72.9986,
    isMock: true,
  },
  {
    id: "mock-mumbai-western-ophthalmology",
    name: "Mock Ophthalmology Specialist",
    specialty: "Ophthalmology",
    hospital: "LifeLink development directory",
    locality: "Borivali",
    city: "Mumbai",
    railLine: "Western",
    railLines: ["Western"],
    station: "Borivali",
    latitude: 19.2307,
    longitude: 72.8567,
    isMock: true,
  },
  {
    id: "mock-mumbai-central-endocrinology",
    name: "Mock Endocrinology Specialist",
    specialty: "Endocrinology",
    hospital: "LifeLink development directory",
    locality: "Kalyan",
    city: "Mumbai",
    railLine: "Central",
    railLines: ["Central"],
    station: "Kalyan Junction",
    latitude: 19.2437,
    longitude: 73.1305,
    isMock: true,
  },
  {
    id: "mock-mumbai-harbour-pulmonology",
    name: "Mock Pulmonology Specialist",
    specialty: "Pulmonology",
    hospital: "LifeLink development directory",
    locality: "Panvel",
    city: "Mumbai",
    railLine: "Harbour",
    railLines: ["Harbour"],
    station: "Panvel",
    latitude: 18.9894,
    longitude: 73.1175,
    isMock: true,
  },
  {
    id: "mock-mumbai-western-gastroenterology",
    name: "Mock Gastroenterology Specialist",
    specialty: "Gastroenterology",
    hospital: "LifeLink development directory",
    locality: "Lower Parel",
    city: "Mumbai",
    railLine: "Western",
    railLines: ["Western"],
    station: "Lower Parel",
    latitude: 18.9981,
    longitude: 72.8303,
    isMock: true,
  },
  {
    id: "mock-mumbai-central-neurology",
    name: "Mock Neurology Specialist",
    specialty: "Neurology",
    hospital: "LifeLink development directory",
    locality: "Ghatkopar",
    city: "Mumbai",
    railLine: "Central",
    railLines: ["Central"],
    station: "Ghatkopar",
    latitude: 19.0863,
    longitude: 72.9081,
    isMock: true,
  },
  {
    id: "mock-mumbai-harbour-gynecology",
    name: "Mock Gynecology Specialist",
    specialty: "Gynecology",
    hospital: "LifeLink development directory",
    locality: "Nerul",
    city: "Mumbai",
    railLine: "Harbour",
    railLines: ["Harbour"],
    station: "Nerul",
    latitude: 19.033,
    longitude: 73.0187,
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
    if (query && !doctor.specialty.toLowerCase().includes(query)) return false;
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
