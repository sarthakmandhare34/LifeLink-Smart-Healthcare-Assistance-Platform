import React from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import { useTheme } from '../../context/ThemeContext';
import { LifeLinkMark } from '../brand/LifeLinkMark';
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
  Moon
} from 'lucide-react';

export const AppShell = () => {
  const { currentUser, logout } = useMockData();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Persistent Vertical Sidebar */}
      <aside className="app-sidebar">
        <div className="app-sidebar-header">
          <LifeLinkMark size="md" />
          <span className="app-sidebar-brand">LifeLink</span>
        </div>
        
        <nav className="app-sidebar-nav">
          <NavLink to="/patient/dashboard" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/patient/appointments" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={18} /> <span>Appointments</span>
          </NavLink>
          <NavLink to="/patient/assessment" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <Stethoscope size={18} /> <span>AI Assessment</span>
          </NavLink>
          <NavLink to="/patient/passport" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <FileHeart size={18} /> <span>Health Passport</span>
          </NavLink>
          <NavLink to="/patient/medicines" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <Pill size={18} /> <span>Medicines</span>
          </NavLink>
          <NavLink to="/patient/prescriptions" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={18} /> <span>Prescriptions</span>
          </NavLink>
          <NavLink to="/patient/specialists" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <UserCheck size={18} /> <span>Specialists</span>
          </NavLink>
          
          <div style={{ margin: 'var(--spacing-4) 0', borderTop: '1px solid var(--color-border)' }}></div>
          
          <NavLink to="/patient/profile" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <User size={18} /> <span>Profile</span>
          </NavLink>
          <NavLink to="/patient/settings" className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={18} /> <span>Settings</span>
          </NavLink>
          
          <NavLink to="/patient/emergency" className={({ isActive }) => `app-sidebar-nav-item sos ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={18} /> 
            <div className="flex-col gap-1">
              <span>Emergency</span>
            </div>
          </NavLink>
        </nav>
      </aside>
      
      {/* Main Workspace */}
      <main className="app-main">
        {/* Utility Header */}
        <header className="app-header">
          <div>
             {/* Page context breadcrumbs or title could go here if needed, keeping it empty for now to maintain minimal clinical feel */}
          </div>
          <div className="app-header-controls">
            <button className="icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 var(--spacing-2)' }}></div>
            
            <div className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <div className="lifelink-avatar" aria-label="Current patient">
                <LifeLinkMark size="sm" />
              </div>
            </div>
            
            <a href="#" onClick={handleLogout} className="icon-btn" title="Logout" style={{ marginLeft: 'var(--spacing-1)' }}>
              <LogOut size={18} />
            </a>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
