import { describe, expect, it } from 'vitest';
import { PATIENT_SIDEBAR_BRAND_LABEL } from './AppShell';

describe('patient sidebar branding', () => {
  it('provides an accessible home label for the LifeLink upper-left brand control', () => {
    expect(PATIENT_SIDEBAR_BRAND_LABEL).toBe('LifeLink patient home');
  });
});
