'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: number;
  user: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
}

interface Specification {
  id: number;
  name: string;
  value: string;
  display_order: number;
}

interface Feature {
  id: number;
  feature: string;
  display_order: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  brand: string;
  category: string;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  specifications: Specification[];
  features: Feature[];
  sku: string;
  stock: number;
}

export default function CrudPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Gallery */}
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name || 'Product image'}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        Sale
                      </span>
                    )}
                  </div>
                  {/* Additional Images */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {product.images?.map((img) => (
                      <img
                        key={img.id}
                        src={img.image_url}
                        alt={`${product.name} - Image ${img.display_order}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{product.name || 'Unnamed Product'}</h2>
                      <p className="text-gray-500">{product.brand || 'Unknown Brand'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > 0 && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-1 text-gray-600">
                        {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {product.features.map((feature) => (
                          <li key={feature.id}>{feature.feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {product.specifications.map((spec) => (
                          <div key={spec.id} className="text-sm">
                            <span className="font-medium">{spec.name}:</span>{' '}
                            <span className="text-gray-600">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4 mb-2">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{review.user}</h4>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-sm text-gray-600">{review.rating}/5</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 ml-auto">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-medium mb-1">{review.title}</h5>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 