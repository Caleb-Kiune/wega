import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { ProductsFilters } from '../lib/api';
import { Product, ProductsResponse } from '../lib/api/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
}

export function useProducts(filters: ProductsFilters = {}): UseProductsResult {
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
        const response = await apiClient.getProducts(filters);
        setProducts(response.products);
        setTotalPages(response.pages);
        setCurrentPage(response.current_page);
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