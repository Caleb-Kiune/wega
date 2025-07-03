'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi, Order } from '@/lib/orders';
import { getImageUrl } from '@/lib/products';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailsClientProps {
  initialOrder: Order;
}

export default function OrderDetailsClient({ initialOrder }: OrderDetailsClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      await ordersApi.updateStatus(order.id, newStatus);
      const data = await ordersApi.getById(order.id);
      setOrder(data);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (newStatus: Order['payment_status']) => {
    try {
      await ordersApi.updatePaymentStatus(order.id, newStatus);
      const data = await ordersApi.getById(order.id);
      setOrder(data);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
    }
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

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm sm:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 min-h-[44px] px-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Order #{order.order_number}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Placed on {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full sm:w-[140px] min-h-[44px]">
                    <SelectValue>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
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
                >
                  <SelectTrigger className="w-full sm:w-[120px] min-h-[44px]">
                    <SelectValue>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
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
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Customer Information</h2>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Name:</span> {order.first_name} {order.last_name}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Email:</span> {order.email}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Shipping Information</h2>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Address:</span> {order.address}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">City:</span> {order.city}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">State:</span> {order.state}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Postal Code:</span> {order.postal_code}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={getImageUrl(item.image_url)}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <div className="text-sm sm:text-base font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{item.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">
                          KES {item.price?.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">
                          KES {(item.price * item.quantity)?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">KES {order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">KES {order.shipping_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">KES {order.tax?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total:</span>
                    <span>KES {order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 