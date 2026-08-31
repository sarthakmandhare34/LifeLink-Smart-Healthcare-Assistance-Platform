import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { trpc } from "../../lib/trpc";

type AppointmentStatus = "Requested" | "Pending" | "Confirmed" | "Completed" | "Cancelled";

const statusLabel: Record<AppointmentStatus, string> = {
  Requested: "Requested",
  Pending: "Pending",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export const DoctorAppointments = () => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const appointments = trpc.doctorWorkspace.appointments.list.useQuery();
  const updateStatus = trpc.doctorWorkspace.appointments.updateStatus.useMutation({
    onSuccess: async (_data, variables) => {
      const messages: Record<"Confirmed" | "Completed" | "Cancelled", string> = {
        Confirmed: "Appointment accepted and confirmed.",
        Completed: "Appointment marked as completed.",
        Cancelled: "Appointment declined or cancelled.",
      };
      setFeedbackMessage(messages[variables.status]);
      await Promise.all([
        utils.doctorWorkspace.appointments.list.invalidate(),
        utils.doctorWorkspace.dashboard.invalidate(),
        utils.doctorWorkspace.patients.invalidate(),
      ]);
    },
  });

  if (appointments.isLoading) return <p>Loading assigned appointments…</p>;
  if (appointments.isError) return <p role="alert">Unable to load assigned appointments. Please try again.</p>;

  const getStatusStyle = (status: AppointmentStatus) => {
    if (status === "Completed") return { color: "var(--color-success)", background: "color-mix(in srgb, var(--color-success) 14%, transparent)" };
    if (status === "Confirmed") return { color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" };
    if (status === "Cancelled") return { color: "var(--color-danger)", background: "color-mix(in srgb, var(--color-danger) 14%, transparent)" };
    return { color: "var(--color-warning)", background: "color-mix(in srgb, var(--color-warning) 14%, transparent)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <header>
        <h1>Appointments</h1>
        <p className="caption">Review assigned requests, confirm consultations, and record when a consultation is completed.</p>
      </header>

      {feedbackMessage ? (
        <div role="status" style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-3)", alignItems: "center", padding: "var(--spacing-3)", borderRadius: "var(--border-radius-md)", border: "1px solid color-mix(in srgb, var(--color-success) 45%, transparent)", background: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-foreground)" }}>
          <strong>{feedbackMessage}</strong>
          <button type="button" onClick={() => setFeedbackMessage(null)} aria-label="Dismiss status message" style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", fontSize: "1.1rem" }}>Dismiss</button>
        </div>
      ) : null}

      {!appointments.data?.length ? (
        <Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}><p>No assigned appointments yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {appointments.data.map((appointment) => {
            const status = appointment.status as AppointmentStatus;
            const isPending = status === "Requested" || status === "Pending";
            const isConfirmed = status === "Confirmed";
            const isCompleted = status === "Completed";
            return (
              <Card key={appointment.id} style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-3)", alignItems: "center", flexWrap: "wrap", borderLeft: "4px solid var(--color-primary)" }}>
                <div style={{ flex: "1 1 360px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>{appointment.patient.name}</h3>
                    <span style={{ ...getStatusStyle(status), borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.8rem", fontWeight: 700 }}>{statusLabel[status]}</span>
                  </div>
                  <p className="caption" style={{ margin: "var(--spacing-1) 0" }}>Scheduled: {new Date(appointment.scheduledAt).toLocaleString()}</p>
                  <p style={{ margin: "var(--spacing-2) 0" }}><strong>Booking reason:</strong> {appointment.reason}</p>
                </div>
                <div style={{ display: "flex", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
                  <Button variant="secondary" onClick={() => navigate(`/doctor/patients/${appointment.patient.id}`)}>Review patient</Button>
                  {isPending ? <>
                    <Button variant="primary" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Confirmed" })}>Accept</Button>
                    <Button variant="secondary" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Cancelled" })}>Decline</Button>
                  </> : null}
                  {isConfirmed ? <>
                    <Button variant="primary" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Completed" })}>Mark completed</Button>
                    <Button variant="secondary" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: appointment.id, status: "Cancelled" })}>Cancel</Button>
                  </> : null}
                  {isCompleted ? <span className="caption" style={{ alignSelf: "center", color: "var(--color-success)", fontWeight: 700 }}>Consultation completed</span> : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {updateStatus.isError ? <p role="alert" style={{ color: "var(--color-danger)" }}>{updateStatus.error.message || "That appointment could not be updated."}</p> : null}
    </div>
  );
};

export default DoctorAppointments;

// The page intentionally exposes only the status transitions permitted by the backend.
// Patient access remains appointment-scoped on the server.
