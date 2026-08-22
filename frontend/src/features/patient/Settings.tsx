import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useMockData } from '../../context/MockDataContext';
import { Settings as SettingsIcon, Bell, Shield, Trash2 } from 'lucide-react';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';

export const Settings = () => {
  const { currentUser, updatePatientProfile } = useMockData();
  const patient = currentUser as any;

  const [aptReminders, setAptReminders] = useState(true);
  const [medAlerts, setMedAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (patient?.settings) {
      setAptReminders(patient.settings.aptReminders);
      setMedAlerts(patient.settings.medAlerts);
    }
  }, [patient]);

  const handleSave = async () => {
    if (!patient) return;
    setIsSaving(true);
    setSuccess(false);
    try {
      await updatePatientProfile(patient.id, {
        settings: { aptReminders, medAlerts }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SettingsIcon size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Workspace Settings</h1>
          <p className="caption">Configure notification preferences and privacy defaults.</p>
        </div>
      </header>

      <BentoGrid>
        
        {/* Notifications Bento Section */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Bell size={20} color="var(--color-primary)" />
                <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>Clinical Notifications</h2>
              </div>
              
              <div className="flex-col gap-3">
                <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                   <div>
                     <p style={{ margin: 0, fontWeight: 600 }}>Appointment Reminders</p>
                     <span className="caption">Receive SMS/Email reminders 24h prior to consultations</span>
                   </div>
                   <input 
                     type="checkbox" 
                     checked={aptReminders} 
                     onChange={(e) => setAptReminders(e.target.checked)} 
                     style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.2)', cursor: 'pointer' }} 
                   />
                </div>

                <div className="flex items-center justify-between py-2">
                   <div>
                     <p style={{ margin: 0, fontWeight: 600 }}>Medication Low-Stock Alerts</p>
                     <span className="caption">Receive alerts when prescription quantities drop below 3-day supply</span>
                   </div>
                   <input 
                     type="checkbox" 
                     checked={medAlerts} 
                     onChange={(e) => setMedAlerts(e.target.checked)} 
                     style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.2)', cursor: 'pointer' }} 
                   />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving Settings...' : 'Save Notification Preferences'}
              </Button>
              {success && <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 'var(--text-caption)' }}>Saved!</span>}
            </div>
          </Card>
        </BentoItem>

        {/* Security & Account Bento Section */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Shield size={20} color="var(--color-primary)" />
                <h2 style={{ margin: 0, fontSize: 'var(--text-h2)' }}>Security & Account Privileges</h2>
              </div>
              
              <div className="flex items-center justify-between py-2 mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Account Security Password</p>
                  <span className="caption">Last updated 30 days ago</span>
                </div>
                <Button variant="secondary" size="sm">Change Password</Button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-muted)' }}>Delete Account</p>
                  <span className="caption">Contact platform administrator to revoke record access</span>
                </div>
                <Button variant="outline" size="sm" disabled style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <Trash2 size={14} /> Request Deletion
                </Button>
              </div>
            </div>
          </Card>
        </BentoItem>

      </BentoGrid>
    </div>
  );
};
