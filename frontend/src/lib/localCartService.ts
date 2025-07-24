import { Cart, CartItem, Product } from '@/types';
import { localProductService } from './localDataService';

export interface CartServiceResponse {
  cart: Cart;
  success: boolean;
  message?: string;
}

class LocalCartService {
  private getCartKey(userId?: string | null): string {
    if (!userId) {
      // For anonymous users or when not logged in
      return 'ecommerce_cart_anonymous';
    }
    // User-specific cart storage
    return `ecommerce_cart_user_${userId}`;
  }

  private getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Get user ID from cookie token or return null if not authenticated
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      if (!token) return null;
      
      // Extract user ID from token (simple parsing for demo)
      const parts = token.split('_');
      if (parts.length >= 3) {
        return parts[2]; // local_token_userId_timestamp_random
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private getStoredCart(userId?: string): Cart {
    if (typeof window === 'undefined') {
      return { 
        id: 'local-cart', 
        userId: userId || 'anonymous',
        items: [], 
        totalItems: 0, 
        totalPrice: 0, 
        updatedAt: new Date().toISOString() 
      };
    }

    const currentUserId = userId || this.getCurrentUserId();
    const cartKey = this.getCartKey(currentUserId);
    const stored = localStorage.getItem(cartKey);
    
    if (stored) {
      const cart = JSON.parse(stored);
      return cart;
    }

    return { 
      id: 'local-cart', 
      userId: currentUserId || 'anonymous',
      items: [], 
      totalItems: 0, 
      totalPrice: 0, 
      updatedAt: new Date().toISOString() 
    };
  }

  private saveCart(cart: Cart): void {
    if (typeof window !== 'undefined') {
      const cartKey = this.getCartKey(cart.userId === 'anonymous' ? null : cart.userId);
      try {
        localStorage.setItem(cartKey, JSON.stringify({
          ...cart,
          updatedAt: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    }
  }

  private calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    return { totalItems, totalPrice };
  }

  async getCart(): Promise<Cart> {
    return this.getStoredCart();
  }

  async addToCart(productId: string, quantity: number = 1): Promise<CartServiceResponse> {
    try {
      const cart = this.getStoredCart();
      const products = await localProductService.getProducts();
      const product = products.data.find((p: Product) => p.id === productId);

      if (!product) {
        return {
          cart,
          success: false,
          message: 'Product not found'
        };
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `cart-item-${Date.now()}`,
          productId: product.id,
          quantity,
          product
        };
        cart.items.push(newItem);
      }

      const totals = this.calculateTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalPrice = totals.totalPrice;
      cart.updatedAt = new Date().toISOString();
      this.saveCart(cart);

      return {
        cart,
        success: true,
        message: 'Item added to cart successfully'
      };
    } catch (error) {
      const cart = this.getStoredCart();
      return {
        cart,
        success: false,
        message: 'Failed to add item to cart'
      };
    }
  }

  async removeFromCart(itemId: string): Promise<CartServiceResponse> {
    try {
      const cart = this.getStoredCart();
      cart.items = cart.items.filter(item => item.id !== itemId);
      const totals = this.calculateTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalPrice = totals.totalPrice;
      cart.updatedAt = new Date().toISOString();
      this.saveCart(cart);

      return {
        cart,
        success: true,
        message: 'Item removed from cart successfully'
      };
    } catch (error) {
      const cart = this.getStoredCart();
      return {
        cart,
        success: false,
        message: 'Failed to remove item from cart'
      };
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartServiceResponse> {
    try {
      const cart = this.getStoredCart();
      const itemIndex = cart.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        return {
          cart,
          success: false,
          message: 'Cart item not found'
        };
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return this.removeFromCart(itemId);
      }

      cart.items[itemIndex].quantity = quantity;
      const totals = this.calculateTotals(cart.items);
      cart.totalItems = totals.totalItems;
      cart.totalPrice = totals.totalPrice;
      cart.updatedAt = new Date().toISOString();
      this.saveCart(cart);

      return {
        cart,
        success: true,
        message: 'Cart item updated successfully'
      };
    } catch (error) {
      const cart = this.getStoredCart();
      return {
        cart,
        success: false,
        message: 'Failed to update cart item'
      };
    }
  }

  async clearCart(): Promise<CartServiceResponse> {
    try {
      const cart: Cart = {
        id: 'local-cart',
        userId: 'local-user',
        items: [],
        totalItems: 0,
        totalPrice: 0,
        updatedAt: new Date().toISOString()
      };
      this.saveCart(cart);

      return {
        cart,
        success: true,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      const cart = this.getStoredCart();
      return {
        cart,
        success: false,
        message: 'Failed to clear cart'
      };
    }
  }

  getTotalItems(cart: Cart): number {
    return cart.totalItems;
  }

  getTotalPrice(cart: Cart): number {
    return cart.totalPrice;
  }

  /**
   * Clear current cart (for logout)
   */
  clearCurrentCart(): void {
    if (typeof window !== 'undefined') {
      const currentUserId = this.getCurrentUserId();
      const cartKey = this.getCartKey(currentUserId);
      localStorage.removeItem(cartKey);
      
      // Also clear anonymous cart
      localStorage.removeItem(this.getCartKey(null));
    }
  }

  /**
   * Switch to user's cart (for login)
   */
  async switchToUserCart(userId: string): Promise<Cart> {
    const userCart = this.getStoredCart(userId);
    return userCart;
  }

  /**
   * Get cart for specific user
   */
  async getUserCart(userId: string): Promise<Cart> {
    return this.getStoredCart(userId);
  }
}

export const localCartService = new LocalCartService();
