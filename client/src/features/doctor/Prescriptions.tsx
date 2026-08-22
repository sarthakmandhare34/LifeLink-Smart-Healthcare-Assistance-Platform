import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FileText, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const DoctorPrescriptions = () => {
  const location = useLocation();
  const isCreate = location.pathname.includes('create');
  const [viewDetail, setViewDetail] = useState(false);

  if (isCreate) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <header>
          <h1>Create Prescription</h1>
          <p className="caption">Issue a new digital prescription for Demo Patient.</p>
        </header>

        <Card style={{ maxWidth: '800px' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Medication Name</label>
              <Input placeholder="E.g., Amoxicillin" />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Dosage</label>
                 <Input placeholder="E.g., 500mg" />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Frequency</label>
                 <Input placeholder="E.g., Twice daily" />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600 }}>Duration</label>
                 <Input placeholder="E.g., 7 days" />
               </div>
            </div>
            
            <div style={{ padding: 'var(--spacing-3)', background: 'var(--color-background)', borderRadius: 'var(--border-radius-md)', marginTop: 'var(--spacing-2)' }}>
              <p className="caption" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <Lock size={14} /> This action will generate an <strong>UNSIGNED / DEMO</strong> mock prescription.
              </p>
            </div>

            <Button type="button" variant="primary" style={{ marginTop: 'var(--spacing-2)', alignSelf: 'flex-start' }}>Generate Mock Prescription</Button>
          </form>
        </Card>
      </div>
    );
  }

  if (viewDetail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm" onClick={() => setViewDetail(false)}>Back</Button>
          <h1 style={{ margin: 0 }}>Prescription Detail</h1>
        </header>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <h2>Patient: Demo Patient</h2>
              <p className="caption">ID: LL-9824</p>
              <p className="caption">Date: Oct 01, 2026</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', background: 'var(--color-border)', fontSize: 'var(--text-caption)' }}>
                <Lock size={12} /> UNSIGNED / DEMO
              </span>
            </div>
          </div>
          
          <div style={{ padding: 'var(--spacing-2) 0' }}>
            <h3 style={{ fontSize: 'var(--text-h3)' }}>Rx</h3>
            <ul style={{ paddingLeft: 'var(--spacing-4)', margin: 'var(--spacing-2) 0', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li><strong>Lisinopril 10mg</strong> - Take 1 tablet by mouth daily for 30 days.</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Issued Prescriptions</h1>
          <p className="caption">History of prescriptions you have issued.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
             <FileText size={32} color="var(--color-primary)" />
             <div>
               <h3 style={{ margin: 0 }}>Prescription for Demo Patient</h3>
               <p className="caption" style={{ margin: 'var(--spacing-1) 0' }}>Oct 01, 2026</p>
             </div>
          </div>
          <Button variant="secondary" onClick={() => setViewDetail(true)}>View Detail</Button>
        </Card>
      </div>
    </div>
  );
};
