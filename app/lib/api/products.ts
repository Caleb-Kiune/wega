import { API_BASE_URL } from "./cart";

// Helper function to get full image URL
const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  // If the path is just a filename, assume it's in the products directory
  if (!path.includes("/")) {
    return `${API_BASE_URL}/images/products/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

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
  originalPrice?: number;
  image: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  category: string;
  brand: string;
  stock: number;
  sku: string;
  rating?: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  features: Array<{
    id: number;
    feature: string;
    display_order: number;
  }>;
  specifications: Array<{
    id: number;
    name: string;
    value: string;
    display_order: number;
  }>;
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    avatar: string;
  }>;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

export const productsApi = {
  getAll: async (params?: { sort?: string }): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products${params?.sort ? `?sort=${params.sort}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Update image URLs in the response
    return data.products.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    // Update image URLs in the response
    return {
      ...data,
      image: getImageUrl(data.image),
      images: data.images.map((img: any) => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    };
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getByBrand: async (brand: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products?brand=${brand}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products?featured=true`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getNew: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products?new=true`);
    if (!response.ok) throw new Error('Failed to fetch new products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getOnSale: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products?sale=true`);
    if (!response.ok) throw new Error('Failed to fetch sale products');
    const data = await response.json();
    // Update image URLs in the response
    return data.map((product: Product) => ({
      ...product,
      image: getImageUrl(product.image),
      images: product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    }));
  },

  getBrands: async (): Promise<{ id: number; name: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/api/brands`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    const data = await response.json();
    return data;
  },

  getCategories: async (): Promise<{ id: number; name: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    const data = await response.json();
    return {
      ...data,
      image: getImageUrl(data.image),
      images: data.images.map((img: any) => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    };
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    const data = await response.json();
    return {
      ...data,
      image: getImageUrl(data.image),
      images: data.images.map((img: any) => ({
        ...img,
        image_url: getImageUrl(img.image_url)
      }))
    };
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
}; 