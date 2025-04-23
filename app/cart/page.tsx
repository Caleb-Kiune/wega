"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const [promoCode, setPromoCode] = useState("")

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCart(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
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

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

        {cartItems.length > 0 ? (
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
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Product */}
                        <div className="col-span-2 flex items-center">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${item.id}`}
                              className="font-medium text-gray-800 hover:text-green-600"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-gray-800">
                          <span className="md:hidden font-medium text-gray-500 mr-2">Price:</span>
                          KES {item.price.toLocaleString()}
                        </div>

                        {/* Quantity */}
                        <div>
                          <span className="md:hidden font-medium text-gray-500 mr-2">Quantity:</span>
                          <div className="flex items-center border rounded-md w-fit">
                            <button
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 border-x">{item.quantity || 1}</span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:text-gray-800"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
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
                              KES {(item.price * (item.quantity || 1)).toLocaleString()}
                            </span>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500"
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
                  onClick={() => {
                    clearCart()
                    toast({
                      title: "Cart cleared",
                      description: "All items have been removed from your cart.",
                    })
                  }}
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

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-800">
                        {shipping === 0 ? "Free" : `KES ${shipping.toLocaleString()}`}
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
