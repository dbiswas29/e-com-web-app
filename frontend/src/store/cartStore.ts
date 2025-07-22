import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, Cart } from '@/types';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      addToCart: async (productId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<Cart>('/cart/add', {
            productId,
            quantity,
          });

          set({
            cart: response.data,
            isLoading: false,
          });

          toast.success('Item added to cart!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Failed to add item to cart');
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        set({ isLoading: true });
        try {
          await apiClient.delete(`/cart/remove/${itemId}`);
          
          const { cart } = get();
          if (cart) {
            const updatedCart = {
              ...cart,
              items: cart.items.filter(item => item.id !== itemId),
            };
            updatedCart.totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
            updatedCart.totalPrice = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

            set({
              cart: updatedCart,
              isLoading: false,
            });
          }

          toast.success('Item removed from cart!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Failed to remove item from cart');
          throw error;
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeFromCart(itemId);
        }

        set({ isLoading: true });
        try {
          const response = await apiClient.put<Cart>('/cart/update', {
            itemId,
            quantity,
          });

          set({
            cart: response.data,
            isLoading: false,
          });

          toast.success('Cart updated!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Failed to update cart');
          throw error;
        }
      },

      clearCart: () => {
        set({ cart: null });
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get<Cart>('/cart');
          set({
            cart: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          // Don't show error toast for 404 (empty cart)
          if (error.response?.status !== 404) {
            console.error('Failed to fetch cart:', error);
          }
        }
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart?.totalItems || 0;
      },

      getTotalPrice: () => {
        const { cart } = get();
        return cart?.totalPrice || 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
