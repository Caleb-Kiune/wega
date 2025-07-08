"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/lib/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useDeliveryLocations } from "@/lib/hooks/use-delivery-locations"

export default function CartPage() {
  const { toast } = useToast()
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const { deliveryLocations, loading: locationsLoading } = useDeliveryLocations()
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [promoCode, setPromoCode] = useState("")

  // Load selected location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedDeliveryLocation')
    if (savedLocation) {
      setSelectedLocation(savedLocation)
    }
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

  // Calculate totals
  const subtotal = items?.reduce((total, item) => 
    total + (item.price * item.quantity), 0) || 0
  
  // Get shipping cost based on selected location
  const selectedDeliveryLocation = deliveryLocations.find(location => location.slug === selectedLocation)
  const shipping = selectedDeliveryLocation ? selectedDeliveryLocation.shippingPrice : 0
  const total = subtotal + shipping

  // Debug logging
  useEffect(() => {
    console.log('Cart Debug:', {
      selectedLocation,
      selectedDeliveryLocation,
      shipping,
      subtotal,
      total,
      deliveryLocations: deliveryLocations.length
    })
  }, [selectedLocation, selectedDeliveryLocation, shipping, subtotal, total, deliveryLocations])

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: number, productName: string) => {
    removeFromCart(itemId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
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

  const hasItems = items && items.length > 0

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Your Shopping Cart</h1>

        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 mb-4">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                  </div>

                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="py-4 sm:py-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-2 flex items-center">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden mr-3 sm:mr-4">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.id}`}
                              className="font-medium text-gray-800 hover:text-green-600 text-sm sm:text-base block"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-gray-800 text-sm sm:text-base">
                          <span className="md:hidden font-medium text-gray-500 mr-2">Price:</span>
                          KES {item.price.toLocaleString()}
                        </div>

                        {/* Quantity */}
                        <div>
                          <span className="md:hidden font-medium text-gray-500 mr-2">Quantity:</span>
                          <div className="flex items-center border rounded-md w-fit">
                            <button
                              className="px-3 py-2 text-gray-600 hover:text-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 border-x min-h-[44px] flex items-center justify-center">{item.quantity}</span>
                            <button
                              className="px-3 py-2 text-gray-600 hover:text-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                            <span className="font-medium text-gray-800 text-sm sm:text-base">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
                            onClick={() => handleRemoveItem(item.id, item.name)}
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
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto min-h-[44px] text-base">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto min-h-[44px] text-base"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-8">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Order Summary</h2>

                  {/* Delivery Location */}
                  <div className="mb-4 sm:mb-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location
                    </label>
                    <Select value={selectedLocation} onValueChange={handleLocationChange}>
                      <SelectTrigger className="min-h-[44px] text-base" disabled={locationsLoading}>
                        <SelectValue placeholder={locationsLoading ? "Loading locations..." : "Select location"} />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryLocations.map((location) => (
                          <SelectItem key={location.id} value={location.slug}>
                            {location.name} - KES {location.shippingPrice.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                      <span className="font-medium text-gray-800 text-sm sm:text-base">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
                      <span className="font-medium text-gray-800 text-sm sm:text-base">
                        {locationsLoading ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : selectedLocation ? (
                          `KES ${shipping.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">Select location</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3 sm:pt-4 flex justify-between">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">Total</span>
                      <span className="font-bold text-lg sm:text-xl text-gray-800">
                        {selectedLocation ? (
                          `KES ${total.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">Select location</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-4 sm:mb-6">
                    <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="min-h-[44px] text-base"
                      />
                      <Button variant="outline" onClick={handleApplyPromoCode} className="min-h-[44px] text-base">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 min-h-[44px] text-base"
                    asChild
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Payment Methods */}
                  <div className="mt-4 sm:mt-6">
                    <p className="text-sm text-gray-500 mb-2">We Accept</p>
                    <div className="flex space-x-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Image 
                          src="/images/mpesa-logo.png" 
                          alt="M-Pesa" 
                          width={40} 
                          height={25} 
                          className="h-6 w-auto"
                        />
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Image 
                          src="/images/visa-logo.png" 
                          alt="Visa" 
                          width={40} 
                          height={25} 
                          className="h-6 w-auto"
                        />
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Image 
                          src="/images/mastercard-logo.png" 
                          alt="Mastercard" 
                          width={40} 
                          height={25} 
                          className="h-6 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-base">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
