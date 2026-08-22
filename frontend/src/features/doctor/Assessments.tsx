import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Assessments = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>AI Triage Assessments</h1>
        <p className="caption">Review patient-submitted symptom assessments.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <h3 style={{ margin: 0 }}>Demo Patient</h3>
              <p className="caption" style={{ margin: 'var(--spacing-1) 0' }}>Submitted: 2 hours ago</p>
            </div>
            <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--color-secondary)', color: 'var(--color-primary)', fontSize: 'var(--text-caption)' }}>Review Pending</span>
          </div>
          
          <div style={{ background: 'var(--color-background)', padding: 'var(--spacing-3)', borderRadius: 'var(--border-radius-md)', marginBottom: 'var(--spacing-3)' }}>
            <p className="caption"><strong>Reported Symptoms:</strong> Headache and mild fever for 2 days.</p>
            <p className="caption"><strong>AI Indication:</strong> Mild viral symptoms. Low Urgency.</p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
             <Button variant="primary" size="sm">Acknowledge</Button>
             <Button variant="secondary" size="sm">Schedule Consultation</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
