import { describe, expect, it } from 'vitest';
import { AMBULANCE_EMERGENCY_NUMBER, buildEmergencySmsBody, SMS_CONFIRMATION_TITLE } from './Emergency';

describe('emergency actions', () => {
  it('uses the unified emergency number only through a user-confirmed dialer action', () => {
    expect(AMBULANCE_EMERGENCY_NUMBER).toBe('112');
  });

  it('creates a neutral emergency-contact SMS draft without location or clinical details', () => {
    const message = buildEmergencySmsBody();
    expect(message).toContain('SOS');
    expect(message).not.toMatch(/location|coordinate|diagnosis|symptom/i);
  });

  it('labels the message action as a confirmation step before opening the device composer', () => {
    expect(SMS_CONFIRMATION_TITLE).toBe('Prepare SOS message');
  });
});
