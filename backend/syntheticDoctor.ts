import { getMockDoctorById, type MockDoctorDirectoryEntry } from "./mockDoctorDirectory";

/**
 * The first connected-workstation increment deliberately grants one controlled
 * synthetic clinician session. It reuses a directory record; it is not a real
 * person, credential, or independent doctor data source.
 */
export const WORKSTATION_DOCTOR_ID = "mock-central-cardiology-dadar";
const SYNTHETIC_DOCTOR_OPEN_ID_PREFIX = "synthetic-doctor:";

export function getWorkstationDoctor(): MockDoctorDirectoryEntry {
  const doctor = getMockDoctorById(WORKSTATION_DOCTOR_ID);
  if (!doctor) throw new Error("Configured synthetic doctor is missing from the controlled directory.");
  return doctor;
}

export function syntheticDoctorOpenId(doctorId: string) {
  return `${SYNTHETIC_DOCTOR_OPEN_ID_PREFIX}${doctorId}`;
}

export function doctorIdFromSyntheticOpenId(openId: string) {
  if (!openId.startsWith(SYNTHETIC_DOCTOR_OPEN_ID_PREFIX)) return null;
  const doctorId = openId.slice(SYNTHETIC_DOCTOR_OPEN_ID_PREFIX.length);
  return getMockDoctorById(doctorId)?.id ?? null;
}

export function doctorDisplayName(doctor: MockDoctorDirectoryEntry) {
  return `Demo ${doctor.specialty} Specialist — ${doctor.station}`;
}
