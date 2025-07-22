'use client';

export function CartItems() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-2">
            Add some items to get started!
          </p>
        </div>
      </div>
    </div>
  );
}
