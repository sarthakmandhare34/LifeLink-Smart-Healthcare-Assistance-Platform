/**
 * Development-only directory. These are explicit mock listings generated from
 * owner-supplied station entities; they are not practitioner credentials, real
 * availability, ratings, reviews, or medical recommendations.
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

const DEVELOPMENT_SPECIALTY_PAIRS: readonly (readonly [string, string])[] = [
  ["General Practice", "Cardiology"],
  ["Pediatrics", "Dermatology"],
  ["Orthopedics", "Ophthalmology"],
  ["Psychiatry", "Endocrinology"],
  ["Pulmonology", "Gastroenterology"],
  ["Neurology", "Gynecology"],
];

/**
 * Creates exactly two clearly marked mock listings for every owner-supplied
 * station entity. Coordinates are station reference points, never user or
 * clinician locations. The shared station entity remains a single record with
 * every line association preserved on both generated listings.
 */
export const mockDoctorDirectory: MockDoctorDirectoryEntry[] = MUMBAI_RAIL_STATIONS.flatMap((station, stationIndex) => {
  const coordinate = MUMBAI_STATION_COORDINATES[station.name];
  if (!coordinate) throw new Error(`Missing controlled map coordinate for ${station.name}`);

  const specialties = DEVELOPMENT_SPECIALTY_PAIRS[stationIndex % DEVELOPMENT_SPECIALTY_PAIRS.length];
  return specialties.map((specialty, specialtyIndex) => ({
    id: `mock-${station.id}-${specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `Mock ${specialty} Specialist — ${station.name}`,
    specialty,
    hospital: "LifeLink development directory",
    locality: station.name,
    city: "Mumbai" as const,
    railLine: station.lines[0],
    railLines: station.lines,
    station: station.name,
    latitude: coordinate.latitude + specialtyIndex * 0.00008,
    longitude: coordinate.longitude + specialtyIndex * 0.00008,
    isMock: true as const,
  }));
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
