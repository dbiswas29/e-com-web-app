import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, Cart } from '@/types';
import { localCartService } from '@/lib/localCartService';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
          const result = await localCartService.addToCart(productId, quantity);

          if (result.success) {
            set({
              cart: result.cart,
              isLoading: false,
            });
            toast.success(result.message || 'Item added to cart!');
          } else {
            set({ isLoading: false });
            toast.error(result.message || 'Failed to add item to cart');
            throw new Error(result.message);
          }
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Failed to add item to cart');
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        set({ isLoading: true });
        try {
          const result = await localCartService.removeFromCart(itemId);
          
          if (result.success) {
            set({
              cart: result.cart,
              isLoading: false,
            });
            toast.success(result.message || 'Item removed from cart!');
          } else {
            set({ isLoading: false });
            toast.error(result.message || 'Failed to remove item from cart');
            throw new Error(result.message);
          }
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Failed to remove item from cart');
          throw error;
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeFromCart(itemId);
        }

        set({ isLoading: true });
        try {
          const result = await localCartService.updateCartItem(itemId, quantity);

          if (result.success) {
            set({
              cart: result.cart,
              isLoading: false,
            });
            toast.success(result.message || 'Cart updated!');
          } else {
            set({ isLoading: false });
            toast.error(result.message || 'Failed to update cart');
            throw new Error(result.message);
          }
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Failed to update cart');
          throw error;
        }
      },

      clearCart: async () => {
        try {
          const result = await localCartService.clearCart();
          if (result.success) {
            set({ cart: result.cart });
            toast.success(result.message || 'Cart cleared!');
          } else {
            toast.error(result.message || 'Failed to clear cart');
          }
        } catch (error: any) {
          toast.error(error.message || 'Failed to clear cart');
        }
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await localCartService.getCart();
          set({
            cart,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Failed to fetch cart:', error);
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
