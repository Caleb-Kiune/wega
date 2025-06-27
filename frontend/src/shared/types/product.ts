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