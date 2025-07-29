import { Suspense } from 'react';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { serverApiClient, handleServerApiCall } from '@/lib/server-api';
import { Product, Category } from '@/types';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    categories?: string;
    search?: string;
    page?: string;
    limit?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ProductsPage(props: ProductsPageProps = { searchParams: {} }) {
  const { searchParams } = props;
  const categoriesParam = searchParams?.categories;
  const categoryParam = searchParams?.category; // Legacy support
  const searchQuery = searchParams?.search;
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '12';
  const minPrice = searchParams?.minPrice;
  const maxPrice = searchParams?.maxPrice;
  
  const selectedCategories = categoriesParam 
    ? categoriesParam.split(',').filter(cat => cat.trim()) 
    : categoryParam 
      ? [categoryParam] 
      : [];

  // Fetch data on the server
  const [products, categories] = await Promise.all([
    handleServerApiCall(
      () => serverApiClient.getProducts({
        categories: categoriesParam,
        category: categoryParam,
        search: searchQuery,
        page,
        limit,
        minPrice,
        maxPrice,
      }),
      []
    ),
    handleServerApiCall(
      () => serverApiClient.getCategories(),
      []
    ),
  ]);

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (selectedCategories.length === 0) return 'All Products';
    if (selectedCategories.length === 1) return `${selectedCategories[0]} Products`;
    return `${selectedCategories.length} Categories Selected`;
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Showing results for "${searchQuery}"`;
    }
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
          {searchQuery && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                🔍 Search: {searchQuery}
              </span>
            </div>
          )}
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
            <ProductFilters categories={categories} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductsGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
