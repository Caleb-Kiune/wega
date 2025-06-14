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
  
  // Debug URL parameters
  useEffect(() => {
    console.log('=== URL Parameters ===');
    console.log('Page:', searchParams.get('page'));
    console.log('Limit:', searchParams.get('limit'));
    console.log('Categories:', searchParams.getAll('categories'));
    console.log('Brands:', searchParams.getAll('brands'));
    console.log('Is Featured:', searchParams.get('is_featured'));
    console.log('Is New:', searchParams.get('is_new'));
    console.log('Is Sale:', searchParams.get('is_sale'));
    console.log('=====================');
  }, [searchParams]);

  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 36,
    categories: searchParams.getAll('categories'),
    brands: searchParams.getAll('brands'),
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    is_featured: searchParams.get('is_featured') === 'true',
    is_new: searchParams.get('is_new') === 'true',
    is_sale: searchParams.get('is_sale') === 'true',
  });

  // Debug initial filters
  useEffect(() => {
    console.log('=== Initial Filters ===');
    console.log('Filters:', filters);
    console.log('=====================');
  }, []);

  const { products, loading, error, totalPages, currentPage } = useProducts(filters);

  // Debug products data
  useEffect(() => {
    if (products.length > 0) {
      console.log('=== Products Data ===');
      console.log('Total products:', products.length);
      console.log('First product:', products[0]);
      console.log('Last product:', products[products.length - 1]);
      console.log('Total pages:', totalPages);
      console.log('Current page:', currentPage);
      console.log('=====================');
    }
  }, [products, totalPages, currentPage]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.categories?.length) {
      filters.categories.forEach(category => {
        params.append('categories', category);
      });
    }
    if (filters.brands?.length) {
      filters.brands.forEach(brand => {
        params.append('brands', brand);
      });
    }
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
          {/* Products Count */}
          {!loading && !error && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length} of {totalPages * filters.limit} products
            </div>
          )}

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

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <nav className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      
                      {/* Show page numbers with ellipsis */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current
                          return page === 1 || 
                                 page === totalPages || 
                                 Math.abs(currentPage - page) <= 1;
                        })
                        .map((page, index, array) => {
                          // Add ellipsis between non-consecutive pages
                          const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? 'bg-green-600 text-white' : ''}
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        Last
                      </Button>
                    </nav>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
