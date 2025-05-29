'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  brand: string;
  category: string;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount: number;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name || 'Product image'}
                className="w-full h-48 object-cover"
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
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{product.name || 'Unnamed Product'}</h2>
                <span className="text-sm text-gray-500">{product.brand || 'Unknown Brand'}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description || 'No description available'}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${(product.price || 0).toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > 0 && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 