import { EventEmitter } from "node:events";

export const PATIENT_EVENT_TYPES = [
  "PROFILE_UPDATED",
  "APPOINTMENT_UPDATED",
  "PRESCRIPTION_CREATED",
  "ASSESSMENT_COMPLETED",
  "MEDICINE_UPDATED",
] as const;

export type PatientEventType = (typeof PATIENT_EVENT_TYPES)[number];

export const DOCTOR_EVENT_TYPES = ["APPOINTMENT_UPDATED"] as const;
export type DoctorEventType = (typeof DOCTOR_EVENT_TYPES)[number];

export type RealtimePatientEvent = {
  id: number;
  userId: number;
  type: PatientEventType;
  entityId: string | null;
  createdAt: Date;
};

export type RealtimeDoctorEvent = {
  id: number;
  doctorId: string;
  patientUserId: number;
  type: DoctorEventType;
  entityId: string | null;
  createdAt: Date;
};

const patientEventBus = new EventEmitter();
patientEventBus.setMaxListeners(0);

function eventChannel(userId: number) {
  return `patient:${userId}`;
}

function doctorEventChannel(doctorId: string) {
  return `doctor:${doctorId}`;
}

export function publishPatientEvent(event: RealtimePatientEvent) {
  patientEventBus.emit(eventChannel(event.userId), event);
}

export function subscribeToPatientEvents(userId: number, listener: (event: RealtimePatientEvent) => void) {
  const channel = eventChannel(userId);
  patientEventBus.on(channel, listener);
  return () => patientEventBus.off(channel, listener);
}

export function publishDoctorEvent(event: RealtimeDoctorEvent) {
  patientEventBus.emit(doctorEventChannel(event.doctorId), event);
}

export function subscribeToDoctorEvents(doctorId: string, listener: (event: RealtimeDoctorEvent) => void) {
  const channel = doctorEventChannel(doctorId);
  patientEventBus.on(channel, listener);
  return () => patientEventBus.off(channel, listener);
}
