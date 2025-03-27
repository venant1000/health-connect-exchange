
// This is a declaration file to extend the existing types
import { Consultation as BaseConsultation } from "@/services/database";

// Extend the status type to include 'negotiating'
declare module "@/services/database" {
  interface Consultation extends BaseConsultation {
    status: 'pending' | 'upcoming' | 'completed' | 'cancelled' | 'negotiating';
  }
}
