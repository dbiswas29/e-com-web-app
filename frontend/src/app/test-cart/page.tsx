'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { localCartService } from '@/lib/localCartService';

export default function CartTestPage() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { cart, addToCart, fetchCart } = useCartStore();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testAddToCart = async () => {
    try {
      await addToCart('1', 1); // Add first product
      addTestResult('✅ Added product to cart');
      await fetchCart();
    } catch (error) {
      addTestResult('❌ Failed to add product to cart');
    }
  };

  const testLogin = async () => {
    try {
      await login('user@test.com', 'password123');
      addTestResult('✅ Logged in successfully');
      setTimeout(async () => {
        await fetchCart();
        addTestResult(`🛒 Cart after login: ${cart?.totalItems || 0} items`);
      }, 1000);
    } catch (error) {
      addTestResult('❌ Login failed');
    }
  };

  const testLogout = () => {
    logout();
    addTestResult('✅ Logged out');
    setTimeout(async () => {
      await fetchCart();
      addTestResult(`🛒 Cart after logout: ${cart?.totalItems || 0} items`);
    }, 1000);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const checkCurrentCart = async () => {
    await fetchCart();
    addTestResult(`🛒 Current cart: ${cart?.totalItems || 0} items, User: ${user?.firstName || 'Not logged in'}`);
  };

  useEffect(() => {
    checkCurrentCart();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cart Authentication Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Panel */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Authentication:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? 'Logged In' : 'Logged Out'}
                </span>
              </div>
              
              {user && (
                <div className="flex justify-between">
                  <span className="font-medium">User:</span>
                  <span className="text-sm">{user.firstName} {user.lastName}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="font-medium">Cart Items:</span>
                <span className="font-bold text-blue-600">{cart?.totalItems || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Cart Total:</span>
                <span className="font-bold text-green-600">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={testAddToCart}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Test Product to Cart
              </button>
              
              <button
                onClick={checkCurrentCart}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Check Current Cart
              </button>
              
              {!isAuthenticated ? (
                <button
                  onClick={testLogin}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Login as Test User
                </button>
              ) : (
                <button
                  onClick={testLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={clearTestResults}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">No test results yet. Try the actions above!</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Test Instructions:</h3>
          <ol className="text-sm text-blue-700 space-y-2">
            <li><strong>1.</strong> Add some products to cart while logged out</li>
            <li><strong>2.</strong> Login as test user - cart should clear and switch to user's cart</li>
            <li><strong>3.</strong> Add some products to cart while logged in</li>
            <li><strong>4.</strong> Logout - cart should clear</li>
            <li><strong>5.</strong> Login again - user's cart should restore with previous items</li>
          </ol>
        </div>

        {/* Debug Info */}
        {cart && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Debug Info:</h3>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify({ 
                cartId: cart.id, 
                userId: cart.userId, 
                itemCount: cart.items.length,
                items: cart.items.map(item => ({ id: item.id, productId: item.productId, quantity: item.quantity }))
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
