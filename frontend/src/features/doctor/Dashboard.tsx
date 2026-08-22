import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Clinical Dashboard</h1>
        <p className="caption">Welcome back, Dr. Sharma.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
        
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
             <Calendar color="var(--color-primary)" />
             <h3 style={{ margin: 0 }}>Today's Appointments</h3>
          </div>
          <p>4 scheduled consultations.</p>
          <Button variant="primary" onClick={() => navigate('/doctor/appointments')}>View Schedule</Button>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
             <Activity color="var(--color-primary)" />
             <h3 style={{ margin: 0 }}>Pending Assessments</h3>
          </div>
          <p>2 patient AI triage results to review.</p>
          <Button variant="secondary" onClick={() => navigate('/doctor/assessments')}>Review Assessments</Button>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
             <Users color="var(--color-primary)" />
             <h3 style={{ margin: 0 }}>Patient Directory</h3>
          </div>
          <p>Access authorized patient records.</p>
          <Button variant="secondary" onClick={() => navigate('/doctor/patients')}>View Patients</Button>
        </Card>

      </div>
    </div>
  );
};
