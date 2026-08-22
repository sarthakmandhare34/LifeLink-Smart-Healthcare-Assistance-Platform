/**
 * Liquid-glass design note: clinician navigation uses the shared glass surface
 * classes so it carries the same pearlescent depth as the patient experience.
 */
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Calendar, LayoutDashboard, FileText, Users, Activity, Stethoscope, Settings, User } from 'lucide-react';
import { LifeLinkMark } from '../brand/LifeLinkMark';
import { LifeLinkLogo } from '../brand/LifeLinkLogo';

const navItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/patients', label: 'My Patients', icon: Users },
  { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { path: '/doctor/consultation', label: 'Consultation', icon: Stethoscope },
  { path: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
  { path: '/doctor/assessments', label: 'Assessments', icon: Activity },
];

export const DoctorAppShell = () => (
  <div className="doctor-layout">
    <aside className="doctor-sidebar">
      <div className="doctor-sidebar-brand">
        <LifeLinkLogo className="lifelink-logo-sidebar" />
      </div>
      <nav className="doctor-sidebar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `doctor-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    <div className="doctor-main">
      <header className="doctor-header">
        <NavLink to="/doctor/settings" className="icon-btn" aria-label="Doctor settings"><Settings size={20} /></NavLink>
        <NavLink to="/doctor/profile" className="doctor-profile-link">
          <span className="doctor-avatar"><LifeLinkMark size="sm" /></span>
          <span>Dr. Ananya Sharma</span>
          <User size={18} />
        </NavLink>
      </header>
      <main className="doctor-content">
        <div className="container"><Outlet /></div>
      </main>
    </div>
  </div>
);
