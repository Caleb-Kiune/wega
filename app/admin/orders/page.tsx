"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi, Order } from '@/lib/orders';
import { format, isValid, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Truck, CheckCircle, XCircle, Search, Filter, Download, Trash2, LogOut, MoreVertical, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';

function OrdersPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentStatusFilter, paymentMethodFilter, currentPage, debouncedSearch, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        payment_method: paymentMethodFilter !== 'all' ? paymentMethodFilter : undefined,
        page: currentPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setOrders(response.orders);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      setError(null);
      console.log(`Attempting to update order ${orderId} to status ${newStatus}`);
      
      const updatedOrder = await ordersApi.updateStatus(orderId, newStatus);
      console.log('Order updated successfully:', updatedOrder);
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      
      let errorMessage = 'Failed to update order status';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a network error
        if (errorMessage.includes('Network error')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Refresh the orders list to ensure we have the latest data
      try {
        await fetchOrders();
      } catch (refreshError) {
        console.error('Error refreshing orders:', refreshError);
      }
    }
  };

  const handlePaymentStatusChange = async (orderId: number, newStatus: Order['payment_status']) => {
    try {
      await ordersApi.updatePaymentStatus(orderId, newStatus);
      fetchOrders();
      toast.success('Payment status updated successfully');
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
      toast.error('Failed to update payment status');
    }
  };

  const handleBulkStatusChange = async (newStatus: Order['status']) => {
    try {
      await Promise.all(selectedOrders.map(id => ordersApi.updateStatus(id, newStatus)));
      await fetchOrders();
      setSelectedOrders([]);
      toast.success('Selected orders updated successfully');
    } catch (error) {
      console.error('Error updating orders:', error);
      toast.error('Failed to update selected orders');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const results = await Promise.allSettled(
        selectedOrders.map(id => ordersApi.delete(id))
      );
      
      const failedDeletions = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      
      if (failedDeletions.length > 0) {
        console.error('Some orders failed to delete:', failedDeletions);
        toast.error(`${failedDeletions.length} order(s) failed to delete`);
      } else {
        toast.success('Selected orders deleted successfully');
      }
      
      await fetchOrders();
      setSelectedOrders([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast.error('Failed to delete selected orders');
    }
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const exportOrders = () => {
    // TODO: Implement order export functionality
    toast.info('Export functionality coming soon');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodDisplay = (method: string | undefined) => {
    if (!method) return 'Unknown';
    switch (method.toLowerCase()) {
      case 'cod':
        return 'Cash on Delivery';
      case 'mpesa':
        return 'M-Pesa';
      case 'card':
        return 'Credit Card';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const getPaymentMethodColor = (method: string | undefined) => {
    if (!method) return 'bg-gray-100 text-gray-800';
    switch (method.toLowerCase()) {
      case 'cod':
        return 'bg-blue-100 text-blue-800';
      case 'mpesa':
        return 'bg-purple-100 text-purple-800';
      case 'card':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Orders Management
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Track, manage, and fulfill customer orders efficiently
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
                onClick={() => router.push('/admin')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={exportOrders} variant="outline" className="flex items-center gap-2 px-4 py-2.5 h-11 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 px-4 py-2.5 h-11 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </div>
              <CardDescription>Find and filter orders by status, payment, or customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Search Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by customer, order ID, or product..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="h-11 pl-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Order Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Payment Status</Label>
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Payment Method</Label>
                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="All Methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="payment_status">Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-slate-200 bg-white/90 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Orders</CardTitle>
              <CardDescription>Manage all customer orders</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Order #</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Payment</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Method</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <AnimatePresence>
                    {orders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 font-mono font-bold text-emerald-700">#{order.id}</td>
                        <td className="px-4 py-3">{order.first_name} {order.last_name}</td>
                        <td className="px-4 py-3">{format(parseISO(order.created_at), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(order.status) + ' px-2 py-1 rounded-full text-xs font-semibold'}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getPaymentStatusColor(order.payment_status) + ' px-2 py-1 rounded-full text-xs font-semibold'}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(order.payment_method)}`}>
                            {getPaymentMethodDisplay(order.payment_method)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">KES {(order.total_amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button size="icon" variant="secondary" className="hover:bg-emerald-100">
                                <Eye className="h-4 w-4 text-emerald-700" />
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')} className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" /> Cancel Order
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkDelete()} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrdersPageWrapper() {
  return (
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  );
} 