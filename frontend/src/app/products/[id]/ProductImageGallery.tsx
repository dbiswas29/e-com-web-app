'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductImageGalleryProps {
  productName: string;
  productImages: string[];
  mainImageUrl: string;
}

export function ProductImageGallery({ productName, productImages, mainImageUrl }: ProductImageGalleryProps) {
  // Create a gallery with 4 images, using fallbacks if needed
  const fallbackImages = [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop'
  ];

  // Combine existing images with fallbacks to ensure we have 4 images
  const allImages = [...new Set([mainImageUrl, ...productImages])]; // Remove duplicates
  const galleryImages = [...allImages];
  
  // Add fallback images if we have fewer than 4
  while (galleryImages.length < 4) {
    galleryImages.push(fallbackImages[galleryImages.length % fallbackImages.length]);
  }
  
  // Limit to 4 images
  const finalImages = galleryImages.slice(0, 4);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = finalImages[currentImageIndex];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? finalImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === finalImages.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden group">
        <Image
          src={currentImage}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {finalImages.length}
        </div>
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-4 gap-3">
        {finalImages.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`aspect-square relative bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              index === currentImageIndex
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
            {index === currentImageIndex && (
              <div className="absolute inset-0 bg-primary-500 bg-opacity-20" />
            )}
          </button>
        ))}
      </div>

      {/* Image Dots Indicator */}
      <div className="flex justify-center space-x-2">
        {finalImages.map((_, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentImageIndex
                ? 'bg-primary-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
