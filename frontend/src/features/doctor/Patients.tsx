import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Patients = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>My Patients</h1>
        <p className="caption">Directory of assigned and associated patients.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Demo Patient</h3>
            <p className="caption" style={{ margin: 'var(--spacing-1) 0' }}>Patient ID: LL-9824</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/doctor/patients/demo-id')}>View Patient Record</Button>
        </Card>

        {/* Empty state example if there were no other patients */}
        {/* <Card style={{ textAlign: 'center', padding: 'var(--spacing-6) var(--spacing-4)', color: 'var(--color-text-muted)' }}>
          <p>No other active patients.</p>
        </Card> */}
      </div>
    </div>
  );
};
