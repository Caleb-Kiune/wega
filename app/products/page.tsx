"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '@/components/product-card';
import ProductsLoading from '@/components/products-loading';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Grid3X3, List } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductsParams } from '../lib/api/products';

export interface ProductsFilters extends Omit<ProductsParams, 'page' | 'limit'> {
  page: number;
  limit: number;
  sort: 'featured' | 'newest' | 'offers' | 'price_asc' | 'price_desc';
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    sort: (searchParams.get('sort') as ProductsFilters['sort']) || 'featured',
    search: searchParams.get('search') || undefined,
  });

  const { products, loading, error, totalPages, currentPage } = useProducts(filters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/products${newUrl}`);
  }, [filters, router]);

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters((prev: ProductsFilters) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: ProductsFilters) => ({ ...prev, page }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev: ProductsFilters) => ({ ...prev, sort: value as ProductsFilters['sort'] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} loading={loading} />

        {/* Main Content */}
        <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-600 mr-3">Sort by:</span>
              <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="offers">Offers</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <button className="p-2 bg-green-600 text-white">
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white text-gray-600 hover:bg-gray-100">
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

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
