import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'staff' | 'employee' | 'client';

interface UserData {
  id?: string | number;
  email?: string;
  role?: string;
  businessId?: string | number;
  [key: string]: any;
}

interface PartyData {
  id: number;
  partyType: string;
  businessId: number;
  name: string;
  loginUsername?: string;
  [key: string]: any;
}

interface AuthState {
  user: UserData | null;
  party: PartyData | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRole: 'staff' | 'client' | null;
  
  // Login handlers
  loginStaff: (user: UserData, token: string) => void;
  loginClient: (party: PartyData, token: string) => void;
  
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      party: null,
      token: null,
      isAuthenticated: false,
      activeRole: null,

      loginStaff: (user, token) => set({ 
        user, 
        party: null, 
        token, 
        isAuthenticated: true,
        activeRole: 'staff'
      }),

      loginClient: (party, token) => set({ 
        party, 
        user: null, 
        token, 
        isAuthenticated: true,
        activeRole: 'client'
      }),

      logout: () => set({ 
        user: null, 
        party: null, 
        token: null, 
        isAuthenticated: false,
        activeRole: null
      }),
    }),
    {
      name: 'erp-auth-storage',
    }
  )
);
