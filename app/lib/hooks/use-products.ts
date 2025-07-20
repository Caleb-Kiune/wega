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
        
        console.log('Fetching products with filters:', filters);
        
        const data = await productsApi.getAll(filters);
        
        console.log('API Response received:', {
          productsCount: data.products.length,
          pages: data.pages,
          currentPage: data.current_page,
          total: data.total,
          search: filters.search,
          page: filters.page
        });
        
        setProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.current_page);
        
        console.log('State updated:', {
          products: data.products.length,
          totalPages: data.pages,
          currentPage: data.current_page
        });
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);

  return { 
    products, 
    loading, 
    error, 
    totalPages, 
    currentPage 
  };
} 