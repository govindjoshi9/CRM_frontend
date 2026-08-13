import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPortalRoute, normalizeRole } from '@/lib/roleUtils';

export type UserRole = 
  | 'admin' 
  | 'staff' 
  | 'manager' 
  | 'employee' 
  | 'accountant' 
  | 'hr' 
  | 'ca' 
  | 'receptionist' 
  | 'client';

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
  
  // Helpers
  getEffectiveRole: () => string;
  getPortalRoute: () => string;

  // Login handlers
  loginStaff: (user: UserData, token: string) => void;
  loginClient: (party: PartyData, token: string) => void;
  
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      party: null,
      token: null,
      isAuthenticated: false,
      activeRole: null,

      getEffectiveRole: () => {
        const state = get();
        return normalizeRole(state.user?.role, state.activeRole);
      },

      getPortalRoute: () => {
        const state = get();
        return getPortalRoute(state.user?.role, state.activeRole);
      },

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
