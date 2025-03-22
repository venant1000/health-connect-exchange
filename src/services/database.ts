
// Simple in-app database using localStorage for persistent storage

// Define types for our data models
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  experience: number;
  location: string;
  price: number;
  availability: string;
  email: string;
  phone: string;
  bio: string;
  education: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
  date: string;
  time: string;
  type: 'video' | 'audio' | 'chat';
  price: number;
  symptoms?: string;
  notes?: string;
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  notes: string;
  followUpDate?: string;
  issuedDate: string;
  signature: string;
}

// Collections
const COLLECTIONS = {
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  CONSULTATIONS: 'consultations',
  PRESCRIPTIONS: 'prescriptions',
  USERS: 'users',
};

// Initialize database with sample data if empty
export const initializeDatabase = () => {
  // Sample doctors
  if (!localStorage.getItem(COLLECTIONS.DOCTORS)) {
    const doctors: Doctor[] = [
      {
        id: "1",
        name: "Dr. Andrew Miller",
        specialty: "Cardiologist",
        rating: 4.9,
        experience: 12,
        location: "New York, NY",
        price: 120,
        availability: "Mon-Fri, 9AM-5PM",
        email: "doctor@example.com",
        phone: "+1 (555) 987-6543",
        bio: "Board-certified cardiologist with over 12 years of experience in diagnosis and treatment of cardiovascular diseases. Specializing in preventive cardiology and heart failure management.",
        education: [
          "MD in Cardiology, Harvard Medical School",
          "Fellowship in Interventional Cardiology, Mayo Clinic",
          "Residency in Internal Medicine, Johns Hopkins Hospital",
          "Board Certified by the American Board of Cardiology"
        ],
        status: 'approved',
      },
      {
        id: "2",
        name: "Dr. Emma Wilson",
        specialty: "Neurologist",
        rating: 4.8,
        experience: 10,
        location: "Chicago, IL",
        price: 140,
        availability: "Tue-Sat, 10AM-6PM",
        email: "emma.wilson@example.com",
        phone: "+1 (555) 234-5678",
        bio: "Experienced neurologist specializing in headache disorders, stroke treatment, and neurodegenerative diseases.",
        education: [
          "MD in Neurology, Johns Hopkins University",
          "Residency at Mayo Clinic",
          "Board Certified by the American Board of Psychiatry and Neurology"
        ],
        status: 'approved',
      },
      {
        id: "3",
        name: "Dr. Michael Chen",
        specialty: "Dermatologist",
        rating: 4.7,
        experience: 8,
        location: "San Francisco, CA",
        price: 110,
        availability: "Mon-Wed, Fri, 9AM-4PM",
        email: "michael.chen@example.com",
        phone: "+1 (555) 876-5432",
        bio: "Dermatologist with expertise in skin cancer screening, cosmetic procedures, and treating chronic skin conditions.",
        education: [
          "MD from Stanford University",
          "Dermatology Residency at UCSF",
          "Board Certified by the American Board of Dermatology"
        ],
        status: 'approved',
      },
    ];
    localStorage.setItem(COLLECTIONS.DOCTORS, JSON.stringify(doctors));
  }

  // Sample patients
  if (!localStorage.getItem(COLLECTIONS.PATIENTS)) {
    const patients: Patient[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        status: 'active',
        joinedDate: "2023-01-15",
      },
      {
        id: "2",
        name: "Alice Smith",
        email: "alice@example.com",
        phone: "+1 (555) 987-6543",
        status: 'active',
        joinedDate: "2023-02-22",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1 (555) 456-7890",
        status: 'active',
        joinedDate: "2023-03-10",
      },
    ];
    localStorage.setItem(COLLECTIONS.PATIENTS, JSON.stringify(patients));
  }

  // Sample consultations
  if (!localStorage.getItem(COLLECTIONS.CONSULTATIONS)) {
    const consultations: Consultation[] = [
      {
        id: "1",
        doctorId: "1",
        patientId: "1",
        doctorName: "Dr. Andrew Miller",
        doctorSpecialty: "Cardiologist",
        patientName: "John Doe",
        status: "upcoming",
        date: "Oct 15, 2023",
        time: "10:00 AM",
        type: "video",
        price: 120,
        symptoms: "Chest pain, shortness of breath",
      },
      {
        id: "2",
        doctorId: "1",
        patientId: "2",
        doctorName: "Dr. Andrew Miller",
        doctorSpecialty: "Cardiologist",
        patientName: "Alice Smith",
        status: "completed",
        date: "Oct 5, 2023",
        time: "2:30 PM",
        type: "audio",
        price: 100,
        symptoms: "Heart palpitations, dizziness",
      },
      {
        id: "3",
        doctorId: "1",
        patientId: "3",
        doctorName: "Dr. Andrew Miller",
        doctorSpecialty: "Cardiologist",
        patientName: "Bob Johnson",
        status: "pending",
        date: "Oct 20, 2023",
        time: "4:15 PM",
        type: "chat",
        price: 90,
        symptoms: "Family history of heart disease, preventive consultation",
      },
    ];
    localStorage.setItem(COLLECTIONS.CONSULTATIONS, JSON.stringify(consultations));
  }

  // Sample users for authentication
  if (!localStorage.getItem(COLLECTIONS.USERS)) {
    const users = [
      {
        id: "1",
        type: "patient",
        email: "patient@example.com",
        password: "password", // In a real app, use hashed passwords
        patientId: "1"
      },
      {
        id: "2",
        type: "doctor",
        email: "doctor@example.com",
        password: "password",
        doctorId: "1"
      },
      {
        id: "3",
        type: "admin",
        email: "admin@example.com",
        password: "password"
      },
    ];
    localStorage.setItem(COLLECTIONS.USERS, JSON.stringify(users));
  }

  console.log("Database initialized with sample data");
};

// Generic CRUD operations
export const db = {
  getAll: <T>(collection: string): T[] => {
    const data = localStorage.getItem(collection);
    return data ? JSON.parse(data) : [];
  },
  
  getById: <T>(collection: string, id: string): T | null => {
    const all = db.getAll<T>(collection);
    return all.find((item: any) => item.id === id) || null;
  },
  
  create: <T>(collection: string, item: T): T => {
    const all = db.getAll<T>(collection);
    // @ts-ignore - We know id exists in our data models
    const withId = { ...item, id: crypto.randomUUID() };
    localStorage.setItem(collection, JSON.stringify([...all, withId]));
    return withId;
  },
  
  update: <T>(collection: string, id: string, updates: Partial<T>): T | null => {
    const all = db.getAll<T>(collection);
    const index = all.findIndex((item: any) => item.id === id);
    
    if (index === -1) return null;
    
    all[index] = { ...all[index], ...updates };
    localStorage.setItem(collection, JSON.stringify(all));
    return all[index];
  },
  
  delete: <T>(collection: string, id: string): boolean => {
    const all = db.getAll<T>(collection);
    const filtered = all.filter((item: any) => item.id !== id);
    
    if (filtered.length === all.length) return false;
    
    localStorage.setItem(collection, JSON.stringify(filtered));
    return true;
  },

  // Specific collection getters
  doctors: {
    getAll: (): Doctor[] => db.getAll<Doctor>(COLLECTIONS.DOCTORS),
    getById: (id: string): Doctor | null => db.getById<Doctor>(COLLECTIONS.DOCTORS, id),
    create: (doctor: Omit<Doctor, 'id'>): Doctor => db.create<Doctor>(COLLECTIONS.DOCTORS, doctor as Doctor),
    update: (id: string, updates: Partial<Doctor>): Doctor | null => db.update<Doctor>(COLLECTIONS.DOCTORS, id, updates),
    delete: (id: string): boolean => db.delete<Doctor>(COLLECTIONS.DOCTORS, id),
    getByStatus: (status: Doctor['status']): Doctor[] => {
      return db.getAll<Doctor>(COLLECTIONS.DOCTORS).filter(doctor => doctor.status === status);
    }
  },
  
  patients: {
    getAll: (): Patient[] => db.getAll<Patient>(COLLECTIONS.PATIENTS),
    getById: (id: string): Patient | null => db.getById<Patient>(COLLECTIONS.PATIENTS, id),
    create: (patient: Omit<Patient, 'id'>): Patient => db.create<Patient>(COLLECTIONS.PATIENTS, patient as Patient),
    update: (id: string, updates: Partial<Patient>): Patient | null => db.update<Patient>(COLLECTIONS.PATIENTS, id, updates),
    delete: (id: string): boolean => db.delete<Patient>(COLLECTIONS.PATIENTS, id),
  },
  
  consultations: {
    getAll: (): Consultation[] => db.getAll<Consultation>(COLLECTIONS.CONSULTATIONS),
    getById: (id: string): Consultation | null => db.getById<Consultation>(COLLECTIONS.CONSULTATIONS, id),
    create: (consultation: Omit<Consultation, 'id'>): Consultation => db.create<Consultation>(COLLECTIONS.CONSULTATIONS, consultation as Consultation),
    update: (id: string, updates: Partial<Consultation>): Consultation | null => db.update<Consultation>(COLLECTIONS.CONSULTATIONS, id, updates),
    delete: (id: string): boolean => db.delete<Consultation>(COLLECTIONS.CONSULTATIONS, id),
    getByDoctorId: (doctorId: string): Consultation[] => {
      return db.getAll<Consultation>(COLLECTIONS.CONSULTATIONS).filter(c => c.doctorId === doctorId);
    },
    getByPatientId: (patientId: string): Consultation[] => {
      return db.getAll<Consultation>(COLLECTIONS.CONSULTATIONS).filter(c => c.patientId === patientId);
    },
    getByStatus: (status: Consultation['status']): Consultation[] => {
      return db.getAll<Consultation>(COLLECTIONS.CONSULTATIONS).filter(c => c.status === status);
    },
    getDoctorConsultations: (doctorId: string, status?: Consultation['status']): Consultation[] => {
      const consultations = db.getAll<Consultation>(COLLECTIONS.CONSULTATIONS).filter(c => c.doctorId === doctorId);
      return status ? consultations.filter(c => c.status === status) : consultations;
    }
  },
  
  prescriptions: {
    getAll: (): Prescription[] => db.getAll<Prescription>(COLLECTIONS.PRESCRIPTIONS),
    getById: (id: string): Prescription | null => db.getById<Prescription>(COLLECTIONS.PRESCRIPTIONS, id),
    create: (prescription: Omit<Prescription, 'id'>): Prescription => db.create<Prescription>(COLLECTIONS.PRESCRIPTIONS, prescription as Prescription),
    update: (id: string, updates: Partial<Prescription>): Prescription | null => db.update<Prescription>(COLLECTIONS.PRESCRIPTIONS, id, updates),
    delete: (id: string): boolean => db.delete<Prescription>(COLLECTIONS.PRESCRIPTIONS, id),
    getByPatientId: (patientId: string): Prescription[] => {
      return db.getAll<Prescription>(COLLECTIONS.PRESCRIPTIONS).filter(p => p.patientId === patientId);
    },
    getByConsultationId: (consultationId: string): Prescription | null => {
      const prescriptions = db.getAll<Prescription>(COLLECTIONS.PRESCRIPTIONS);
      return prescriptions.find(p => p.consultationId === consultationId) || null;
    }
  },
};
