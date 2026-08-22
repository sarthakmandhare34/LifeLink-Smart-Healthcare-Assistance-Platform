import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { UserCheck, Search, MapPin, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../../lib/trpc';

export const SpecialistFinder = () => {
  const trpcUtils = trpc.useUtils();
  const directoryQuery = trpc.patientDiscovery.list.useQuery();
  const requestMutation = trpc.patientAppointment.request.useMutation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requestedAt, setRequestedAt] = useState('');
  const [requestedDocId, setRequestedDocId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState('');

  if (directoryQuery.isLoading) return <div className="flex items-center justify-center h-full"><p className="caption">Loading specialist directory…</p></div>;

  const filteredDoctors = (directoryQuery.data ?? []).filter(
    (doctor) => doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequest = async (doctorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!requestedAt) {
      setRequestError('Choose a requested visit date and time before sending an appointment request.');
      return;
    }

    setProcessingId(doctorId);
    setRequestError('');
    try {
      await requestMutation.mutateAsync({ doctorId, scheduledAt: new Date(requestedAt) });
      await trpcUtils.patientAppointment.list.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setRequestedDocId(doctorId);
      window.setTimeout(() => navigate('/patient/appointments'), 900);
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'Unable to submit the appointment request.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCheck size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Specialist Finder</h1>
          <p className="caption">Browse the LifeLink development directory and send a patient-owned appointment request.</p>
        </div>
      </header>

      <Card variant="glass" className="mb-4">
        <div className="flex-col gap-3">
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}><Input placeholder="Search by specialty or directory name…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Requested visit date and time</label>
            <Input type="datetime-local" value={requestedAt} onChange={(event) => setRequestedAt(event.target.value)} />
          </div>
          {requestError && <div className="alert-panel"><span className="caption">{requestError}</span></div>}
        </div>
      </Card>

      <div>
        <h2 className="mb-3" style={{ fontSize: 'var(--text-h2)' }}>Development Directory Specialists</h2>
        <BentoGrid>
          {filteredDoctors.map((doctor) => {
            const isSelected = selectedDocId === doctor.id;
            return (
              <BentoItem key={doctor.id} colSpan={2}>
                <Card variant="glass" interactive selected={isSelected} className="h-full flex-col justify-between" onClick={() => setSelectedDocId(isSelected ? null : doctor.id)}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{doctor.name}</h3>
                        <p style={{ color: 'var(--color-success)', fontWeight: 600, margin: '2px 0 0 0' }}>{doctor.specialty}</p>
                      </div>
                      <Badge status="neutral">Development mock</Badge>
                    </div>

                    <div className="flex-col gap-1 mt-2">
                      <div className="caption flex items-center gap-1"><Building size={14} /> {doctor.hospital}</div>
                      <div className="caption flex items-center gap-1"><MapPin size={14} /> {doctor.locality}, {doctor.city} • {doctor.railLine} line</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                    {requestedDocId === doctor.id ? (
                      <Button variant="secondary" className="w-full" disabled>Requested! Opening appointments…</Button>
                    ) : (
                      <Button variant="primary" className="w-full" onClick={(event) => handleRequest(doctor.id, event)} disabled={processingId === doctor.id}>
                        {processingId === doctor.id ? 'Requesting Appointment…' : 'Request Appointment'}
                      </Button>
                    )}
                  </div>
                </Card>
              </BentoItem>
            );
          })}

          {filteredDoctors.length === 0 && (
            <BentoItem colSpan={4}>
              <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}><p className="text-muted" style={{ margin: 0 }}>No directory entries match &ldquo;{searchTerm}&rdquo;.</p></Card>
            </BentoItem>
          )}
        </BentoGrid>
      </div>
    </div>
  );
};
