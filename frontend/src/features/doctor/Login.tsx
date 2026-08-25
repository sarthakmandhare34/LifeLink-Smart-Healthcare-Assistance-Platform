import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { trpc } from "../../lib/trpc";

export const DoctorLogin = () => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const login = trpc.doctorAuth.login.useMutation({
    onSuccess: async (doctor) => {
      utils.doctorAuth.me.setData(undefined, doctor);
      await utils.auth.me.invalidate();
      navigate("/doctor/dashboard", { replace: true });
    },
    onError: () => setError("The synthetic doctor access code was not accepted."),
  });

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    login.mutate({ accessCode });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--color-background)", padding: "var(--spacing-4)" }}>
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-4)" }}>
          <LifeLinkLogo className="lifelink-logo-auth" />
          <p className="caption">Synthetic Clinical Workstation</p>
          <p className="caption" style={{ marginTop: "var(--spacing-1)" }}>Controlled demo identity. No real clinician account is represented.</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          <div>
            <label htmlFor="doctor-access-code" style={{ display: "block", marginBottom: "var(--spacing-1)", fontWeight: 600 }}>Demo workstation access code</label>
            <Input id="doctor-access-code" type="password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} autoComplete="current-password" required />
          </div>
          {error ? <p role="alert" style={{ color: "var(--color-danger)", margin: 0 }}>{error}</p> : null}
          <Button type="submit" variant="primary" disabled={login.isPending} style={{ marginTop: "var(--spacing-2)" }}>{login.isPending ? "Opening workspace…" : "Open demo workspace"}</Button>
        </form>
        <footer className="auth-card-footer" style={{ marginTop: "var(--spacing-4)" }}><span className="caption">Looking for your patient account?</span><button type="button" className="auth-link-button" onClick={() => navigate("/login")}>Patient sign in</button></footer>
      </Card>
    </div>
  );
};
