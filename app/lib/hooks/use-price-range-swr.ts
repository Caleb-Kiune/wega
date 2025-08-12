import useSWR from 'swr';
import { PriceRange, PriceStats } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UsePriceRangeSWRResult {
  priceRange: PriceRange;
  priceStats: PriceStats | null;
  loading: boolean;
  error: Error | null;
  mutate: () => Promise<any>;
}

export function usePriceRangeSWR(): UsePriceRangeSWRResult {
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/products/price-stats`, {
    // Cache price stats for longer since they don't change often
    revalidateOnFocus: false,
    refreshInterval: 0,
    keepPreviousData: true,
    // Fallback to default range if API fails
    fallback: {
      [`${API_BASE_URL}/products/price-stats`]: {
        min_price: 0,
        max_price: 50000,
        avg_price: 25000,
      }
    }
  });

  // Calculate price range with padding
  const calculatePriceRange = (stats: any): PriceRange => {
    if (stats && stats.min_price !== undefined && stats.max_price !== undefined) {
      const padding = Math.max(1000, Math.floor((stats.max_price - stats.min_price) * 0.1));
      return {
        min: Math.max(0, Math.floor(stats.min_price - padding)),
        max: Math.ceil(stats.max_price + padding)
      };
    }
    return { min: 0, max: 50000 };
  };

  return {
    priceRange: calculatePriceRange(data),
    priceStats: data || null,
    loading: isLoading,
    error: error,
    mutate,
  };
} 