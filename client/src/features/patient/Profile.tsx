import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { currentUser, updatePatientProfile } = useMockData();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.role !== 'patient') return null;

  const [firstName, lastName] = currentUser.name.split(' ');
  const [first, setFirst] = useState(firstName || '');
  const [last, setLast] = useState(lastName || '');
  const [phone, setPhone] = useState(currentUser.emergencyContacts[0]?.phone || '+1 555-0100');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !last.trim()) {
      setError('First and last name are required.');
      return;
    }
    setError('');
    setIsSaving(true);
    setSuccess(false);

    try {
      await updatePatientProfile(currentUser.id, {
        name: `${first.trim()} ${last.trim()}`
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update patient profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Patient Profile</h1>
          <p className="caption">Manage identity information and contact preferences.</p>
        </div>
      </header>

      <Card variant="glass" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Avatar & Header Identity Surface */}
        <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', 
            color: 'var(--color-secondary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '700',
            fontSize: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge status="success"><CheckCircle2 size={12} /> Verified Patient</Badge>
              <span className="caption">ID: {currentUser.id}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-panel mb-3">
            <span style={{ fontSize: 'var(--text-caption)' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex-col gap-4">
          <div className="flex gap-3">
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>First Name</label>
               <Input type="text" value={first} onChange={e => setFirst(e.target.value)} required />
             </div>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Last Name</label>
               <Input type="text" value={last} onChange={e => setLast(e.target.value)} required />
             </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Registered Email Address</label>
            <Input type="email" defaultValue={currentUser.email} readOnly style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Primary Contact Phone</label>
            <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
            {success && <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Profile updated successfully!</span>}
          </div>
        </form>
      </Card>
    </div>
  );
};
