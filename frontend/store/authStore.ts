import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  companyId: number;
}

interface Company {
  id: number;
  name: string;
  type: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  logoPath: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  company: Company | null;
  login: (token: string, user: User, company: Company) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      company: null,
      login: (token, user, company) => set({ token, user, company }),
      logout: () => set({ token: null, user: null, company: null }),
    }),
    {
      name: 'lmbc-auth-storage',
    }
  )
);
