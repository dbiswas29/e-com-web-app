'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Category {
  category: string;
  count: number;
}

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    setMounted(true);
    const category = searchParams?.get('category') || '';
    const min = searchParams?.get('minPrice') || '';
    const max = searchParams?.get('maxPrice') || '';
    
    setSelectedCategory(category);
    setMinPrice(min);
    setMaxPrice(max);
    
    fetchCategories();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: any[]; total: number }>('/products');
      const products = response.data.data;

      // Group products by category to get counts
      const categoryMap = new Map<string, number>();
      products.forEach(product => {
        const count = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, count + 1);
      });

      const categoryList: Category[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));

      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = (newParams: Record<string, string | null>) => {
    if (!mounted) return;
    
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    
    Object.keys(newParams).forEach((key) => {
      const value = newParams[key];
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/products${query}`);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    updateURL({ category: newCategory });
  };

  const handlePriceFilter = () => {
    updateURL({ 
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  const hasActiveFilters = mounted && (selectedCategory || minPrice || maxPrice);

  // Don't render dynamic content until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="card p-4">
          <button 
            onClick={clearFilters}
            className="btn-secondary w-full text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(({ category, count }) => (
              <label key={category} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={mounted ? selectedCategory === category : false}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="text-sm">{category}</span>
                </div>
                <span className="text-xs text-gray-500">({count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <input 
              type="number" 
              className="input" 
              placeholder="$0"
              value={mounted ? minPrice : ''}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input 
              type="number" 
              className="input" 
              placeholder="$1000"
              value={mounted ? maxPrice : ''}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button 
            className="btn-primary w-full"
            onClick={handlePriceFilter}
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Filters</h3>
        <div className="space-y-2">
          <button 
            className="w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            onClick={() => {
              setMinPrice('');
              setMaxPrice('25');
              updateURL({ minPrice: null, maxPrice: '25' });
            }}
          >
            Under $25
          </button>
          <button 
            className="w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            onClick={() => {
              setMinPrice('25');
              setMaxPrice('50');
              updateURL({ minPrice: '25', maxPrice: '50' });
            }}
          >
            $25 - $50
          </button>
          <button 
            className="w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            onClick={() => {
              setMinPrice('50');
              setMaxPrice('100');
              updateURL({ minPrice: '50', maxPrice: '100' });
            }}
          >
            $50 - $100
          </button>
          <button 
            className="w-full text-left text-sm p-2 rounded hover:bg-gray-100"
            onClick={() => {
              setMinPrice('100');
              setMaxPrice('');
              updateURL({ minPrice: '100', maxPrice: null });
            }}
          >
            Over $100
          </button>
        </div>
      </div>
    </div>
  );
}
