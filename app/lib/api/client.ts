import axios from 'axios';
import { Brand } from './brands';
import { Category } from './categories';
import { Product, ProductsFilters, ProductsResponse } from './products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changed to false to match server CORS config
  timeout: 10000, // Added timeout
});

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

apiClient.getProducts = async (filters: ProductsFilters = {}): Promise<ProductsResponse> => {
  const response = await apiClient.get('/products', { params: filters });
  return response.data;
};

export default apiClient; 