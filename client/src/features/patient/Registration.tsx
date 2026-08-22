import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { LifeLinkMark } from '../../components/brand/LifeLinkMark';
import { trpc } from '../../lib/trpc';

export const PatientRegistration = () => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const registerMutation = trpc.patientAuth.register.useMutation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      await registerMutation.mutateAsync({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      await trpcUtils.auth.me.invalidate();
      navigate('/patient/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please verify your form details.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 'var(--spacing-4)' }}>
      <Card variant="glass" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5)' }}>
          <LifeLinkMark size="lg" className="auth-brand-mark" />
          <h1 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.75rem' }}>LifeLink</h1>
          <p className="caption" style={{ marginTop: '4px' }}>Register Patient Portal Account</p>
        </div>
        
        {error && (
          <div className="alert-panel mb-4">
            <span style={{ fontSize: 'var(--text-caption)' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex-col gap-3">
          <div className="flex gap-3">
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>First Name</label>
               <Input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="Jane" />
             </div>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Last Name</label>
               <Input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Doe" />
             </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Email Address</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane.doe@example.com" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Confirm Password</label>
            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register Account'}
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-5)', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)' }}>
          <span className="caption">Already have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Back to Login
          </a>
        </div>
      </Card>
    </div>
  );
};
