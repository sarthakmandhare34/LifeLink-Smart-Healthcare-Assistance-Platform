import React, { useState } from 'react';
import { Outlet, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../_core/hooks/useAuth';
import { LifeLinkLogo } from '../brand/LifeLinkLogo';
import { usePatientRealtime } from '../../hooks/usePatientRealtime';
import { trpc } from '../../lib/trpc';
import {
  LayoutDashboard,
  FileHeart,
  Stethoscope,
  UserCheck,
  Calendar,
  Pill,
  FileText,
  ShieldAlert,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

const patientNavigation = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/assessment', label: 'AI Assessment', icon: Stethoscope },
  { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { to: '/patient/medicines', label: 'Medicines', icon: Pill },
  { to: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
  { to: '/patient/passport', label: 'Health Passport', icon: FileHeart },
  { to: '/patient/specialists', label: 'Specialists', icon: UserCheck },
] as const;

const accountNavigation = [
  { to: '/patient/profile', label: 'Profile', icon: User },
  { to: '/patient/settings', label: 'Settings', icon: SettingsIcon },
] as const;

const pageTitles: Record<string, string> = {
  '/patient/dashboard': 'Dashboard',
  '/patient/assessment': 'AI Health Assessment',
  '/patient/appointments': 'Appointments',
  '/patient/medicines': 'Medicine Cabinet',
  '/patient/prescriptions': 'Prescriptions',
  '/patient/passport': 'Health Passport',
  '/patient/specialists': 'Find a Specialist',
  '/patient/profile': 'Profile',
  '/patient/settings': 'Settings',
  '/patient/emergency': 'Emergency Care',
};

export const PATIENT_SIDEBAR_BRAND_LABEL = 'LifeLink patient home';

export const AppShell = () => {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const profileQuery = trpc.patientProfile.get.useQuery(undefined, { enabled: Boolean(user) });
  usePatientRealtime(Boolean(user));

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p className="caption">Loading your LifeLink workspace…</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const closeMobileNavigation = () => setIsMobileNavigationOpen(false);
  const pageTitle = pageTitles[location.pathname] ?? 'LifeLink';

  return (
    <div className="app-layout">
      {isMobileNavigationOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileNavigation}
        />
      )}

      <aside className={`app-sidebar ${isMobileNavigationOpen ? 'is-open' : ''}`} aria-label="Patient navigation">
        <div className="app-sidebar-header">
          <NavLink to="/patient/dashboard" onClick={closeMobileNavigation} className="app-sidebar-brand-link" aria-label={PATIENT_SIDEBAR_BRAND_LABEL}>
            <LifeLinkLogo className="lifelink-logo-sidebar lifelink-logo-sidebar-patient" />
            <LifeLinkLogo variant="symbol" className="lifelink-logo-sidebar-symbol" />
          </NavLink>
        </div>

        <nav className="app-sidebar-nav">
          {patientNavigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={closeMobileNavigation} className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}

          <div className="app-sidebar-divider" />

          {accountNavigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={closeMobileNavigation} className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}

          <NavLink to="/patient/emergency" onClick={closeMobileNavigation} className={({ isActive }) => `app-sidebar-nav-item sos ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={18} /> <span>SOS Emergency</span>
          </NavLink>
        </nav>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div className="app-header-context">
            <button
              type="button"
              className="app-mobile-menu-button"
              aria-label={isMobileNavigationOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileNavigationOpen}
              onClick={() => setIsMobileNavigationOpen((open) => !open)}
            >
              {isMobileNavigationOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <NavLink to="/patient/dashboard" className="app-mobile-brand" aria-label={PATIENT_SIDEBAR_BRAND_LABEL}>
              <LifeLinkLogo variant="symbol" className="app-mobile-brand-symbol" />
              <span>LifeLink</span>
            </NavLink>
            <div>
              <p className="caption app-header-eyebrow">Patient workspace</p>
              <p className="app-header-title">{pageTitle}</p>
            </div>
          </div>
          <div className="app-header-controls">
            <button className="icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="app-header-divider" />
            <button type="button" className="app-account-control" onClick={() => navigate('/patient/profile')} aria-label="Open your profile">
              <div className={`lifelink-avatar ${profileQuery.data?.avatarUrl ? 'has-photo' : ''}`} aria-hidden="true">
                {profileQuery.data?.avatarUrl ? (
                  <img src={profileQuery.data.avatarUrl} alt="" />
                ) : (
                  <LifeLinkLogo variant="symbol" className="lifelink-mark lifelink-mark-sm" />
                )}
              </div>
              <span>{user.name || 'Patient'}</span>
            </button>
            <a href="#" onClick={handleLogout} className="icon-btn" title="Sign out" aria-label="Sign out">
              <LogOut size={18} />
            </a>
          </div>
        </header>

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
