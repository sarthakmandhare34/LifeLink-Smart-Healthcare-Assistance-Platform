import { describe, expect, it } from 'vitest';
import { PATIENT_SIDEBAR_BRAND_LABEL, PATIENT_SIDEBAR_BRAND_NAME } from './AppShell';

describe('patient sidebar branding', () => {
  it('provides an accessible home label for the LifeLink upper-left brand control', () => {
    expect(PATIENT_SIDEBAR_BRAND_LABEL).toBe('LifeLink patient home');
  });

  it('uses only the requested LifeLink name beside the brand symbol', () => {
    expect(PATIENT_SIDEBAR_BRAND_NAME).toBe('LifeLink');
  });
});
