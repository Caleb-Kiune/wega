import useSWR from 'swr';
import { Brand } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UseBrandsSWRResult {
  brands: Brand[];
  loading: boolean;
  error: Error | null;
  mutate: () => Promise<any>;
}

export function useBrandsSWR(): UseBrandsSWRResult {
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/brands`, {
    // Cache brands for longer since they don't change often
    revalidateOnFocus: false,
    refreshInterval: 0,
    // Keep previous data while loading
    keepPreviousData: true,
  });

  return {
    brands: data || [],
    loading: isLoading,
    error: error,
    mutate,
  };
}

// Hook for fetching a single brand
export function useBrandSWR(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_BASE_URL}/brands/${id}` : null,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    brand: data,
    loading: isLoading,
    error: error,
    mutate,
  };
} 