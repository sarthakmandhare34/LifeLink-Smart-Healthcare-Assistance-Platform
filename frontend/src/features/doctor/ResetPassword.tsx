import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { trpc } from "../../lib/trpc";

export const DoctorResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provisioningCode, setProvisioningCode] = useState("");
  const [message, setMessage] = useState("");
  const reset = trpc.doctorAuth.resetPassword.useMutation({
    onSuccess: () => {
      setMessage("Password changed. Sign in using the new doctor password.");
      setPassword("");
      setProvisioningCode("");
    },
    onError: error => setMessage(error.message),
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    reset.mutate({ email, password, provisioningCode });
  };
  return (
    <main className="auth-page" aria-labelledby="doctor-reset-heading">
      <Card variant="glass" className="auth-card auth-card-wide">
        <header className="auth-card-header">
          <LifeLinkLogo className="lifelink-logo-auth" />
          <p className="caption">Controlled recovery</p>
          <h1 id="doctor-reset-heading">Reset a clinician password</h1>
          <p>
            Only the owner provisioning code can reset a controlled clinician
            password. Passwords are never displayed or recovered.
          </p>
        </header>
        {message ? (
          <div className="alert-panel auth-message" role="status">
            {message}
          </div>
        ) : null}
        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <span>Clinician email</span>
            <Input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="auth-field">
            <span>New password</span>
            <Input
              type="password"
              minLength={10}
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="auth-field">
            <span>Owner provisioning code</span>
            <Input
              type="password"
              value={provisioningCode}
              onChange={event => setProvisioningCode(event.target.value)}
              autoComplete="off"
              required
            />
          </label>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={reset.isPending}
          >
            {reset.isPending ? "Resetting…" : "Reset password"}
          </Button>
        </form>
        <footer className="auth-card-footer">
          <span className="caption">Remembered the password?</span>
          <button
            type="button"
            className="auth-link-button"
            onClick={() => navigate("/doctor/login")}
          >
            Doctor sign in
          </button>
        </footer>
      </Card>
    </main>
  );
};
