'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { ProductFilters } from '@/components/products/ProductFilters';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category ? `${category} Products` : 'All Products'}
          </h1>
          <p className="text-lg text-gray-600">
            {category 
              ? `Discover our ${category.toLowerCase()} collection` 
              : 'Discover our complete collection of products'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductsGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-width-container container-padding py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-300 aspect-square rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
