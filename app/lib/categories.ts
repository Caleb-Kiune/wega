import apiClient from './client';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface CategoryProductsResponse {
  products: any[];
  total: number;
  pages: number;
  current_page: number;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  getProducts: async (id: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<CategoryProductsResponse> => {
    const response = await apiClient.get(`/categories/${id}/products`, { params });
    return response.data;
  },
}; 