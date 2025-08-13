import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/products';
import { ordersApi } from '@/lib/orders';
import { deliveryLocationsApi, DeliveryLocation } from '@/lib/cart';
import { Product } from '@/shared/types';
import { Order } from '@/lib/orders';

interface DashboardData {
  products: Product[];
  orders: Order[];
  deliveryLocations: DeliveryLocation[];
  loading: boolean;
  error: string | null;
}

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  todaysSales: number;
  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
  freeDeliveryLocations: number;
  paidDeliveryLocations: number;
}

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    products: [],
    orders: [],
    deliveryLocations: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch all data in parallel for better performance
      const [productsResponse, ordersResponse, deliveryLocationsData] = await Promise.all([
        productsApi.getAll({ limit: 1000 }),
        ordersApi.getAll({ page: 1, per_page: 1000 }),
        deliveryLocationsApi.getAll(true)
      ]);
      
      setData({
        products: productsResponse.products || [],
        orders: ordersResponse.orders || [],
        deliveryLocations: deliveryLocationsData || [],
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      // Set partial data if some requests succeeded
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch some dashboard data. Please refresh to try again.'
      }));
    }
  };

  const calculateStats = (): DashboardStats => {
    const { products, orders, deliveryLocations } = data;
    
    // Product statistics
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    // Order statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    
    // Today's sales calculation
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.created_at && o.created_at.startsWith(today));
    const todaysSales = todaysOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    // Delivery location statistics
    const totalLocations = deliveryLocations.length;
    const activeLocations = deliveryLocations.filter(loc => loc.isActive).length;
    const inactiveLocations = deliveryLocations.filter(loc => !loc.isActive).length;
    const freeDeliveryLocations = deliveryLocations.filter(loc => loc.shippingPrice === 0).length;
    const paidDeliveryLocations = deliveryLocations.filter(loc => loc.shippingPrice > 0).length;

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      todaysSales,
      totalLocations,
      activeLocations,
      inactiveLocations,
      freeDeliveryLocations,
      paidDeliveryLocations
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...data,
    stats: calculateStats(),
    refetch: fetchDashboardData
  };
} 