import { SWRConfiguration } from 'swr';

// Reusable fetcher function
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }
  
  return response.json();
};

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  // Dedupe requests within 2 seconds
  dedupingInterval: 2000,
  
  // Revalidate on focus
  revalidateOnFocus: true,
  
  // Revalidate on reconnect
  revalidateOnReconnect: true,
  
  // Retry on error with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Refresh interval (disabled by default, can be overridden per hook)
  refreshInterval: 0,
  
  // Keep previous data while revalidating
  keepPreviousData: true,
  
  // Fetcher function
  fetcher,
  
  // Error handling
  onError: (error) => {
    console.error('SWR Error:', error);
  },
  
  // Success handling
  onSuccess: (data, key) => {
    console.log('SWR Success:', key, data);
  },
};

// Helper function to create SWR keys with filters
export const createSWRKey = (endpoint: string, filters?: Record<string, any>) => {
  if (!filters || Object.keys(filters).length === 0) {
    return endpoint;
  }
  
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}; 