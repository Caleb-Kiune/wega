"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '@/components/product-card';
import ProductsLoading from '@/components/products-loading';
import { Button } from '../components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductsParams } from '../lib/api/products';

export interface ProductsFilters extends Omit<ProductsParams, 'page' | 'limit'> {
  page: number;
  limit: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: 100,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    is_featured: searchParams.get('is_featured') === 'true',
    is_new: searchParams.get('is_new') === 'true',
    is_sale: searchParams.get('is_sale') === 'true',
  });

  const { products, loading, error, totalPages, currentPage } = useProducts(filters);

  // Add logging to see what data we're getting
  useEffect(() => {
    if (products.length > 0) {
      console.log('=== PRODUCTS PAGE DEBUG ===');
      console.log('First product data:', products[0]);
      console.log('Total products:', products.length);
      console.log('=======================');
    }
  }, [products]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.is_featured) params.set('is_featured', 'true');
    if (filters.is_new) params.set('is_new', 'true');
    if (filters.is_sale) params.set('is_sale', 'true');

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/products${newUrl}`);
  }, [filters, router]);

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters((prev: ProductsFilters) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: ProductsFilters) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} loading={loading} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Products Grid */}
          {loading ? (
            <ProductsLoading />
          ) : error ? (
            <div className="text-center text-red-600">
              Error loading products: {error.message}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

            {/* Pagination */}
              {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                  Previous
                </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'bg-green-600 text-white' : ''}
                      >
                        {page}
                </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                  Next
                </Button>
              </nav>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
