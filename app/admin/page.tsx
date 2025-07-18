'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/products';
import { ordersApi } from '@/lib/orders';
import { deliveryLocationsApi, DeliveryLocation } from '@/lib/cart';
import { Product } from '@/shared/types';
import { Order } from '@/lib/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, MapPin, Settings, LogOut, BarChart3, TrendingUp, Users, Plus, ArrowRight, AlertTriangle, Check, Star, Zap, Tag, Activity, DollarSign, ShoppingBag, Truck, UserCheck, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

function AdminPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await productsApi.getAll({
          limit: 1000 // Get all products for stats
        });
        setProducts(productsResponse.products);
        
        // Fetch orders
        const ordersResponse = await ordersApi.getAll({
          page: 1,
          per_page: 1000 // Get all orders for stats
        });
        setOrders(ordersResponse.orders);
        
        // Fetch delivery locations
        const deliveryLocationsData = await deliveryLocationsApi.getAll(true);
        setDeliveryLocations(deliveryLocationsData);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Calculate dashboard stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  
  // Calculate order statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  
  // Calculate today's sales (orders created today)
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(o => o.created_at.startsWith(today));
  const todaysSales = todaysOrders.reduce((sum, order) => sum + order.total_amount, 0);
  
  // Calculate delivery location statistics
  const totalLocations = deliveryLocations.length;
  const activeLocations = deliveryLocations.filter(loc => loc.isActive).length;
  const inactiveLocations = deliveryLocations.filter(loc => !loc.isActive).length;
  const freeDeliveryLocations = deliveryLocations.filter(loc => loc.shippingPrice === 0).length;
  const paidDeliveryLocations = deliveryLocations.filter(loc => loc.shippingPrice > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-500 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-ping opacity-20"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-700">Loading your dashboard</h3>
                <p className="text-slate-500">Preparing your admin overview...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto border-red-200 bg-red-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-700">Connection Error</CardTitle>
              <CardDescription className="text-red-600">Failed to load dashboard data</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-600 text-center">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
              Try Again
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
          <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Manage your kitchenware business with powerful tools
                  </p>
                </div>
              </div>
            {user && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Logged in as {user.username} ({user.role})</span>
                </div>
            )}
          </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
                className="flex items-center gap-2 px-4 py-2.5 h-11 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
      </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">In Stock</p>
                  <p className="text-2xl font-bold text-green-900">{inStockProducts}</p>
                </div>
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-900">{outOfStockProducts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Products Management */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-5 h-5 text-blue-50" />
                  </div>
                <div>
                    <CardTitle className="text-lg">Products Management</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{totalProducts}</div>
                  <div className="text-sm text-blue-600">Total Products</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">In Stock</span>
                  <span className="font-medium text-green-600">{inStockProducts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Out of Stock</span>
                  <span className="font-medium text-red-600">{outOfStockProducts}</span>
                </div>
                <Button 
                  onClick={() => router.push('/admin/products')}
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  style={{ 
                    backgroundColor: '#2563eb', 
                    color: 'white',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  Manage Products
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" style={{ color: '#ffffff' }} />
                  </div>
                <div>
                    <CardTitle className="text-lg">Orders Management</CardTitle>
                    <CardDescription>Track and fulfill orders</CardDescription>
      </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{pendingOrders}</div>
                    <div className="text-xs text-green-600">Pending Orders</div>
              </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">KES {todaysSales.toFixed(2)}</div>
                    <div className="text-xs text-blue-600">Today's Sales</div>
              </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Processing</span>
                    <span className="font-medium text-orange-600">{processingOrders}</span>
              </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Shipped</span>
                    <span className="font-medium text-green-600">{shippedOrders}</span>
            </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Delivered</span>
                    <span className="font-medium text-blue-600">{deliveredOrders}</span>
                  </div>
                </div>
                  <Button
                  onClick={() => router.push('/admin/orders')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  View Orders
                  </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Locations */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-purple-50" />
            </div>
                  <div>
                    <CardTitle className="text-lg">Delivery Locations</CardTitle>
                    <CardDescription>Manage delivery areas</CardDescription>
          </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{activeLocations}</div>
                    <div className="text-xs text-purple-600">Active Locations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalLocations}</div>
                    <div className="text-xs text-green-600">Total Locations</div>
                          </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Free Delivery</span>
                    <span className="font-medium text-green-600">{freeDeliveryLocations}</span>
                          </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Paid Delivery</span>
                    <span className="font-medium text-blue-600">{paidDeliveryLocations}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Inactive</span>
                    <span className="font-medium text-red-600">{inactiveLocations}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/admin/delivery-locations')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  Manage Locations
                </Button>
              </div>
            </CardContent>
              </Card>


              </motion.div>

        {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">No recent activity to display</p>
                  <p className="text-xs text-slate-400 mt-1">Activity will appear here as you use the system</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
      </div>
    </div>
  );
}

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
} 