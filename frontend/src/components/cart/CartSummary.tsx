export function CartSummary() {
  return (
    <div className="card p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>

      <button className="btn-primary w-full text-lg py-3" disabled>
        Checkout
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Free shipping on orders over $50
      </p>
    </div>
  );
}
