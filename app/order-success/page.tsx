"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  ArrowRight, 
  Package, 
  Truck, 
  CreditCard, 
  Home, 
  ShoppingBag, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Eye, 
  RefreshCw,
  Sparkles,
  Star,
  Shield,
  Clock,
  Gift,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ordersApi, Order } from "@/lib/orders"
import { getImageUrl } from '@/lib/products'
import { format, isValid, parseISO } from 'date-fns'
import OrderTimeline from '@/components/order-timeline'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    items: false,
    details: false,
    timeline: false
  })

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (orderId) {
      fetchOrder(parseInt(orderId))
    } else {
      setLoading(false)
      setError("No order ID provided")
    }
  }, [orderId])

  // Hide confetti after 3 seconds
  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [order])

  const fetchOrder = async (orderId: number) => {
    try {
      setLoading(true)
      const response = await ordersApi.getById(orderId)
      setOrder(response)
      setError(null)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const refreshOrder = async () => {
    if (!order) return
    setIsRefreshing(true)
    await fetchOrder(order.id)
    setIsRefreshing(false)
  }

  const getPaymentMethodDisplay = (method?: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery'
      case 'mpesa': return 'M-Pesa'
      case 'card': return 'Credit Card'
      default: return method || 'Not specified'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'cancelled':
        return <div className="w-3 h-3 bg-red-400 rounded-full" />
      default:
        return <Package className="h-4 w-4 text-slate-500" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const safeFormat = (dateString: string | null | undefined, fmt: string) => {
    if (!dateString) return 'Unknown date'
    const date = parseISO(dateString)
    return isValid(date) ? format(date, fmt) : 'Invalid date'
  }

  const shareOrder = async () => {
    if (navigator.share && order) {
      try {
        await navigator.share({
          title: `Order #${order.order_number}`,
          text: `Check out my order from WEGA Kitchenware!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-200 animate-pulse"></div>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading your order details...</h2>
              <p className="text-slate-600">Please wait while we fetch your order information</p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Order Not Found</h1>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">{error || "Unable to load order details"}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/track-order">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3">
                      <Package className="w-5 h-5 mr-2" />
                      Track Another Order
                    </Button>
                  </Link>
            <Link href="/">
                    <Button variant="outline" className="px-6 py-3 border-slate-300 hover:bg-slate-50">
                      <Home className="w-5 h-5 mr-2" />
                      Continue Shopping
                    </Button>
            </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-emerald-400"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: -20,
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  ease: "linear",
                  delay: Math.random() * 0.5
                }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Compact Success Header */}
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
                  <CheckCircle className="w-10 h-10 text-white" />
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
              Order Placed Successfully!
            </motion.h1>
            <motion.p 
              className="text-slate-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Thank you for your order. We'll process it right away and keep you updated.
            </motion.p>
          </motion.div>

          {/* Compact Order Summary */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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

          {/* Collapsible Sections */}
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
                    <OrderTimeline order={order} />
                  </CardContent>
                </CollapsibleContent>
        </Card>
            </Collapsible>
          </div>


        </div>
      </div>
    </div>
  )
} 