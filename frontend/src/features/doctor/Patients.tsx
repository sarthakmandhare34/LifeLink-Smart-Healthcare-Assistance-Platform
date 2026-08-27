import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";

export const Patients = () => {
  const navigate = useNavigate();
  const patients = trpc.doctorWorkspace.patients.useQuery();
  if (patients.isLoading) return <p>Loading authorized patients…</p>;
  if (patients.isError)
    return (
      <p role="alert">Unable to load authorized patients. Please try again.</p>
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
        <h1>My Patients</h1>
        <p className="caption">
          Patients appear only after an appointment is assigned to this
          synthetic doctor.
        </p>
      </header>
      {!patients.data?.length ? (
        <Card
          style={{
            textAlign: "center",
            padding: "var(--spacing-6) var(--spacing-4)",
          }}
        >
          <p>No authorized patients yet.</p>
        </Card>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
        >
          {patients.data.map(patient => (
            <Card
              key={patient.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--spacing-3)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{patient.name}</h3>
                <p className="caption" style={{ margin: "var(--spacing-1) 0" }}>
                  Patient relationship: assigned appointment
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate(`/doctor/patients/${patient.id}`)}
              >
                View patient record
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
