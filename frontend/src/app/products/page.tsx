'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { ProductFilters } from '@/components/products/ProductFilters';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoriesParam = searchParams?.get('categories');
  const categoryParam = searchParams?.get('category'); // Legacy support
  
  const selectedCategories = categoriesParam 
    ? categoriesParam.split(',').filter(cat => cat.trim()) 
    : categoryParam 
      ? [categoryParam] 
      : [];

  const getPageTitle = () => {
    if (selectedCategories.length === 0) return 'All Products';
    if (selectedCategories.length === 1) return `${selectedCategories[0]} Products`;
    return `${selectedCategories.length} Categories Selected`;
  };

  const getPageDescription = () => {
    if (selectedCategories.length === 0) return 'Discover our complete collection of products';
    if (selectedCategories.length === 1) return `Discover our ${selectedCategories[0].toLowerCase()} collection`;
    return `Browse products from: ${selectedCategories.join(', ')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            {getPageDescription()}
          </p>
          {selectedCategories.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span 
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
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
