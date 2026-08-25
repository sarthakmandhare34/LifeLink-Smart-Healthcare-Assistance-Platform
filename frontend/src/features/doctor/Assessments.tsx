import { Card } from "../../components/ui/Card";
import { Activity, Lock } from "lucide-react";

export const Assessments = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>AI Triage Assessments</h1><p className="caption">Assessment review will use the same authorized appointment relationship as the shared patient record.</p></header>
    <Card style={{ textAlign: "center", padding: "var(--spacing-6) var(--spacing-4)" }}>
      <Activity size={40} color="var(--color-primary)" />
      <h2>No assessments are shown</h2>
      <p>LifeLink does not show fabricated assessments. Authorized assessment visibility will be added after the doctor-side relationship checks are implemented.</p>
      <p className="caption" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Lock size={14} /> Assessment records remain patient-owned and protected.</p>
    </Card>
  </div>
);
