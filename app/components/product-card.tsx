import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/api';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.image_url || '/placeholder.svg';

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block aspect-square relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.is_new && (
            <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
              New
            </span>
          )}
          {product.is_sale && (
            <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              <Link href={`/products/${product.id}`} className="hover:text-green-600">
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
            aria-label="Add to wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            KES {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-sm text-gray-500 line-through">
              KES {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.review_count})
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          aria-label="Add to cart"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
} 