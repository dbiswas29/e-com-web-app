import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
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
          <Categories />
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
          <FeaturedProducts />
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
