import useSWR from 'swr';
import { Product, ProductsParams } from '@/lib/types';
import { createSWRKey } from '@/lib/swr-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UseProductsSWRResult {
  products: Product[];
  total: number;
  pages: number;
  current_page: number;
  loading: boolean;
  error: Error | null;
  mutate: () => Promise<any>;
}

export function useProductsSWR(filters: ProductsParams = {}): UseProductsSWRResult {
  const key = createSWRKey(`${API_BASE_URL}/products`, filters);
  
  const { data, error, isLoading, mutate } = useSWR(key, {
    // Keep previous data while loading
    keepPreviousData: true,
    // Revalidate on focus for real-time updates
    revalidateOnFocus: true,
    // Refresh interval for live data (optional)
    refreshInterval: 30000, // 30 seconds
  });

  return {
    products: data?.products || [],
    total: data?.total || 0,
    pages: data?.pages || 0,
    current_page: data?.current_page || 1,
    loading: isLoading,
    error: error,
    mutate,
  };
}

// Hook for fetching a single product
export function useProductSWR(id: number) {
  const key = `${API_BASE_URL}/products/${id}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    id ? key : null,
    {
      keepPreviousData: true,
      revalidateOnFocus: true,
    }
  );

  return {
    product: data,
    loading: isLoading,
    error: error,
    mutate,
  };
}

// Hook for fetching featured products
export function useFeaturedProductsSWR(limit: number = 10) {
  return useProductsSWR({ is_featured: true, limit });
}

// Hook for fetching new products
export function useNewProductsSWR(limit: number = 10) {
  return useProductsSWR({ is_new: true, limit });
}

// Hook for fetching sale products
export function useSaleProductsSWR(limit: number = 10) {
  return useProductsSWR({ is_sale: true, limit });
}

// Hook for fetching products by category
export function useProductsByCategorySWR(category: string, limit: number = 10) {
  return useProductsSWR({ categories: [category], limit });
}

// Hook for fetching products by brand
export function useProductsByBrandSWR(brand: string, limit: number = 10) {
  return useProductsSWR({ brands: [brand], limit });
} 