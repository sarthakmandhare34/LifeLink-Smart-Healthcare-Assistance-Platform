import { useEffect } from "react";
import { trpc } from "../lib/trpc";

type DoctorRealtimePayload = {
  id: number;
  type: "APPOINTMENT_UPDATED";
  entityId: string | null;
  createdAt: string;
};

/** Uses the same notification-and-refetch pattern as patient realtime, scoped by the signed doctor session. */
export function useDoctorRealtime(enabled: boolean) {
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("EventSource" in window)) return;
    const source = new EventSource("/api/doctor-events");
    const onDoctorEvent = (message: Event) => {
      try {
        const payload = JSON.parse((message as MessageEvent<string>).data) as DoctorRealtimePayload;
        if (payload.type === "APPOINTMENT_UPDATED") {
          void utils.doctorWorkspace.dashboard.invalidate();
          void utils.doctorWorkspace.appointments.list.invalidate();
          void utils.doctorWorkspace.patients.invalidate();
        }
      } catch {
        // Ignore malformed notification-only events; EventSource reconnects when needed.
      }
    };
    source.addEventListener("doctor-event", onDoctorEvent);
    return () => {
      source.removeEventListener("doctor-event", onDoctorEvent);
      source.close();
    };
  }, [enabled, utils]);
}
