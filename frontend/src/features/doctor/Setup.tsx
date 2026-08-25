import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { trpc } from "../../lib/trpc";

type OneTimeCredential = { doctorId: string; displayName: string; email: string; password: string };

export const DoctorSetup = () => {
  const navigate = useNavigate();
  const directory = trpc.doctorAuth.directory.useQuery();
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provisioningCode, setProvisioningCode] = useState("");
  const [message, setMessage] = useState("");
  const [bulkCredentials, setBulkCredentials] = useState<OneTimeCredential[]>([]);
  const bulkProvision = trpc.doctorAuth.provisionDirectory.useMutation({
    onSuccess: (result) => {
      setBulkCredentials(result.created);
      setMessage(result.created.length ? "All remaining controlled demo accounts have been created. Copy the one-time credentials now." : "All controlled demo doctors already have separate accounts.");
      setProvisioningCode("");
    },
    onError: (error) => setMessage(error.message),
  });
  const provision = trpc.doctorAuth.provision.useMutation({
    onSuccess: (result) => {
      setMessage(`${result.displayName} now has a separate demo login.`);
      setPassword("");
      setProvisioningCode("");
    },
    onError: (error) => setMessage(error.message),
  });
  const copyCredentials = async () => {
    const text = bulkCredentials.map((credential) => `${credential.displayName}\nEmail: ${credential.email}\nPassword: ${credential.password}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setMessage("One-time credentials copied. Store them in a private password manager before closing this page.");
  };
  const submitIndividual = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    provision.mutate({ doctorId, email, password, provisioningCode });
  };
  return <main className="auth-page" aria-labelledby="doctor-setup-heading"><Card variant="glass" className="auth-card auth-card-wide">
    <header className="auth-card-header"><LifeLinkLogo className="lifelink-logo-auth" /><p className="caption">Controlled demo accounts</p><h1 id="doctor-setup-heading">Provision doctor test logins</h1><p>Create separate directory-aligned emails and passwords for the controlled LifeLink demo specialists. No real clinician identity is created.</p></header>
    {message ? <div className="alert-panel auth-message" role="status">{message}</div> : null}
    <section style={{ display: "grid", gap: "var(--spacing-3)" }}>
      <div><h2 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--spacing-1)" }}>All controlled demo doctors</h2><p className="caption">This creates the remaining separate accounts in one action. Existing accounts are skipped, so it is safe to use again.</p></div>
      <label className="auth-field"><span>Owner provisioning code</span><Input type="password" value={provisioningCode} onChange={(event) => setProvisioningCode(event.target.value)} autoComplete="off" required /><small className="caption">This code is never a doctor password and is not stored or displayed.</small></label>
      <Button type="button" variant="primary" className="w-full" disabled={!provisioningCode || bulkProvision.isPending} onClick={() => bulkProvision.mutate({ provisioningCode })}>{bulkProvision.isPending ? "Creating all accounts…" : "Create all remaining doctor logins"}</Button>
    </section>
    {bulkCredentials.length ? <section style={{ marginTop: "var(--spacing-5)", paddingTop: "var(--spacing-4)", borderTop: "1px solid var(--color-border)", display: "grid", gap: "var(--spacing-2)" }}><h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>One-time credentials</h2><p role="alert" style={{ margin: 0, color: "var(--color-semantic-warning)" }}>Copy these now. Passwords will not be displayed after you leave this page.</p>{bulkCredentials.map((credential) => <div key={credential.doctorId} style={{ padding: "var(--spacing-2)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)" }}><strong>{credential.displayName}</strong><p className="caption" style={{ margin: "4px 0 0" }}>Email: {credential.email}</p><p className="caption" style={{ margin: "4px 0 0" }}>Password: <code>{credential.password}</code></p></div>)}<Button type="button" variant="secondary" onClick={() => void copyCredentials()}>Copy all credentials</Button></section> : null}
    <details style={{ marginTop: "var(--spacing-5)", paddingTop: "var(--spacing-4)", borderTop: "1px solid var(--color-border)" }}><summary style={{ cursor: "pointer", fontWeight: 700 }}>Advanced: create one specific doctor account</summary><form onSubmit={submitIndividual} className="auth-form" style={{ marginTop: "var(--spacing-3)" }}><label className="auth-field"><span>Controlled demo doctor</span><select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required><option value="">Select a synthetic doctor</option>{directory.data?.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.displayName} · {doctor.locality}</option>)}</select></label><label className="auth-field"><span>Separate demo email</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label className="auth-field"><span>Separate password</span><Input type="password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></label><Button type="submit" variant="secondary" className="w-full" disabled={provision.isPending || directory.isLoading}>{provision.isPending ? "Creating account…" : "Create one doctor login"}</Button></form></details>
    <footer className="auth-card-footer"><span className="caption">Already provisioned?</span><button type="button" className="auth-link-button" onClick={() => navigate("/doctor/login")}>Doctor sign in</button></footer>
  </Card></main>;
};
