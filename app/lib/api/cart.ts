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
  // If the path is just a filename, assume it's in the products directory
  if (!path.includes("/")) {
    return `${API_BASE_URL}/images/products/${path}`;
  }
  return `${API_BASE_URL}${path}`;
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
    const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`);
    if (!response.ok) {
      console.error('Failed to fetch cart:', response.status, response.statusText);
      throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    // Update image URLs in the response
    if (data.items) {
      data.items = data.items.map((item: CartItem) => ({
        ...item,
        product: {
          ...item.product,
          image: getImageUrl(item.product.image)
        }
      }));
    }
    console.log('Cart data received:', data);
    return data;
  },

  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const sessionId = getSessionId();
    console.log('Adding item to cart:', { sessionId, productId, quantity });
    const response = await fetch(`${API_BASE_URL}/cart/items?session_id=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!response.ok) {
      console.error('Failed to add item:', response.status, response.statusText);
      throw new Error('Failed to add item to cart');
    }
    const data = await response.json();
    console.log('Add item response:', data);
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
    return response.json();
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove item from cart');
    return response.json();
  },

  clearCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  },
};

export const deliveryLocationsApi = {
  getAll: async (): Promise<DeliveryLocation[]> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations`);
    if (!response.ok) throw new Error('Failed to fetch delivery locations');
    return response.json();
  },

  getById: async (id: number): Promise<DeliveryLocation> => {
    const response = await fetch(`${API_BASE_URL}/delivery-locations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch delivery location');
    return response.json();
  },
}; 