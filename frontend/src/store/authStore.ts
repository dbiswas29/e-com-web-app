import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import { apiClient } from '@/lib/api';
import { setCookie, deleteCookie } from 'cookies-next';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<AuthResponse>('/auth/login', {
            email,
            password,
          });

          const { user, accessToken, refreshToken } = response.data;

          // Set cookies
          setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
          setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 }); // 30 days

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch cart after successful login
          const { useCartStore } = await import('./cartStore');
          useCartStore.getState().fetchCart();

          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Login failed');
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<AuthResponse>('/auth/register', userData);

          const { user, accessToken, refreshToken } = response.data;

          // Set cookies
          setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 * 7 });
          setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch cart after successful registration
          const { useCartStore } = await import('./cartStore');
          useCartStore.getState().fetchCart();

          toast.success('Registration successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Registration failed');
          throw error;
        }
      },

      logout: () => {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        
        // Clear cart on logout
        const { useCartStore } = require('./cartStore');
        useCartStore.getState().clearCart();
        
        set({
          user: null,
          isAuthenticated: false,
        });
        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        try {
          const response = await apiClient.get<User>('/auth/profile');
          set({
            user: response.data,
            isAuthenticated: true,
          });
          
          // Fetch cart if user is authenticated
          const { useCartStore } = await import('./cartStore');
          useCartStore.getState().fetchCart();
        } catch (error) {
          // Clear cart if authentication fails
          const { useCartStore } = require('./cartStore');
          useCartStore.getState().clearCart();
          
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
