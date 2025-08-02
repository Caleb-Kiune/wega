import { getSessionId, getSessionData } from './session';

export interface WishlistItem {
  id: string; // UUID for guest items
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    slug?: string;
  };
  added_at: number;
  is_guest: boolean;
}

export interface Wishlist {
  items: WishlistItem[];
  session_id: string;
  last_updated: number;
}

// Helper function to get full image URL
const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com';
  const apiBaseUrl = baseUrl.replace('/api', '');
  
  if (!path.includes("/")) {
    return `${apiBaseUrl}/static/uploads/${path}`;
  }
  return `${apiBaseUrl}${path}`;
};

// Guest wishlist management
export const guestWishlistApi = {
  // Get wishlist from localStorage
  getWishlist: (): Wishlist => {
    if (typeof window === 'undefined') {
      return { items: [], session_id: '', last_updated: Date.now() };
    }
    
    try {
      const sessionId = getSessionId();
      const stored = localStorage.getItem(`wishlist_${sessionId}`);
      
      if (stored) {
        const wishlist: Wishlist = JSON.parse(stored);
        // Update image URLs
        wishlist.items = wishlist.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            image: getImageUrl(item.product.image)
          }
        }));
        return wishlist;
      }
      
      return {
        items: [],
        session_id: sessionId,
        last_updated: Date.now()
      };
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return {
        items: [],
        session_id: getSessionId(),
        last_updated: Date.now()
      };
    }
  },

  // Add item to wishlist
  addItem: (product: any): Wishlist => {
    if (typeof window === 'undefined') {
      return { items: [], session_id: '', last_updated: Date.now() };
    }
    
    try {
      const sessionId = getSessionId();
      const wishlist = guestWishlistApi.getWishlist();
      
      // Check if item already exists
      const existingItem = wishlist.items.find(item => item.product_id === product.id);
      if (existingItem) {
        return wishlist; // Item already in wishlist
      }
      
      // Add new item
      const newItem: WishlistItem = {
        id: crypto.randomUUID(),
        product_id: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: getImageUrl(product.image),
          slug: product.slug
        },
        added_at: Date.now(),
        is_guest: true
      };
      
      wishlist.items.push(newItem);
      wishlist.last_updated = Date.now();
      
      localStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return guestWishlistApi.getWishlist();
    }
  },

  // Remove item from wishlist
  removeItem: (productId: number): Wishlist => {
    if (typeof window === 'undefined') {
      return { items: [], session_id: '', last_updated: Date.now() };
    }
    
    try {
      const sessionId = getSessionId();
      const wishlist = guestWishlistApi.getWishlist();
      
      wishlist.items = wishlist.items.filter(item => item.product_id !== productId);
      wishlist.last_updated = Date.now();
      
      localStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return guestWishlistApi.getWishlist();
    }
  },

  // Clear wishlist
  clearWishlist: (): Wishlist => {
    if (typeof window === 'undefined') {
      return { items: [], session_id: '', last_updated: Date.now() };
    }
    
    try {
      const sessionId = getSessionId();
      const wishlist: Wishlist = {
        items: [],
        session_id: sessionId,
        last_updated: Date.now()
      };
      
      localStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { items: [], session_id: getSessionId(), last_updated: Date.now() };
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId: number): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const wishlist = guestWishlistApi.getWishlist();
      return wishlist.items.some(item => item.product_id === productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  // Get wishlist count
  getWishlistCount: (): number => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const wishlist = guestWishlistApi.getWishlist();
      return wishlist.items.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  },

  // Sync guest wishlist to backend (for when user registers)
  syncToBackend: async (customerId: number): Promise<boolean> => {
    try {
      const wishlist = guestWishlistApi.getWishlist();
      if (wishlist.items.length === 0) return true;
      
      // TODO: Implement backend sync when customer registration is added
      console.log('Syncing wishlist to backend for customer:', customerId);
      
      return true;
    } catch (error) {
      console.error('Error syncing wishlist to backend:', error);
      return false;
    }
  },

  // Export wishlist data
  exportWishlist: (): string => {
    try {
      const wishlist = guestWishlistApi.getWishlist();
      return JSON.stringify(wishlist, null, 2);
    } catch (error) {
      console.error('Error exporting wishlist:', error);
      return '';
    }
  },

  // Import wishlist data
  importWishlist: (data: string): boolean => {
    try {
      const wishlist: Wishlist = JSON.parse(data);
      const sessionId = getSessionId();
      
      wishlist.session_id = sessionId;
      wishlist.last_updated = Date.now();
      
      localStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return true;
    } catch (error) {
      console.error('Error importing wishlist:', error);
      return false;
    }
  }
}; 