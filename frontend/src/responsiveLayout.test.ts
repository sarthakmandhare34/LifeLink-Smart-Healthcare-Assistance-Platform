import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(new URL('./index.css', import.meta.url), 'utf8');
const discoveryStyles = readFileSync(new URL('./discovery.css', import.meta.url), 'utf8');

describe('multi-display responsive layout system', () => {
  it('defines wide desktop, laptop/tablet, mobile, and compact touch-screen layout rules', () => {
    expect(globalStyles).toContain('@media (min-width: 1280px)');
    expect(globalStyles).toContain('@media (min-width: 769px) and (max-width: 1024px)');
    expect(globalStyles).toContain('@media (max-width: 768px)');
    expect(globalStyles).toContain('@media (max-width: 480px)');
    expect(globalStyles).toContain('min-height: 44px');
  });

  it('keeps the Specialist Finder map and filters responsive from tablet to compact mobile', () => {
    expect(discoveryStyles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(discoveryStyles).toContain('grid-template-columns: 1fr;');
    expect(discoveryStyles).toContain('height: clamp(280px, 62vw, 360px)');
  });
});
