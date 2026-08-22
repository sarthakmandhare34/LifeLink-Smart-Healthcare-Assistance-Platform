import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { FileText, Lock, ArrowLeft, Pill, User } from 'lucide-react';
import type { Prescription } from '../../types';

export const Prescriptions = () => {
  const { currentUser, getPatientPrescriptions, getDoctorById } = useMockData();
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null);

  if (!currentUser) return null;

  const prescriptions = getPatientPrescriptions(currentUser.id);
  const selectedRx = prescriptions.find((p) => p.id === selectedRxId);
  const prescribingDoctor = selectedRx ? getDoctorById(selectedRx.doctorId) : null;

  if (selectedRx && prescribingDoctor) {
    return (
      <div className="container" style={{ padding: 0 }}>
        <header className="mb-4 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setSelectedRxId(null)}>
            <ArrowLeft size={16} /> Back to Prescriptions
          </Button>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h1)' }}>Digital Prescription Detail</h1>
        </header>

        {/* Level 3 Surface: Solid Structured Clinical Rx Document */}
        <Card variant="solid" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="flex justify-between items-start mb-4" style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: 'var(--spacing-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-h2)', margin: 0 }}>{prescribingDoctor.name}</h2>
              <p className="caption" style={{ margin: '4px 0' }}>{prescribingDoctor.specialty} • {prescribingDoctor.hospital}</p>
              <p className="caption" style={{ margin: 0 }}>Issue Date: {new Date(selectedRx.date).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Badge status="neutral">
                <Lock size={12} /> {selectedRx.status}
              </Badge>
              <p className="caption" style={{ marginTop: 'var(--spacing-2)', fontSize: '0.7rem' }}>
                Ref: {selectedRx.integrityReference}
              </p>
            </div>
          </div>
          
          <div style={{ padding: 'var(--spacing-2) 0' }}>
            <h3 style={{ fontSize: '28px', fontFamily: 'serif', margin: '0 0 var(--spacing-4) 0', color: 'var(--color-primary)' }}>Rx</h3>
            
            <div className="flex-col gap-3">
              {selectedRx.medicines.map((med, idx) => (
                <div key={idx} style={{ padding: 'var(--spacing-3)', background: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <Pill size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {med.name} {med.dosage}
                  </p>
                  <p className="caption" style={{ margin: 0 }}>Instructions: {med.instructions}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--spacing-5)', padding: 'var(--spacing-4)', background: 'rgba(0,27,48,0.03)', borderRadius: 'var(--border-radius-md)', border: '1px dashed var(--color-border)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-1) 0', fontSize: 'var(--text-h3)' }}>Clinical Notes & Observations</h4>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: 'var(--text-body)' }}>"{selectedRx.clinicalNotes}"</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Prescriptions</h1>
          <p className="caption">Verified digital prescription history and integrity references.</p>
        </div>
      </header>

      <BentoGrid>
        {prescriptions.map((rx) => {
          const doctor = getDoctorById(rx.doctorId);
          return (
            <BentoItem key={rx.id} colSpan={2}>
              <Card 
                variant="glass" 
                interactive 
                className="h-full flex-col justify-between" 
                onClick={() => setSelectedRxId(rx.id)}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,27,48,0.06)' }}>
                        <FileText size={22} color="var(--color-primary)" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>Prescription from {doctor?.name}</h3>
                        <span className="caption">{new Date(rx.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge status="neutral">{rx.status}</Badge>
                  </div>
                  
                  <div style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
                    <span className="caption">Prescribed Items:</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600 }}>{rx.medicines.map(m => m.name).join(', ')}</p>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'right' }}>
                  <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedRxId(rx.id); }}>
                    View Full Prescription Detail
                  </Button>
                </div>
              </Card>
            </BentoItem>
          );
        })}

        {prescriptions.length === 0 && (
          <BentoItem colSpan={4}>
            <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
              <p className="text-muted" style={{ margin: 0 }}>No prescription history found.</p>
            </Card>
          </BentoItem>
        )}
      </BentoGrid>
    </div>
  );
};
