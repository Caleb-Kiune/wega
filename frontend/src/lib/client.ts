import axios, { AxiosInstance } from 'axios';
import { Brand } from './brands';
import { Category } from './categories';
import { Product, ProductsParams, ProductsResponse, getImageUrl } from './products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com/api';

interface ApiClient extends AxiosInstance {
  getBrands: () => Promise<Brand[]>;
  getCategories: () => Promise<Category[]>;
  getProducts: (filters?: ProductsParams) => Promise<ProductsResponse>;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changed to false to match server CORS config
  timeout: 60000 // 60 seconds
}) as ApiClient;

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add API methods
apiClient.getBrands = async (): Promise<Brand[]> => {
  const response = await apiClient.get('/brands');
  return response.data;
};

apiClient.getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

apiClient.getProducts = async (filters: ProductsParams = {}): Promise<ProductsResponse> => {
  const response = await apiClient.get('/products', { params: filters });
  const data = response.data;
  // Process image URLs
  return {
    ...data,
    products: data.products.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }))
  };
};

export default apiClient; 