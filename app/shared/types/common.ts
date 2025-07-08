export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_location_id: number;
  delivery_location_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryLocation {
  id: number;
  name: string;
  address: string;
  fee: number;
  is_active: boolean;
} 