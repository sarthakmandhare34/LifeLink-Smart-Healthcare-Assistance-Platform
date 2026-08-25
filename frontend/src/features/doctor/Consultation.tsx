import { Card } from "../../components/ui/Card";
import { Lock, Stethoscope } from "lucide-react";

export const Consultation = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>Consultation</h1><p className="caption">Consultations will be connected to an authorized appointment relationship.</p></header>
    <Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}>
      <Stethoscope size={40} color="var(--color-primary)" />
      <h2>No active consultation selected</h2>
      <p>Notes and patient context are intentionally unavailable until consultation persistence and server-side patient-record access are implemented. No clinical notes are stored locally.</p>
      <p className="caption" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Lock size={14} /> Appointment authorization remains the required access boundary.</p>
    </Card>
  </div>
);
