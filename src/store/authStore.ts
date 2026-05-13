import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  authModalOpen: false,
  setAuthModalOpen: (v) => set({ authModalOpen: v }),
}));
