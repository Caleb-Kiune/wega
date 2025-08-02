"use client"

import { useState } from "react"
import { Search, Package, Clock, CheckCircle, XCircle, Truck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { orderTrackingApi, Order } from "@/lib/customer-auth"
import { useToast } from "@/lib/hooks/use-toast"
import { useCustomerAuth } from "@/lib/hooks/use-customer-auth"
import { getSessionId } from "@/lib/session"

export default function TrackOrderPage() {
  const { toast } = useToast()
  const { isAuthenticated, customer } = useCustomerAuth()
  const [trackingMethod, setTrackingMethod] = useState<'email' | 'guest'>('email')
  const [email, setEmail] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
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

  const handleTrackByEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await orderTrackingApi.getOrdersByEmail(email.trim())
      setOrders(response.orders)
      setSearched(true)
      
      if (response.orders.length === 0) {
        toast({
          title: "No orders found",
          description: "No orders found for this email address.",
        })
      } else {
        toast({
          title: "Orders found",
          description: `Found ${response.orders.length} order(s) for this email.`,
        })
      }
    } catch (error) {
      console.error('Failed to track orders:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to track orders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTrackByOrderNumber = async () => {
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
      setOrders([response.order])
      setSearched(true)
      
      toast({
        title: "Order found",
        description: "Order details retrieved successfully.",
      })
    } catch (error) {
      console.error('Failed to track order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to track order.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTrackGuestOrders = async () => {
    setLoading(true)
    try {
      const sessionId = getSessionId()
      const response = await orderTrackingApi.getGuestOrders(sessionId)
      setOrders(response.orders)
      setSearched(true)
      
      if (response.orders.length === 0) {
        toast({
          title: "No guest orders",
          description: "No orders found for your current session.",
        })
      } else {
        toast({
          title: "Guest orders found",
          description: `Found ${response.orders.length} order(s) from your session.`,
        })
      }
    } catch (error) {
      console.error('Failed to get guest orders:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get guest orders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (order: Order) => {
    try {
      await orderTrackingApi.reorder(order.id)
      toast({
        title: "Reorder created",
        description: "A new order has been created based on your previous order.",
      })
    } catch (error) {
      console.error('Failed to create reorder:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create reorder.",
        variant: "destructive",
      })
    }
  }

  const handleCancelOrder = async (order: Order) => {
    try {
      await orderTrackingApi.cancelOrder(order.id)
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      })
      // Refresh orders
      if (trackingMethod === 'email') {
        await handleTrackByEmail()
      } else {
        await handleTrackGuestOrders()
      }
    } catch (error) {
      console.error('Failed to cancel order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel order.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Orders</h1>
          <p className="text-gray-600">Find and manage your orders easily</p>
        </div>

        {/* Tracking Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              variant={trackingMethod === 'email' ? 'default' : 'outline'}
              onClick={() => setTrackingMethod('email')}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              Track by Email
            </Button>
            <Button
              variant={trackingMethod === 'guest' ? 'default' : 'outline'}
              onClick={() => setTrackingMethod('guest')}
              className="flex-1"
            >
              <Package className="h-4 w-4 mr-2" />
              Guest Orders
            </Button>
          </div>

          {trackingMethod === 'email' && (
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
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleTrackByEmail}
                  disabled={loading || !email.trim()}
                  className="w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Find All Orders"}
                </Button>

                <div className="space-y-2">
                  <Input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Order number (optional)"
                    className="w-full"
                  />
                  <Button
                    onClick={handleTrackByOrderNumber}
                    disabled={loading || !email.trim() || !orderNumber.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Searching..." : "Track Specific Order"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {trackingMethod === 'guest' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Find orders from your current browsing session
              </p>
              <Button
                onClick={handleTrackGuestOrders}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Find Guest Orders"}
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {orders.length > 0 ? `Found ${orders.length} Order(s)` : "No Orders Found"}
              </h2>
            </div>

            {orders.length > 0 && (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Customer:</span>
                            <p>{order.first_name} {order.last_name}</p>
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>
                            <p>{order.email}</p>
                          </div>
                          <div>
                            <span className="font-medium">Total:</span>
                            <p>KES {order.total_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <p>{new Date(order.created_at || '').toLocaleDateString()}</p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.product?.name || `Item ${index + 1}`}</span>
                                  <span>Qty: {item.quantity} × KES {item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:flex-shrink-0">
                        {order.status.toLowerCase() === 'pending' && (
                          <Button
                            onClick={() => handleCancelOrder(order)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel Order
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleReorder(order)}
                          variant="outline"
                          size="sm"
                        >
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orders.length === 0 && (
              <div className="p-6 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-4">
                  {trackingMethod === 'email' 
                    ? "No orders found for this email address. Please check your email or try a different email."
                    : "No guest orders found for your current session."
                  }
                </p>
                <Button onClick={() => setSearched(false)} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Customer Account Benefits */}
        {!isAuthenticated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Create an Account for Better Order Management
                </h3>
                <p className="text-green-700 mb-4">
                  Sign up for a free account to easily track all your orders, save your information, 
                  and get faster checkout on future purchases.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Create Account
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 