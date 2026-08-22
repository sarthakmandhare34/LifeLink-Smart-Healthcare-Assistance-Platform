import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { CheckCircle2, Clock, XCircle, Calendar as CalendarIcon, User } from 'lucide-react';

export const Appointments = () => {
  const { currentUser, appointments, getDoctorById, updateAppointmentStatus } = useMockData();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!currentUser) return null;

  const patientAppointments = appointments.filter((a) => a.patientId === currentUser.id);
  const upcoming = patientAppointments.filter((a) => ['Requested', 'Pending', 'Confirmed'].includes(a.status));
  const past = patientAppointments.filter((a) => ['Completed', 'Cancelled'].includes(a.status));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 size={14} />;
      case 'Requested':
      case 'Pending': return <Clock size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Requested':
      case 'Pending': return 'neutral';
      case 'Cancelled': return 'neutral'; // No red allowed in B.6
      default: return 'neutral';
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment request?')) return;
    setCancellingId(id);
    try {
      await updateAppointmentStatus(id, 'Cancelled');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalendarIcon size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Appointments</h1>
          <p className="caption">Manage your scheduled clinical consultations and history.</p>
        </div>
      </header>

      {/* Upcoming Section */}
      <div className="mb-6">
        <h2 className="mb-3" style={{ fontSize: 'var(--text-h2)' }}>Upcoming Consultations</h2>
        <BentoGrid>
          {upcoming.map((apt) => {
            const doctor = getDoctorById(apt.doctorId);
            return (
              <BentoItem key={apt.id} colSpan={2}>
                <Card variant="glass" interactive className="h-full flex-col justify-between" style={{ opacity: cancellingId === apt.id ? 0.5 : 1 }}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {doctor?.name.charAt(0) || <User size={20} />}
                        </div>
                        <div>
                          <h3 style={{ margin: 0 }}>{doctor?.name || 'Assigned Specialist'}</h3>
                          <span className="caption">{doctor?.specialty} • {doctor?.hospital}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(apt.status) as any}>
                        {getStatusIcon(apt.status)} {apt.status}
                      </Badge>
                    </div>

                    <div style={{ padding: 'var(--spacing-3)', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)' }}>
                      <div className="flex justify-between items-center">
                        <span className="caption">Date & Time</span>
                        <strong style={{ color: 'var(--color-primary)' }}>
                          {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {apt.time}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'right' }}>
                    <Button variant="outline" size="sm" onClick={() => handleCancel(apt.id)} disabled={cancellingId === apt.id}>
                      {cancellingId === apt.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </Button>
                  </div>
                </Card>
              </BentoItem>
            );
          })}

          {upcoming.length === 0 && (
             <BentoItem colSpan={4}>
               <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                 <p className="text-muted" style={{ margin: 0 }}>No upcoming appointments scheduled.</p>
               </Card>
             </BentoItem>
          )}
        </BentoGrid>
      </div>

      {/* Past History Section */}
      <div>
        <h2 className="mb-3" style={{ fontSize: 'var(--text-h2)' }}>Consultation History</h2>
        <div className="flex-col gap-3">
          {past.map((apt) => {
            const doctor = getDoctorById(apt.doctorId);
            return (
              <Card key={apt.id} variant="solid" className="flex justify-between items-center" style={{ opacity: 0.85 }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>{doctor?.name || 'Specialist'}</h3>
                    <Badge variant={getStatusVariant(apt.status) as any}>
                      {getStatusIcon(apt.status)} {apt.status}
                    </Badge>
                  </div>
                  <span className="caption">{doctor?.specialty} • {new Date(apt.date).toLocaleDateString()} at {apt.time}</span>
                </div>
              </Card>
            );
          })}
          {past.length === 0 && (
            <p className="text-muted caption">No past appointments recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};
