import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Lock, FileText } from 'lucide-react';

export const PatientView = () => {
  const [authorized, setAuthorized] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header>
        <h1>Patient Record: Demo Patient</h1>
        <p className="caption">ID: LL-9824</p>
      </header>

      {!authorized ? (
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-6) var(--spacing-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Lock size={48} color="var(--color-text-muted)" />
          <div>
            <h2 style={{ margin: 0 }}>Authorization Required</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-1)' }}>You must request access to view this patient's Health Passport.</p>
          </div>
          <Button variant="primary" onClick={() => setAuthorized(true)}>Request Passport Access (Mock)</Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card style={{ borderLeft: '4px solid var(--color-success)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <FileText color="var(--color-success)" />
                <h2 style={{ margin: 0, color: 'var(--color-success)' }}>Access Granted</h2>
             </div>
             <p className="caption" style={{ marginTop: 'var(--spacing-2)' }}>You have temporary access to the Health Passport for this consultation.</p>
          </Card>

          <Card>
            <h2>Health Passport Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-3)' }}>
               <div>
                 <p className="caption">Blood Group</p>
                 <p style={{ fontWeight: 600 }}>O+</p>
               </div>
               <div>
                 <p className="caption">Allergies</p>
                 <p style={{ fontWeight: 600 }}>Penicillin, Peanuts</p>
               </div>
               <div style={{ gridColumn: 'span 2' }}>
                 <p className="caption">Existing Conditions</p>
                 <p style={{ fontWeight: 600 }}>Mild Hypertension</p>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
