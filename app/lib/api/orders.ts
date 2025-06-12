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
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return await response.json();
  },

  updateStatus: async (id: number, status: Order['status']): Promise<Order> => {
    try {
      const url = `${API_BASE_URL}/orders/${id}/status`;
      console.log('Making request to:', url);
      
      const requestBody = { status };
      console.log('Request body:', requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }).catch(error => {
        console.error('Network error:', error);
        throw new Error(`Network error: ${error.message}`);
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
      throw new Error('Failed to update order status: Unknown error');
    }
  },

  updatePaymentStatus: async (id: number, status: Order['payment_status']): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_status: status }),
    });
    
    if (!response.ok) throw new Error('Failed to update payment status');
    return await response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete order');
  },

  getByOrderNumber: async (orderNumber: string, email: string): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_number: orderNumber, email }),
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getByOrderNumber:', error);
      throw error;
    }
  },
}; 