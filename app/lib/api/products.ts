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
  category?: string;
  brand?: string;
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
  getAll: async (params: ProductsParams = {}): Promise<ProductsResponse> => {
    // Build query string
    const queryParams = new URLSearchParams();
    
    // Add all parameters that are defined
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert boolean values to strings
        if (typeof value === 'boolean') {
          queryParams.append(key, value.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    // Log the request parameters
    console.log('API Request Parameters:', {
      url: `${API_BASE_URL}/products?${queryParams.toString()}`,
      params: Object.fromEntries(queryParams.entries())
    });

    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();

    // Log the raw response
    console.log('API Raw Response:', {
      total: data.total,
      products: data.products.map((p: Product) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        is_featured: p.is_featured
      }))
    });

    // Transform the products
    const transformedProducts = data.products.map(transformProduct);

    // Log the transformed products
    console.log('API Transformed Products:', {
      total: data.total,
      products: transformedProducts.map((p: Product) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        is_featured: p.is_featured
      }))
    });

    return {
      products: transformedProducts,
      total: data.total,
      pages: data.pages,
      current_page: data.current_page,
      per_page: data.per_page
    };
  },

  getById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    // Update image URLs in the response
    return {
      ...data,
      images: data.images.map((img: ProductImage) => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    };
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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
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