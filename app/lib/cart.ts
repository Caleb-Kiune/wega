import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from './config';

// Get or create session ID
const getSessionId = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return 'server-session';
  }
  
  try {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'fallback-session';
  }
};

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

// Helper function to get full image URL
const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  
  // Get the base URL from environment variable, fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com';
  const apiBaseUrl = baseUrl.replace('/api', ''); // Remove /api to get the root URL
  
  // If the path is just a filename, assume it's in the uploads directory
  if (!path.includes("/")) {
    return `${apiBaseUrl}/static/uploads/${path}`;
  }
  return `${apiBaseUrl}${path}`;
};

export interface Cart {
  id: number;
  session_id: string;
  items: CartItem[];
}

export interface DeliveryLocation {
  id: number;
  name: string;
  slug: string;
  city: string;
  shippingPrice: number;
  isActive: boolean;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    console.log('Getting cart with session ID:', sessionId);
    console.log('API URL:', `${API_BASE_URL}/cart?session_id=${sessionId}`);
    
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`);
        if (!response.ok) {
          console.error('Failed to fetch cart:', response.status, response.statusText);
          throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Update image URLs in the response
        if (data.items) {
          data.items = data.items.map((item: CartItem) => ({
            ...item,
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: getImageUrl((item.product as any).image_url || item.product.image)
            }
          }));
        }
        console.log('Cart data received:', data);
        return data;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }
    
    // All retries failed
    if (lastError instanceof TypeError && lastError.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw lastError || new Error('Failed to fetch cart after multiple attempts');
  },

  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const sessionId = getSessionId();
    console.log('Adding item to cart:', { sessionId, productId, quantity });
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        session_id: sessionId,
        product_id: productId, 
        quantity 
      }),
    });
    if (!response.ok) {
      console.error('Failed to add item:', response.status, response.statusText);
      throw new Error('Failed to add item to cart');
    }
    const data = await response.json();
    console.log('Add item response:', data);
    
    // Transform the response to match the frontend interface
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: getImageUrl(item.product.image_url || item.product.image)
        }
      }));
    }
    
    return data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    const data = await response.json();
    
    // Transform the response to match the frontend interface
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: getImageUrl(item.product.image_url || item.product.image)
        }
      }));
    }
    
    return data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove item from cart');
    const data = await response.json();
    
    // Handle case where item doesn't exist (backend returns success)
    if (data.message === 'Item not found in cart') {
      console.log('Item not found in cart, returning empty cart state');
      return {
        id: 0,
        session_id: sessionId,
        items: []
      };
    }
    
    // Transform the response to match the frontend interface
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: getImageUrl(item.product.image_url || item.product.image)
        }
      }));
    }
    
    return data;
  },

  clearCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    const data = await response.json();
    
    // Transform the response to match the frontend interface
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: getImageUrl(item.product.image_url || item.product.image)
        }
      }));
    }
    
    return data;
  },
};

export const deliveryLocationsApi = {
  getAll: async (admin: boolean = false): Promise<DeliveryLocation[]> => {
    const url = admin 
      ? `${API_BASE_URL}/delivery-locations?admin=true`
      : `${API_BASE_URL}/delivery-locations`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch delivery locations');
    return response.json();
  },

  getById: async (id: number): Promise<DeliveryLocation> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch delivery location');
    return response.json();
  },

  create: async (data: Omit<DeliveryLocation, 'id'>): Promise<DeliveryLocation> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
        city: data.city,
        shipping_price: data.shippingPrice,
        is_active: data.isActive
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create delivery location');
    }
    return response.json();
  },

  update: async (id: number, data: Partial<Omit<DeliveryLocation, 'id'>>): Promise<DeliveryLocation> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.city && { city: data.city }),
        ...(data.shippingPrice !== undefined && { shipping_price: data.shippingPrice }),
        ...(data.isActive !== undefined && { is_active: data.isActive })
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update delivery location');
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete delivery location');
    }
  },
}; 