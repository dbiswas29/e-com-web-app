import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';
import { serverApiClient, handleServerApiCall } from '@/lib/server-api';
import { Product, Category } from '@/types';

interface CategoryGroup {
  category: string;
  products: Product[];
}

export default async function HomePage() {
  // Fetch data on the server
  const [featuredProducts, allProducts] = await Promise.all([
    handleServerApiCall(
      () => serverApiClient.getFeaturedProducts(),
      []
    ),
    handleServerApiCall(
      () => serverApiClient.getProducts({}),
      []
    ),
  ]);

  // Debug: Log the data we received
  console.log('HomePage - Featured Products:', featuredProducts?.length || 0);
  console.log('HomePage - All Products:', allProducts?.length || 0);

  // Group products by category and create categories with product images
  const categoryMap = new Map<string, Product[]>();
  const products = allProducts || [];
  
  products.forEach((product: Product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }
    categoryMap.get(product.category)!.push(product);
  });

  // Convert to Category objects with product images
  const categories: Category[] = Array.from(categoryMap.entries()).map(([categoryName, categoryProducts], index) => ({
    id: `cat-${index + 1}`,
    name: categoryName,
    description: `Browse products in ${categoryName} category`,
    imageUrl: categoryProducts[0]?.imageUrl || 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=400&fit=crop',
    productCount: categoryProducts.length,
    slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  console.log('HomePage - Categories created:', categories?.length || 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-width-container container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover our wide range of products across different categories
            </p>
          </div>
          <div className="px-12 lg:px-16">
            <Categories categories={categories} />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-width-container container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Check out our most popular products
            </p>
          </div>
          <FeaturedProducts products={featuredProducts} />
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary text-lg px-8 py-3"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-600">
        <div className="max-width-container container-padding">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
