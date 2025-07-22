import { Metadata } from 'next';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { ProductFilters } from '@/components/products/ProductFilters';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our wide selection of quality products at great prices.',
  openGraph: {
    title: 'Products | Modern E-Commerce',
    description: 'Browse our wide selection of quality products at great prices.',
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of products
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
