import React from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Patient } from '../../types';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  FileHeart, 
  Calendar, 
  Pill, 
  FileText, 
  UserCheck, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Activity,
  Droplets,
  Microscope,
  FileBarChart
} from 'lucide-react';

export const PatientDashboard = () => {
  const { currentUser, getUpcomingAppointment, getPatientMedicines, getPatientPrescriptions, assessments } = useMockData();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'patient') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="caption">Loading clinical workspace...</p>
      </div>
    );
  }

  const patient = currentUser as Patient;
  const upcomingAppointment = getUpcomingAppointment(patient.id);
  const activeMedicines = getPatientMedicines(patient.id);
  const recentPrescriptions = getPatientPrescriptions(patient.id);
  const lowStockMeds = activeMedicines.filter(m => m.lowStock);
  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;

  // Helper for semantic urgency styling
  const getUrgencyClass = (urgency: string) => {
    if (urgency === 'LOW') return 'urgency-low';
    if (urgency === 'MODERATE') return 'urgency-moderate';
    if (urgency === 'EMERGENCY') return 'urgency-emergency';
    return '';
  };

  const getUrgencyBadgeStatus = (urgency: string) => {
    if (urgency === 'EMERGENCY') return 'danger';
    if (urgency === 'MODERATE') return 'warning';
    return 'success';
  };

  return (
    <div style={{ padding: 0 }}>
      {/* 1. Welcome Area */}
      <div className="mb-5">
        <h1 style={{ margin: 0 }}>Good morning, {patient.name}</h1>
        <p className="caption" style={{ margin: 'var(--spacing-1) 0 0 0', fontSize: '14px' }}>
          Here's what's happening with your health today.
        </p>
      </div>
      
      {/* Low Stock Alert */}
      {lowStockMeds.length > 0 && (
        <div className="alert-panel interactive-surface mb-5" onClick={() => navigate('/patient/medicines')}>
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span><strong>Medication Notice:</strong> You are running low on {lowStockMeds.map(m => m.name).join(', ')}.</span>
          </div>
        </div>
      )}

      {/* Primary Care Area: ~60/40 Split using Bento Grid */}
      <div className="bento-grid mb-5">
        {/* AI Health Assessment - Main Focus */}
        <div className="bento-col-7 bento-row-2">
          <Card variant="glass" className="h-full flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>AI Health Assessment</h2>
                  <span className="caption">Understand your symptoms and receive AI-assisted health guidance.</span>
                </div>
              </div>

              {latestAssessment ? (
                <div className={`mb-4 ${getUrgencyClass(latestAssessment.urgency)}`} style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--border-radius-sm)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Latest Analysis</span>
                    <Badge status={getUrgencyBadgeStatus(latestAssessment.urgency) as any}>
                      {latestAssessment.urgency === 'EMERGENCY' && <ShieldAlert size={12} style={{ marginRight: '4px' }} />}
                      {latestAssessment.urgency}
                    </Badge>
                  </div>
                  <p className="caption" style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--color-text)' }}>
                    <strong>Reported:</strong> {latestAssessment.symptoms}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                     <span className="caption text-muted">{new Date(latestAssessment.date).toLocaleDateString()}</span>
                     <span className="caption" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Review details &rarr;</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 'var(--spacing-5)', background: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)', border: '1px dashed var(--color-border)', textAlign: 'center' }} className="mb-4">
                  <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                    No recent assessment. Start a new assessment for medical guidance.
                  </p>
                </div>
              )}
            </div>
            <div>
              <Button variant="primary" className="w-full" onClick={() => navigate('/patient/assessment')}>
                Start AI Assessment <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Today's Care */}
        <div className="bento-col-5 bento-row-2">
          <Card variant="glass" className="h-full flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} color="var(--color-primary)" />
              <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>Today's Care</h2>
            </div>
            
            <div className="flex-col gap-3 flex-grow">
              <div className="interactive-surface" onClick={() => navigate('/patient/appointments')} style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="caption" style={{ fontWeight: 600, color: 'var(--color-text)' }}>Next Appointment</span>
                  {upcomingAppointment ? <Badge status="success">Confirmed</Badge> : <Badge status="neutral">None</Badge>}
                </div>
                {upcomingAppointment ? (
                  <>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '15px' }}>
                      {new Date(upcomingAppointment.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {upcomingAppointment.time}
                    </div>
                    <span className="caption">Dr. Sarah Chen, Cardiology</span>
                  </>
                ) : (
                  <div className="caption text-muted">No appointments scheduled</div>
                )}
              </div>

              <div className="interactive-surface" onClick={() => navigate('/patient/medicines')} style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="caption" style={{ fontWeight: 600, color: 'var(--color-text)' }}>Medications</span>
                  <Badge status={lowStockMeds.length > 0 ? 'warning' : 'neutral'}>{activeMedicines.length} Active</Badge>
                </div>
                {activeMedicines.length > 0 ? (
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '15px' }}>
                      {activeMedicines[0].name} {activeMedicines[0].dosage}
                    </div>
                    <div className="caption">{activeMedicines[0].schedule}</div>
                    {activeMedicines.length > 1 && <div className="caption mt-1" style={{ color: 'var(--color-primary)' }}>+{activeMedicines.length - 1} more medications</div>}
                  </div>
                ) : (
                  <div className="caption text-muted">No active medications</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Health Overview Strip */}
      <div className="mb-5">
        <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-3)' }}>Health Overview</h2>
        <div className="bento-grid" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
          <div className="bento-col-3">
             <Card variant="solid" className="interactive-surface h-full flex flex-col justify-center items-center text-center" onClick={() => navigate('/patient/passport')} style={{ padding: 'var(--spacing-4)' }}>
              <Droplets size={20} color="var(--color-semantic-emergency)" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <div className="clinical-value">{patient.bloodGroup}</div>
              <span className="caption text-muted">Blood Group</span>
            </Card>
          </div>
          <div className="bento-col-3">
             <Card variant="solid" className="interactive-surface h-full flex flex-col justify-center items-center text-center" onClick={() => navigate('/patient/passport')} style={{ padding: 'var(--spacing-4)' }}>
              <ShieldAlert size={20} color="var(--color-semantic-warning)" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <div className="clinical-value">{patient.allergies.length}</div>
              <span className="caption text-muted">{patient.allergies.length === 1 ? 'Allergy' : 'Allergies'}</span>
            </Card>
          </div>
          <div className="bento-col-3">
             <Card variant="solid" className="interactive-surface h-full flex flex-col justify-center items-center text-center" onClick={() => navigate('/patient/passport')} style={{ padding: 'var(--spacing-4)' }}>
              <Microscope size={20} color="var(--color-primary)" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <div className="clinical-value">{patient.conditions.length}</div>
              <span className="caption text-muted">{patient.conditions.length === 1 ? 'Condition' : 'Conditions'}</span>
            </Card>
          </div>
          <div className="bento-col-3">
             <Card variant="solid" className="interactive-surface h-full flex flex-col justify-center items-center text-center" onClick={() => navigate('/patient/medicines')} style={{ padding: 'var(--spacing-4)' }}>
              <Pill size={20} color="var(--color-semantic-success)" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <div className="clinical-value">{activeMedicines.length}</div>
              <span className="caption text-muted">Active Prescriptions</span>
            </Card>
          </div>
        </div>
      </div>

      {/* Secondary Rows: Appointments, Activity, Actions */}
      <div className="bento-grid">
        {/* Upcoming Appointments List */}
        <div className="bento-col-5">
          <Card variant="glass" className="h-full">
            <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-4)' }}>Upcoming Appointments</h3>
            <div className="flex-col gap-3">
              {upcomingAppointment ? (
                <div className="interactive-surface flex items-center justify-between" style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }} onClick={() => navigate('/patient/appointments')}>
                  <div className="flex items-center gap-3">
                    <div style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)', padding: '10px', borderRadius: '10px', textAlign: 'center', minWidth: '55px' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(upcomingAppointment.date).toLocaleDateString(undefined, { month: 'short' })}</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>{new Date(upcomingAppointment.date).getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Dr. Sarah Chen</div>
                      <div className="caption">Cardiology • {upcomingAppointment.time}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 'var(--spacing-5)', textAlign: 'center', background: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)' }}>
                   <p className="caption text-muted">No upcoming appointments.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="bento-col-4">
          <Card variant="glass" className="h-full">
            <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-4)' }}>Recent Activity</h3>
            <div className="flex-col gap-4">
              {assessments.slice(-1).map(assessment => (
                <div key={assessment.id} className="flex gap-3">
                  <div style={{ marginTop: '2px', background: 'var(--color-primary-muted)', padding: '6px', borderRadius: '8px' }}><Stethoscope size={16} color="var(--color-primary)" /></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>AI Assessment Completed</div>
                    <div className="caption">{new Date(assessment.date).toLocaleDateString()} • {assessment.urgency} Urgency</div>
                  </div>
                </div>
              ))}
              {recentPrescriptions.slice(-1).map(rx => (
                <div key={rx.id} className="flex gap-3">
                  <div style={{ marginTop: '2px', background: 'var(--color-primary-muted)', padding: '6px', borderRadius: '8px' }}><FileText size={16} color="var(--color-primary)" /></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>New Prescription Issued</div>
                    <div className="caption">{new Date(rx.date).toLocaleDateString()} • {rx.medicines.length} medicines</div>
                  </div>
                </div>
              ))}
              {assessments.length === 0 && recentPrescriptions.length === 0 && (
                <p className="caption text-muted">No recent clinical activity recorded.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bento-col-3">
          <Card variant="glass" className="h-full">
            <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-4)' }}>Quick Actions</h3>
            <div className="flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => navigate('/patient/specialists')}>
                <span className="flex items-center gap-2"><UserCheck size={16} /> Find Specialist</span>
                <ArrowRight size={14} />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => navigate('/patient/passport')}>
                <span className="flex items-center gap-2"><FileBarChart size={16} /> Health Passport</span>
                <ArrowRight size={14} />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => navigate('/patient/medicines')}>
                <span className="flex items-center gap-2"><Pill size={16} /> Pharmacy</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};
