
import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { User } from "@/services/database";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Load user on component mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);
  
  const login = (email: string, password: string) => {
    const loggedInUser = authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };
  
  const register = (userData: Omit<User, 'id'>) => {
    const newUser = authService.register(userData);
    setUser(newUser);
    return newUser;
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  // Helper to get the patient ID if the user is a patient
  const patientId = user?.type === 'patient' ? user.id : null;
  
  // Helper to get the doctor ID if the user is a doctor
  const doctorId = user?.type === 'doctor' ? user.id : null;
  
  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    userRole: user?.type || null,
    patientId,
    doctorId
  };
}
