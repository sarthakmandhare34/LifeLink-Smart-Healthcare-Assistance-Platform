import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Lock } from "lucide-react";
import { trpc } from "../../lib/trpc";

export const PatientView = () => {
  const { patientId } = useParams();
  const patients = trpc.doctorWorkspace.patients.useQuery();
  if (patients.isLoading) return <p>Verifying the appointment relationship…</p>;
  if (patients.isError) return <p role="alert">Unable to verify patient authorization. Please try again.</p>;
  const patient = patients.data?.find((candidate) => String(candidate.id) === patientId);
  if (!patient) return <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}><header><h1>Patient Record</h1></header><Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}><Lock size={40} color="var(--color-text-muted)" /><h2>Not authorized</h2><p>The requested patient is not linked to an appointment assigned to this synthetic doctor.</p></Card></div>;
  return <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>Patient Record</h1><p className="caption">{patient.name}</p></header>
    <Card><h2>Shared record access is not enabled yet</h2><p>The appointment relationship has been verified, but Health Passport, assessment, medicine, and prescription access will be added only with explicit server-side authorization rules. No clinical data is displayed or fabricated here.</p></Card>
  </div>;
};
