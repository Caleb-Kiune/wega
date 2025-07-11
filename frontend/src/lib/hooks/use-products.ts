import { useState, useEffect } from 'react';
import { productsApi, Product, ProductsParams, ProductsResponse } from '@/lib/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
}

export function useProducts(filters: ProductsParams = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log the filters being used
        console.log('Fetching products with filters:', filters);
        
        const data = await productsApi.getAll(filters);
        
        // Log the response data
        console.log('API Response:', {
          totalProducts: data.products.length,
          total: data.total,
          pages: data.pages,
          currentPage: data.current_page
        });
        
        setProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.current_page);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error, totalPages, currentPage };
} 