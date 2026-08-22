/**
 * Development-only doctor directory. These entries are intentionally mock data;
 * they are not practitioner credentials, real availability, ratings, or reviews.
 */
export type MockDoctorDirectoryEntry = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  locality: string;
  city: "Mumbai";
  railLine: "Central" | "Harbour" | "Western";
  latitude: number;
  longitude: number;
  isMock: true;
};

export type MockDoctorDirectoryFilters = {
  city?: "Mumbai";
  specialty?: string;
  railLine?: MockDoctorDirectoryEntry["railLine"];
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
  const query = normalized(filters.query);

  return mockDoctorDirectory.filter((doctor) => {
    if (filters.city && doctor.city !== filters.city) return false;
    if (filters.railLine && doctor.railLine !== filters.railLine) return false;
    if (specialty && doctor.specialty.toLowerCase() !== specialty) return false;
    if (locality && doctor.locality.toLowerCase() !== locality) return false;
    if (query && ![doctor.name, doctor.specialty, doctor.hospital, doctor.locality, doctor.railLine].some((field) => field.toLowerCase().includes(query))) return false;
    return true;
  });
}

export function getMockDoctorDirectoryFacets() {
  return {
    city: "Mumbai" as const,
    specialties: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.specialty))).sort(),
    localities: Array.from(new Set(mockDoctorDirectory.map((doctor) => doctor.locality))).sort(),
    railLines: ["Central", "Harbour", "Western"] as const,
  };
}

export function getMockDoctorById(id: string) {
  return mockDoctorDirectory.find((doctor) => doctor.id === id) ?? null;
}
