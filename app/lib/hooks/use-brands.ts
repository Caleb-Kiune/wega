import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/products';

interface Brand {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
}

interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

export const useBrands = (): UseBrandsResult => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getBrands();
        setBrands(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
}; 