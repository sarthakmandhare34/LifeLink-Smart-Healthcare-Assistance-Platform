/**
 * Development-only directory. These are explicit mock listings; they are not
 * practitioner credentials, real availability, ratings, reviews, or medical recommendations.
 */
import { MUMBAI_RAIL_LINES, MUMBAI_RAIL_STATIONS, type MumbaiRailLine } from "@shared/mumbaiRailNetwork";
import { MUMBAI_STATION_COORDINATES } from "@shared/mumbaiStationCoordinates";

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

type ControlledDirectoryDefinition = {
  id: string;
  specialty: string;
  station: string;
  railLine: MumbaiRailLine;
};

/**
 * Compact, balanced development catalog: four specialty examples per primary
 * corridor. Shared-station connectivity comes from the owner-supplied network.
 */
const CONTROLLED_DIRECTORY_DEFINITIONS: readonly ControlledDirectoryDefinition[] = [
  { id: "mock-central-cardiology-dadar", specialty: "Cardiology", station: "Dadar", railLine: "Central" },
  { id: "mock-central-dermatology-ghatkopar", specialty: "Dermatology", station: "Ghatkopar", railLine: "Central" },
  { id: "mock-central-orthopedics-byculla", specialty: "Orthopedics", station: "Byculla", railLine: "Central" },
  { id: "mock-central-neurology-kalyan", specialty: "Neurology", station: "Kalyan Junction", railLine: "Central" },
  { id: "mock-western-general-practice-churchgate", specialty: "General Practice", station: "Churchgate", railLine: "Western" },
  { id: "mock-western-pediatrics-bandra", specialty: "Pediatrics", station: "Bandra", railLine: "Western" },
  { id: "mock-western-ophthalmology-andheri", specialty: "Ophthalmology", station: "Andheri", railLine: "Western" },
  { id: "mock-western-gastroenterology-borivali", specialty: "Gastroenterology", station: "Borivali", railLine: "Western" },
  { id: "mock-harbour-psychiatry-wadala", specialty: "Psychiatry", station: "Wadala Road", railLine: "Harbour" },
  { id: "mock-harbour-endocrinology-chembur", specialty: "Endocrinology", station: "Chembur", railLine: "Harbour" },
  { id: "mock-harbour-pulmonology-vashi", specialty: "Pulmonology", station: "Vashi", railLine: "Harbour" },
  { id: "mock-harbour-gynecology-panvel", specialty: "Gynecology", station: "Panvel", railLine: "Harbour" },
];

export const mockDoctorDirectory: MockDoctorDirectoryEntry[] = CONTROLLED_DIRECTORY_DEFINITIONS.map((definition) => {
  const station = MUMBAI_RAIL_STATIONS.find((candidate) => candidate.name === definition.station);
  const coordinate = MUMBAI_STATION_COORDINATES[definition.station];
  if (!station || !coordinate) throw new Error(`Missing controlled directory reference data for ${definition.station}`);

  return {
    id: definition.id,
    name: `Mock ${definition.specialty} Specialist — ${definition.station}`,
    specialty: definition.specialty,
    hospital: "LifeLink development directory",
    locality: definition.station,
    city: "Mumbai",
    railLine: definition.railLine,
    railLines: station.lines,
    station: station.name,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    isMock: true,
  };
});

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
  const supportedStations = MUMBAI_RAIL_STATIONS.filter((station) => mockDoctorDirectory.some((doctor) => doctor.station === station.name));
  return {
    city: "Mumbai" as const,
    specialties: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.specialty))).sort(),
    localities: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.locality))).sort(),
    railLines: MUMBAI_RAIL_LINES,
    stations: supportedStations,
  };
}

export function getMockDoctorById(id: string) {
  return mockDoctorDirectory.find((doctor) => doctor.id === id) ?? null;
}
