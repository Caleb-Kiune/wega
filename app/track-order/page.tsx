'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion"
import { ordersApi, Order } from '@/lib/orders';
import { getImageUrl } from '@/lib/products';
import { format, isValid, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  HelpCircle,
  User,
  MapPin,
  Mail,
  Phone,
  FileText,
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Home,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// Utility functions for order status
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

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Package className="h-4 w-4 text-amber-500" />;
    case 'processing':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-4 w-4 text-purple-500" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-slate-500" />;
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

const getPaymentMethodDisplay = (method?: string) => {
  switch (method) {
    case 'cod': return 'Cash on Delivery'
    case 'mpesa': return 'M-Pesa'
    case 'card': return 'Credit Card'
    default: return method || 'Not specified'
  }
}

// Safe date formatting helper
const safeFormat = (dateString: string | null | undefined, fmt: string) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
  if (!isValid(date)) return 'N/A';
  return format(date, fmt);
};

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    items: false,
    details: false,
    timeline: false
  });

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const orderNumberParam = searchParams.get('orderNumber');
    const emailParam = searchParams.get('email');

    if (orderNumberParam && emailParam) {
      setOrderNumber(orderNumberParam);
      setEmail(emailParam);
      handleTrackOrder(undefined, orderNumberParam, emailParam);
    }
  }, [searchParams]);

  const handleTrackOrder = async (
    e?: React.FormEvent,
    orderNumberValue?: string,
    emailValue?: string
  ) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const finalOrderNumber = orderNumberValue || orderNumber;
    const finalEmail = emailValue || email;

    try {
      const response = await ordersApi.getByOrderNumber(finalOrderNumber, finalEmail);
      console.log('Order tracking response:', response);
      setOrder(response);
      toast({
        title: "Order Found",
        description: "Your order details have been loaded successfully.",
      });
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Order not found. Please check your order number and email.');
      setOrder(null);
      toast({
        variant: "destructive",
        title: "Order Not Found",
        description: "We couldn't find an order with the provided details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Compact Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              </motion.div>
            </div>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Track Your Order
            </motion.h1>
            <motion.p 
              className="text-slate-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
            Enter your order number and email to track your order status
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Order Tracking</h2>
                  <p className="text-slate-600 text-sm">Find your order details</p>
                </div>
        </div>
            </div>

            <div className="p-6">
              {!isClient ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
              <form onSubmit={handleTrackOrder} className="space-y-4" suppressHydrationWarning>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium text-slate-700 mb-2">
                      Order Number
                    </label>
                    <Input
                      id="orderNumber"
                      type="text"
                      placeholder="Enter order number"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                      className="w-full min-h-[44px] text-base"
                      aria-label="Order Number"
                    />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full min-h-[44px] text-base"
                      aria-label="Email Address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[56px] text-base font-medium rounded-2xl flex items-center justify-center gap-3 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'linear-gradient(to right, #059669, #16a34a)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          </motion.div>

          {/* Error Message */}
        {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" 
              role="alert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-sm">{error}</p>
              <Link
                href="/contact"
                  className="text-red-700 hover:text-red-800 flex items-center gap-1 text-sm"
              >
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
            </motion.div>
        )}

          {/* Loading State */}
        {loading && (
            <motion.div 
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Skeleton className="h-5 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div>
                    <Skeleton className="h-5 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
            </motion.div>
        )}

          {/* Order Results */}
        {order && (
            <motion.div 
              className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-emerald-600" />
                      </div>
                <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Order #{order.order_number}
                  </h2>
                        <p className="text-slate-600 text-sm">
                          Placed on {safeFormat(order.created_at, 'MMM d, yyyy \'at\' h:mm a')}
                  </p>
                </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                      <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                      {order.status
                        ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                        : "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <Badge className={`${getPaymentStatusColor(order.payment_status)} border font-medium px-3 py-1`}>
                      {order.payment_status
                        ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
                        : "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

              <div className="p-6">
                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="text-sm font-medium text-slate-700">{order.first_name} {order.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Payment</p>
                      <p className="text-sm font-medium text-slate-700">{getPaymentMethodDisplay(order.payment_method)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-medium text-slate-700">{order.city}, {order.state}</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex justify-between items-center">
                <div>
                      <p className="text-sm text-slate-600">Total Amount</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        KES {(order.total_amount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{order.items?.length || 0} items</p>
                      <p className="text-sm text-slate-600">Shipping: KES {(order.shipping_cost || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Collapsible Sections */}
          {order && (
            <div className="space-y-4 mb-8">
              {/* Order Items Section */}
              <Collapsible open={expandedSections.items} onOpenChange={() => toggleSection('items')}>
                <Card className="border-slate-200 bg-white/90 shadow-lg">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-emerald-600" />
                          </div>
                <div>
                            <CardTitle className="text-lg">Order Items ({order.items?.length || 0})</CardTitle>
                            <p className="text-slate-600 text-sm">View your purchased items</p>
                  </div>
                </div>
                        {expandedSections.items ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
              </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-slate-200">
                                  <Image
                                    src={getImageUrl(item.product?.image_url) || '/placeholder-product.jpg'}
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 truncate">
                                    {item.product?.name || 'Unknown Product'}
                                </h4>
                                <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                                  </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">
                                  KES {(item.price * item.quantity)?.toLocaleString()}
                                </p>
                              </div>
                            </motion.div>
                        ))
                      ) : (
                          <div className="text-center py-6 text-slate-500">
                            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-sm">No items found for this order.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Order Details Section */}
              <Collapsible open={expandedSections.details} onOpenChange={() => toggleSection('details')}>
                <Card className="border-slate-200 bg-white/90 shadow-lg">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Order Details</CardTitle>
                            <p className="text-slate-600 text-sm">Customer info, shipping & payment details</p>
                          </div>
                        </div>
                        {expandedSections.details ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-600" />
                            Customer Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-700">{order.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                              <Phone className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-700">{order.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            Shipping Address
                          </h4>
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-700">{order.address}</p>
                            <p className="text-sm text-slate-700">{order.city}, {order.state}</p>
                            {order.postal_code && order.postal_code !== 'N/A' && (
                              <p className="text-sm text-slate-700">{order.postal_code}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-amber-800 font-medium text-sm mb-1">Order Notes</p>
                              <p className="text-amber-700 text-sm">{order.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Order Timeline Section */}
              <Collapsible open={expandedSections.timeline} onOpenChange={() => toggleSection('timeline')}>
                <Card className="border-slate-200 bg-white/90 shadow-lg">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Order Timeline</CardTitle>
                            <p className="text-slate-600 text-sm">Track your order progress</p>
                          </div>
                        </div>
                        {expandedSections.timeline ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-emerald-600 text-xs font-bold">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 mb-1">Order Confirmed</h4>
                            <p className="text-xs text-slate-600 mb-1">{safeFormat(order.created_at, 'MMM d, h:mm a')}</p>
                            <p className="text-xs text-slate-600">Your order has been received and confirmed.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-emerald-600 text-xs font-bold">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 mb-1">Processing</h4>
                            <p className="text-xs text-slate-600">Our team is preparing your order for shipment.</p>
                </div>
              </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-slate-400 text-xs font-bold">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-400 mb-1">Shipping</h4>
                            <p className="text-xs text-slate-400">Your order will be shipped soon.</p>
                          </div>
                  </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-slate-400 text-xs font-bold">4</span>
                  </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-400 mb-1">Delivery</h4>
                            <p className="text-xs text-slate-400">Your order will be delivered to your address.</p>
                  </div>
                </div>
              </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-emerald-200 p-8 mb-8 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              background: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #10b981'
            }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">What would you like to do next?</h3>
              <p className="text-slate-600 text-base">Choose your next action</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-8 py-4 text-base border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium rounded-2xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#cbd5e1',
                    color: '#374151',
                    minHeight: '56px'
                  }}
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </Link>
              
              <Link href="/products" className="w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 font-medium rounded-2xl flex items-center justify-center gap-3 text-white"
                  style={{ 
                    background: 'linear-gradient(to right, #059669, #16a34a)',
                    border: 'none',
                    color: 'white',
                    minHeight: '56px'
                  }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </button>
              </Link>
            </div>
          </motion.div>
          </div>
      </div>
    </div>
  );
} 