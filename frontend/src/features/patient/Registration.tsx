import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { LifeLinkLogo } from '../../components/brand/LifeLinkLogo';
import { trpc } from '../../lib/trpc';

export const PatientRegistration = () => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const registerMutation = trpc.patientAuth.register.useMutation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await registerMutation.mutateAsync({ name: fullName.trim(), email, password });
      await trpcUtils.auth.me.invalidate();
      navigate('/patient/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please verify your form details.');
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page" aria-labelledby="patient-registration-heading">
      <Card variant="glass" className="auth-card auth-card-wide">
        <header className="auth-card-header">
          <LifeLinkLogo className="lifelink-logo-auth" />
          <p className="caption">Patient workspace</p>
          <h1 id="patient-registration-heading">Create your patient account</h1>
          <p>Your Health Passport details can be completed privately after account creation.</p>
        </header>

        {error && <div className="alert-panel auth-message" role="alert">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <fieldset className="auth-fieldset">
            <legend>Personal information</legend>
            <div className="auth-field-grid">
              <label className="auth-field"><span>Full name</span><Input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" autoComplete="name" required /></label>
              <label className="auth-field"><span>Email</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="patient@example.com" autoComplete="email" required /></label>
            </div>
          </fieldset>
          <fieldset className="auth-fieldset">
            <legend>Secure sign in</legend>
            <label className="auth-field"><span>Password</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete="new-password" required /></label>
            <label className="auth-field"><span>Confirm password</span><Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" autoComplete="new-password" required /></label>
          </fieldset>
          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>{isLoading ? 'Creating account…' : 'Create Account'}</Button>
        </form>

        <footer className="auth-card-footer">
          <span className="caption">Already have an account?</span>
          <button type="button" className="auth-link-button" onClick={() => navigate('/login')}>Sign In</button>
        </footer>
      </Card>
    </main>
  );
};
