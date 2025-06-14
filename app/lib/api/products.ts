import { API_BASE_URL } from './config';

// Helper function to get full image URL
export const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  // If the path is just a filename, assume it's in the products directory
  if (!path.includes("/")) {
    return `http://localhost:5000/images/products/${path}`;
  }
  return `http://localhost:5000${path}`;
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
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
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

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    try {
      // Ensure all required fields are present
      const requiredFields = ['name', 'price', 'stock'];
      const missingFields = requiredFields.filter(field => !product[field as keyof Product]);
      
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

      console.log('Sending update request with data:', {
        id,
        product: {
          ...transformedProduct,
          images: transformedProduct.images?.map(img => ({
            ...img,
            image_url: img.image_url
          }))
        }
      });

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || `Failed to update product: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Update response:', data);
      
      // Transform the response data to include full URLs
      return {
        ...data,
        images: data.images.map((img: ProductImage) => ({
          ...img,
          image_url: getImageUrl(img.image_url)
        }))
      };
    } catch (error) {
      console.error('Error in update:', error);
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