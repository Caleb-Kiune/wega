import apiClient from './client';

export interface Brand {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface BrandProductsResponse {
  products: any[];
  total: number;
  pages: number;
  current_page: number;
}

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    const response = await apiClient.get('/brands');
    return response.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data;
  },

  getProducts: async (id: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<BrandProductsResponse> => {
    const response = await apiClient.get(`/brands/${id}/products`, { params });
    return response.data;
  },
}; 