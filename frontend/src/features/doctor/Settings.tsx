import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { trpc } from "../../lib/trpc";

export const DoctorSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const changePassword = trpc.doctorAuth.changePassword.useMutation({
    onSuccess: () => { setMessage("Password changed for this synthetic doctor account."); setCurrentPassword(""); setNewPassword(""); },
    onError: (error) => setMessage(error.message),
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    changePassword.mutate({ currentPassword, newPassword });
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
    <header><h1>Settings</h1><p className="caption">Security controls for the signed synthetic doctor account.</p></header>
    <Card style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <section><h2 style={{ fontSize: "var(--text-h3)" }}>Password</h2><p className="caption">Change only this doctor account&apos;s password. The owner-controlled reset path is available from doctor sign in if the current password is unavailable.</p>
        {message ? <p role="status" style={{ margin: "var(--spacing-2) 0", color: changePassword.isError ? "var(--color-semantic-emergency)" : "var(--color-semantic-success)" }}>{message}</p> : null}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)", marginTop: "var(--spacing-3)" }}>
          <label className="auth-field"><span>Current password</span><Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" minLength={10} required /></label>
          <label className="auth-field"><span>New password</span><Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={10} required /></label>
          <Button type="submit" variant="primary" disabled={changePassword.isPending}>{changePassword.isPending ? "Changing…" : "Change password"}</Button>
        </form>
      </section>
    </Card>
  </div>;
};
