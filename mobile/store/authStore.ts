import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  district: string | null;
  userType: string;
  cityPoints: number;
  businessName?: string | null;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (
    user: User,
    token: string,
    refreshToken: string
  ) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,

  setAuth: (user, token, refreshToken) =>
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  logout: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),
}));
