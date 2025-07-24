import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, Cart } from '@/types';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  loadingItems: Set<string>; // Track loading state per product/item
  loadingCartItems: Set<string>; // Track loading state per cart item (for quantity changes/removal)
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isItemLoading: (productId: string) => boolean;
  isCartItemLoading: (cartItemId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      loadingItems: new Set<string>(),
      loadingCartItems: new Set<string>(),

      isItemLoading: (productId: string) => {
        return get().loadingItems.has(productId);
      },

      isCartItemLoading: (cartItemId: string) => {
        return get().loadingCartItems.has(cartItemId);
      },

      addToCart: async (productId: string, quantity = 1) => {
        const { loadingItems } = get();
        const newLoadingItems = new Set(loadingItems);
        newLoadingItems.add(productId);
        set({ loadingItems: newLoadingItems });
        
        try {
          const response = await apiClient.post<Cart>('/cart/add', {
            productId,
            quantity,
          });

          const finalLoadingItems = new Set(get().loadingItems);
          finalLoadingItems.delete(productId);
          
          set({
            cart: response.data,
            loadingItems: finalLoadingItems,
          });

          toast.success('Item added to cart!');
        } catch (error: any) {
          const finalLoadingItems = new Set(get().loadingItems);
          finalLoadingItems.delete(productId);
          set({ loadingItems: finalLoadingItems });
          toast.error(error.response?.data?.message || 'Failed to add item to cart');
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        const { loadingCartItems } = get();
        const newLoadingCartItems = new Set(loadingCartItems);
        newLoadingCartItems.add(itemId);
        set({ loadingCartItems: newLoadingCartItems });

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

            const finalLoadingCartItems = new Set(get().loadingCartItems);
            finalLoadingCartItems.delete(itemId);

            set({
              cart: updatedCart,
              loadingCartItems: finalLoadingCartItems,
            });
          }

          toast.success('Item removed from cart!');
        } catch (error: any) {
          const finalLoadingCartItems = new Set(get().loadingCartItems);
          finalLoadingCartItems.delete(itemId);
          set({ loadingCartItems: finalLoadingCartItems });
          toast.error(error.response?.data?.message || 'Failed to remove item from cart');
          throw error;
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeFromCart(itemId);
        }

        const { loadingCartItems } = get();
        const newLoadingCartItems = new Set(loadingCartItems);
        newLoadingCartItems.add(itemId);
        set({ loadingCartItems: newLoadingCartItems });

        try {
          const response = await apiClient.put<Cart>('/cart/update', {
            itemId,
            quantity,
          });

          const finalLoadingCartItems = new Set(get().loadingCartItems);
          finalLoadingCartItems.delete(itemId);

          set({
            cart: response.data,
            loadingCartItems: finalLoadingCartItems,
          });

          toast.success('Cart updated!');
        } catch (error: any) {
          const finalLoadingCartItems = new Set(get().loadingCartItems);
          finalLoadingCartItems.delete(itemId);
          set({ loadingCartItems: finalLoadingCartItems });
          toast.error(error.response?.data?.message || 'Failed to update cart');
          throw error;
        }
      },

      clearCart: () => {
        set({ 
          cart: null,
          loadingItems: new Set<string>(),
          loadingCartItems: new Set<string>()
        });
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
      partialize: (state) => {
        // Only persist cart if user might be authenticated
        // We'll clear this on logout anyway, but this prevents stale data
        return { cart: state.cart };
      },
    }
  )
);
