export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com/api';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BRANDS: '/brands',
  CART: '/cart',
  ORDERS: '/orders',
  DELIVERY_LOCATIONS: '/delivery-locations',
  UPLOAD: '/upload',
} as const;

export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NEWEST: 'created_at_desc',
  OLDEST: 'created_at_asc',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const; 