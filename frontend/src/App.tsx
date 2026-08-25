/**
 * Liquid-glass design note: both patient and doctor flows use the same pearlescent
 * surface system, with page-specific content kept intact inside shared shells.
 */
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DoctorAppShell } from './components/layout/DoctorAppShell';
import { PatientDashboard } from './features/patient/Dashboard';
import { HealthPassport } from './features/patient/HealthPassport';
import { MedicineCabinet } from './features/patient/MedicineCabinet';
import { PatientLogin } from './features/patient/Login';
import { PatientRegistration } from './features/patient/Registration';
import { AIAssessment } from './features/patient/AIAssessment';
import { SpecialistFinder } from './features/patient/SpecialistFinder';
import { Appointments } from './features/patient/Appointments';
import { Prescriptions } from './features/patient/Prescriptions';
import { Emergency } from './features/patient/Emergency';
import { Profile } from './features/patient/Profile';
import { Settings } from './features/patient/Settings';
import { DoctorLogin } from './features/doctor/Login';
import { DoctorSetup } from './features/doctor/Setup';
import { DoctorDashboard } from './features/doctor/Dashboard';
import { Patients } from './features/doctor/Patients';
import { DoctorAppointments } from './features/doctor/Appointments';
import { Consultation } from './features/doctor/Consultation';
import { DoctorPrescriptions } from './features/doctor/Prescriptions';
import { Assessments } from './features/doctor/Assessments';
import { DoctorProfile } from './features/doctor/Profile';
import { DoctorSettings } from './features/doctor/Settings';
import { PatientView } from './features/doctor/PatientView';
import { WorkspaceSelector } from './features/entry/WorkspaceSelector';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkspaceSelector />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegistration />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/setup" element={<DoctorSetup />} />

        <Route path="/patient" element={<AppShell />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="passport" element={<HealthPassport />} />
          <Route path="assessment" element={<AIAssessment />} />
          <Route path="specialists" element={<SpecialistFinder />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="medicines" element={<MedicineCabinet />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/doctor" element={<DoctorAppShell />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:patientId" element={<PatientView />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="prescriptions/create" element={<DoctorPrescriptions />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<DoctorSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
