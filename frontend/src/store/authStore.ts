import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { localAuthService, AuthResponse } from '@/lib/localAuthService';
import { localCartService } from '@/lib/localCartService';
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
          const response = await localAuthService.login({ email, password });

          const { user, accessToken, refreshToken } = response;

          // Set cookies
          setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
          setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 }); // 30 days

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Switch to user's cart after successful login
          try {
            await localCartService.switchToUserCart(user.id);
            // Trigger cart store to refresh
            const cartStore = (await import('./cartStore')).useCartStore;
            const { fetchCart } = cartStore.getState();
            await fetchCart();
          } catch (cartError) {
            console.error('Failed to load user cart:', cartError);
          }

          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Login failed');
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await localAuthService.register(userData);

          const { user, accessToken, refreshToken } = response;

          // Set cookies
          setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 * 7 });
          setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Initialize user's cart after successful registration
          try {
            await localCartService.switchToUserCart(user.id);
            // Trigger cart store to refresh
            const cartStore = (await import('./cartStore')).useCartStore;
            const { fetchCart } = cartStore.getState();
            await fetchCart();
          } catch (cartError) {
            console.error('Failed to initialize user cart:', cartError);
          }

          toast.success('Registration successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Registration failed');
          throw error;
        }
      },

      logout: () => {
        // Clear authentication cookies
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        
        // Clear current user's cart
        localCartService.clearCurrentCart();
        
        set({
          user: null,
          isAuthenticated: false,
        });

        // Clear cart store state
        const cartStore = import('./cartStore').then(module => {
          const { useCartStore } = module;
          useCartStore.setState({ cart: null });
        });

        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        try {
          const token = typeof window !== 'undefined' ? 
            document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : 
            null;
            
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          const user = await localAuthService.getProfile(token);
          set({
            user,
            isAuthenticated: true,
          });

          // Restore user's cart on authentication check
          try {
            const cartStore = (await import('./cartStore')).useCartStore;
            const { fetchCart } = cartStore.getState();
            await fetchCart();
          } catch (cartError) {
            console.error('Failed to restore user cart:', cartError);
          }
        } catch (error) {
          // Token is invalid, clear auth state
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
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
