"use client"

import { useState, useEffect } from "react"
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Home, Eye, Share2, ChevronDown, ChevronUp, User, MapPin, Calendar, Phone, Mail, FileText, ShoppingBag, CreditCard, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { orderTrackingApi, Order } from "@/lib/order-tracking"
import { useToast } from "@/lib/hooks/use-toast"
import { getImageUrl } from '@/lib/products'
import { format, isValid, parseISO } from 'date-fns'
import OrderTimeline from '@/components/order-timeline'
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Safe formatting functions to prevent hydration mismatches
const formatCurrency = (amount: number) => {
  if (typeof window === 'undefined') {
    return `KES ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
  return `KES ${amount.toLocaleString()}`
}

const safeFormat = (dateString: string | null | undefined, fmt: string) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, fmt) : 'Invalid date'
}

export default function TrackOrderPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    items: false,
    details: false,
    timeline: false
  })

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodDisplay = (method?: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery'
      case 'mpesa': return 'M-Pesa'
      case 'card': return 'Credit Card'
      default: return method || 'Not specified'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
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

  const handleTrackOrder = async () => {
    if (!email.trim() || !orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and order number.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await orderTrackingApi.trackOrder({
        email: email.trim(),
        order_number: orderNumber.trim()
      })
      setOrder(response.order)
      setSearched(true)
      
      toast({
        title: "Order found",
        description: "Order details retrieved successfully.",
      })
    } catch (error) {
      console.error('Failed to track order:', error)
      setOrder(null)
      setSearched(true)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to track order.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Orders</h1>
              <p className="text-gray-600">Find and manage your orders easily</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
              Track Your Orders
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Find and manage your orders easily with detailed tracking information
            </p>
          </motion.div>

          {/* Tracking Form */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                  autoComplete="email"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <Label htmlFor="orderNumber" className="text-sm font-medium text-gray-700">
                  Order Number
                </Label>
                <Input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number"
                  className="mt-1"
                  autoComplete="off"
                  suppressHydrationWarning
                />
              </div>

              <Button
                onClick={handleTrackOrder}
                disabled={loading || !email.trim() || !orderNumber.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {searched && (
              <motion.div 
                className="bg-white rounded-xl shadow-lg border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {order ? "Order Found" : "Order Not Found"}
                  </h2>
                </div>

                {order ? (
                  <div className="p-6">
                    {/* Order Summary */}
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Placed on {safeFormat(order.created_at, 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          {order.payment_status && (
                            <Badge className={getPaymentStatusColor(order.payment_status)}>
                              <CreditCard className="w-3 h-3 mr-1" />
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Summary */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-slate-600">Total Amount</p>
                            <p className="text-2xl font-bold text-emerald-700">
                              KES {(order.total_amount || 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">{order.items?.length || 0} items</p>
                            <p className="text-sm text-slate-600">
                              Shipping: KES {(order.shipping_cost || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Collapsible Sections */}
                    <div className="space-y-4">
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
                                  order.items.map((item: any, index: number) => (
                                    <motion.div
                                      key={index}
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
                                          {item.product?.name || `Item ${index + 1}`}
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

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <Link href="/">
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Home className="w-4 h-4 mr-2" />
                          Continue Shopping
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={shareOrder}
                        className="w-full sm:w-auto"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Order
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
                    <p className="text-gray-600 mb-4">
                      No order found with the provided email and order number. Please check your details and try again.
                    </p>
                    <Button onClick={() => setSearched(false)} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 