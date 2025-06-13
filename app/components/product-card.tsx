import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/api';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { API_BASE_URL } from '../lib/api/config';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.image_url || '/placeholder.svg';
  // Add detailed logging for debugging
  console.log('=== PRODUCT CARD DEBUG ===');
  console.log('Product ID:', product.id);
  console.log('Product Name:', product.name);
  console.log('Status Flags:', {
    is_featured: product.is_featured,
    is_new: product.is_new,
    is_sale: product.is_sale
  });
  console.log('Brand:', product.brand);
  console.log('Category:', product.category);
  console.log('Full Product Data:', JSON.stringify(product, null, 2));
  console.log('=======================');

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block aspect-square relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={product.is_featured}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Status Badges - New Position */}
      <div className="absolute top-0 left-0 w-full">
        <div className="relative">
          <div className="absolute top-2 left-2 flex flex-wrap gap-2">
            {product.is_featured && (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-sm"></div>
                <div className="relative bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                  Featured
                </div>
              </div>
            )}
            {product.is_new && (
              <div className="relative">
                <div className="absolute inset-0 bg-green-600 blur-sm"></div>
                <div className="relative bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                  New
                </div>
              </div>
            )}
            {product.is_sale && (
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-sm"></div>
                <div className="relative bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                  Sale
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">${product.original_price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{product.rating?.toFixed(1) || '0.0'}</span>
            <span className="ml-1 text-sm text-gray-500">({product.review_count})</span>
          </div>
        </div>
      </div>
    </div>
  );
} 