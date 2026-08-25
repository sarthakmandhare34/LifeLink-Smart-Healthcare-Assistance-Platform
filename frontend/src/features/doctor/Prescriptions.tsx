import { Card } from "../../components/ui/Card";
import { FileText, Lock } from "lucide-react";

export const DoctorPrescriptions = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>Prescriptions</h1><p className="caption">Shared prescription authoring is the next protected workflow increment.</p></header>
    <Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}>
      <FileText size={40} color="var(--color-primary)" />
      <h2>No prescriptions are shown</h2>
      <p>LifeLink does not fabricate prescriptions. Doctor-side prescription creation will appear only after authorized patient-record access and shared persistence are implemented.</p>
      <p className="caption" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Lock size={14} /> Patient prescription records remain protected.</p>
    </Card>
  </div>
);
