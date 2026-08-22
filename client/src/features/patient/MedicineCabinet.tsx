import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { Badge } from '../../components/ui/Badge';
import { Pill, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Medicine } from '../../types';

export const MedicineCabinet = () => {
  const { currentUser, getPatientMedicines, addMedicine, updateMedicine, removeMedicine } = useMockData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Medicine>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (!currentUser) return null;
  const activeMedicines = getPatientMedicines(currentUser.id);

  const handleOpenAdd = () => {
    setFormData({ name: '', dosage: '', schedule: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setFormData(med);
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (editingId) {
        await updateMedicine(editingId, formData);
      } else {
        await addMedicine({
          id: `m_${Date.now()}`,
          patientId: currentUser.id,
          name: formData.name || '',
          dosage: formData.dosage || '',
          schedule: formData.schedule || '',
          frequency: formData.frequency || 'Daily',
          startDate: new Date().toISOString(),
          endDate: '2026-12-31',
          quantity: 30,
          expiry: '2027-01-01',
          lowStock: false
        });
      }
      setShowForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this medication from your cabinet?')) return;
    setProcessingId(id);
    try {
      await removeMedicine(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pill size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Smart Medicine Cabinet</h1>
            <p className="caption">Manage active medications, schedules, and stock alerts.</p>
          </div>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Medication
          </Button>
        )}
      </header>

      {showForm && (
        <Card variant="glass" className="mb-4">
          <form onSubmit={handleSubmit} className="flex-col gap-3">
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Medication Record' : 'Add New Medication'}</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Medicine Name</label>
              <Input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="E.g., Lisinopril, Amoxicillin..." />
            </div>
            <div className="flex gap-3">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Dosage</label>
                <Input type="text" value={formData.dosage || ''} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 10mg" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Schedule</label>
                <Input type="text" value={formData.schedule || ''} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="e.g. Morning, Daily" required />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Save Medication'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Bento Grid layout for Medicine Cards */}
      <BentoGrid>
        {activeMedicines.map((med: Medicine) => (
          <BentoItem key={med.id} colSpan={2}>
            <Card 
              variant="solid" 
              interactive 
              style={{ 
                height: '100%', 
                borderLeft: med.lowStock ? '4px solid var(--color-secondary)' : '4px solid var(--color-success)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: processingId === med.id ? 0.5 : 1
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Pill color="var(--color-primary)" size={20} />
                    <h3 style={{ margin: 0 }}>{med.name}</h3>
                  </div>
                  {med.lowStock ? (
                    <Badge status="warning"><AlertCircle size={12} /> Low Stock</Badge>
                  ) : (
                    <Badge status="success">Active</Badge>
                  )}
                </div>

                <div className="flex gap-4 mt-3" style={{ background: 'var(--color-background)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--border-radius-sm)' }}>
                  <div>
                    <span className="caption">Dosage</span>
                    <div style={{ fontWeight: 600 }}>{med.dosage}</div>
                  </div>
                  <div>
                    <span className="caption">Schedule</span>
                    <div style={{ fontWeight: 600 }}>{med.schedule}</div>
                  </div>
                  <div>
                    <span className="caption">Frequency</span>
                    <div style={{ fontWeight: 600 }}>{med.frequency}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(med)} disabled={processingId === med.id}>
                  <Edit2 size={14} /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRemove(med.id)} disabled={processingId === med.id}>
                  <Trash2 size={14} /> {processingId === med.id ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            </Card>
          </BentoItem>
        ))}

        {activeMedicines.length === 0 && (
          <BentoItem colSpan={4}>
            <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
              <p className="text-muted" style={{ margin: 0 }}>No active medications in cabinet.</p>
            </Card>
          </BentoItem>
        )}
      </BentoGrid>
    </div>
  );
};
