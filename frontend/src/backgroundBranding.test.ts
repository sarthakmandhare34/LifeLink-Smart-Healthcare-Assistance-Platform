import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

describe('LifeLink background branding', () => {
  it('uses the official lockup as a subtle, non-interactive blurred background layer', () => {
    expect(globalStyles).toContain("background: url('/manus-storage/lifelink-background-lockup_56f20e75.jpg')");
    expect(globalStyles).toContain('pointer-events: none');
    expect(globalStyles).toContain('.auth-page::before {');
    expect(globalStyles).toContain('.app-layout::before {');
    expect(globalStyles).toContain('mix-blend-mode: multiply');
    expect(globalStyles).toContain('.app-layout > * { position: relative; z-index: 1; }');
    expect(globalStyles).toContain('#root { position: relative; z-index: 1; min-height: 100vh; }');
  });
});
