'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { apiClient } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, isItemLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = params?.id as string;
  const isAddingToCart = isItemLoading(productId);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get<Product>(`/products/${productId}`);
      setProduct(response.data);
      
      // Set the primary image first, then check if additional images exist
      const allImages = response.data.images && response.data.images.length > 0 
        ? response.data.images 
        : [response.data.imageUrl];
      
      // Ensure we have a valid image URL
      const firstImage = allImages[0] || response.data.imageUrl;
      setSelectedImage(firstImage);
      setSelectedImageIndex(0);
      
      console.log('Product loaded:', response.data);
      console.log('Selected image:', firstImage);
      console.log('All images:', allImages);
      
      // Fetch related products
      fetchRelatedProducts();
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      setIsLoadingRelated(true);
      const response = await apiClient.get<Product[]>(`/products/${productId}/related`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Don't show error for related products, just log it
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (!product || product.stock === 0) {
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }
    } catch (error) {
      // Error is handled in the store
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <StarSolidIcon className="absolute inset-0 h-5 w-5 text-yellow-400 w-1/2 overflow-hidden" />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-width-container container-padding py-8">
          {/* Back button - show during loading too */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Products
          </button>
          
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image skeleton */}
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-square bg-gray-300 rounded-xl"></div>
                <div className="flex justify-center lg:justify-start">
                  <div className="flex space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="lg:col-span-5 space-y-6 lg:pl-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
                <div className="h-12 bg-gray-300 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-10 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-width-container container-padding py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - Takes up 7 columns for larger display */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-xl bg-white shadow-lg group">
              {selectedImage && product ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                  onError={(e) => {
                    console.error('Image failed to load:', selectedImage);
                    // Fallback to product imageUrl if available
                    if (product.imageUrl && selectedImage !== product.imageUrl) {
                      setSelectedImage(product.imageUrl);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-gray-400 text-4xl mb-2">📷</div>
                    <p className="text-gray-500 text-sm">Loading image...</p>
                  </div>
                </div>
              )}
              
              {/* Image Navigation Arrows */}
              {product && (() => {
                const allImages = product.images && product.images.length > 0 
                  ? product.images 
                  : [product.imageUrl];
                
                if (allImages.length > 1) {
                  return (
                    <>
                      <button
                        onClick={() => {
                          const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
                          setSelectedImage(allImages[newIndex]);
                          setSelectedImageIndex(newIndex);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:shadow-xl"
                      >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                      </button>
                      <button
                        onClick={() => {
                          const newIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
                          setSelectedImage(allImages[newIndex]);
                          setSelectedImageIndex(newIndex);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:shadow-xl"
                      >
                        <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                      </button>
                    </>
                  );
                }
                return null;
              })()}
              
              {/* Stock badge */}
              {product && product.stock === 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-md">
                  Out of Stock
                </div>
              )}
              {product && product.stock > 0 && product.stock <= 10 && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-md">
                  Only {product.stock} left!
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex justify-center lg:justify-start">
              <div className="flex space-x-3 overflow-x-auto pb-2 max-w-full">
                {product && (() => {
                  const allImages = product.images && product.images.length > 0 
                    ? product.images 
                    : [product.imageUrl];
                  
                  return allImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(imageUrl);
                        setSelectedImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-primary-500 ring-2 ring-primary-200 shadow-md scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.name} view ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full p-1"
                      />
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Product Information - Takes up 5 columns */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            {/* Product Title and Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-full transition-colors"
                >
                  {product.category}
                </Link>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex flex-wrap items-center gap-4" data-testid="product-rating">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl lg:text-5xl font-bold text-gray-900" data-testid="product-price">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500">USD</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center">
              {product.stock > 0 ? (
                <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">In Stock</span>
                  {product.stock <= 10 && (
                    <span className="ml-2 text-orange-600 font-medium">
                      (Only {product.stock} left)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-sm font-semibold text-gray-900">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none cursor-pointer"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {isAddingToCart 
                    ? 'Adding...' 
                    : product.stock === 0 
                    ? 'Out of Stock' 
                    : 'Add to Cart'
                  }
                </button>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
                  <dd className="text-sm font-semibold text-gray-900">{product.category}</dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Stock</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Product ID</dt>
                  <dd className="text-sm font-mono text-gray-900">{product.id}</dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Rating</dt>
                  <dd className="text-sm font-semibold text-gray-900">{product.rating.toFixed(1)}/5.0</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You might also like
          </h2>
          
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                        {relatedProduct.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(relatedProduct.rating)}
                        <span className="text-xs text-gray-600 ml-1">
                          ({relatedProduct.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {relatedProduct.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p className="mb-4">No related products found in this category.</p>
              <Link href="/products" className="btn-secondary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
