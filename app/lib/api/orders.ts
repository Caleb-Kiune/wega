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

export const ordersApi = {
  getAll: async (params?: { status?: string; page?: number }): Promise<OrdersResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());

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
      console.log(`Updating order ${id} status to ${status}`);
      const url = `${API_BASE_URL}/orders/${id}/status`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server response:', errorData);
        throw new Error(errorData.error || `Failed to update order status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Update successful:', data);
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
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
}; 