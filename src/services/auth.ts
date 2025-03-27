
import { db, User } from './database';

let currentUser: User | null = null;

export const authService = {
  login: (email: string, password: string): User | null => {
    const user = db.users.login(email, password);
    if (user) {
      currentUser = user;
      // Save auth in session storage so it persists during page refresh
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user;
  },

  register: (user: Omit<User, 'id'>): User | null => {
    // Check if email already exists
    const existingUser = db.users.getByEmail(user.email);
    if (existingUser) {
      return null;
    }
    
    // Create new user
    const newUser = db.users.register(user);
    currentUser = newUser;
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  logout: (): void => {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    // Try to restore from session if not in memory
    if (!currentUser) {
      const savedUser = sessionStorage.getItem('currentUser');
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
      }
    }
    return currentUser;
  },

  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },

  getUserRole: (): 'patient' | 'doctor' | 'admin' | null => {
    const user = authService.getCurrentUser();
    return user ? user.type : null;
  },
  
  // Get user transactions
  getUserTransactions: (userId: string) => {
    return db.transactions.getByPatientId(userId);
  }
};
