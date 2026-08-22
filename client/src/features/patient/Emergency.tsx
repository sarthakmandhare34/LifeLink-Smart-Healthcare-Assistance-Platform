import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Phone, MapPin, Activity, AlertTriangle } from 'lucide-react';

export const Emergency = () => {
  const { currentUser } = useMockData();
  const [status, setStatus] = useState<'idle' | 'confirming' | 'processing' | 'triggered'>('idle');

  if (!currentUser || currentUser.role !== 'patient') return null;

  const handleTrigger = () => {
    setStatus('confirming');
  };

  const handleConfirm = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('triggered');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header className="mb-4" style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(242,184,75,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-2)' }}>
          <ShieldAlert size={32} color="var(--color-secondary)" />
        </div>
        <h1 style={{ margin: 0 }}>Emergency Assistance</h1>
        <p className="caption">Quick emergency contact notification and dispatch simulation.</p>
        <div style={{ marginTop: 'var(--spacing-2)' }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--color-primary)', color: 'var(--color-secondary)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--text-caption)', fontWeight: 700, border: '1px solid rgba(242,184,75,0.3)' }}>
            DEMO ENVIRONMENT • SIMULATED ACTION
          </span>
        </div>
      </header>

      <Card 
        variant={status === 'triggered' ? 'emergency' : 'glass'}
        style={{ 
          width: '100%', 
          maxWidth: '540px', 
          textAlign: 'center', 
          backgroundColor: status === 'triggered' ? 'var(--color-primary)' : undefined,
          color: status === 'triggered' ? 'white' : 'var(--color-text)'
        }}
      >
        {status === 'idle' && (
          <div className="flex-col gap-4 items-center">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,27,48,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={40} color="var(--color-secondary)" />
            </div>
            <div>
              <h2 style={{ color: 'var(--color-primary)', margin: '0 0 var(--spacing-1) 0' }}>SOS Emergency Dispatch</h2>
              <p style={{ margin: 0 }}>Triggering SOS will notify your recorded emergency contacts and transmit your location.</p>
              <p className="caption" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-text-muted)' }}>
                (This is a safe demonstration flow. No real emergency services will be dispatched.)
              </p>
            </div>
            
            <Button 
               variant="secondary" 
               style={{ width: '100%', padding: '16px', fontSize: 'var(--text-h2)', textTransform: 'uppercase', letterSpacing: '1px' }}
               onClick={handleTrigger}
            >
              TRIGGER SOS
            </Button>
          </div>
        )}

        {(status === 'confirming' || status === 'processing') && (
          <div className="flex-col gap-4 items-center">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 159, 128, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={40} color="var(--color-secondary)" />
            </div>
            <div>
              <h2 style={{ color: 'var(--color-primary)', margin: '0 0 var(--spacing-1) 0' }}>Confirm Emergency Trigger</h2>
              <p style={{ margin: 0 }}>Are you sure you want to activate emergency notification mode?</p>
              <p className="caption" style={{ marginTop: 'var(--spacing-2)', color: '#8C391B', fontWeight: 700 }}>
                DEMO WARNING: NO REAL EMERGENCY RESPONDERS OR SMS WILL BE CONTACTED.
              </p>
            </div>
            
            <div className="flex gap-3 w-full">
              <Button variant="outline" style={{ flex: 1 }} onClick={() => setStatus('idle')} disabled={status === 'processing'}>
                Cancel
              </Button>
              <Button variant="secondary" style={{ flex: 1 }} onClick={handleConfirm} disabled={status === 'processing'}>
                {status === 'processing' ? 'Activating...' : 'Confirm SOS'}
              </Button>
            </div>
          </div>
        )}

        {status === 'triggered' && (
          <div className="flex-col gap-4 items-center">
             <Activity size={64} color="var(--color-secondary)" />
             <div>
               <h2 style={{ color: 'white', margin: '0 0 var(--spacing-1) 0' }}>Simulated Emergency Active</h2>
               <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>Your emergency contacts have been notified in demo state.</p>
             </div>
             
             <div style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.1)', padding: 'var(--spacing-4)', borderRadius: 'var(--border-radius-md)' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'white', margin: '0 0 var(--spacing-2) 0' }}>
                  <MapPin size={18} color="var(--color-secondary)" /> 
                  Location coordinates transmitted to simulated responder pool.
                </p>
                {currentUser.emergencyContacts.map((contact) => (
                  <p key={contact.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'white', margin: 0 }}>
                    <Phone size={18} color="var(--color-secondary)" /> 
                    {contact.name} ({contact.relationship}) notified at {contact.phone}.
                  </p>
                ))}
             </div>

             <Button 
               variant="outline" 
               style={{ width: '100%', borderColor: 'white', color: 'white' }}
               onClick={() => setStatus('idle')}
            >
              Reset Emergency State
            </Button>
          </div>
        )}

      </Card>
    </div>
  );
};
