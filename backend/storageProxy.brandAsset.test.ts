import { describe, expect, it } from 'vitest';
import {
  LIFELINK_OFFICIAL_LOGO_LOCKUP_ROUTE,
  LIFELINK_OFFICIAL_LOGO_LOCKUP_STORAGE_KEY,
  LIFELINK_OFFICIAL_LOGO_ROUTE,
  LIFELINK_OFFICIAL_LOGO_STORAGE_KEY,
} from './_core/storageProxy';

describe('official LifeLink branding asset route', () => {
  it('uses a stable same-origin image route for the owner-supplied logo', () => {
    expect(LIFELINK_OFFICIAL_LOGO_ROUTE).toBe('/assets/branding/lifelink-logo.jpg');
    expect(LIFELINK_OFFICIAL_LOGO_ROUTE).not.toContain('manus-storage');
  });

  it('maps the route to the managed official-logo storage key', () => {
    expect(LIFELINK_OFFICIAL_LOGO_STORAGE_KEY).toBe('lifelink-official-logo_71a0ddff.jpg');
  });

  it('provides a dedicated tightly framed route for full wordmarks and the visible tagline', () => {
    expect(LIFELINK_OFFICIAL_LOGO_LOCKUP_ROUTE).toBe('/assets/branding/lifelink-logo-lockup.jpg');
    expect(LIFELINK_OFFICIAL_LOGO_LOCKUP_STORAGE_KEY).toBe('lifelink-official-logo-lockup_f75be2e5.jpg');
  });
});
