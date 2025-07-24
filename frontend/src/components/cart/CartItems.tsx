'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CartItems() {
  const { cart, isLoading, fetchCart, updateCartItem, removeFromCart, isCartItemLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchCart, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">Please login to view your cart</p>
            <p className="text-sm text-gray-400 mt-2 mb-6">
              Sign in to access your saved items and continue shopping
            </p>
            <Link 
              href="/auth/login" 
              className="btn-primary inline-flex items-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-300 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2 mb-6">
              Add some items to get started!
            </p>
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Cart Items ({cart.totalItems})</h2>
        
        <div className="space-y-6">
          {cart.items.map((item) => {
            const itemLoading = isCartItemLoading(item.id);
            
            return (
              <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.product.category}
                </p>
                <p className="text-lg font-semibold text-primary-600 mt-2">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={itemLoading}
                  className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                
                <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={itemLoading}
                  className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={itemLoading}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full disabled:opacity-50"
                title="Remove item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
