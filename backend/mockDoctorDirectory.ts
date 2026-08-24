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
 * Compact development catalog clustered around connected interchange areas.
 * All 12 specialties remain represented, while card and map discovery now focus
 * on four nearby hubs rather than spreading examples across distant endpoints.
 */
const CONTROLLED_DIRECTORY_DEFINITIONS: readonly ControlledDirectoryDefinition[] = [
  { id: "mock-central-cardiology-dadar", specialty: "Cardiology", station: "Dadar", railLine: "Central" },
  { id: "mock-central-dermatology-dadar", specialty: "Dermatology", station: "Dadar", railLine: "Central" },
  { id: "mock-central-orthopedics-kurla", specialty: "Orthopedics", station: "Kurla", railLine: "Central" },
  { id: "mock-central-neurology-kurla", specialty: "Neurology", station: "Kurla", railLine: "Central" },
  { id: "mock-western-general-practice-dadar", specialty: "General Practice", station: "Dadar", railLine: "Western" },
  { id: "mock-western-pediatrics-bandra", specialty: "Pediatrics", station: "Bandra", railLine: "Western" },
  { id: "mock-western-ophthalmology-bandra", specialty: "Ophthalmology", station: "Bandra", railLine: "Western" },
  { id: "mock-western-gastroenterology-bandra", specialty: "Gastroenterology", station: "Bandra", railLine: "Western" },
  { id: "mock-harbour-psychiatry-kurla", specialty: "Psychiatry", station: "Kurla", railLine: "Harbour" },
  { id: "mock-harbour-endocrinology-bandra", specialty: "Endocrinology", station: "Bandra", railLine: "Harbour" },
  { id: "mock-harbour-pulmonology-wadala", specialty: "Pulmonology", station: "Wadala Road", railLine: "Harbour" },
  { id: "mock-harbour-gynecology-wadala", specialty: "Gynecology", station: "Wadala Road", railLine: "Harbour" },
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
