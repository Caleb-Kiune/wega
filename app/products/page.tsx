"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '@/lib/hooks/use-products';
import ProductFilters from '@/components/ProductFilters';
import ProductCard from '@/components/product-card';
import { ProductsLoading } from '@/components/products-loading';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductsParams } from '@/shared/types';

export interface ProductsFilters extends Omit<ProductsParams, 'page' | 'limit'> {
  page: number;
  limit: number;
  search?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Debug URL parameters
  useEffect(() => {
    console.log('=== URL Parameters ===');
    console.log('Page:', searchParams.get('page'));
    console.log('Limit:', searchParams.get('limit'));
    console.log('Categories:', searchParams.getAll('categories[]'));
    console.log('Brands:', searchParams.getAll('brands[]'));
    console.log('Is Featured:', searchParams.get('is_featured'));
    console.log('Is New:', searchParams.get('is_new'));
    console.log('Is Sale:', searchParams.get('is_sale'));
    console.log('=====================');
  }, [searchParams]);

  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 36,
    categories: searchParams.getAll('categories[]'),
    brands: searchParams.getAll('brands[]'),
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    is_featured: searchParams.get('is_featured') === 'true',
    is_new: searchParams.get('is_new') === 'true',
    is_sale: searchParams.get('is_sale') === 'true',
    search: searchParams.get('search') || undefined,
  });

  // Debug initial filters
  useEffect(() => {
    console.log('=== Initial Filters ===');
    console.log('Filters:', filters);
    console.log('=====================');
  }, []);

  // Handle search parameter changes from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: urlSearch || undefined, page: 1 }));
    }
  }, [searchParams.get('search')]);

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

  const handleFiltersChange = (newFilters: Partial<ProductsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (updatedFilters.page > 1) params.set('page', updatedFilters.page.toString());
    if (updatedFilters.limit !== 36) params.set('limit', updatedFilters.limit.toString());
    if (updatedFilters.categories?.length) {
      updatedFilters.categories.forEach(category => params.append('categories[]', category));
    }
    if (updatedFilters.brands?.length) {
      updatedFilters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (updatedFilters.min_price) params.set('min_price', updatedFilters.min_price.toString());
    if (updatedFilters.max_price) params.set('max_price', updatedFilters.max_price.toString());
    if (updatedFilters.is_featured) params.set('is_featured', 'true');
    if (updatedFilters.is_new) params.set('is_new', 'true');
    if (updatedFilters.is_sale) params.set('is_sale', 'true');
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    // Update URL with new page
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (filters.limit !== 36) params.set('limit', filters.limit.toString());
    if (filters.categories?.length) {
      filters.categories.forEach(category => params.append('categories[]', category));
    }
    if (filters.brands?.length) {
      filters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.is_featured) params.set('is_featured', 'true');
    if (filters.is_new) params.set('is_new', 'true');
    if (filters.is_sale) params.set('is_sale', 'true');
    if (filters.search) params.set('search', filters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleClearSearch = () => {
    const updatedFilters = { ...filters, search: undefined, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL without search parameter
    const params = new URLSearchParams();
    if (updatedFilters.limit !== 36) params.set('limit', updatedFilters.limit.toString());
    if (updatedFilters.categories?.length) {
      updatedFilters.categories.forEach(category => params.append('categories[]', category));
    }
    if (updatedFilters.brands?.length) {
      updatedFilters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (updatedFilters.min_price) params.set('min_price', updatedFilters.min_price.toString());
    if (updatedFilters.max_price) params.set('max_price', updatedFilters.max_price.toString());
    if (updatedFilters.is_featured) params.set('is_featured', 'true');
    if (updatedFilters.is_new) params.set('is_new', 'true');
    if (updatedFilters.is_sale) params.set('is_sale', 'true');
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Filters */}
        <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} loading={loading} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Results Header */}
          {filters.search && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm text-green-800">
                    Search results for: <span className="font-semibold">"{filters.search}"</span>
                  </span>
                  <span className="text-sm text-green-600">
                    ({products.length} {products.length === 1 ? 'product' : 'products'} found)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="text-green-700 border-green-300 hover:bg-green-100 min-h-[44px] w-full sm:w-auto"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Products Count */}
          {!loading && !error && !filters.search && (
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {filters.search ? (
                  <>
                    <p className="text-lg font-medium mb-2">No products found for "{filters.search}"</p>
                    <p className="text-sm">Try adjusting your search terms or browse all products</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">No products found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </>
                )}
              </div>
              {filters.search && (
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Enhanced Pagination - Mobile Optimized */}
              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <nav className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="min-h-[44px] min-w-[44px]"
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
                                className={`min-h-[44px] min-w-[44px] ${currentPage === page ? 'bg-green-600 text-white' : ''}`}
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
                        className="min-h-[44px] min-w-[44px]"
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="min-h-[44px] min-w-[44px]"
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
