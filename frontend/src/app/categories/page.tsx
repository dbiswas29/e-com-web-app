'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';

interface CategoryGroup {
  category: string;
  count: number;
  products: Product[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔥 fetchCategories called');
      
      // Test 1: Direct fetch
      console.log('🔥 Testing direct fetch...');
      const directResponse = await fetch('http://localhost:3001/api/products');
      console.log('🔥 Direct fetch response status:', directResponse.status);
      
      if (!directResponse.ok) {
        throw new Error(`Direct fetch failed with status: ${directResponse.status}`);
      }
      
      const directData = await directResponse.json();
      console.log('🔥 Direct fetch SUCCESS - received products:', directData?.data?.length || 0);
      
      // Test 2: API client
      console.log('🔥 Testing API client...');
      const response = await apiClient.get<{ data: Product[]; total: number; page: number; limit: number; totalPages: number }>('/products');
      console.log('🔥 API client SUCCESS - response data type:', typeof response.data);
      console.log('🔥 API client response keys:', Object.keys(response.data || {}));
      
      const responseData = response.data as { data: Product[]; total: number; page: number; limit: number; totalPages: number };
      const products = responseData.data; // API wraps products in data property
      console.log('🔥 Products extracted:', products?.length || 0);

      if (!products || !Array.isArray(products)) {
        throw new Error(`Expected products array, got: ${typeof products}`);
      }

      // Group products by category
      const categoryMap = new Map<string, Product[]>();
      products.forEach((product, index) => {
        console.log(`🔥 Processing product ${index}: ${product.name} - ${product.category}`);
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, []);
        }
        categoryMap.get(product.category)!.push(product);
      });

      // Convert to CategoryGroup array
      const categoryGroups: CategoryGroup[] = Array.from(categoryMap.entries()).map(([category, categoryProducts]) => ({
        category,
        count: categoryProducts.length,
        products: categoryProducts,
      }));

      console.log('🔥 SUCCESS - Category groups created:', categoryGroups.length);
      categoryGroups.forEach(group => {
        console.log(`🔥 Category: ${group.category} (${group.count} products)`);
      });
      
      setCategories(categoryGroups);
    } catch (error) {
      console.error('🔥 ERROR in fetchCategories:', error);
      if (error instanceof Error) {
        console.error('🔥 Error message:', error.message);
        console.error('🔥 Error stack:', error.stack);
      }
      setError(`Failed to load categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-width-container container-padding py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchCategories}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of products across different categories. 
            Find exactly what you're looking for with ease.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((categoryGroup) => (
            <Link
              key={categoryGroup.category}
              href={`/products?category=${encodeURIComponent(categoryGroup.category)}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {mounted ? categoryGroup.category.substring(0, 2).toUpperCase() : '..'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">
                    {categoryGroup.category}
                  </h3>
                  <p className="text-sm opacity-90">
                    {categoryGroup.count} {categoryGroup.count === 1 ? 'Product' : 'Products'}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Explore {categoryGroup.category}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Starting from ${Math.min(...categoryGroup.products.map(p => p.price)).toFixed(2)}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((categoryGroup) => (
              <Link
                key={`featured-${categoryGroup.category}`}
                href={`/products?category=${encodeURIComponent(categoryGroup.category)}`}
                className="group text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-800 transition-all">
                  <span className="text-white font-bold text-lg">
                    {mounted ? categoryGroup.category.substring(0, 2).toUpperCase() : '..'}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {categoryGroup.category}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {categoryGroup.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse all our products or use our search feature to find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
            <Link href="/products" className="btn-secondary">
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
