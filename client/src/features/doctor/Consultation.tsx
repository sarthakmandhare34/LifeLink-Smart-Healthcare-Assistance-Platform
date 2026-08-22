import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Consultation = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Active Consultation</h1>
        <p className="caption">Demo Patient (LL-9824)</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-4)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
           <Card>
             <h2>Clinical Notes</h2>
             <textarea 
                 style={{ 
                   width: '100%', 
                   minHeight: '200px', 
                   padding: 'var(--spacing-2)', 
                   borderRadius: 'var(--border-radius-md)', 
                   border: '1px solid var(--color-border)',
                   fontFamily: 'inherit'
                 }}
                 placeholder="Enter consultation notes here..."
             />
             <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant="primary">Save Notes</Button>
                <Button variant="secondary" onClick={() => navigate('/doctor/prescriptions/create')}>Issue Prescription</Button>
             </div>
           </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
           <Card>
             <h3 style={{ margin: '0 0 var(--spacing-2) 0' }}>Patient Context</h3>
             <p className="caption"><strong>Allergies:</strong> Penicillin</p>
             <p className="caption"><strong>Conditions:</strong> Mild Hypertension</p>
             <Button variant="secondary" size="sm" style={{ marginTop: 'var(--spacing-2)' }} onClick={() => navigate('/doctor/patients/demo-id')}>Full Passport</Button>
           </Card>
        </div>

      </div>
    </div>
  );
};
