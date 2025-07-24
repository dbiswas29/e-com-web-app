'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function CartSummary() {
  const { cart, getTotalItems, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 50 ? 0 : subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const itemCount = getTotalItems();
  const hasItems = itemCount > 0 && isAuthenticated;

  if (!isAuthenticated) {
    return (
      <div className="card p-6 sticky top-4">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Please login to view your order summary</p>
          <div className="text-gray-400 text-sm">
            Sign in to see your cart total and proceed to checkout
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        className={`w-full text-lg py-3 rounded-lg font-medium transition-colors ${
          hasItems 
            ? 'bg-primary-600 text-white hover:bg-primary-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!hasItems}
      >
        {hasItems ? 'Proceed to Checkout' : 'Cart is Empty'}
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        {subtotal >= 50 || subtotal === 0 
          ? 'Free shipping on orders over $50' 
          : `Add $${(50 - subtotal).toFixed(2)} more for free shipping`
        }
      </p>
    </div>
  );
}
