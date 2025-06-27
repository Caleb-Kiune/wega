'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ordersApi, Order } from '@/app/lib/api/orders';
import { getImageUrl } from '@/app/lib/api/products';
import { format, isValid, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, XCircle, CreditCard, HelpCircle } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// Utility functions for order status
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

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Package className="h-5 w-5" />;
    case 'processing':
      return <Package className="h-5 w-5" />;
    case 'shipped':
      return <Truck className="h-5 w-5" />;
    case 'delivered':
      return <CheckCircle className="h-5 w-5" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">
            Enter your order number and email to track your order status
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full"
                  aria-label="Order Number"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  aria-label="Email Address"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
              aria-label={loading ? 'Tracking order...' : 'Track Order'}
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">
            <div className="flex items-center justify-between">
              <p>{error}</p>
              <Link
                href="/contact"
                className="text-red-700 hover:text-red-800 flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div>
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" role="region" aria-label="Order Details">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {safeFormat(order.created_at, 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status
                        ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                        : "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status
                        ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
                        : "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {order.first_name} {order.last_name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {order.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {order.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {order.address}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">City:</span> {order.city}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">State:</span> {order.state}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Postal Code:</span> {order.postal_code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200" role="table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 relative">
                                  <Image
                                    src={getImageUrl(item.product?.image_url) || '/placeholder-product.jpg'}
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="(max-width: 40px) 100vw, 40px"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                    {item.product?.name || 'Unknown Product'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              KES {(item.price || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              KES {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-lg font-medium text-gray-900">
                      KES {((order.total_amount || 0) - (order.shipping_cost || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-lg font-medium text-gray-900">
                      KES {(order.shipping_cost || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      KES {(order.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 