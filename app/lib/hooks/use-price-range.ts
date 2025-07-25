import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/products';

export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceStats {
  min_price: number;
  max_price: number;
  avg_price: number;
  total_products: number;
  distribution: Array<{
    label: string;
    min: number;
    max: number | null;
    count: number;
  }>;
}

export interface UsePriceRangeResult {
  priceRange: PriceRange;
  priceStats: PriceStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePriceRange(): UsePriceRangeResult {
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 50000 });
  const [priceStats, setPriceStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPriceRange = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get price statistics from the dedicated endpoint
      const stats = await productsApi.getPriceStats();
      
      if (stats && stats.min_price !== undefined && stats.max_price !== undefined) {
        // Add some padding to the range for better UX
        const padding = Math.max(1000, Math.floor((stats.max_price - stats.min_price) * 0.1));
        
        setPriceRange({
          min: Math.max(0, Math.floor(stats.min_price - padding)),
          max: Math.ceil(stats.max_price + padding)
        });
        
        setPriceStats(stats);
      } else {
        // Fallback to default range
        setPriceRange({ min: 0, max: 50000 });
        setPriceStats(null);
      }
    } catch (err) {
      console.error('Error fetching price range:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch price range'));
      // Fallback to default range
      setPriceRange({ min: 0, max: 50000 });
      setPriceStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceRange();
  }, []);

  return {
    priceRange,
    priceStats,
    loading,
    error,
    refetch: fetchPriceRange
  };
} 