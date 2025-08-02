import { API_BASE_URL } from './config';

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at?: string;
  last_login?: string;
  migrated_from_session?: string;
  migration_date?: string;
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  address_type: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at?: string;
}

export interface CustomerProfile extends Customer {
  addresses: CustomerAddress[];
}

export interface AuthResponse {
  message: string;
  customer: Customer;
  token: string;
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
  postal_code?: string;
  total_amount: number;
  shipping_cost: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  customer_id?: number;
  guest_session_id?: string;
  items: any[];
}

// Customer Authentication API
export const customerAuthApi = {
  // Register new customer
  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/customer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  // Login customer
  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/customer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  // Get customer profile
  getProfile: async (token: string): Promise<{ customer: CustomerProfile }> => {
    const response = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    return response.json();
  },

  // Update customer profile
  updateProfile: async (
    token: string,
    data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
    }
  ): Promise<{ message: string; customer: Customer }> => {
    const response = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  },

  // Change password
  changePassword: async (
    token: string,
    data: {
      current_password: string;
      new_password: string;
    }
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/customer/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }

    return response.json();
  },

  // Get customer orders
  getOrders: async (token: string): Promise<{ orders: Order[] }> => {
    const response = await fetch(`${API_BASE_URL}/customer/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get orders');
    }

    return response.json();
  },

  // Migrate guest data to customer account
  migrateGuestData: async (
    token: string,
    sessionId: string
  ): Promise<{ message: string; migrated_orders: number }> => {
    const response = await fetch(`${API_BASE_URL}/customer/migrate-guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to migrate guest data');
    }

    return response.json();
  },

  // Get customer addresses
  getAddresses: async (token: string): Promise<{ addresses: CustomerAddress[] }> => {
    const response = await fetch(`${API_BASE_URL}/customer/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get addresses');
    }

    return response.json();
  },

  // Add customer address
  addAddress: async (
    token: string,
    data: {
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state?: string;
      postal_code?: string;
      country?: string;
      address_type?: string;
      is_default_shipping?: boolean;
      is_default_billing?: boolean;
    }
  ): Promise<{ message: string; address: CustomerAddress }> => {
    const response = await fetch(`${API_BASE_URL}/customer/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add address');
    }

    return response.json();
  },

  // Update customer address
  updateAddress: async (
    token: string,
    addressId: number,
    data: {
      address_line_1?: string;
      address_line_2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
      address_type?: string;
      is_default_shipping?: boolean;
      is_default_billing?: boolean;
    }
  ): Promise<{ message: string; address: CustomerAddress }> => {
    const response = await fetch(`${API_BASE_URL}/customer/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update address');
    }

    return response.json();
  },

  // Delete customer address
  deleteAddress: async (
    token: string,
    addressId: number
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/customer/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete address');
    }

    return response.json();
  },
};

// Order Tracking API
export const orderTrackingApi = {
  // Track order by email and order number
  trackOrder: async (data: {
    email: string;
    order_number: string;
  }): Promise<{ order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to track order');
    }

    return response.json();
  },

  // Get orders by email
  getOrdersByEmail: async (email: string): Promise<{ orders: Order[] }> => {
    const response = await fetch(`${API_BASE_URL}/orders/by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get orders');
    }

    return response.json();
  },

  // Get guest orders by session ID
  getGuestOrders: async (sessionId: string): Promise<{ orders: Order[] }> => {
    const response = await fetch(`${API_BASE_URL}/orders/guest/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get guest orders');
    }

    return response.json();
  },

  // Get order status
  getOrderStatus: async (orderId: number): Promise<{
    order_id: number;
    order_number: string;
    status: string;
    payment_status: string;
    created_at?: string;
    updated_at?: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get order status');
    }

    return response.json();
  },

  // Cancel order
  cancelOrder: async (orderId: number): Promise<{ message: string; order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel order');
    }

    return response.json();
  },

  // Reorder
  reorder: async (orderId: number): Promise<{ message: string; order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create reorder');
    }

    return response.json();
  },

  // Search orders
  searchOrders: async (data: {
    email?: string;
    order_number?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ orders: Order[]; total: number }> => {
    const response = await fetch(`${API_BASE_URL}/orders/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search orders');
    }

    return response.json();
  },
}; 