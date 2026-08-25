import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { trpc } from "../../lib/trpc";

type OneTimeCredential = { doctorId?: string; displayName?: string; email: string; password: string };
type OwnerAccount = { doctorId: string; displayName: string; email: string };

export const DoctorSetup = () => {
  const navigate = useNavigate();
  const directory = trpc.doctorAuth.directory.useQuery();
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provisioningCode, setProvisioningCode] = useState("");
  const [message, setMessage] = useState("");
  const [bulkCredentials, setBulkCredentials] = useState<OneTimeCredential[]>([]);
  const [ownerAccounts, setOwnerAccounts] = useState<OwnerAccount[]>([]);
  const [replacementCredentials, setReplacementCredentials] = useState<OneTimeCredential[]>([]);
  const bulkProvision = trpc.doctorAuth.provisionDirectory.useMutation({
    onSuccess: (result) => {
      setBulkCredentials(result.created);
      setReplacementCredentials([]);
      setMessage(result.created.length ? "All remaining clinician accounts were created. Copy the one-time credentials now." : "No new clinician accounts were created. Use Account recovery to view provisioned emails or replace a password.");
    },
    onError: (error) => setMessage(error.message),
  });
  const provision = trpc.doctorAuth.provision.useMutation({
    onSuccess: (result) => {
      setMessage(`${result.displayName} now has a separate clinician login.`);
      setPassword("");
    },
    onError: (error) => setMessage(error.message),
  });
  const loadOwnerAccounts = trpc.doctorAuth.ownerAccounts.useMutation({
    onSuccess: (accounts) => {
      setOwnerAccounts(accounts);
      setReplacementCredentials([]);
      setMessage(accounts.length ? "Provisioned clinician emails are shown below. Passwords remain unavailable; replace a password to create a new one-time value." : "No clinician accounts are currently provisioned. Create all clinician logins first.");
    },
    onError: (error) => setMessage(error.message),
  });
  const replacePassword = trpc.doctorAuth.replacePassword.useMutation({
    onSuccess: (credential) => {
      setReplacementCredentials([credential]);
      setMessage("A new one-time password was created. Copy it now; the previous password no longer works.");
    },
    onError: (error) => setMessage(error.message),
  });
  const copyCredentials = async (credentials: OneTimeCredential[]) => {
    const text = credentials.map((credential) => `${credential.displayName ? `${credential.displayName}\n` : ""}Email: ${credential.email}\nPassword: ${credential.password}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setMessage("One-time credentials copied. Store them in a private password manager before closing this page.");
  };
  const submitIndividual = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    provision.mutate({ doctorId, email, password, provisioningCode });
  };
  const canUseOwnerTools = provisioningCode.length > 0;
  const credentialsToShow = replacementCredentials.length ? replacementCredentials : bulkCredentials;
  return <main className="auth-page" aria-labelledby="doctor-setup-heading"><Card variant="glass" className="auth-card auth-card-wide">
    <header className="auth-card-header"><LifeLinkLogo className="lifelink-logo-auth" /><p className="caption">Controlled clinician accounts</p><h1 id="doctor-setup-heading">Clinician account administration</h1><p>Create and recover separate directory-aligned clinician accounts. Passwords are only shown when created or replaced.</p></header>
    {message ? <div className="alert-panel auth-message" role="status">{message}</div> : null}
    <section style={{ display: "grid", gap: "var(--spacing-3)" }}>
      <div><h2 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--spacing-1)" }}>Owner access</h2><p className="caption">Enter the private owner provisioning code to create accounts, view provisioned emails, or create a replacement password.</p></div>
      <label className="auth-field"><span>Owner provisioning code</span><Input type="password" value={provisioningCode} onChange={(event) => setProvisioningCode(event.target.value)} autoComplete="off" required /><small className="caption">This code is never a clinician password and is not stored or displayed.</small></label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--spacing-2)" }}><Button type="button" variant="primary" disabled={!canUseOwnerTools || bulkProvision.isPending} onClick={() => bulkProvision.mutate({ provisioningCode })}>{bulkProvision.isPending ? "Creating accounts…" : "Create all clinician logins"}</Button><Button type="button" variant="secondary" disabled={!canUseOwnerTools || loadOwnerAccounts.isPending} onClick={() => loadOwnerAccounts.mutate({ provisioningCode })}>{loadOwnerAccounts.isPending ? "Loading accounts…" : "View provisioned emails"}</Button></div>
    </section>
    {ownerAccounts.length ? <section style={{ marginTop: "var(--spacing-5)", paddingTop: "var(--spacing-4)", borderTop: "1px solid var(--color-border)", display: "grid", gap: "var(--spacing-2)" }}><h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>Provisioned clinician accounts</h2><p className="caption" style={{ margin: 0 }}>Emails are shown for owner recovery. Passwords are never retrievable; choose Replace password to create a new one-time password.</p>{ownerAccounts.map((account) => <div key={account.doctorId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--spacing-2)", flexWrap: "wrap", padding: "var(--spacing-2)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)" }}><div><strong>{account.displayName}</strong><p className="caption" style={{ margin: "4px 0 0" }}>{account.email}</p></div><Button type="button" variant="secondary" disabled={replacePassword.isPending} onClick={() => replacePassword.mutate({ email: account.email, provisioningCode })}>{replacePassword.isPending ? "Replacing…" : "Replace password"}</Button></div>)}</section> : null}
    {credentialsToShow.length ? <section style={{ marginTop: "var(--spacing-5)", paddingTop: "var(--spacing-4)", borderTop: "1px solid var(--color-border)", display: "grid", gap: "var(--spacing-2)" }}><h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>One-time credentials</h2><p role="alert" style={{ margin: 0, color: "var(--color-semantic-warning)" }}>Copy these now. Passwords will not be displayed after you leave this page.</p>{credentialsToShow.map((credential) => <div key={credential.email} style={{ padding: "var(--spacing-2)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)" }}>{credential.displayName ? <strong>{credential.displayName}</strong> : null}<p className="caption" style={{ margin: "4px 0 0" }}>Email: {credential.email}</p><p className="caption" style={{ margin: "4px 0 0" }}>Password: <code>{credential.password}</code></p></div>)}<Button type="button" variant="secondary" onClick={() => void copyCredentials(credentialsToShow)}>Copy credentials</Button></section> : null}
    <details style={{ marginTop: "var(--spacing-5)", paddingTop: "var(--spacing-4)", borderTop: "1px solid var(--color-border)" }}><summary style={{ cursor: "pointer", fontWeight: 700 }}>Advanced: create one specialist account</summary><form onSubmit={submitIndividual} className="auth-form" style={{ marginTop: "var(--spacing-3)" }}><label className="auth-field"><span>Controlled specialist</span><select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required><option value="">Select a controlled specialist</option>{directory.data?.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.displayName} · {doctor.locality}</option>)}</select></label><label className="auth-field"><span>Clinician email</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label className="auth-field"><span>Separate password</span><Input type="password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></label><Button type="submit" variant="secondary" className="w-full" disabled={provision.isPending || directory.isLoading || !canUseOwnerTools}>{provision.isPending ? "Creating account…" : "Create clinician login"}</Button></form></details>
    <footer className="auth-card-footer"><span className="caption">Ready to sign in?</span><button type="button" className="auth-link-button" onClick={() => navigate("/doctor/login")}>Doctor sign in</button></footer>
  </Card></main>;
};
