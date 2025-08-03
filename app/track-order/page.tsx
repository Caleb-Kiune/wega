"use client"

import { useState, useEffect } from "react"
import { Search, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { orderTrackingApi, Order } from "@/lib/order-tracking"
import { useToast } from "@/lib/hooks/use-toast"

// Safe formatting functions to prevent hydration mismatches
const formatCurrency = (amount: number) => {
  if (typeof window === 'undefined') {
    return `KES ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
  return `KES ${amount.toLocaleString()}`
}

const formatDate = (dateString: string) => {
  if (typeof window === 'undefined') {
    return new Date(dateString).toISOString().split('T')[0]
  }
  return new Date(dateString).toLocaleDateString()
}

export default function TrackOrderPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

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
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto max-w-4xl px-4">
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
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Orders</h1>
          <p className="text-gray-600">Find and manage your orders easily</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Track Order"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {order ? "Order Found" : "Order Not Found"}
              </h2>
            </div>

            {order ? (
              <div className="p-6">
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
                        <p>{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{formatDate(order.created_at || '')}</p>
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
                </div>
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
          </div>
        )}
      </div>
    </div>
  )
} 