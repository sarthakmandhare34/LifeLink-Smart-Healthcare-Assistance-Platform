import React from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const DoctorProfile = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Clinical Profile</h1>
        <p className="caption">Manage your professional information.</p>
      </header>

      <Card style={{ maxWidth: '600px' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>First Name</label>
               <Input type="text" defaultValue="Ananya" />
             </div>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Last Name</label>
               <Input type="text" defaultValue="Sharma" />
             </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Specialty</label>
            <Input type="text" defaultValue="Cardiology" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>License Number</label>
            <Input type="text" defaultValue="MC-992384" readOnly style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }} />
          </div>
          <Button type="button" variant="primary" style={{ marginTop: 'var(--spacing-2)', alignSelf: 'flex-start' }}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};
