import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { trpc } from "../../lib/trpc";

export const DoctorAppointments = () => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const appointments = trpc.doctorWorkspace.appointments.list.useQuery();
  const updateStatus =
    trpc.doctorWorkspace.appointments.updateStatus.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.doctorWorkspace.appointments.list.invalidate(),
          utils.doctorWorkspace.dashboard.invalidate(),
          utils.doctorWorkspace.patients.invalidate(),
        ]);
      },
    });
  if (appointments.isLoading) return <p>Loading assigned appointments…</p>;
  if (appointments.isError)
    return (
      <p role="alert">
        Unable to load assigned appointments. Please try again.
      </p>
    );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-4)",
      }}
    >
      <header>
        <h1>Appointments</h1>
        <p className="caption">
          Only appointments assigned to this controlled synthetic doctor are
          shown. The booking reason and assessment context remain scoped to that
          relationship.
        </p>
      </header>
      {!appointments.data?.length ? (
        <Card
          style={{
            textAlign: "center",
            padding: "var(--spacing-6) var(--spacing-4)",
          }}
        >
          <p>No assigned appointments yet.</p>
        </Card>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
        >
          {appointments.data.map(appointment => {
            const pending =
              appointment.status === "Requested" ||
              appointment.status === "Pending";
            return (
              <Card
                key={appointment.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "var(--spacing-3)",
                  alignItems: "center",
                  flexWrap: "wrap",
                  borderLeft: "4px solid var(--color-primary)",
                }}
              >
                <div style={{ flex: "1 1 360px" }}>
                  <h3 style={{ margin: 0 }}>{appointment.patient.name}</h3>
                  <p
                    className="caption"
                    style={{ margin: "var(--spacing-1) 0" }}
                  >
                    {new Date(appointment.scheduledAt).toLocaleString()}
                  </p>
                  <p style={{ margin: "var(--spacing-2) 0" }}>
                    <strong>Booking reason:</strong> {appointment.reason}
                  </p>
                  <p style={{ margin: 0 }}>
                    Status: <strong>{appointment.status}</strong>
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-2)",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`/doctor/patients/${appointment.patient.id}`)
                    }
                  >
                    Review context
                  </Button>
                  {pending ? (
                    <>
                      <Button
                        variant="primary"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            id: appointment.id,
                            status: "Confirmed",
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            id: appointment.id,
                            status: "Cancelled",
                          })
                        }
                      >
                        Decline
                      </Button>
                    </>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {updateStatus.isError ? (
        <p role="alert" style={{ color: "var(--color-danger)" }}>
          That appointment could not be updated. It may no longer be awaiting a
          decision.
        </p>
      ) : null}
    </div>
  );
};
