import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Patient, Doctor, Appointment, Medicine, Prescription, Assessment } from '../types';

interface MockDataState {
  currentUser: Patient | Doctor | null;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicines: Medicine[];
  prescriptions: Prescription[];
  assessments: Assessment[];
}

interface MockDataContextType extends MockDataState {
  setCurrentUser: (user: Patient | Doctor | null) => void;
  // Dashboard needs these getters
  getUpcomingAppointment: (patientId: string) => Appointment | null;
  getDoctorById: (id: string) => Doctor | null;
  getPatientMedicines: (patientId: string) => Medicine[];
  getPatientPrescriptions: (patientId: string) => Prescription[];
  addMedicine: (med: Medicine) => Promise<void>;
  updateMedicine: (id: string, updates: Partial<Medicine>) => Promise<void>;
  removeMedicine: (id: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  addAssessment: (assessment: Assessment) => Promise<void>;
  requestAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (patientData: Partial<Patient>) => Promise<void>;
  updatePatientProfile: (id: string, updates: Partial<Patient>) => Promise<void>;
}

const mockPatients: Patient[] = [
  {
    id: 'p1',
    role: 'patient',
    name: 'Demo Patient',
    email: 'patient@demo.com',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Mild Hypertension'],
    emergencyContacts: [
      { id: 'ec1', name: 'Jane Doe', relationship: 'Spouse', phone: '+1 555-0199' }
    ]
  }
];

const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    role: 'doctor',
    name: 'Dr. Sarah Chen',
    email: 'doctor@demo.com',
    specialty: 'Cardiology',
    hospital: 'LifeLink General',
    location: 'New York, NY',
    isVerified: true
  },
  {
    id: 'd2',
    role: 'doctor',
    name: 'Demo Doctor',
    email: 'demo_doctor@demo.com',
    specialty: 'General Practice',
    hospital: 'Demo Clinic',
    location: 'Remote',
    isVerified: false
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    time: '10:00 AM',
    status: 'Confirmed'
  }
];

const initialMedicines: Medicine[] = [
  {
    id: 'm1',
    patientId: 'p1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    schedule: 'Morning',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quantity: 14,
    expiry: '2027-05-01',
    lowStock: true // For demonstrating alerts
  }
];

const initialPrescriptions: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    doctorId: 'd1',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'UNSIGNED / DEMO',
    medicines: [
      { name: 'Lisinopril', dosage: '10mg', instructions: 'Take one tablet daily in the morning.' }
    ],
    clinicalNotes: 'Blood pressure slightly elevated. Starting low dose ACE inhibitor.',
    integrityReference: 'hash:8f4c2b9a1e3d7f'
  }
];

const initialAssessments: Assessment[] = [];

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Patient | Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [prescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);

  const getUpcomingAppointment = (patientId: string) => {
    return appointments.find(a => a.patientId === patientId && a.status === 'Confirmed') || null;
  };

  const getDoctorById = (id: string) => {
    return doctors.find(d => d.id === id) || null;
  };

  const getPatientMedicines = (patientId: string) => {
    return medicines.filter(m => m.patientId === patientId);
  };

  const getPatientPrescriptions = (patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  const addMedicine = async (med: Medicine) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setMedicines(prev => [...prev, med]);
        resolve();
      }, 600);
    });
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
        resolve();
      }, 600);
    });
  };

  const removeMedicine = async (id: string) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setMedicines(prev => prev.filter(m => m.id !== id));
        resolve();
      }, 600);
    });
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        resolve();
      }, 600);
    });
  };

  const addAssessment = async (assessment: Assessment) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setAssessments(prev => [...prev, assessment]);
        resolve();
      }, 1500);
    });
  };

  const requestAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const newApt: Appointment = {
          ...appointment,
          id: `a_${Date.now()}`,
          status: 'Requested'
        };
        setAppointments(prev => [...prev, newApt]);
        resolve();
      }, 1000);
    });
  };

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const patient = patients.find(p => p.email === email && p.role === 'patient');
        if (patient && password) {
          setCurrentUser(patient);
          resolve();
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (patientData: Partial<Patient>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPatient: Patient = {
          ...patientData,
          id: `p_${Date.now()}`,
          role: 'patient',
          conditions: [],
          allergies: [],
          emergencyContacts: []
        } as Patient;
        setPatients(prev => [...prev, newPatient]);
        setCurrentUser(newPatient);
        resolve();
      }, 1000);
    });
  };

  const updatePatientProfile = async (id: string, updates: Partial<Patient>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        if (currentUser && currentUser.id === id) {
          setCurrentUser(prev => prev ? { ...prev, ...updates } as Patient : prev);
        }
        resolve();
      }, 800);
    });
  };

  const value = {
    currentUser,
    setCurrentUser,
    patients,
    doctors,
    appointments,
    medicines,
    prescriptions,
    assessments,
    getUpcomingAppointment,
    getDoctorById,
    getPatientMedicines,
    getPatientPrescriptions,
    addMedicine,
    updateMedicine,
    removeMedicine,
    updateAppointmentStatus,
    addAssessment,
    requestAppointment,
    login,
    logout,
    register,
    updatePatientProfile,
  };

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
