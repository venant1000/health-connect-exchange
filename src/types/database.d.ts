
// Database interface type definition
import { Doctor, Patient, User, Consultation, Prescription, Message, Transaction, PriceNegotiation } from "@/services/database";

declare module "@/services/database" {
  // Re-export existing types to ensure they're available
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
    licenseDocument?: string;
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
    medications: string;
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
    doctorId?: string;
  }

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

  // Database service interface
  export interface DatabaseService {
    initializeDatabase: () => void;
    users: {
      login: (email: string, password: string) => User | null;
      register: (user: Omit<User, 'id'>) => User | null;
      getById: (id: string) => User | null;
      getByEmail: (email: string) => User | null;
    };
    doctors: {
      getAll: () => Doctor[];
      getById: (id: string) => Doctor | null;
      create: (doctor: Omit<Doctor, 'id'>) => Doctor | null;
      update: (id: string, updates: Partial<Doctor>) => Doctor | null;
      delete: (id: string) => boolean;
      getByStatus: (status: Doctor['status']) => Doctor[];
      uploadLicenseDocument: (id: string, documentUrl: string) => Doctor | null;
      getPendingVerifications: () => Doctor[];
      updateVerificationStatus: (id: string, status: 'approved' | 'rejected') => Doctor | null;
    };
    patients: {
      getAll: () => Patient[];
      getById: (id: string) => Patient | null;
      create: (patient: Omit<Patient, 'id'>) => Patient | null;
      update: (id: string, updates: Partial<Patient>) => Patient | null;
      delete: (id: string) => boolean;
    };
    consultations: {
      getAll: () => Consultation[];
      getById: (id: string) => Consultation | null;
      create: (consultation: Omit<Consultation, 'id'>) => Consultation | null;
      update: (id: string, updates: Partial<Consultation>) => Consultation | null;
      delete: (id: string) => boolean;
      getByDoctorId: (doctorId: string) => Consultation[];
      getByPatientId: (patientId: string) => Consultation[];
      getByStatus: (status: Consultation['status']) => Consultation[];
      getDoctorConsultations: (doctorId: string, status?: Consultation['status']) => Consultation[];
      updateStatus: (id: string, status: Consultation['status']) => Consultation | null;
      updatePrice: (id: string, newPrice: number) => Consultation | null;
    };
    prescriptions: {
      getAll: () => Prescription[];
      getById: (id: string) => Prescription | null;
      create: (prescription: Omit<Prescription, 'id'>) => Prescription | null;
      update: (id: string, updates: Partial<Prescription>) => Prescription | null;
      delete: (id: string) => boolean;
      getByPatientId: (patientId: string) => Prescription[];
      getByConsultationId: (consultationId: string) => Prescription | null;
    };
    messages: {
      getAll: () => Message[];
      getById: (id: string) => Message | null;
      create: (message: Omit<Message, 'id'>) => Message | null;
      update: (id: string, updates: Partial<Message>) => Message | null;
      delete: (id: string) => boolean;
      getByConsultationId: (consultationId: string) => Message[];
      markAsRead: (messageId: string) => boolean;
      getUnreadCount: (userId: string) => number;
    };
    transactions: {
      getAll: () => Transaction[];
      getById: (id: string) => Transaction | null;
      create: (transaction: Omit<Transaction, 'id'>) => Transaction | null;
      getByPatientId: (patientId: string) => Transaction[];
      getByDoctorId: (doctorId: string) => Transaction[];
      addFunds: (patientId: string, amount: number) => Transaction | null;
      payForConsultation: (patientId: string, consultationId: string, amount: number, doctorName: string, doctorId: string) => Transaction | null;
    };
    priceNegotiations: {
      getAll: () => PriceNegotiation[];
      getById: (id: string) => PriceNegotiation | null;
      create: (negotiation: Omit<PriceNegotiation, 'id'>) => PriceNegotiation | null;
      getByConsultationId: (consultationId: string) => PriceNegotiation[];
      update: (id: string, status: 'accepted' | 'rejected') => PriceNegotiation | null;
    };
    analytics: {
      getConsultationStats: () => {
        total: number;
        pending: number;
        upcoming: number;
        completed: number;
        cancelled: number;
        negotiating: number;
      };
      getDoctorStats: () => {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
      };
      getPatientStats: () => {
        total: number;
        active: number;
        inactive: number;
      };
      getTransactionStats: () => {
        totalAmount: number;
        creditAmount: number;
        debitAmount: number;
        transactionCount: number;
      };
      getRevenueByMonth: () => Array<{
        month: string;
        amount: number;
      }>;
    };
  }
}
