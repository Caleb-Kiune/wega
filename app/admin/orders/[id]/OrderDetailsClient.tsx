'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi, Order } from '@/lib/orders';
import { getImageUrl } from '@/lib/products';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  Calendar,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface OrderDetailsClientProps {
  initialOrder: Order;
}

export default function OrderDetailsClient({ initialOrder }: OrderDetailsClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      setIsUpdating(true);
      await ordersApi.updateStatus(order.id, newStatus);
      const data = await ordersApi.getById(order.id);
      setOrder(data);
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: Order['payment_status']) => {
    try {
      setIsUpdating(true);
      await ordersApi.updatePaymentStatus(order.id, newStatus);
      const data = await ordersApi.getById(order.id);
      setOrder(data);
      toast.success('Payment status updated successfully');
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
      toast.error('Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusIcon = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2.5 h-11 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Orders</span>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Order #{order.order_number}
                  </h1>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Placed on {format(new Date(order.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-11 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={`${getStatusColor(order.status)} border px-3 py-1 rounded-full text-xs font-semibold`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={order.payment_status}
                onValueChange={handlePaymentStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-11 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getPaymentStatusIcon(order.payment_status)}
                      <Badge className={`${getPaymentStatusColor(order.payment_status)} border px-3 py-1 rounded-full text-xs font-semibold`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-slate-200 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Order Items</CardTitle>
                      <CardDescription>{order.items?.length || 0} items in this order</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {order.items?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                            src={getImageUrl(item.product?.image_url)}
                            alt={item.product?.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            KES {(item.price * item.quantity)?.toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-500">
                            KES {item.price?.toLocaleString()} each
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer & Shipping Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Customer Information */}
              <Card className="border-slate-200 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{order.first_name} {order.last_name}</p>
                        <p className="text-sm text-slate-500">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{order.email}</p>
                        <p className="text-sm text-slate-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{order.phone}</p>
                        <p className="text-sm text-slate-500">Phone</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-slate-200 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Payment Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {order.payment_method === 'cod' ? 'Cash on Delivery' :
                           order.payment_method === 'mpesa' ? 'M-Pesa' :
                           order.payment_method === 'card' ? 'Credit Card' :
                           order.payment_method || 'Not specified'}
                        </p>
                        <p className="text-sm text-slate-500">Payment Method</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 text-slate-400 flex items-center justify-center">
                        {getPaymentStatusIcon(order.payment_status)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{order.payment_status}</p>
                        <p className="text-sm text-slate-500">Payment Status</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="border-slate-200 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                      <div>
                        <p className="font-medium text-slate-900">{order.address}</p>
                        <p className="text-sm text-slate-500">
                          {order.city}, {order.state}{order.postal_code && order.postal_code !== 'N/A' ? ` ${order.postal_code}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-slate-200 bg-white/90 shadow-md sticky top-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">
                        KES {(order.total_amount - order.shipping_cost)?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-medium text-slate-900">
                        KES {order.shipping_cost?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-xl font-bold text-emerald-700">
                          KES {order.total_amount?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-slate-200 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Order Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-900">Order Placed</p>
                        <p className="text-sm text-slate-500">
                          {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-400">Processing</p>
                        <p className="text-sm text-slate-400">In progress</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-400">Shipped</p>
                        <p className="text-sm text-slate-400">Pending</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-400">Delivered</p>
                        <p className="text-sm text-slate-400">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            {order.notes && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-slate-200 bg-white/90 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">Order Notes</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{order.notes}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 