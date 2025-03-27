
// Database simulation using localStorage for browser compatibility
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
  licenseDocument?: string; // New field for license document
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface User {
  id: string;
  type: 'patient' | 'doctor' | 'admin';
  email: string;
  password: string;
  doctorId?: string;
  patientId?: string;
}

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled' | 'negotiating';
  date: string;
  time: string;
  type: 'video' | 'audio' | 'chat';
  price: number;
  symptoms?: string;
  notes?: string;
  paymentStatus: 'pending' | 'completed';
  roomId?: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: string; // JSON string of medications array
  notes: string;
  followUpDate?: string;
  issuedDate: string;
  signature: string;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  senderType: 'doctor' | 'patient';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  patientId?: string;
  consultationId?: string;
  doctorId?: string; // Added doctorId to track which doctor received payment
}

// New interface for price negotiations
export interface PriceNegotiation {
  id: string;
  consultationId: string;
  proposedPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  initiatedBy: 'doctor' | 'patient';
  timestamp: string;
}

export interface HealthMetric {
  id: string;
  patientId: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface UserProfileData {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

// Helper functions to work with localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize database with sample data if needed
export const initializeDatabase = () => {
  // Initialize users
  if (!localStorage.getItem('users')) {
    const users: User[] = [
      {
        id: "1",
        type: "doctor",
        email: "doctor@example.com",
        password: "password",
        doctorId: "1"
      },
      {
        id: "2",
        type: "patient",
        email: "patient@example.com",
        password: "password",
        patientId: "1"
      },
      {
        id: "3",
        type: "admin",
        email: "admin@example.com",
        password: "password"
      }
    ];
    setItem('users', users);
  }

  // Initialize doctors
  if (!localStorage.getItem('doctors')) {
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
        licenseDocument: "license_1.pdf" // Mock license document
      },
      {
        id: "2",
        name: "Dr. Emma Wilson",
        specialty: "Cardiologist",
        rating: 4.8,
        experience: 12,
        location: "New York, NY",
        price: 120,
        availability: "Mon-Fri, 9AM-5PM",
        email: "emma@example.com",
        phone: "+1 (555) 123-4567",
        bio: "Board-certified cardiologist with expertise in non-invasive cardiology, cardiovascular imaging, and women's heart health.",
        education: [
          "MD, Stanford University School of Medicine",
          "Cardiology Fellowship, Cleveland Clinic",
          "Internal Medicine Residency, Massachusetts General Hospital",
          "Board Certified in Cardiovascular Disease"
        ],
        status: 'approved'
      },
      {
        id: "3",
        name: "Dr. Michael Chen",
        specialty: "Neurologist",
        rating: 4.7,
        experience: 8,
        location: "San Francisco, CA",
        price: 140,
        availability: "Mon, Wed, Fri, 10AM-6PM",
        email: "michael@example.com",
        phone: "+1 (555) 234-5678",
        bio: "Neurologist specializing in stroke prevention, headache disorders, and neurodegenerative diseases with a focus on personalized treatment plans.",
        education: [
          "MD, Johns Hopkins School of Medicine",
          "Neurology Residency, UCSF Medical Center",
          "Fellowship in Vascular Neurology, Mayo Clinic",
          "Board Certified in Neurology"
        ],
        status: 'approved'
      }
    ];
    setItem('doctors', doctors);
  }

  // Initialize patients
  if (!localStorage.getItem('patients')) {
    const patients: Patient[] = [
      {
        id: "1",
        name: "John Doe",
        email: "patient@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        status: "active",
        joinedDate: "2023-01-15"
      }
    ];
    setItem('patients', patients);
  }

  // Initialize consultations
  if (!localStorage.getItem('consultations')) {
    const consultations: Consultation[] = [
      {
        id: "1",
        doctorId: "2",
        patientId: "1",
        doctorName: "Dr. Emma Wilson",
        doctorSpecialty: "Cardiologist",
        patientName: "John Doe",
        status: "upcoming",
        date: "Oct 15, 2023",
        time: "10:00 AM",
        type: "video",
        price: 120,
        symptoms: "Chest pain, shortness of breath during exercise",
        paymentStatus: "completed",
        roomId: "room_abc123"
      },
      {
        id: "2",
        doctorId: "3",
        patientId: "1",
        doctorName: "Dr. Michael Chen",
        doctorSpecialty: "Neurologist",
        patientName: "John Doe",
        status: "completed",
        date: "Oct 5, 2023",
        time: "2:30 PM",
        type: "audio",
        price: 100,
        symptoms: "Frequent headaches, sensitivity to light",
        notes: "Patient reported improvement with prescribed medication. Recommended follow-up in 3 months.",
        paymentStatus: "completed",
        roomId: "room_def456"
      },
      {
        id: "3",
        doctorId: "1",
        patientId: "1",
        doctorName: "Dr. Andrew Miller",
        doctorSpecialty: "Cardiologist",
        patientName: "John Doe",
        status: "pending",
        date: "Oct 20, 2023",
        time: "4:15 PM",
        type: "chat",
        price: 90,
        symptoms: "Follow-up for previous heart condition",
        paymentStatus: "pending",
        roomId: "room_ghi789"
      }
    ];
    setItem('consultations', consultations);
  }

  // Initialize prescriptions
  if (!localStorage.getItem('prescriptions')) {
    setItem('prescriptions', []);
  }

  // Initialize messages
  if (!localStorage.getItem('messages')) {
    const messages: Message[] = [
      {
        id: "1",
        consultationId: "2",
        senderId: "3", // Dr. Michael Chen
        senderType: "doctor",
        content: "Hello John, how are your headaches since our last consultation?",
        timestamp: "2023-10-06T10:15:00Z",
        isRead: true
      },
      {
        id: "2",
        consultationId: "2",
        senderId: "1", // Patient (John)
        senderType: "patient",
        content: "Hi Dr. Chen, they've improved with the medication you prescribed, but I still get occasional mild headaches.",
        timestamp: "2023-10-06T10:18:00Z",
        isRead: true
      },
      {
        id: "3",
        consultationId: "2",
        senderId: "3", // Dr. Michael Chen
        senderType: "doctor",
        content: "That's good to hear. If the mild headaches persist, we might need to adjust the dosage. Let's discuss this in your next appointment.",
        timestamp: "2023-10-06T10:20:00Z",
        isRead: true
      }
    ];
    setItem('messages', messages);
  }

  // Initialize transactions
  if (!localStorage.getItem('transactions')) {
    const transactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 200,
        date: "Oct 1, 2023",
        description: "Added funds via credit card",
        patientId: "1"
      },
      {
        id: "2",
        type: "debit",
        amount: 120,
        date: "Oct 2, 2023",
        description: "Payment for Dr. Emma Wilson consultation",
        patientId: "1",
        consultationId: "1",
        doctorId: "2"
      },
      {
        id: "3",
        type: "debit",
        amount: 100,
        date: "Oct 3, 2023",
        description: "Payment for Dr. Michael Chen consultation",
        patientId: "1",
        consultationId: "2",
        doctorId: "3"
      }
    ];
    setItem('transactions', transactions);
  }

  // Initialize price negotiations (new)
  if (!localStorage.getItem('priceNegotiations')) {
    setItem('priceNegotiations', []);
  }

  // Initialize health metrics
  if (!localStorage.getItem('healthMetrics')) {
    setItem('healthMetrics', []);
  }

  // Initialize user profile data
  if (!localStorage.getItem('userProfiles')) {
    setItem('userProfiles', []);
  }

  console.log("Database initialized with sample data");
};

// Run initialization
initializeDatabase();

// SQLite-inspired database service
class SQLiteSimulationService {
  // Generate a UUID for IDs
  private generateId(): string {
    return crypto.randomUUID();
  }

  // User operations
  users = {
    login: (email: string, password: string): User | null => {
      const users = getItem<User[]>('users', []);
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
    },
    
    register: (user: Omit<User, 'id'>): User => {
      const users = getItem<User[]>('users', []);
      const id = this.generateId();
      const newUser: User = { ...user, id };
      users.push(newUser);
      setItem('users', users);
      return newUser;
    },
    
    getById: (id: string): User | null => {
      const users = getItem<User[]>('users', []);
      const user = users.find(u => u.id === id);
      return user || null;
    },
    
    getByEmail: (email: string): User | null => {
      const users = getItem<User[]>('users', []);
      const user = users.find(u => u.email === email);
      return user || null;
    }
  };
  
  // Doctor operations
  doctors = {
    getAll: (): Doctor[] => {
      return getItem<Doctor[]>('doctors', []);
    },
    
    getById: (id: string): Doctor | null => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const doctor = doctors.find(d => d.id === id);
      return doctor || null;
    },
    
    create: (doctor: Omit<Doctor, 'id'>): Doctor => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const id = this.generateId();
      const newDoctor: Doctor = { ...doctor, id };
      doctors.push(newDoctor);
      setItem('doctors', doctors);
      return newDoctor;
    },
    
    update: (id: string, updates: Partial<Doctor>): Doctor | null => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const index = doctors.findIndex(d => d.id === id);
      if (index === -1) return null;
      
      const updatedDoctor = { ...doctors[index], ...updates };
      doctors[index] = updatedDoctor;
      setItem('doctors', doctors);
      return updatedDoctor;
    },
    
    delete: (id: string): boolean => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const filtered = doctors.filter(d => d.id !== id);
      setItem('doctors', filtered);
      return filtered.length < doctors.length;
    },
    
    getByStatus: (status: Doctor['status']): Doctor[] => {
      const doctors = getItem<Doctor[]>('doctors', []);
      return doctors.filter(d => d.status === status);
    },
    
    uploadLicenseDocument: (id: string, documentUrl: string): Doctor | null => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const index = doctors.findIndex(d => d.id === id);
      if (index === -1) return null;
      
      doctors[index].licenseDocument = documentUrl;
      setItem('doctors', doctors);
      return doctors[index];
    },
    
    getPendingVerifications: (): Doctor[] => {
      const doctors = getItem<Doctor[]>('doctors', []);
      return doctors.filter(d => d.status === 'pending');
    },
    
    updateVerificationStatus: (id: string, status: 'approved' | 'rejected'): Doctor | null => {
      const doctors = getItem<Doctor[]>('doctors', []);
      const index = doctors.findIndex(d => d.id === id);
      if (index === -1) return null;
      
      doctors[index].status = status;
      setItem('doctors', doctors);
      return doctors[index];
    }
  };
  
  // Patient operations
  patients = {
    getAll: (): Patient[] => {
      return getItem<Patient[]>('patients', []);
    },
    
    getById: (id: string): Patient | null => {
      const patients = getItem<Patient[]>('patients', []);
      const patient = patients.find(p => p.id === id);
      return patient || null;
    },
    
    create: (patient: Omit<Patient, 'id'>): Patient => {
      const patients = getItem<Patient[]>('patients', []);
      const id = this.generateId();
      const newPatient: Patient = { ...patient, id };
      patients.push(newPatient);
      setItem('patients', patients);
      return newPatient;
    },
    
    update: (id: string, updates: Partial<Patient>): Patient | null => {
      const patients = getItem<Patient[]>('patients', []);
      const index = patients.findIndex(p => p.id === id);
      if (index === -1) return null;
      
      const updatedPatient = { ...patients[index], ...updates };
      patients[index] = updatedPatient;
      setItem('patients', patients);
      return updatedPatient;
    },
    
    delete: (id: string): boolean => {
      const patients = getItem<Patient[]>('patients', []);
      const filtered = patients.filter(p => p.id !== id);
      setItem('patients', filtered);
      return filtered.length < patients.length;
    }
  };
  
  // Consultation operations
  consultations = {
    getAll: (): Consultation[] => {
      return getItem<Consultation[]>('consultations', []);
    },
    
    getById: (id: string): Consultation | null => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const consultation = consultations.find(c => c.id === id);
      return consultation || null;
    },
    
    create: (consultation: Omit<Consultation, 'id'>): Consultation => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const id = this.generateId();
      // Generate a unique room ID for video calls
      const roomId = `room_${this.generateId().split('-')[0]}`;
      
      const newConsultation: Consultation = { 
        ...consultation, 
        id, 
        roomId 
      };
      
      consultations.push(newConsultation);
      setItem('consultations', consultations);
      return newConsultation;
    },
    
    update: (id: string, updates: Partial<Consultation>): Consultation | null => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const index = consultations.findIndex(c => c.id === id);
      if (index === -1) return null;
      
      const updatedConsultation = { ...consultations[index], ...updates };
      consultations[index] = updatedConsultation;
      setItem('consultations', consultations);
      return updatedConsultation;
    },
    
    delete: (id: string): boolean => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const filtered = consultations.filter(c => c.id !== id);
      setItem('consultations', filtered);
      return filtered.length < consultations.length;
    },
    
    getByDoctorId: (doctorId: string): Consultation[] => {
      const consultations = getItem<Consultation[]>('consultations', []);
      return consultations.filter(c => c.doctorId === doctorId);
    },
    
    getByPatientId: (patientId: string): Consultation[] => {
      const consultations = getItem<Consultation[]>('consultations', []);
      return consultations.filter(c => c.patientId === patientId);
    },
    
    getByStatus: (status: Consultation['status']): Consultation[] => {
      const consultations = getItem<Consultation[]>('consultations', []);
      return consultations.filter(c => c.status === status);
    },
    
    getDoctorConsultations: (doctorId: string, status?: Consultation['status']): Consultation[] => {
      const consultations = getItem<Consultation[]>('consultations', []);
      if (status) {
        return consultations.filter(c => c.doctorId === doctorId && c.status === status);
      }
      return consultations.filter(c => c.doctorId === doctorId);
    },
    
    updateStatus: (id: string, status: Consultation['status']): Consultation | null => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const index = consultations.findIndex(c => c.id === id);
      if (index === -1) return null;
      
      consultations[index].status = status;
      setItem('consultations', consultations);
      return consultations[index];
    },
    
    updatePrice: (id: string, newPrice: number): Consultation | null => {
      const consultations = getItem<Consultation[]>('consultations', []);
      const index = consultations.findIndex(c => c.id === id);
      if (index === -1) return null;
      
      consultations[index].price = newPrice;
      setItem('consultations', consultations);
      return consultations[index];
    }
  };
  
  // Prescription operations
  prescriptions = {
    getAll: (): Prescription[] => {
      return getItem<Prescription[]>('prescriptions', []);
    },
    
    getById: (id: string): Prescription | null => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      const prescription = prescriptions.find(p => p.id === id);
      return prescription || null;
    },
    
    create: (prescription: Omit<Prescription, 'id'>): Prescription => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      const id = this.generateId();
      const newPrescription: Prescription = { ...prescription, id };
      prescriptions.push(newPrescription);
      setItem('prescriptions', prescriptions);
      return newPrescription;
    },
    
    update: (id: string, updates: Partial<Prescription>): Prescription | null => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      const index = prescriptions.findIndex(p => p.id === id);
      if (index === -1) return null;
      
      const updatedPrescription = { ...prescriptions[index], ...updates };
      prescriptions[index] = updatedPrescription;
      setItem('prescriptions', prescriptions);
      return updatedPrescription;
    },
    
    delete: (id: string): boolean => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      const filtered = prescriptions.filter(p => p.id !== id);
      setItem('prescriptions', filtered);
      return filtered.length < prescriptions.length;
    },
    
    getByPatientId: (patientId: string): Prescription[] => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      return prescriptions.filter(p => p.patientId === patientId);
    },
    
    getByConsultationId: (consultationId: string): Prescription | null => {
      const prescriptions = getItem<Prescription[]>('prescriptions', []);
      const prescription = prescriptions.find(p => p.consultationId === consultationId);
      return prescription || null;
    }
  };
  
  // Message operations
  messages = {
    getAll: (): Message[] => {
      return getItem<Message[]>('messages', []);
    },
    
    getById: (id: string): Message | null => {
      const messages = getItem<Message[]>('messages', []);
      const message = messages.find(m => m.id === id);
      return message || null;
    },
    
    create: (message: Omit<Message, 'id'>): Message => {
      const messages = getItem<Message[]>('messages', []);
      const id = this.generateId();
      const newMessage: Message = { ...message, id };
      messages.push(newMessage);
      setItem('messages', messages);
      return newMessage;
    },
    
    update: (id: string, updates: Partial<Message>): Message | null => {
      const messages = getItem<Message[]>('messages', []);
      const index = messages.findIndex(m => m.id === id);
      if (index === -1) return null;
      
      const updatedMessage = { ...messages[index], ...updates };
      messages[index] = updatedMessage;
      setItem('messages', messages);
      return updatedMessage;
    },
    
    delete: (id: string): boolean => {
      const messages = getItem<Message[]>('messages', []);
      const filtered = messages.filter(m => m.id !== id);
      setItem('messages', filtered);
      return filtered.length < messages.length;
    },
    
    getByConsultationId: (consultationId: string): Message[] => {
      const messages = getItem<Message[]>('messages', []);
      return messages.filter(m => m.consultationId === consultationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    
    markAsRead: (messageId: string): boolean => {
      const messages = getItem<Message[]>('messages', []);
      const index = messages.findIndex(m => m.id === messageId);
      if (index === -1) return false;
      
      messages[index].isRead = true;
      setItem('messages', messages);
      return true;
    },
    
    getUnreadCount: (userId: string): number => {
      const messages = getItem<Message[]>('messages', []);
      return messages.filter(m => m.senderId !== userId && !m.isRead).length;
    }
  };
  
  // Transaction operations
  transactions = {
    getAll: (): Transaction[] => {
      return getItem<Transaction[]>('transactions', []);
    },
    
    getById: (id: string): Transaction | null => {
      const transactions = getItem<Transaction[]>('transactions', []);
      const transaction = transactions.find(t => t.id === id);
      return transaction || null;
    },
    
    create: (transaction: Omit<Transaction, 'id'>): Transaction => {
      const transactions = getItem<Transaction[]>('transactions', []);
      const id = this.generateId();
      const newTransaction: Transaction = { ...transaction, id };
      transactions.push(newTransaction);
      setItem('transactions', transactions);
      return newTransaction;
    },
    
    getByPatientId: (patientId: string): Transaction[] => {
      const transactions = getItem<Transaction[]>('transactions', []);
      return transactions.filter(t => t.patientId === patientId);
    },
    
    getByDoctorId: (doctorId: string): Transaction[] => {
      const transactions = getItem<Transaction[]>('transactions', []);
      return transactions.filter(t => t.doctorId === doctorId);
    },
    
    addFunds: (patientId: string, amount: number): Transaction => {
      return this.transactions.create({
        type: 'credit',
        amount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: "Added funds via credit card",
        patientId
      });
    },
    
    payForConsultation: (patientId: string, consultationId: string, amount: number, doctorName: string, doctorId: string): Transaction => {
      return this.transactions.create({
        type: 'debit',
        amount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: `Payment for Dr. ${doctorName} consultation`,
        patientId,
        consultationId,
        doctorId
      });
    }
  };

  // Health metrics operations
  healthMetrics = {
    getAll: (): HealthMetric[] => {
      return getItem<HealthMetric[]>('healthMetrics', []);
    },
    
    getById: (id: string): HealthMetric | null => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      return metrics.find(m => m.id === id) || null;
    },
    
    create: (metric: Omit<HealthMetric, 'id'>): HealthMetric => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      const id = this.generateId();
      const newMetric: HealthMetric = { ...metric, id };
      metrics.push(newMetric);
      setItem('healthMetrics', metrics);
      return newMetric;
    },
    
    update: (id: string, updates: Partial<HealthMetric>): HealthMetric | null => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      const index = metrics.findIndex(m => m.id === id);
      if (index === -1) return null;
      
      const updatedMetric = { ...metrics[index], ...updates };
      metrics[index] = updatedMetric;
      setItem('healthMetrics', metrics);
      return updatedMetric;
    },
    
    delete: (id: string): boolean => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      const filtered = metrics.filter(m => m.id !== id);
      setItem('healthMetrics', filtered);
      return filtered.length < metrics.length;
    },
    
    getByPatientId: (patientId: string): HealthMetric[] => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      return metrics.filter(m => m.patientId === patientId);
    },
    
    getByType: (patientId: string, type: string): HealthMetric[] => {
      const metrics = getItem<HealthMetric[]>('healthMetrics', []);
      return metrics
        .filter(m => m.patientId === patientId && m.type === type)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  };
  
  // User profile operations
  userProfiles = {
    getById: (userId: string): UserProfileData | null => {
      const profiles = getItem<UserProfileData[]>('userProfiles', []);
      return profiles.find(p => p.userId === userId) || null;
    },
    
    create: (profile: Omit<UserProfileData, 'id'>): UserProfileData => {
      const profiles = getItem<UserProfileData[]>('userProfiles', []);
      const id = this.generateId();
      const newProfile: UserProfileData = { ...profile, id };
      profiles.push(newProfile);
      setItem('userProfiles', profiles);
      return newProfile;
    },
    
    update: (userId: string, updates: Partial<UserProfileData>): UserProfileData | null => {
      const profiles = getItem<UserProfileData[]>('userProfiles', []);
      const index = profiles.findIndex(p => p.userId === userId);
      
      if (index === -1) {
        // If no profile exists, create a new one
        const newProfile = this.userProfiles.create({ userId, ...updates });
        return newProfile;
      }
      
      // Update existing profile
      const updatedProfile = { ...profiles[index], ...updates };
      profiles[index] = updatedProfile;
      setItem('userProfiles', profiles);
      return updatedProfile;
    }
  };

  // NEW: Price negotiation operations
  priceNegotiations = {
    getAll: (): PriceNegotiation[] => {
      return getItem<PriceNegotiation[]>('priceNegotiations', []);
    },
    
    getById: (id: string): PriceNegotiation | null => {
      const negotiations = getItem<PriceNegotiation[]>('priceNegotiations', []);
      return negotiations.find(n => n.id === id) || null;
    },
    
    create: (negotiation: Omit<PriceNegotiation, 'id'>): PriceNegotiation => {
      const negotiations = getItem<PriceNegotiation[]>('priceNegotiations', []);
      const id = this.generateId();
      const newNegotiation: PriceNegotiation = { ...negotiation, id };
      negotiations.push(newNegotiation);
      setItem('priceNegotiations', negotiations);
      return newNegotiation;
    },
    
    getByConsultationId: (consultationId: string): PriceNegotiation[] => {
      const negotiations = getItem<PriceNegotiation[]>('priceNegotiations', []);
      return negotiations
        .filter(n => n.consultationId === consultationId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    
    update: (id: string, status: 'accepted' | 'rejected'): PriceNegotiation | null => {
      const negotiations = getItem<PriceNegotiation[]>('priceNegotiations', []);
      const index = negotiations.findIndex(n => n.id === id);
      if (index === -1) return null;
      
      negotiations[index].status = status;
      setItem('priceNegotiations', negotiations);
      return negotiations[index];
    }
  };
  
  // Analytics operations for admin dashboard
  analytics = {
    getConsultationStats: () => {
      const consultations = getItem<Consultation[]>('consultations', []);
      return {
        total: consultations.length,
        pending: consultations.filter(c => c.status === 'pending').length,
        upcoming: consultations.filter(c => c.status === 'upcoming').length,
        completed: consultations.filter(c => c.status === 'completed').length,
        cancelled: consultations.filter(c => c.status === 'cancelled').length,
        negotiating: consultations.filter(c => c.status === 'negotiating').length
      };
    },
    
    getDoctorStats: () => {
      const doctors = getItem<Doctor[]>('doctors', []);
      return {
        total: doctors.length,
        pending: doctors.filter(d => d.status === 'pending').length,
        approved: doctors.filter(d => d.status === 'approved').length,
        rejected: doctors.filter(d => d.status === 'rejected').length
      };
    },
    
    getPatientStats: () => {
      const patients = getItem<Patient[]>('patients', []);
      return {
        total: patients.length,
        active: patients.filter(p => p.status === 'active').length,
        inactive: patients.filter(p => p.status === 'inactive').length
      };
    },
    
    getTransactionStats: () => {
      const transactions = getItem<Transaction[]>('transactions', []);
      return {
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        creditAmount: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
        debitAmount: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
        transactionCount: transactions.length
      };
    },
    
    getRevenueByMonth: () => {
      const transactions = getItem<Transaction[]>('transactions', []);
      const monthlyRevenue: Record<string, number> = {};
      
      transactions.forEach(t => {
        if (t.type === 'debit') {
          const date = new Date(t.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          if (!monthlyRevenue[monthYear]) {
            monthlyRevenue[monthYear] = 0;
          }
          monthlyRevenue[monthYear] += t.amount;
        }
      });
      
      return Object.entries(monthlyRevenue).map(([month, amount]) => ({
        month,
        amount
      }));
    }
  };
}

// Create and export the database service
const dbService = new SQLiteSimulationService();
export const db = dbService;
