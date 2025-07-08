import { API_BASE_URL } from './config';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image_url: string;
    price: number;
  };
}

export interface Order {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  total_amount: number;
  shipping_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  session_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  delivery_location_id: number;
  notes?: string;
  cart_items?: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

export interface OrdersParams {
  status?: string;
  payment_status?: string;
  page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const ordersApi = {
  getAll: async (params?: OrdersParams): Promise<OrdersResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.payment_status) queryParams.append('payment_status', params.payment_status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

      const url = `${API_BASE_URL}/orders?${queryParams.toString()}`;
      console.log('Fetching orders from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Orders response:', data);
      return data;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      console.log('Creating order with data:', orderData);
      console.log('API URL:', `${API_BASE_URL}/orders`);
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          const responseText = await response.text();
          console.error('Raw response text:', responseText);
        }
        
        throw new Error(errorMessage);
      }

      const order = await response.json();
      console.log('Order created successfully:', order);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      return await response.json();
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  },

  updateStatus: async (id: number, status: Order['status']): Promise<Order> => {
    try {
      console.log(`Updating order ${id} status to:`, status);
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to update order status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Status updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw error;
    }
  },

  updatePaymentStatus: async (id: number, status: Order['payment_status']): Promise<Order> => {
    try {
      console.log(`Updating order ${id} payment status to:`, status);
      const response = await fetch(`${API_BASE_URL}/orders/${id}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_status: status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to update payment status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment status updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      console.log(`Deleting order ${id}`);
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to delete order: ${response.status}`);
      }
      
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  track: async (orderNumber: string, email: string): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_number: orderNumber, email }),
      });

      if (!response.ok) throw new Error('Failed to track order');
      return await response.json();
    } catch (error) {
      console.error('Error in track:', error);
      throw error;
    }
  },

  getByOrderNumber: async (orderNumber: string, email: string): Promise<Order> => {
    try {
      console.log('Tracking order by number:', orderNumber, 'email:', email);
      const response = await fetch(`${API_BASE_URL}/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_number: orderNumber, email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Order not found' }));
        throw new Error(errorData.error || 'Order not found');
      }

      const orders = await response.json();
      console.log('Track response:', orders);
      
      // Return the first order if it's an array, or the order if it's a single object
      if (Array.isArray(orders)) {
        if (orders.length === 0) {
          throw new Error('Order not found');
        }
        return orders[0];
      }
      
      return orders;
    } catch (error) {
      console.error('Error in getByOrderNumber:', error);
      throw error;
    }
  },
}; 