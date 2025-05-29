import { useState, useEffect } from 'react';
import apiClient, { Brand } from '../lib/api';

interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: Error | null;
}

export function useBrands(): UseBrandsResult {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getBrands();
        setBrands(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
} 