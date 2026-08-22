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

export function getMockDoctorById(id: string) {
  return mockDoctorDirectory.find((doctor) => doctor.id === id) ?? null;
}
