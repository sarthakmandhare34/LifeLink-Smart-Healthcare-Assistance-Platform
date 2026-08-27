import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { LifeLinkLogo } from "../../components/brand/LifeLinkLogo";
import { EntryThemeToggle } from "../../components/EntryThemeToggle";
import { trpc } from "../../lib/trpc";
import { Chrome } from "lucide-react";
import { PATIENT_DASHBOARD_PATH } from "./patientAuthRoutes";

export const PatientLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trpcUtils = trpc.useUtils();
  const loginMutation = trpc.patientAuth.login.useMutation();
  const providerQuery = trpc.auth.providers.useQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const providerError =
    searchParams.get("authError") === "registration_required"
      ? "No LifeLink account is linked to this Google account. Please register first."
      : searchParams.get("authError") === "account_exists"
        ? "This email already has a LifeLink account. Sign in with its existing method before linking Google."
        : searchParams.get("authError") === "provider_sign_in_failed"
          ? "Google sign-in could not be completed. Please try again."
          : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await loginMutation.mutateAsync({ email, password });
      await trpcUtils.auth.me.invalidate();
      navigate(PATIENT_DASHBOARD_PATH);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-labelledby="patient-login-heading">
      <EntryThemeToggle />
      <Card variant="glass" className="auth-card">
        <header className="auth-card-header">
          <LifeLinkLogo className="lifelink-logo-auth" />
          <p className="caption">Patient workspace</p>
          <h1 id="patient-login-heading">Welcome back</h1>
          <p>Sign in to your health workspace.</p>
        </header>

        {(error || providerError) && (
          <div className="alert-panel auth-message" role="alert">
            {error || providerError}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <label className="auth-field">
            <span>Email</span>
            <Input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="patient@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <Input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="social-auth" aria-label="Alternative sign-in methods">
          <div className="social-auth-divider">
            <span>or continue with</span>
          </div>
          <div className="social-auth-actions">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!providerQuery.data?.googleAuthorizationStartUrl}
              onClick={() => {
                const startUrl =
                  providerQuery.data?.googleAuthorizationStartUrl;
                if (startUrl) window.location.assign(startUrl);
              }}
            >
              <Chrome size={18} /> Continue with Google
            </Button>
          </div>
          {!providerQuery.isLoading && providerQuery.data?.google && (
            <p className="caption social-auth-note">
              Use Google sign-in only if your LifeLink account is already
              registered.
            </p>
          )}
          {!providerQuery.isLoading && !providerQuery.data?.google && (
            <p className="caption social-auth-note">
              Google sign-in will activate once it is securely connected.
            </p>
          )}
        </div>

        <footer className="auth-card-footer">
          <span className="caption">Don&apos;t have an account?</span>
          <button
            type="button"
            className="auth-link-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <span className="caption">Need the clinician workspace?</span>
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
