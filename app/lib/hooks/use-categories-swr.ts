import useSWR from 'swr';
import { Category } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UseCategoriesSWRResult {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  mutate: () => Promise<any>;
}

export function useCategoriesSWR(): UseCategoriesSWRResult {
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/categories`, {
    // Cache categories for longer since they don't change often
    revalidateOnFocus: false,
    refreshInterval: 0,
    // Keep previous data while loading
    keepPreviousData: true,
  });

  return {
    categories: data || [],
    loading: isLoading,
    error: error,
    mutate,
  };
}

// Hook for fetching a single category
export function useCategorySWR(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_BASE_URL}/categories/${id}` : null,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    category: data,
    loading: isLoading,
    error: error,
    mutate,
  };
} 