'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden" role="region" aria-label="Hero section">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-width-container container-padding py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Amazing
                <span className="block text-yellow-300">Products</span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-100 max-w-lg">
                Shop the latest trends with unbeatable prices and fast, 
                free shipping on orders over $50.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                Browse Categories
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-primary-200">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-primary-200">Products</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-primary-200">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-24 h-24 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Shopping bag icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">Featured Products</h3>
                  <p className="text-primary-100">Discover our best sellers</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg z-0">
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-gray-600">On orders $50+</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg z-0">
              <div className="text-sm font-medium">Best Price</div>
              <div className="text-xs text-gray-600">Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)"/>
        </svg>
      </div>
    </section>
  );
}
