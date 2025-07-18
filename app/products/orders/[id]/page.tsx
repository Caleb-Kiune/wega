"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, CreditCard, User, MapPin, Calendar, Phone, Mail, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"
import { format, isValid, parseISO } from 'date-fns'
import { getImageUrl } from '@/lib/products'

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    image_url: string
    price: number
  }
}

interface Order {
  id: number
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
  total_amount: number
  shipping_cost: number
  status: string
  payment_status: string
  payment_method?: string
  notes: string | null
  created_at: string
  items: OrderItem[]
}

// Utility functions for order status
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
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

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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

// Safe date formatting helper
const safeFormat = (dateString: string | null | undefined, fmt: string) => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
  if (!isValid(date)) return 'N/A';
  return format(date, fmt);
};

export default function OrderDetailsPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log('Fetching order from:', `${API_BASE_URL}/orders/${id}`)
        const response = await fetch(`${API_BASE_URL}/orders/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        console.log('Order data received:', data)
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Order Not Found</h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-lg">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Order Header Card */}
        <Card className="border-slate-200 bg-white/90 shadow-lg mb-8">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
              <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Order #{order.order_number}
                </h1>
                  <p className="text-slate-600 text-base lg:text-lg mt-1">
                    Placed on {safeFormat(order.created_at, 'MMMM d, yyyy \'at\' h:mm a')}
                </p>
                </div>
              </div>
              
              {/* Status Badges */}
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
                  <CreditCard className="h-5 w-5 text-slate-500" />
                  <Badge className={`${getPaymentStatusColor(order.payment_status)} border font-medium px-3 py-1`}>
                    {order.payment_status
                      ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
                      : "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Order Information Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Order Items */}
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
          </div>
              <div>
                    <CardTitle className="text-xl">Order Items</CardTitle>
                    <p className="text-slate-600 text-sm">{order.items?.length || 0} items in this order</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
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
                          {item.product?.name || 'Unknown Product'}
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
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No items found for this order.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Order Summary</CardTitle>
                    <p className="text-slate-600 text-sm">Payment and shipping details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      KES {((order.total_amount || 0) - (order.shipping_cost || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold text-slate-900">
                      KES {(order.shipping_cost || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      KES {(order.total_amount || 0).toLocaleString()}
                    </span>
              </div>
                </div>
              </CardContent>
            </Card>
            </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            {/* Customer Information */}
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Customer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{order.first_name} {order.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{order.email}</span>
              </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{order.phone}</span>
            </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                              </div>
                  <CardTitle className="text-lg">Shipping</CardTitle>
                                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Address</p>
                  <p className="text-sm text-slate-600">{order.address}</p>
                              </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">City</span>
                    <p className="text-slate-900 font-medium">{order.city}</p>
                            </div>
                  <div>
                    <span className="text-slate-500">State</span>
                    <p className="text-slate-900 font-medium">{order.state}</p>
              </div>
            </div>
                {order.postal_code && order.postal_code !== 'N/A' && (
                <div>
                    <span className="text-slate-500 text-sm">Postal Code</span>
                    <p className="text-slate-900 font-medium text-sm">{order.postal_code}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-slate-500 text-sm">Method</span>
                  <p className="text-slate-900 font-medium">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' :
                     order.payment_method === 'mpesa' ? 'M-Pesa' :
                     order.payment_method === 'card' ? 'Credit Card' :
                     order.payment_method || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-sm">Status</span>
                  <p className="text-slate-900 font-medium">
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </p>
                </div>
                {order.notes && (
                  <div>
                    <span className="text-slate-500 text-sm">Notes</span>
                    <p className="text-slate-900 text-sm">{order.notes}</p>
              </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 