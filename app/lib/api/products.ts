import apiClient from './client';

export interface ProductFeature {
  id: number;
  product_id: number;
  feature: string;
  display_order: number;
}

export interface ProductSpecification {
  id: number;
  product_id: number;
  name: string;
  value: string;
  display_order: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku?: string;
  stock: number;
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  brand?: string;
  category?: string;
  rating?: number;
  review_count: number;
  category_id?: number;
  brand_id?: number;
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

  getBrands: async (): Promise<{ id: number; name: string }[]> => {
    const response = await apiClient.get('/brands');
    return response.data;
  },

  getCategories: async (): Promise<{ id: number; name: string }[]> => {
    const response = await apiClient.get('/categories');
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