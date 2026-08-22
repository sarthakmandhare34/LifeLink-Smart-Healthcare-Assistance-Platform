import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { UserCheck, Search, MapPin, Building, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SpecialistFinder = () => {
  const { doctors, currentUser, requestAppointment } = useMockData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requestedDocId, setRequestedDocId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequest = async (doctorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    setProcessingId(doctorId);
    try {
      await requestAppointment({
        patientId: currentUser.id,
        doctorId,
        date: new Date(Date.now() + 86400000 * 5).toISOString(),
        time: '02:00 PM',
      });
      setRequestedDocId(doctorId);
      setTimeout(() => {
        setRequestedDocId(null);
        navigate('/patient/appointments');
      }, 1500);
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
          <p className="caption">Browse verified clinical specialists and request appointments.</p>
        </div>
      </header>

      {/* Glass Search & Filter Surface */}
      <Card variant="glass" className="mb-4">
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Input 
              placeholder="Search by specialty or doctor name (e.g., Cardiology, Dr. Chen)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3" style={{ fontSize: 'var(--text-h2)' }}>Available Specialists</h2>
        
        <BentoGrid>
          {filteredDoctors.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            return (
              <BentoItem key={doc.id} colSpan={2}>
                <Card 
                  variant="glass" 
                  interactive 
                  selected={isSelected}
                  className="h-full flex-col justify-between"
                  onClick={() => setSelectedDocId(isSelected ? null : doc.id)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{doc.name}</h3>
                        <p style={{ color: 'var(--color-success)', fontWeight: 600, margin: '2px 0 0 0' }}>{doc.specialty}</p>
                      </div>
                      {doc.isVerified ? (
                        <Badge status="success"><CheckCircle2 size={12} /> Verified</Badge>
                      ) : (
                        <Badge status="neutral">Verification Pending</Badge>
                      )}
                    </div>
                    
                    <div className="flex-col gap-1 mt-2">
                      <div className="caption flex items-center gap-1">
                        <Building size={14} /> {doc.hospital}
                      </div>
                      <div className="caption flex items-center gap-1">
                        <MapPin size={14} /> {doc.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* SELECT -> ELEVATE -> REVEAL -> ACT */}
                  <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                    {requestedDocId === doc.id ? (
                      <Button variant="secondary" className="w-full" disabled style={{ backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}>
                        Requested! Redirecting to Appointments...
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="w-full" 
                        onClick={(e) => handleRequest(doc.id, e)} 
                        disabled={processingId === doc.id}
                      >
                        {processingId === doc.id ? 'Requesting Appointment...' : 'Request Appointment'}
                      </Button>
                    )}
                  </div>
                </Card>
              </BentoItem>
            );
          })}
          
          {filteredDoctors.length === 0 && (
             <BentoItem colSpan={4}>
               <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                 <p className="text-muted" style={{ margin: 0 }}>No specialists found matching "{searchTerm}".</p>
               </Card>
             </BentoItem>
          )}
        </BentoGrid>
      </div>
    </div>
  );
};
