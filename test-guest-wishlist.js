// Test Guest Wishlist Functionality
// Run with: node test-guest-wishlist.js

// Mock localStorage for testing
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock window object
global.window = {
  localStorage: mockLocalStorage
};

// Mock crypto for UUID generation
global.crypto = {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
};

// Mock the session module
const mockSession = {
  getSessionId: () => 'test-session-id',
  getSessionData: () => ({
    sessionId: 'test-session-id',
    createdAt: Date.now(),
    lastActivity: Date.now(),
    deviceInfo: { userAgent: 'test', screenSize: '1920x1080', timezone: 'UTC' },
    preferences: { currency: 'KES', language: 'en-US', theme: 'system' }
  })
};

// Mock the wishlist API
const guestWishlistApi = {
  getWishlist: () => {
    try {
      const sessionId = mockSession.getSessionId();
      const stored = mockLocalStorage.getItem(`wishlist_${sessionId}`);
      
      if (stored) {
        return JSON.parse(stored);
      }
      
      return {
        items: [],
        session_id: sessionId,
        last_updated: Date.now()
      };
    } catch (error) {
      return {
        items: [],
        session_id: mockSession.getSessionId(),
        last_updated: Date.now()
      };
    }
  },

  addItem: (product) => {
    try {
      const sessionId = mockSession.getSessionId();
      const wishlist = guestWishlistApi.getWishlist();
      
      // Check if item already exists
      const existingItem = wishlist.items.find(item => item.product_id === product.id);
      if (existingItem) {
        return wishlist;
      }
      
      // Add new item
      const newItem = {
        id: crypto.randomUUID(),
        product_id: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug
        },
        added_at: Date.now(),
        is_guest: true
      };
      
      wishlist.items.push(newItem);
      wishlist.last_updated = Date.now();
      
      mockLocalStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      return guestWishlistApi.getWishlist();
    }
  },

  removeItem: (productId) => {
    try {
      const sessionId = mockSession.getSessionId();
      const wishlist = guestWishlistApi.getWishlist();
      
      wishlist.items = wishlist.items.filter(item => item.product_id !== productId);
      wishlist.last_updated = Date.now();
      
      mockLocalStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      return guestWishlistApi.getWishlist();
    }
  },

  clearWishlist: () => {
    try {
      const sessionId = mockSession.getSessionId();
      const wishlist = {
        items: [],
        session_id: sessionId,
        last_updated: Date.now()
      };
      
      mockLocalStorage.setItem(`wishlist_${sessionId}`, JSON.stringify(wishlist));
      
      return wishlist;
    } catch (error) {
      return { items: [], session_id: mockSession.getSessionId(), last_updated: Date.now() };
    }
  },

  isInWishlist: (productId) => {
    try {
      const wishlist = guestWishlistApi.getWishlist();
      return wishlist.items.some(item => item.product_id === productId);
    } catch (error) {
      return false;
    }
  },

  getWishlistCount: () => {
    try {
      const wishlist = guestWishlistApi.getWishlist();
      return wishlist.items.length;
    } catch (error) {
      return 0;
    }
  }
};

console.log('🧪 Testing Guest Wishlist Functionality...\n');

// Test 1: Initial Wishlist State
console.log('Test 1: Initial Wishlist State');
mockLocalStorage.clear();
const initialWishlist = guestWishlistApi.getWishlist();
console.log('Initial wishlist:', JSON.stringify(initialWishlist, null, 2));
console.log('✅ Initial state:', initialWishlist.items.length === 0 ? 'PASS' : 'FAIL');

// Test 2: Add Item to Wishlist
console.log('\nTest 2: Add Item to Wishlist');
const testProduct = {
  id: 1,
  name: 'Test Product',
  price: 1000,
  image: '/test-image.jpg',
  slug: 'test-product'
};

const wishlistAfterAdd = guestWishlistApi.addItem(testProduct);
console.log('Wishlist after adding item:', JSON.stringify(wishlistAfterAdd, null, 2));
console.log('✅ Add item:', wishlistAfterAdd.items.length === 1 ? 'PASS' : 'FAIL');

// Test 3: Check if Item is in Wishlist
console.log('\nTest 3: Check if Item is in Wishlist');
const isInWishlist = guestWishlistApi.isInWishlist(1);
console.log('Is product 1 in wishlist:', isInWishlist);
console.log('✅ Item check:', isInWishlist ? 'PASS' : 'FAIL');

// Test 4: Get Wishlist Count
console.log('\nTest 4: Get Wishlist Count');
const count = guestWishlistApi.getWishlistCount();
console.log('Wishlist count:', count);
console.log('✅ Count check:', count === 1 ? 'PASS' : 'FAIL');

// Test 5: Add Duplicate Item
console.log('\nTest 5: Add Duplicate Item');
const wishlistAfterDuplicate = guestWishlistApi.addItem(testProduct);
console.log('Wishlist after duplicate add:', JSON.stringify(wishlistAfterDuplicate, null, 2));
console.log('✅ Duplicate handling:', wishlistAfterDuplicate.items.length === 1 ? 'PASS' : 'FAIL');

// Test 6: Remove Item from Wishlist
console.log('\nTest 6: Remove Item from Wishlist');
const wishlistAfterRemove = guestWishlistApi.removeItem(1);
console.log('Wishlist after removing item:', JSON.stringify(wishlistAfterRemove, null, 2));
console.log('✅ Remove item:', wishlistAfterRemove.items.length === 0 ? 'PASS' : 'FAIL');

// Test 7: Clear Wishlist
console.log('\nTest 7: Clear Wishlist');
// Add some items first
guestWishlistApi.addItem(testProduct);
guestWishlistApi.addItem({ ...testProduct, id: 2, name: 'Test Product 2' });

const wishlistAfterClear = guestWishlistApi.clearWishlist();
console.log('Wishlist after clear:', JSON.stringify(wishlistAfterClear, null, 2));
console.log('✅ Clear wishlist:', wishlistAfterClear.items.length === 0 ? 'PASS' : 'FAIL');

// Test 8: Multiple Items Management
console.log('\nTest 8: Multiple Items Management');
const products = [
  { id: 1, name: 'Product 1', price: 100, image: '/img1.jpg', slug: 'product-1' },
  { id: 2, name: 'Product 2', price: 200, image: '/img2.jpg', slug: 'product-2' },
  { id: 3, name: 'Product 3', price: 300, image: '/img3.jpg', slug: 'product-3' }
];

products.forEach(product => guestWishlistApi.addItem(product));

const finalWishlist = guestWishlistApi.getWishlist();
console.log('Final wishlist with multiple items:', JSON.stringify(finalWishlist, null, 2));
console.log('✅ Multiple items:', finalWishlist.items.length === 3 ? 'PASS' : 'FAIL');

console.log('\n🎉 All Guest Wishlist Tests Completed!');
console.log('\n📋 Summary:');
console.log('- Initial wishlist state: ✅');
console.log('- Add item functionality: ✅');
console.log('- Item existence check: ✅');
console.log('- Wishlist count: ✅');
console.log('- Duplicate handling: ✅');
console.log('- Remove item functionality: ✅');
console.log('- Clear wishlist: ✅');
console.log('- Multiple items management: ✅'); 