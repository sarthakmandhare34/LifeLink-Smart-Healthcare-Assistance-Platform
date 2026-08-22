import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useMockData } from '../../context/MockDataContext';
import { LifeLinkMark } from '../../components/brand/LifeLinkMark';

export const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useMockData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/patient/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 'var(--spacing-4)' }}>
      <Card variant="glass" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-5)' }}>
          <LifeLinkMark size="lg" className="auth-brand-mark" />
          <h1 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.75rem' }}>LifeLink</h1>
          <p className="caption" style={{ marginTop: '4px' }}>Patient Clinical Workspace Login</p>
          <div style={{ marginTop: 'var(--spacing-3)', padding: '6px 12px', background: 'rgba(0,27,48,0.05)', borderRadius: 'var(--border-radius-sm)', display: 'inline-block' }}>
            <span className="caption" style={{ color: 'var(--color-primary)' }}>
              DEMO Account: <strong>patient@demo.com</strong>
            </span>
          </div>
        </div>
        
        {error && (
          <div className="alert-panel mb-4">
            <span style={{ fontSize: 'var(--text-caption)' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex-col gap-3">
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>
              Registered Email Address
            </label>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="patient@demo.com" 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>
              Account Password
            </label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? 'Authenticating Credentials...' : 'Login to Patient Portal'}
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-5)', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)' }}>
          <span className="caption">Don't have a patient account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Register New Account
          </a>
        </div>
      </Card>
    </div>
  );
};
