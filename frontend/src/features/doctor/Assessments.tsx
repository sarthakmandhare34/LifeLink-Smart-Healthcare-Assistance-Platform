import { useNavigate } from "react-router-dom";
import { Activity, Lock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { trpc } from "../../lib/trpc";

export const Assessments = () => {
  const navigate = useNavigate();
  const patients = trpc.doctorWorkspace.patients.useQuery();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-4)",
      }}
    >
      <header>
        <h1>Assessment context</h1>
        <p className="caption">
          Review a patient&apos;s submitted assessment summary only after
          opening a patient record connected to your assigned appointment.
        </p>
      </header>
      {patients.isLoading ? (
        <p>Loading assigned patients…</p>
      ) : patients.isError ? (
        <p role="alert">Unable to verify assigned patient access.</p>
      ) : !patients.data?.length ? (
        <Card
          style={{
            textAlign: "center",
            padding: "var(--spacing-6) var(--spacing-4)",
          }}
        >
          <Activity size={40} color="var(--color-primary)" />
          <h2>No assigned patient assessments</h2>
          <p>
            Assessment context appears when an assigned patient has submitted an
            assessment.
          </p>
        </Card>
      ) : (
        <Card>
          <div style={{ display: "grid", gap: "var(--spacing-3)" }}>
            {patients.data.map(patient => (
              <div
                key={patient.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "var(--spacing-3)",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{patient.name}</strong>
                  <p className="caption" style={{ margin: "4px 0 0" }}>
                    <Lock size={13} style={{ verticalAlign: "-2px" }} />{" "}
                    Appointment-authorized context only
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                >
                  Review assessment
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
