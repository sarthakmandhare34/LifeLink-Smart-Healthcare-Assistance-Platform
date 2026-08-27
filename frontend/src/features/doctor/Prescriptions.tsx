import { useNavigate } from "react-router-dom";
import { FileText, Lock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { trpc } from "../../lib/trpc";

export const DoctorPrescriptions = () => {
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
        <h1>Prescriptions</h1>
        <p className="caption">
          Open an assigned patient&apos;s record to review context and create a
          prescription only after a confirmed appointment.
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
          <FileText size={40} color="var(--color-primary)" />
          <h2>No eligible patient records</h2>
          <p>
            Prescriptions become available after an assigned appointment is
            confirmed.
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
                    Assigned appointment relationship required
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                >
                  Open prescription form
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
