import apiClient from './client';

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

export interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    categories?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
}; 