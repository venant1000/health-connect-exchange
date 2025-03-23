
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
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

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Connect to SQLite database
const db = new Database(join(dataDir, 'healthconnect.db'));
db.pragma('journal_mode = WAL');

// Initialize database with schema
export const initializeDatabase = () => {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      doctorId TEXT,
      patientId TEXT
    )
  `);

  // Create doctors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL,
      avatar TEXT,
      rating REAL DEFAULT 0,
      experience INTEGER DEFAULT 0,
      location TEXT,
      price REAL DEFAULT 0,
      availability TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      bio TEXT,
      education TEXT, -- JSON string array
      status TEXT DEFAULT 'pending'
    )
  `);

  // Create patients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'active',
      joinedDate TEXT NOT NULL
    )
  `);

  // Create consultations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      doctorId TEXT NOT NULL,
      patientId TEXT NOT NULL,
      doctorName TEXT NOT NULL,
      doctorSpecialty TEXT NOT NULL,
      patientName TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      price REAL DEFAULT 0,
      symptoms TEXT,
      notes TEXT,
      paymentStatus TEXT DEFAULT 'pending',
      roomId TEXT,
      FOREIGN KEY (doctorId) REFERENCES doctors(id),
      FOREIGN KEY (patientId) REFERENCES patients(id)
    )
  `);

  // Create prescriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      consultationId TEXT NOT NULL,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      diagnosis TEXT,
      medications TEXT, -- JSON string
      notes TEXT,
      followUpDate TEXT,
      issuedDate TEXT NOT NULL,
      signature TEXT NOT NULL,
      FOREIGN KEY (consultationId) REFERENCES consultations(id),
      FOREIGN KEY (patientId) REFERENCES patients(id)
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      consultationId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      senderType TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      isRead BOOLEAN DEFAULT 0,
      FOREIGN KEY (consultationId) REFERENCES consultations(id)
    )
  `);

  // Insert sample data if tables are empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (userCount.count === 0) {
    // Insert sample doctors
    const insertDoctor = db.prepare(`
      INSERT INTO doctors (id, name, specialty, rating, experience, location, price, availability, email, phone, bio, education, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertDoctor.run(
      "1",
      "Dr. Andrew Miller",
      "Cardiologist",
      4.9,
      12,
      "New York, NY",
      120,
      "Mon-Fri, 9AM-5PM",
      "doctor@example.com",
      "+1 (555) 987-6543",
      "Board-certified cardiologist with over 12 years of experience in diagnosis and treatment of cardiovascular diseases. Specializing in preventive cardiology and heart failure management.",
      JSON.stringify([
        "MD in Cardiology, Harvard Medical School",
        "Fellowship in Interventional Cardiology, Mayo Clinic",
        "Residency in Internal Medicine, Johns Hopkins Hospital",
        "Board Certified by the American Board of Cardiology"
      ]),
      'approved'
    );
    
    // Insert sample patients
    const insertPatient = db.prepare(`
      INSERT INTO patients (id, name, email, phone, status, joinedDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertPatient.run(
      "1",
      "John Doe",
      "patient@example.com",
      "+1 (555) 123-4567",
      "active",
      "2023-01-15"
    );
    
    // Insert sample users
    const insertUser = db.prepare(`
      INSERT INTO users (id, type, email, password, doctorId, patientId)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    // Sample doctor user
    insertUser.run(
      "1",
      "doctor",
      "doctor@example.com",
      "password", // In a real app, use hashed passwords
      "1",
      null
    );
    
    // Sample patient user
    insertUser.run(
      "2",
      "patient",
      "patient@example.com",
      "password",
      null,
      "1"
    );
    
    // Sample admin user
    insertUser.run(
      "3",
      "admin",
      "admin@example.com",
      "password",
      null,
      null
    );

    console.log("Database initialized with sample data");
  }
};

// Run initialization
initializeDatabase();

// Database operations
export const databaseService = {
  // User operations
  users: {
    login: (email: string, password: string): User | null => {
      const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as User | undefined;
      return user || null;
    },
    register: (user: Omit<User, 'id'>): User => {
      const id = crypto.randomUUID();
      const stmt = db.prepare(`
        INSERT INTO users (id, type, email, password, doctorId, patientId)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, user.type, user.email, user.password, user.doctorId, user.patientId);
      return { ...user, id };
    },
    getById: (id: string): User | null => {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
      return user || null;
    },
    getByEmail: (email: string): User | null => {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
      return user || null;
    }
  },
  
  // Doctor operations
  doctors: {
    getAll: (): Doctor[] => {
      return db.prepare('SELECT * FROM doctors').all() as Doctor[];
    },
    getById: (id: string): Doctor | null => {
      const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id) as Doctor | undefined;
      if (doctor) {
        doctor.education = JSON.parse(doctor.education as unknown as string);
      }
      return doctor || null;
    },
    create: (doctor: Omit<Doctor, 'id'>): Doctor => {
      const id = crypto.randomUUID();
      const stmt = db.prepare(`
        INSERT INTO doctors (id, name, specialty, avatar, rating, experience, location, price, availability, email, phone, bio, education, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        doctor.name,
        doctor.specialty,
        doctor.avatar || null,
        doctor.rating,
        doctor.experience,
        doctor.location || null,
        doctor.price,
        doctor.availability || null,
        doctor.email,
        doctor.phone || null,
        doctor.bio || null,
        JSON.stringify(doctor.education || []),
        doctor.status
      );
      return { ...doctor, id };
    },
    update: (id: string, updates: Partial<Doctor>): Doctor | null => {
      // Get current doctor
      const doctor = databaseService.doctors.getById(id);
      if (!doctor) return null;
      
      // Prepare update fields
      const updatedDoctor = { ...doctor, ...updates };
      
      // Run update query
      const stmt = db.prepare(`
        UPDATE doctors
        SET name = ?, specialty = ?, avatar = ?, rating = ?, experience = ?,
            location = ?, price = ?, availability = ?, email = ?, phone = ?,
            bio = ?, education = ?, status = ?
        WHERE id = ?
      `);
      
      stmt.run(
        updatedDoctor.name,
        updatedDoctor.specialty,
        updatedDoctor.avatar || null,
        updatedDoctor.rating,
        updatedDoctor.experience,
        updatedDoctor.location || null,
        updatedDoctor.price,
        updatedDoctor.availability || null,
        updatedDoctor.email,
        updatedDoctor.phone || null,
        updatedDoctor.bio || null,
        JSON.stringify(updatedDoctor.education || []),
        updatedDoctor.status,
        id
      );
      
      return updatedDoctor;
    },
    delete: (id: string): boolean => {
      const result = db.prepare('DELETE FROM doctors WHERE id = ?').run(id);
      return result.changes > 0;
    },
    getByStatus: (status: Doctor['status']): Doctor[] => {
      const doctors = db.prepare('SELECT * FROM doctors WHERE status = ?').all(status) as Doctor[];
      doctors.forEach(doctor => {
        doctor.education = JSON.parse(doctor.education as unknown as string);
      });
      return doctors;
    }
  },
  
  // Patient operations
  patients: {
    getAll: (): Patient[] => {
      return db.prepare('SELECT * FROM patients').all() as Patient[];
    },
    getById: (id: string): Patient | null => {
      const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as Patient | undefined;
      return patient || null;
    },
    create: (patient: Omit<Patient, 'id'>): Patient => {
      const id = crypto.randomUUID();
      const stmt = db.prepare(`
        INSERT INTO patients (id, name, email, phone, avatar, status, joinedDate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        patient.name,
        patient.email,
        patient.phone || null,
        patient.avatar || null,
        patient.status,
        patient.joinedDate
      );
      return { ...patient, id };
    },
    update: (id: string, updates: Partial<Patient>): Patient | null => {
      // Get current patient
      const patient = databaseService.patients.getById(id);
      if (!patient) return null;
      
      // Prepare update fields
      const updatedPatient = { ...patient, ...updates };
      
      // Run update query
      const stmt = db.prepare(`
        UPDATE patients
        SET name = ?, email = ?, phone = ?, avatar = ?, status = ?, joinedDate = ?
        WHERE id = ?
      `);
      
      stmt.run(
        updatedPatient.name,
        updatedPatient.email,
        updatedPatient.phone || null,
        updatedPatient.avatar || null,
        updatedPatient.status,
        updatedPatient.joinedDate,
        id
      );
      
      return updatedPatient;
    },
    delete: (id: string): boolean => {
      const result = db.prepare('DELETE FROM patients WHERE id = ?').run(id);
      return result.changes > 0;
    }
  },
  
  // Consultation operations
  consultations: {
    getAll: (): Consultation[] => {
      return db.prepare('SELECT * FROM consultations').all() as Consultation[];
    },
    getById: (id: string): Consultation | null => {
      const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as Consultation | undefined;
      return consultation || null;
    },
    create: (consultation: Omit<Consultation, 'id'>): Consultation => {
      const id = crypto.randomUUID();
      // Generate a unique room ID for video calls
      const roomId = `room_${crypto.randomUUID().split('-')[0]}`;
      
      const stmt = db.prepare(`
        INSERT INTO consultations (
          id, doctorId, patientId, doctorName, doctorSpecialty, patientName, 
          status, date, time, type, price, symptoms, notes, paymentStatus, roomId
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        consultation.doctorId,
        consultation.patientId,
        consultation.doctorName,
        consultation.doctorSpecialty,
        consultation.patientName,
        consultation.status,
        consultation.date,
        consultation.time,
        consultation.type,
        consultation.price,
        consultation.symptoms || null,
        consultation.notes || null,
        consultation.paymentStatus || 'pending',
        roomId
      );
      
      return { ...consultation, id, roomId };
    },
    update: (id: string, updates: Partial<Consultation>): Consultation | null => {
      // Get current consultation
      const consultation = databaseService.consultations.getById(id);
      if (!consultation) return null;
      
      // Prepare update fields
      const updatedConsultation = { ...consultation, ...updates };
      
      // Run update query
      const stmt = db.prepare(`
        UPDATE consultations
        SET doctorId = ?, patientId = ?, doctorName = ?, doctorSpecialty = ?, 
            patientName = ?, status = ?, date = ?, time = ?, type = ?, 
            price = ?, symptoms = ?, notes = ?, paymentStatus = ?, roomId = ?
        WHERE id = ?
      `);
      
      stmt.run(
        updatedConsultation.doctorId,
        updatedConsultation.patientId,
        updatedConsultation.doctorName,
        updatedConsultation.doctorSpecialty,
        updatedConsultation.patientName,
        updatedConsultation.status,
        updatedConsultation.date,
        updatedConsultation.time,
        updatedConsultation.type,
        updatedConsultation.price,
        updatedConsultation.symptoms || null,
        updatedConsultation.notes || null,
        updatedConsultation.paymentStatus,
        updatedConsultation.roomId,
        id
      );
      
      return updatedConsultation;
    },
    delete: (id: string): boolean => {
      const result = db.prepare('DELETE FROM consultations WHERE id = ?').run(id);
      return result.changes > 0;
    },
    getByDoctorId: (doctorId: string): Consultation[] => {
      return db.prepare('SELECT * FROM consultations WHERE doctorId = ?').all(doctorId) as Consultation[];
    },
    getByPatientId: (patientId: string): Consultation[] => {
      return db.prepare('SELECT * FROM consultations WHERE patientId = ?').all(patientId) as Consultation[];
    },
    getByStatus: (status: Consultation['status']): Consultation[] => {
      return db.prepare('SELECT * FROM consultations WHERE status = ?').all(status) as Consultation[];
    },
    getDoctorConsultations: (doctorId: string, status?: Consultation['status']): Consultation[] => {
      if (status) {
        return db.prepare('SELECT * FROM consultations WHERE doctorId = ? AND status = ?').all(doctorId, status) as Consultation[];
      }
      return db.prepare('SELECT * FROM consultations WHERE doctorId = ?').all(doctorId) as Consultation[];
    }
  },
  
  // Prescription operations
  prescriptions: {
    getAll: (): Prescription[] => {
      const prescriptions = db.prepare('SELECT * FROM prescriptions').all() as Prescription[];
      prescriptions.forEach(prescription => {
        prescription.medications = JSON.parse(prescription.medications as unknown as string);
      });
      return prescriptions;
    },
    getById: (id: string): Prescription | null => {
      const prescription = db.prepare('SELECT * FROM prescriptions WHERE id = ?').get(id) as Prescription | undefined;
      if (prescription) {
        prescription.medications = JSON.parse(prescription.medications as unknown as string);
      }
      return prescription || null;
    },
    create: (prescription: Omit<Prescription, 'id'>): Prescription => {
      const id = crypto.randomUUID();
      
      const stmt = db.prepare(`
        INSERT INTO prescriptions (
          id, consultationId, patientId, patientName, diagnosis, 
          medications, notes, followUpDate, issuedDate, signature
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        prescription.consultationId,
        prescription.patientId,
        prescription.patientName,
        prescription.diagnosis || null,
        JSON.stringify(prescription.medications || []),
        prescription.notes || null,
        prescription.followUpDate || null,
        prescription.issuedDate,
        prescription.signature
      );
      
      return { ...prescription, id };
    },
    update: (id: string, updates: Partial<Prescription>): Prescription | null => {
      // Get current prescription
      const prescription = databaseService.prescriptions.getById(id);
      if (!prescription) return null;
      
      // Prepare update fields
      const updatedPrescription = { ...prescription, ...updates };
      
      // Run update query
      const stmt = db.prepare(`
        UPDATE prescriptions
        SET consultationId = ?, patientId = ?, patientName = ?, diagnosis = ?, 
            medications = ?, notes = ?, followUpDate = ?, issuedDate = ?, signature = ?
        WHERE id = ?
      `);
      
      stmt.run(
        updatedPrescription.consultationId,
        updatedPrescription.patientId,
        updatedPrescription.patientName,
        updatedPrescription.diagnosis || null,
        JSON.stringify(updatedPrescription.medications || []),
        updatedPrescription.notes || null,
        updatedPrescription.followUpDate || null,
        updatedPrescription.issuedDate,
        updatedPrescription.signature,
        id
      );
      
      return updatedPrescription;
    },
    delete: (id: string): boolean => {
      const result = db.prepare('DELETE FROM prescriptions WHERE id = ?').run(id);
      return result.changes > 0;
    },
    getByPatientId: (patientId: string): Prescription[] => {
      const prescriptions = db.prepare('SELECT * FROM prescriptions WHERE patientId = ?').all(patientId) as Prescription[];
      prescriptions.forEach(prescription => {
        prescription.medications = JSON.parse(prescription.medications as unknown as string);
      });
      return prescriptions;
    },
    getByConsultationId: (consultationId: string): Prescription | null => {
      const prescription = db.prepare('SELECT * FROM prescriptions WHERE consultationId = ?').get(consultationId) as Prescription | undefined;
      if (prescription) {
        prescription.medications = JSON.parse(prescription.medications as unknown as string);
      }
      return prescription || null;
    }
  },
  
  // Message operations
  messages: {
    getAll: (): Message[] => {
      return db.prepare('SELECT * FROM messages').all() as Message[];
    },
    getById: (id: string): Message | null => {
      const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as Message | undefined;
      return message || null;
    },
    create: (message: Omit<Message, 'id'>): Message => {
      const id = crypto.randomUUID();
      
      const stmt = db.prepare(`
        INSERT INTO messages (id, consultationId, senderId, senderType, content, timestamp, isRead)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        message.consultationId,
        message.senderId,
        message.senderType,
        message.content,
        message.timestamp,
        message.isRead ? 1 : 0
      );
      
      return { ...message, id };
    },
    update: (id: string, updates: Partial<Message>): Message | null => {
      // Get current message
      const message = databaseService.messages.getById(id);
      if (!message) return null;
      
      // Prepare update fields
      const updatedMessage = { ...message, ...updates };
      
      // Run update query
      const stmt = db.prepare(`
        UPDATE messages
        SET consultationId = ?, senderId = ?, senderType = ?, content = ?, timestamp = ?, isRead = ?
        WHERE id = ?
      `);
      
      stmt.run(
        updatedMessage.consultationId,
        updatedMessage.senderId,
        updatedMessage.senderType,
        updatedMessage.content,
        updatedMessage.timestamp,
        updatedMessage.isRead ? 1 : 0,
        id
      );
      
      return updatedMessage;
    },
    delete: (id: string): boolean => {
      const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
      return result.changes > 0;
    },
    getByConsultationId: (consultationId: string): Message[] => {
      return db.prepare('SELECT * FROM messages WHERE consultationId = ? ORDER BY timestamp ASC').all(consultationId) as Message[];
    },
    markAsRead: (messageId: string): boolean => {
      const result = db.prepare('UPDATE messages SET isRead = 1 WHERE id = ?').run(messageId);
      return result.changes > 0;
    },
    getUnreadCount: (userId: string): number => {
      const result = db.prepare('SELECT COUNT(*) as count FROM messages WHERE senderId != ? AND isRead = 0').get(userId) as { count: number };
      return result.count;
    }
  }
};

export { databaseService as db };
