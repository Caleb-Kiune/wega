import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000, // Increased timeout to 10 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    console.log('Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
      },
    });

    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Connection refused. Is the backend server running?');
      // Return empty data instead of throwing error
      return Promise.resolve({ data: [] });
    }

    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config?.url);
      return Promise.resolve({ data: [] });
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data);
      return Promise.resolve({ data: [] });
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  products: '/products',
  brands: '/brands',
  categories: '/categories',
} as const;

// Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  is_new?: boolean;
  is_sale?: boolean;
  category: string;
  brand: string;
  stock: number;
  rating?: number;
  review_count?: number;
  features?: string[];
  specifications?: Record<string, string>;
  images?: string[];
  sku?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

export interface ProductsFilters {
  page?: number;
  limit?: number;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  search?: string;
}

// API methods with error handling
export const apiClient = {
  // Products
  getProducts: async (filters?: ProductsFilters) => {
    try {
      const response = await api.get<ProductsResponse>(endpoints.products, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0, pages: 0, current_page: 1, per_page: 12 };
    }
  },

  // Brands
  getBrands: async () => {
    try {
      const response = await api.get<Brand[]>(endpoints.brands);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const response = await api.get<Category[]>(endpoints.categories);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};

export default apiClient; 