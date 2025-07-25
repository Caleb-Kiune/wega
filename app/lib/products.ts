import { API_BASE_URL } from './config';

// Helper function to get full image URL
export const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  
  // Use the same base URL logic as config.ts
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  let baseUrl: string;
  if (isDevelopment && isLocalhost) {
    baseUrl = 'http://localhost:5000';
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  } else {
    baseUrl = 'https://wega-backend.onrender.com';
  }
  
  // If the path is just a filename, assume it's in the uploads directory
  if (!path.includes("/")) {
    return `${baseUrl}/static/uploads/${path}`;
  }
  
  // Ensure the path starts with a slash if it doesn't already
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

// Helper function to transform image URL back to relative path
const transformImageUrlForBackend = (url: string): string => {
  if (!url) return "";
  // If it's a full URL, extract just the filename
  if (url.startsWith("http")) {
    const parts = url.split("/");
    return parts[parts.length - 1];
  }
  return url;
};

export interface ProductFeature {
  id?: number;
  product_id?: number;
  feature: string;
  display_order: number;
}

export interface ProductSpecification {
  id?: number;
  product_id?: number;
  name: string;
  value: string;
  display_order: number;
}

export interface ProductImage {
  id?: number;
  product_id?: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Review {
  id: number;
  product_id: number;
  user: string;
  avatar: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  stock: number;
  is_new: boolean;
  is_sale: boolean;
  is_featured: boolean;
  images: ProductImage[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  brand: string;
  category: string;
  brand_id?: number;
  category_id?: number;
  rating: number;
  review_count: number;
  image_url: string;
  reviews: Review[];
}

export interface ProductsParams {
  categories?: string[];
  brands?: string[];
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  is_featured?: boolean;
  is_new?: boolean;
  is_sale?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

// Add transformation function
const transformProduct = (product: any): Product => {
  return {
    ...product,
    is_new: product.is_new || false,
    is_sale: product.is_sale || false,
    is_featured: product.is_featured || false,
    images: product.images?.map((img: any) => ({
      ...img,
      image_url: getImageUrl(img.image_url)
    })) || []
  };
};

export const productsApi = {
  getAll: async (params: ProductsParams = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    // Add filter parameters
    if (params.categories?.length) {
      params.categories.forEach(category => {
        queryParams.append('categories[]', category);
      });
    }
    if (params.brands?.length) {
      params.brands.forEach(brand => {
        queryParams.append('brands[]', brand);
      });
    }
    if (params.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params.is_featured) queryParams.append('is_featured', 'true');
    if (params.is_new) queryParams.append('is_new', 'true');
    if (params.is_sale) queryParams.append('is_sale', 'true');
    
    // Add search and sort parameters
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    
    // Apply transformation to products
    return {
      ...data,
      products: data.products.map((product: any) => transformProduct(product))
    };
  },

  getPriceStats: async () => {
    const response = await fetch(`${API_BASE_URL}/products/price-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch price statistics');
    }
    return await response.json();
  },
  
  getById: async (id: number) => {
    console.log('🔄 API getById - Fetching product ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      console.error('❌ API getById - Failed to fetch product:', response.status, response.statusText);
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    console.log('📦 API getById - Raw response data:', data);
    console.log('📋 API getById - Specifications:', data.specifications);
    console.log('📋 API getById - Features:', data.features);
    
    return data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getByBrand: async (brand: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products?brand=${brand}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products?featured=true`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getNew: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products?new=true`);
    if (!response.ok) throw new Error('Failed to fetch new products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getOnSale: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products?sale=true`);
    if (!response.ok) throw new Error('Failed to fetch sale products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getBrands: async (): Promise<{ id: number; name: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/brands`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    const data = await response.json();
    return data;
  },

  getCategories: async (): Promise<{ id: number; name: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data;
  },

  checkSkuUnique: async (sku: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/check-sku?sku=${sku}`);
      if (response.ok) {
        const data = await response.json();
        return data.is_unique;
      }
      return false;
    } catch (error) {
      console.error('Error checking SKU uniqueness:', error);
      return false;
    }
  },

  generateUniqueSku: async (): Promise<string> => {
    try {
      // Generate a random SKU with format: WG-XX-XXXX-XXX
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      
      const generateSku = () => {
        const prefix = 'WG';
        const middle = Array.from({length: 2}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        const firstNum = Array.from({length: 4}, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
        const suffix = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        return `${prefix}-${middle}-${firstNum}-${suffix}`;
      };

      // Try up to 10 times to find a unique SKU
      for (let i = 0; i < 10; i++) {
        const sku = generateSku();
        
        // Check if SKU exists using the dedicated endpoint
        const response = await fetch(`${API_BASE_URL}/products/check-sku?sku=${sku}`);
        if (response.ok) {
          const data = await response.json();
          if (data.is_unique) {
            return sku; // SKU is unique
          }
        }
      }
      
      // Fallback: use timestamp-based SKU
      const timestamp = Date.now().toString().slice(-6);
      return `WG-TS-${timestamp}-${Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')}`;
    } catch (error) {
      console.error('Error generating SKU:', error);
      // Final fallback
      const timestamp = Date.now().toString().slice(-6);
      return `WG-FB-${timestamp}`;
    }
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      console.log('Creating product with data:', product);
      
      // If no SKU is provided, generate a unique one
      let productData = { ...product };
      if (!productData.sku || productData.sku.trim() === '') {
        productData.sku = await productsApi.generateUniqueSku();
        console.log('Generated unique SKU:', productData.sku);
      }
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      console.log('Create response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Create failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Handle SKU conflict specifically
        if (response.status === 400 && errorData.error && errorData.error.includes('UNIQUE constraint failed: products.sku')) {
          throw new Error('SKU already exists. Please use a different SKU or leave it empty to auto-generate.');
        }
        
        throw new Error(errorData.error || `Failed to create product: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Create response:', data);
      return data;
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
      throw new Error('Failed to create product: Unknown error');
    }
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    try {
      console.log('🔄 API Update - Starting update for product ID:', id);
      console.log('📦 API Update - Raw product data:', product);
      
      // Ensure all required fields are present
      const requiredFields = ['name', 'price', 'stock'];
      const missingFields = requiredFields.filter(field => {
        const value = product[field as keyof Product];
        return value === undefined || value === null || value === '';
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate specifications
      if (product.specifications?.some(spec => !spec.name || !spec.value)) {
        throw new Error('All specifications must have both name and value');
      }

      // Transform image URLs before sending to backend
      const transformedProduct = {
        ...product,
        // Ensure these fields are present with default values if not provided
        name: product.name || '',
        price: product.price || 0,
        stock: product.stock || 0,
        description: product.description || '',
        sku: product.sku || '',
        is_new: product.is_new || false,
        is_sale: product.is_sale || false,
        is_featured: product.is_featured || false,
        images: product.images?.map(img => ({
          ...img,
          image_url: transformImageUrlForBackend(img.image_url),
          is_primary: img.is_primary || false,
          display_order: img.display_order || 0
        })) || [],
        specifications: product.specifications?.map(spec => ({
          ...spec,
          name: spec.name.trim(),
          value: spec.value.trim(),
          display_order: spec.display_order || 0
        })) || [],
        features: product.features?.map(feature => ({
          ...feature,
          feature: feature.feature.trim(),
          display_order: feature.display_order || 0
        })) || []
      };

      console.log('🚀 API Update - Sending transformed data:', {
        id,
        specifications: transformedProduct.specifications,
        features: transformedProduct.features,
        images: transformedProduct.images?.length
      });

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedProduct),
      });

      console.log('📡 API Update - Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ API Update - Error response JSON:', errorData);
        } catch (jsonError) {
          console.error('❌ API Update - Failed to parse error response as JSON:', jsonError);
          errorData = { error: 'Failed to parse error response' };
        }
        
        console.error('❌ API Update - Update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Provide more specific error messages based on status code
        let errorMessage = 'Failed to update product';
        if (response.status === 400) {
          errorMessage = errorData.error || 'Invalid data provided';
        } else if (response.status === 404) {
          errorMessage = 'Product not found';
        } else if (response.status === 500) {
          // Handle specific database constraint errors
          if (errorData.error && errorData.error.includes('UNIQUE constraint failed: products.sku')) {
            errorMessage = 'SKU already exists. Please use a different SKU or leave it empty.';
          } else {
            errorMessage = errorData.error || 'Server error occurred';
          }
        } else {
          errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Update - Update successful:', {
        id: data.id,
        specifications: data.specifications?.length,
        features: data.features?.length
      });
      
      // Transform the response data to include full URLs
      return {
        ...data,
        images: data.images.map((img: ProductImage) => ({
          ...img,
          image_url: getImageUrl(img.image_url)
        }))
      };
    } catch (error) {
      console.error('❌ API Update - Error in update:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update product: ${error.message}`);
      }
      throw new Error('Failed to update product: Unknown error');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      console.log(`Attempting to delete product ${id}`);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => null);
        console.error('Delete error response:', errorData);
        throw new Error(errorData?.error || 'Failed to delete product');
      }
      
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },
};