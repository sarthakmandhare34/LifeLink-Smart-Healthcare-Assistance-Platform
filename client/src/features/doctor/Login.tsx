import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { LifeLinkLogo } from '../../components/brand/LifeLinkLogo';

export const DoctorLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/doctor/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-background)' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
          <LifeLinkLogo className="lifelink-logo-auth" />
          <p className="caption">Clinical Portal Login</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Doctor ID</label>
            <Input type="text" placeholder="Enter your ID" required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Password</label>
            <Input type="password" placeholder="Enter password" required />
          </div>
          <Button type="submit" variant="primary" style={{ marginTop: 'var(--spacing-2)' }}>Secure Login</Button>
        </form>
      </Card>
    </div>
  );
};
