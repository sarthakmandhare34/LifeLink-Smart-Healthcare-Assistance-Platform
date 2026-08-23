import { describe, expect, it } from 'vitest';
import { LIFELINK_OFFICIAL_LOGO_URL } from '../brand/LifeLinkLogo';
import { PATIENT_SIDEBAR_BRAND_LABEL } from './AppShell';

describe('patient sidebar branding', () => {
  it('provides an accessible home label for the LifeLink upper-left brand control', () => {
    expect(PATIENT_SIDEBAR_BRAND_LABEL).toBe('LifeLink patient home');
  });

  it('uses the owner-supplied official LifeLink artwork instead of a synthetic mark', () => {
    expect(LIFELINK_OFFICIAL_LOGO_URL).toBe('/manus-storage/lifelink-official-logo_71a0ddff.jpg');
  });
});
