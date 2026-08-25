import { ArrowRight, CalendarCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
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
  "Open the restricted synthetic demo workspace",
  "Review only appointments assigned to the signed demo identity",
  "Accept or decline pending appointment requests",
];

export const WorkspaceSelector = () => {
  const navigate = useNavigate();
  return (
    <main className="workspace-entry" aria-labelledby="workspace-entry-heading">
      <EntryThemeToggle />
      <section className="workspace-entry-shell">
        <header className="workspace-entry-header">
          <LifeLinkLogo className="lifelink-logo-auth workspace-entry-logo" />
          <span className="workspace-entry-kicker">LifeLink connected care</span>
          <h1 id="workspace-entry-heading">Choose your workspace</h1>
          <p>Continue to the Patient Portal or the protected synthetic Doctor Workstation.</p>
        </header>

        <div className="workspace-entry-grid">
          <Card variant="glass" className="workspace-choice-card">
            <div className="workspace-choice-topline"><span className="workspace-choice-icon patient"><HeartPulse size={22} /></span><span className="workspace-choice-label">Patient Portal</span></div>
            <h2>Personal health workspace</h2>
            <p>Sign in to your patient-owned LifeLink account and manage your own information.</p>
            <ul className="workspace-choice-list">{patientHighlights.map((item) => <li key={item}><ShieldCheck size={16} />{item}</li>)}</ul>
            <Button type="button" variant="primary" className="workspace-choice-action" onClick={() => navigate("/login")}>Patient sign in <ArrowRight size={18} /></Button>
            <button type="button" className="auth-link-button workspace-secondary-link" onClick={() => navigate("/register")}>Create a patient account</button>
          </Card>

          <Card variant="glass" className="workspace-choice-card">
            <div className="workspace-choice-topline"><span className="workspace-choice-icon doctor"><Stethoscope size={22} /></span><span className="workspace-choice-label">Doctor Workstation</span></div>
            <h2>Controlled demo clinician workspace</h2>
            <p>Access the stable LifeLink synthetic-doctor workflow; no real clinician account is represented.</p>
            <ul className="workspace-choice-list">{doctorHighlights.map((item) => <li key={item}><ShieldCheck size={16} />{item}</li>)}</ul>
            <Button type="button" variant="primary" className="workspace-choice-action" onClick={() => navigate("/doctor/login")}>Doctor sign in <ArrowRight size={18} /></Button>
            <p className="caption workspace-choice-note"><CalendarCheck size={15} /> Requires this doctor&apos;s separate demo email and password.</p>
          </Card>
        </div>

        <aside className="workspace-entry-note"><ShieldCheck size={18} /><p><strong>Privacy boundary:</strong> patient records remain patient-owned. The synthetic doctor workspace can access only server-authorized, assigned appointment information.</p></aside>
      </section>
    </main>
  );
};
