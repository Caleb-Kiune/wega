import { useState, useEffect } from 'react';
import { apiClient, Product, ProductsParams, ProductsResponse } from '@/app/lib/api';

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
        const { data } = await apiClient.get<ProductsResponse>('/products', { params: filters });
        setProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.current_page);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error, totalPages, currentPage };
} 