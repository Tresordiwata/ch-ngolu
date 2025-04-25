'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN_GENERAL' | 'ADMIN_SUCCURSALE' | 'UTILISATEUR';
  succursaleId?: string;
}

interface AuthState {
  utilisateur: Utilisateur | null;
  token: string | null;
  setAuth: (utilisateur: Utilisateur, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      utilisateur: null,
      token: null,
      setAuth: (utilisateur, token) => set({ utilisateur, token }),
      logout: () => set({ utilisateur: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);