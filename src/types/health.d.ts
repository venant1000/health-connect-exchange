
// This is a declaration file to add health-related types
declare module "@/services/database" {
  interface HealthMetric {
    id: string;
    patientId: string;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes?: string;
  }

  interface UserProfileData {
    id: string;
    userId: string;
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
}
