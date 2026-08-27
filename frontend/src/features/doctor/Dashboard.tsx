import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Users, Calendar, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dashboard = trpc.doctorWorkspace.dashboard.useQuery();
  if (dashboard.isLoading) return <p>Loading assigned appointment data…</p>;
  if (dashboard.isError || !dashboard.data)
    return (
      <p role="alert">
        Unable to load the synthetic doctor workspace. Please try again.
      </p>
    );
  const { appointmentCount, pendingCount, upcomingCount, patientCount } =
    dashboard.data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-4)",
      }}
    >
      <header>
        <h1>Clinical Dashboard</h1>
        <p className="caption">
          Controlled synthetic workstation. Counts reflect only assigned,
          database-backed appointments.
        </p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--spacing-4)",
        }}
      >
        <Card>
          <Calendar color="var(--color-primary)" />
          <h3>Appointments</h3>
          <p>
            {appointmentCount} assigned appointment
            {appointmentCount === 1 ? "" : "s"}; {upcomingCount} upcoming.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/doctor/appointments")}
          >
            View appointments
          </Button>
        </Card>
        <Card>
          <Activity color="var(--color-primary)" />
          <h3>Pending requests</h3>
          <p>
            {pendingCount
              ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} awaiting a decision.`
              : "No appointment requests are awaiting a decision."}
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/doctor/appointments")}
          >
            Review requests
          </Button>
        </Card>
        <Card>
          <Users color="var(--color-primary)" />
          <h3>Authorized patients</h3>
          <p>
            {patientCount
              ? `${patientCount} patient${patientCount === 1 ? "" : "s"} are linked through assigned appointments.`
              : "No patient relationship has been established yet."}
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/doctor/patients")}
          >
            View patients
          </Button>
        </Card>
      </div>
    </div>
  );
};
