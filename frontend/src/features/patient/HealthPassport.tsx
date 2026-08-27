import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FileHeart, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import { trpc } from '../../lib/trpc';

type EmergencyContactDraft = {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
};

export const HealthPassport = () => {
  const trpcUtils = trpc.useUtils();
  const profileQuery = trpc.patientProfile.get.useQuery();
  const updateMutation = trpc.patientProfile.update.useMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [contactDraft, setContactDraft] = useState<EmergencyContactDraft | null>(null);
  const [contactError, setContactError] = useState('');
  const [isSavingContact, setIsSavingContact] = useState(false);
  const createEmergencyContactMutation = trpc.patientProfile.emergencyContacts.create.useMutation();
  const updateEmergencyContactMutation = trpc.patientProfile.emergencyContacts.update.useMutation();

  useEffect(() => {
    if (!profileQuery.data) return;
    setBloodGroup(profileQuery.data.bloodGroup || '');
    setAllergies(profileQuery.data.allergies.join(', '));
    setConditions(profileQuery.data.conditions.join(', '));
  }, [profileQuery.data]);

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="caption">Loading Health Passport...</p>
      </div>
    );
  }
  if (!profileQuery.data) return null;
  const patient = profileQuery.data;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        bloodGroup,
        allergies: allergies.split(',').map(s => s.trim()).filter(s => s),
        conditions: conditions.split(',').map(s => s.trim()).filter(s => s),
      });
      await trpcUtils.patientProfile.get.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const beginContactEdit = (contact?: { id: string; name: string; relationship: string; phone: string }) => {
    setContactError('');
    setContactDraft(contact ? { ...contact } : { name: '', relationship: '', phone: '' });
  };

  const cancelContactEdit = () => {
    setContactError('');
    setContactDraft(null);
  };

  const saveEmergencyContact = async () => {
    if (!contactDraft) return;
    const values = {
      name: contactDraft.name.trim(),
      relationship: contactDraft.relationship.trim(),
      phone: contactDraft.phone.trim(),
    };
    if (!values.name || !values.relationship || !values.phone) {
      setContactError('Enter the contact name, relationship, and phone number before saving.');
      return;
    }

    setIsSavingContact(true);
    setContactError('');
    try {
      if (contactDraft.id) {
        await updateEmergencyContactMutation.mutateAsync({ id: Number(contactDraft.id), values });
      } else {
        await createEmergencyContactMutation.mutateAsync(values);
      }
      await trpcUtils.patientProfile.get.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setContactDraft(null);
    } catch (error) {
      setContactError(error instanceof Error ? error.message : 'The emergency contact could not be saved. Please review the phone number and try again.');
    } finally {
      setIsSavingContact(false);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileHeart size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Health Passport</h1>
            <p className="caption">Private health information stored in your LifeLink account.</p>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={handleEditClick}>Edit Passport</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Passport'}
            </Button>
          </div>
        )}
      </header>

      <BentoGrid>
        
        {/* Basic Information - Bento Span 2 */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full">
            <CardHeader title="Patient Medical Profile" />
            <div className="flex-col gap-3">
              <div className="flex justify-between items-center" style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-muted">Blood Group</span>
                {isEditing ? (
                  <Input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} style={{ width: '120px' }} />
                ) : (
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>{patient.bloodGroup || 'Not recorded'}</strong>
                )}
              </div>
              <div className="flex justify-between items-center" style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-muted">Account Status</span>
                <Badge status="success">Patient account</Badge>
              </div>
              <div className="flex justify-between items-center" style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-muted">Email Reference</span>
                <strong>{patient.email}</strong>
              </div>
            </div>
          </Card>
        </BentoItem>

        {/* Emergency Contacts - Bento Span 2 */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full">
            <div className="flex justify-between items-center mb-3" style={{ gap: 'var(--spacing-3)' }}>
              <CardHeader title="Emergency Contacts" />
              {!contactDraft && <Button variant="outline" size="sm" onClick={() => beginContactEdit()}>Add contact</Button>}
            </div>
            <div className="flex-col gap-2">
              {patient.emergencyContacts.length ? patient.emergencyContacts.map(contact => (
                <div key={contact.id} style={{ padding: '12px var(--spacing-3)', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)' }}>
                  {contactDraft?.id === contact.id ? (
                    <EmergencyContactEditor
                      draft={contactDraft}
                      onChange={setContactDraft}
                      error={contactError}
                      isSaving={isSavingContact}
                      onCancel={cancelContactEdit}
                      onSave={saveEmergencyContact}
                    />
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-1" style={{ gap: 'var(--spacing-2)' }}>
                        <strong style={{ color: 'var(--color-primary)' }}>{contact.name}</strong>
                        <div className="flex items-center gap-2">
                          <Badge status="neutral">{contact.relationship}</Badge>
                          {!contactDraft && <Button variant="outline" size="sm" onClick={() => beginContactEdit(contact)}>Edit</Button>}
                        </div>
                      </div>
                      <div className="caption">Phone: {contact.phone}</div>
                    </>
                  )}
                </div>
              )) : <span className="text-muted caption">No emergency contacts recorded.</span>}
              {contactDraft && !contactDraft.id && (
                <div style={{ padding: '12px var(--spacing-3)', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)' }}>
                  <EmergencyContactEditor
                    draft={contactDraft}
                    onChange={setContactDraft}
                    error={contactError}
                    isSaving={isSavingContact}
                    onCancel={cancelContactEdit}
                    onSave={saveEmergencyContact}
                  />
                </div>
              )}
            </div>
          </Card>
        </BentoItem>

        {/* Allergies - Bento Span 2 */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} color="var(--color-secondary)" />
              <h3 style={{ margin: 0 }}>Recorded Allergies</h3>
            </div>
            {isEditing ? (
              <Input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Comma separated..." />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map(a => <Badge key={a} status="warning">{a}</Badge>)
                ) : (
                  <span className="text-muted caption">No known drug/food allergies recorded.</span>
                )}
              </div>
            )}
          </Card>
        </BentoItem>

        {/* Existing Conditions - Bento Span 2 */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} color="var(--color-primary)" />
              <h3 style={{ margin: 0 }}>Active Diagnoses & Conditions</h3>
            </div>
            {isEditing ? (
              <Input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Comma separated..." />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {patient.conditions.length > 0 ? (
                  patient.conditions.map(c => (
                    <div key={c} style={{ padding: '8px 12px', backgroundColor: 'rgba(0, 27, 48, 0.05)', borderRadius: 'var(--border-radius-sm)', fontWeight: 600, border: '1px solid var(--color-border)' }}>
                      {c}
                    </div>
                  ))
                ) : (
                  <span className="text-muted caption">No active chronic conditions recorded.</span>
                )}
              </div>
            )}
          </Card>
        </BentoItem>

      </BentoGrid>
    </div>
  );
};

function EmergencyContactEditor({
  draft,
  onChange,
  error,
  isSaving,
  onCancel,
  onSave,
}: {
  draft: EmergencyContactDraft;
  onChange: (draft: EmergencyContactDraft) => void;
  error: string;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex-col gap-3">
      <div className="caption" style={{ margin: 0 }}>Enter the number LifeLink should use only when you confirm an SOS message draft.</div>
      <label className="flex-col gap-1">
        <span className="caption">Contact name</span>
        <Input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} placeholder="Family member name" autoComplete="name" />
      </label>
      <label className="flex-col gap-1">
        <span className="caption">Relationship</span>
        <Input value={draft.relationship} onChange={(event) => onChange({ ...draft, relationship: event.target.value })} placeholder="For example, parent or sibling" />
      </label>
      <label className="flex-col gap-1">
        <span className="caption">Emergency contact number</span>
        <Input type="tel" value={draft.phone} onChange={(event) => onChange({ ...draft, phone: event.target.value })} placeholder="For example, +91 98765 43210" autoComplete="tel" inputMode="tel" />
      </label>
      {error && <p role="alert" style={{ margin: 0, color: 'var(--color-semantic-emergency)', fontSize: 'var(--text-caption)' }}>{error}</p>}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save contact'}</Button>
      </div>
    </div>
  );
}
