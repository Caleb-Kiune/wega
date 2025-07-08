import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface DeliveryLocation {
  id: number;
  name: string;
  city: string;
  slug: string;
  shippingPrice: number;
  isActive: boolean;
}

interface UseDeliveryLocationsResult {
  deliveryLocations: DeliveryLocation[];
  loading: boolean;
  error: string | null;
}

export const useDeliveryLocations = (): UseDeliveryLocationsResult => {
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveryLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/delivery-locations`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch delivery locations');
        }
        
        const data = await response.json();
        setDeliveryLocations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch delivery locations');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryLocations();
  }, []);

  return { deliveryLocations, loading, error };
}; 