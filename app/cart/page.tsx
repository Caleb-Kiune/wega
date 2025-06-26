"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/lib/hooks/use-toast"
import { deliveryLocationsApi, DeliveryLocation } from "@/app/lib/api/cart"
import { useCart } from "@/lib/hooks/use-cart"

export default function CartPage() {
  const { toast } = useToast()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [locations, setLocations] = useState<DeliveryLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [promoCode, setPromoCode] = useState("")
  const [loading, setLoading] = useState(true)

  // Load selected location from localStorage on mount
  useEffect(() => {
    // Clear any existing location from localStorage
    localStorage.removeItem('selectedDeliveryLocation')
    setSelectedLocation("")
  }, [])

  // Save selected location to localStorage when it changes
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    if (value) {
      localStorage.setItem('selectedDeliveryLocation', value)
    } else {
      localStorage.removeItem('selectedDeliveryLocation')
    }
  }

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const locationsData = await deliveryLocationsApi.getAll()
        setLocations(locationsData)
      } catch (error) {
        console.error('Error fetching locations:', error)
        toast({
          title: "Error",
          description: "Failed to load delivery locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [toast])

  // Calculate totals
  const subtotal = cart?.items?.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0) || 0
  const location = locations.find(loc => loc.slug === selectedLocation)
  const shipping = selectedLocation ? (location?.shippingPrice || 0) : 0
  const total = subtotal + shipping

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: number, productName: string) => {
    await removeFromCart(itemId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    })
  }

  const handleClearCart = async () => {
    await clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code.",
        variant: "destructive",
      })
      return
    }

    // Simulate promo code validation
    toast({
      title: "Invalid code",
      description: "The promo code you entered is invalid or has expired.",
      variant: "destructive",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const hasItems = cart?.items && cart.items.length > 0

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 mb-4">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                  </div>

                  <div className="divide-y">
                    {cart?.items.map((item) => (
                      <div key={item.id} className="py-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-2 flex items-center">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-medium text-gray-800 hover:text-green-600"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-gray-800">
                          <span className="md:hidden font-medium text-gray-500 mr-2">Price:</span>
                          KES {item.product.price.toLocaleString()}
                        </div>

                        {/* Quantity */}
                        <div>
                          <span className="md:hidden font-medium text-gray-500 mr-2">Quantity:</span>
                          <div className="flex items-center border rounded-md w-fit">
                            <button
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 border-x">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="md:hidden font-medium text-gray-500 mr-2">Total:</span>
                            <span className="font-medium text-gray-800">
                              KES {(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  {/* Location Selector */}
                  <div className="mb-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location
                    </label>
                    <Select value={selectedLocation} onValueChange={handleLocationChange}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select your delivery location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.slug}>
                            {location.name} - KES {location.shippingPrice.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-800">
                        KES {shipping.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-medium text-gray-800">Total</span>
                      <span className="font-bold text-xl text-gray-800">KES {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={handleApplyPromoCode}>
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    asChild
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Payment Methods */}
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-2">We Accept</p>
                    <div className="flex space-x-3">
                      <div className="bg-gray-100 p-1 rounded">
                        <Image src="/placeholder.svg?height=30&width=50" alt="M-Pesa" width={50} height={30} />
                      </div>
                      <div className="bg-gray-100 p-1 rounded">
                        <Image src="/placeholder.svg?height=30&width=50" alt="Visa" width={50} height={30} />
                      </div>
                      <div className="bg-gray-100 p-1 rounded">
                        <Image src="/placeholder.svg?height=30&width=50" alt="Mastercard" width={50} height={30} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
