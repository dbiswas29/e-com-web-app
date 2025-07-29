'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Category } from '@/types';

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  // Use server data directly (no fallback needed as we now get real product images)
  const displayCategories = categories || [];
  
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(displayCategories.length / itemsPerPage);
  
  const currentCategories = displayCategories.slice(
    currentStartIndex,
    currentStartIndex + itemsPerPage
  );

  const goToNext = () => {
    if (currentStartIndex + itemsPerPage < displayCategories.length) {
      setCurrentStartIndex(currentStartIndex + itemsPerPage);
    }
  };

  const goToPrevious = () => {
    if (currentStartIndex > 0) {
      setCurrentStartIndex(currentStartIndex - itemsPerPage);
    }
  };

  const canGoNext = currentStartIndex + itemsPerPage < displayCategories.length;
  const canGoPrevious = currentStartIndex > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && canGoPrevious) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && canGoNext) {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoPrevious, canGoNext, currentStartIndex]);

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {displayCategories.length > itemsPerPage && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
              !canGoPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:scale-110'
            }`}
            aria-label="Previous categories"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
              !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:scale-110'
            }`}
            aria-label="Next categories"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
        {currentCategories.map((category, index) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="category-image-container">
              <Image
                src={category.imageUrl || 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=400&fit=crop'}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-bold text-white text-center px-4">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Dots */}
      {displayCategories.length > itemsPerPage && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStartIndex(index * itemsPerPage)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                Math.floor(currentStartIndex / itemsPerPage) === index
                  ? 'bg-primary-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
