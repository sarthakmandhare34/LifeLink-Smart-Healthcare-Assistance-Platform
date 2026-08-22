import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DoctorAppointments = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Appointments</h1>
        <p className="caption">Manage your schedule and consultations.</p>
      </header>

      <div>
        <h2 style={{ fontSize: 'var(--text-h3)' }}>Today</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-3)' }}>
           
           <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-primary)' }}>
             <div>
               <h3 style={{ margin: 0 }}>Demo Patient</h3>
               <p style={{ margin: 'var(--spacing-1) 0' }}>Cardiology Consultation</p>
               <p className="caption" style={{ margin: 0 }}>10:00 AM</p>
             </div>
             <Button variant="primary" onClick={() => navigate('/doctor/consultation')}>Start Consultation</Button>
           </Card>

        </div>
      </div>
    </div>
  );
};
