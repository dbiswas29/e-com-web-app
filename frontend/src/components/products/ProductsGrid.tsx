'use client';

export function ProductsGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing 1-12 of 156 products
        </p>
        <select className="input text-sm py-2">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
          <option>Best Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product cards will be loaded here */}
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    </div>
  );
}
