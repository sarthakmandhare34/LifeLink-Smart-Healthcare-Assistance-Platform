import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const bootstrap = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');
const appShell = readFileSync(new URL('./components/layout/AppShell.tsx', import.meta.url), 'utf8');
const login = readFileSync(new URL('./features/patient/Login.tsx', import.meta.url), 'utf8');
const registration = readFileSync(new URL('./features/patient/Registration.tsx', import.meta.url), 'utf8');

describe('light-only interface', () => {
  it('forces the light theme, removes legacy preference storage, and exposes no patient-facing dark-mode toggle', () => {
    expect(bootstrap).toContain("document.documentElement.setAttribute('data-theme', 'light')");
    expect(bootstrap).toContain("localStorage.removeItem('lifelink_theme')");
    expect(appShell).not.toContain('Toggle theme');
    expect(login).not.toContain('EntryThemeToggle');
    expect(registration).not.toContain('EntryThemeToggle');
  });
});
