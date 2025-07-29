'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize price values from URL parameters
  const [minPrice, setMinPrice] = useState<string>(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams?.get('maxPrice') || '');

  // Get current filters from URL
  const categoriesParam = searchParams?.get('categories') || '';
  const currentCategory = searchParams?.get('category') || ''; // Legacy support
  
  // Update price inputs when URL changes
  useEffect(() => {
    setMinPrice(searchParams?.get('minPrice') || '');
    setMaxPrice(searchParams?.get('maxPrice') || '');
  }, [searchParams]);
  
  // Parse selected categories from URL
  const selectedCategories = categoriesParam 
    ? categoriesParam.split(',').filter(cat => cat.trim()) 
    : currentCategory 
      ? [currentCategory] 
      : [];

  const updateUrl = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/products${query}`);
  };

  const handleCategoryFilter = (categoryName: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(cat => cat !== categoryName)
      : [...selectedCategories, categoryName];
    
    // Remove legacy single category param and use categories param
    const newParams: Record<string, string> = {
      page: '1', // Reset to first page
    };
    
    // Remove single category parameter
    newParams.category = '';
    
    if (newSelectedCategories.length > 0) {
      newParams.categories = newSelectedCategories.join(',');
    } else {
      newParams.categories = '';
    }
    
    updateUrl(newParams);
  };

  const handlePriceFilter = () => {
    updateUrl({
      minPrice,
      maxPrice,
      page: '1', // Reset to first page
    });
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    // Clear all filter parameters
    router.push('/products');
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleCategoryFilter(category.name)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.name}
                {category.productCount && (
                  <span className="text-gray-500 ml-1">({category.productCount})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handlePriceFilter}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      <div>
        <button
          onClick={clearFilters}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
