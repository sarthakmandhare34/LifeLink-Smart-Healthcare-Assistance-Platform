import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DoctorSettings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Settings</h1>
        <p className="caption">Application preferences and security.</p>
      </header>

      <Card style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)' }}>Notifications</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--color-border)' }}>
             <p style={{ margin: 0 }}>New Patient Assignments</p>
             <input type="checkbox" defaultChecked />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--color-border)' }}>
             <p style={{ margin: 0 }}>Consultation Reminders</p>
             <input type="checkbox" defaultChecked />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)' }}>Security</h2>
          <Button variant="secondary" size="sm">Change Password</Button>
        </div>
      </Card>
    </div>
  );
};
