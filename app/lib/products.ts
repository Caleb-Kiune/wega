'use client';

import { Product, ProductFilters, ProductSort } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wega-production.up.railway.app/api';

export async function getProducts(filters?: ProductFilters, sort?: ProductSort, page: number = 1, limit: number = 12): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  try {
    let baseUrl = API_BASE_URL;
    
    // Use Railway URL for production
    if (typeof window === 'undefined') {
      baseUrl = 'https://wega-production.up.railway.app/api';
    }

    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.isNew) params.append('is_new', 'true');
    if (filters?.isSale) params.append('is_sale', 'true');
    if (filters?.isFeatured) params.append('is_featured', 'true');
    if (sort) params.append('sort', sort);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${baseUrl}/products?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    let baseUrl = API_BASE_URL;
    
    // Use Railway URL for production
    if (typeof window === 'undefined') {
      baseUrl = 'https://wega-production.up.railway.app/api';
    }

    const response = await fetch(`${baseUrl}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getCategories(): Promise<{ categories: Array<{ id: number; name: string; slug: string; description?: string; image_url?: string }> }> {
  try {
    let baseUrl = API_BASE_URL;
    
    // Use Railway URL for production
    if (typeof window === 'undefined') {
      baseUrl = 'https://wega-production.up.railway.app/api';
    }

    const response = await fetch(`${baseUrl}/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getBrands(): Promise<{ brands: Array<{ id: number; name: string; slug: string; description?: string; logo_url?: string }> }> {
  try {
    let baseUrl = API_BASE_URL;
    
    // Use Railway URL for production
    if (typeof window === 'undefined') {
      baseUrl = 'https://wega-production.up.railway.app/api';
    }

    const response = await fetch(`${baseUrl}/brands`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
}