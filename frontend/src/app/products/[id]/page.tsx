import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { serverApiClient, handleServerApiCall } from '@/lib/server-api';
import { ProductActions } from '@/components/products/ProductActions';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { ProductImageGallery } from './ProductImageGallery';

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = params.id;

  // Fetch product data on the server
  const [product, relatedProducts] = await Promise.all([
    handleServerApiCall(
      () => serverApiClient.getProduct(productId),
      null as Product | null
    ),
    handleServerApiCall(
      () => serverApiClient.getProducts({ limit: '4' }),
      [] as Product[]
    ),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-width-container container-padding py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <ProductImageGallery
            productName={product.name}
            productImages={product.images || []}
            mainImageUrl={product.imageUrl}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ? (
                      <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                    )
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Actions */}
            <ProductActions product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} currentProductId={productId} />
      </div>
    </div>
  );
}
