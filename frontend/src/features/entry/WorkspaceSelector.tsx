import { useState } from "react";
import { ArrowRight, HeartPulse, LoaderCircle, ShieldCheck, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const patientHighlights = [
  "Manage your own health profile and care records",
  "Request appointments from the controlled Mumbai directory",
  "Use protected assessment, medicine, and emergency tools",
];

const doctorHighlights = [
  "Open the protected clinician workspace",
  "Review only appointments assigned to your account",
];

type Workspace = "patient" | "clinician";

export const WorkspaceSelector = () => {
  const navigate = useNavigate();
  const [switchingTo, setSwitchingTo] = useState<Workspace | null>(null);
  const openWorkspace = (workspace: Workspace, path: string) => {
    if (switchingTo) return;
    setSwitchingTo(workspace);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => navigate(path), reducedMotion ? 0 : 180);
  };
  const openingPatient = switchingTo === "patient";
  const openingClinician = switchingTo === "clinician";
  return (
    <main className={`workspace-entry${switchingTo ? " is-switching" : ""}`} aria-labelledby="workspace-entry-heading" aria-busy={Boolean(switchingTo)}>
      <EntryThemeToggle />
      <section className="workspace-entry-shell">
        <header className="workspace-entry-header">
          <LifeLinkLogo className="lifelink-logo-auth workspace-entry-logo" />
          <span className="workspace-entry-kicker">LifeLink connected care</span>
          <h1 id="workspace-entry-heading">Choose your workspace</h1>
          <p>Choose the workspace that matches your account.</p>
        </header>

        <div className="workspace-entry-grid">
          <Card variant="glass" className="workspace-choice-card">
            <div className="workspace-choice-topline"><span className="workspace-choice-icon patient"><HeartPulse size={22} /></span><span className="workspace-choice-label">Patient Portal</span></div>
            <h2>Personal health workspace</h2>
            <p>Manage your health information and care requests.</p>
            <ul className="workspace-choice-list">{patientHighlights.map((item) => <li key={item}><ShieldCheck size={16} />{item}</li>)}</ul>
            <Button type="button" variant="primary" className="workspace-choice-action" onClick={() => openWorkspace("patient", "/login")} disabled={Boolean(switchingTo)}>{openingPatient ? <><LoaderCircle size={18} className="workspace-choice-spinner" /> Opening patient workspace…</> : <>Patient sign in <ArrowRight size={18} /></>}</Button>
            <button type="button" className="auth-link-button workspace-secondary-link" onClick={() => openWorkspace("patient", "/register")} disabled={Boolean(switchingTo)}>Create a patient account</button>
          </Card>

          <Card variant="glass" className="workspace-choice-card">
            <div className="workspace-choice-topline"><span className="workspace-choice-icon doctor"><Stethoscope size={22} /></span><span className="workspace-choice-label">Doctor Workstation</span></div>
            <h2>Clinician workspace</h2>
            <p>Review assigned appointments and patient context.</p>
            <ul className="workspace-choice-list">{doctorHighlights.map((item) => <li key={item}><ShieldCheck size={16} />{item}</li>)}</ul>
            <Button type="button" variant="primary" className="workspace-choice-action" onClick={() => openWorkspace("clinician", "/doctor/login")} disabled={Boolean(switchingTo)}>{openingClinician ? <><LoaderCircle size={18} className="workspace-choice-spinner" /> Opening clinician workspace…</> : <>Doctor sign in <ArrowRight size={18} /></>}</Button>
          </Card>
        </div>

        <aside className="workspace-entry-note"><ShieldCheck size={18} /><p><strong>Privacy boundary:</strong> patient records remain patient-owned. The controlled clinician workspace can access only server-authorized, assigned appointment information.</p></aside>
      </section>
      {switchingTo ? <div className="workspace-switch-status" role="status" aria-live="polite"><LoaderCircle size={20} className="workspace-choice-spinner" /> Opening {switchingTo === "patient" ? "Patient Portal" : "Doctor Workstation"}…</div> : null}
    </main>
  );
};
