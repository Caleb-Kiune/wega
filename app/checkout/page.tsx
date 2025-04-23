"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { cartItems } = useCart()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. We'll process your order shortly.",
      })
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before proceeding to checkout.</p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/cart" className="text-green-600 hover:text-green-700 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" className="mt-1" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="county">County</Label>
                      <Select required>
                        <SelectTrigger id="county" className="mt-1">
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kisumu">Kisumu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                          <SelectItem value="eldoret">Eldoret</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" className="mt-1" required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Method</h2>

                  <RadioGroup defaultValue="standard">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div className="flex-1">
                          <Label htmlFor="standard" className="font-medium text-gray-800">
                            Standard Delivery
                          </Label>
                          <p className="text-sm text-gray-600">2-5 business days</p>
                          <p className="text-sm font-medium text-gray-800 mt-1">KES 350</p>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="express" id="express" />
                        <div className="flex-1">
                          <Label htmlFor="express" className="font-medium text-gray-800">
                            Express Delivery
                          </Label>
                          <p className="text-sm text-gray-600">1-2 business days</p>
                          <p className="text-sm font-medium text-gray-800 mt-1">KES 550</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Label htmlFor="mpesa" className="font-medium text-gray-800 mr-2">
                              M-Pesa
                            </Label>
                            <Image src="/placeholder.svg?height=30&width=50" alt="M-Pesa" width={50} height={30} />
                          </div>
                          <p className="text-sm text-gray-600">Pay via M-Pesa mobile money</p>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Label htmlFor="card" className="font-medium text-gray-800 mr-2">
                              Credit/Debit Card
                            </Label>
                            <div className="flex space-x-2">
                              <Image src="/placeholder.svg?height=30&width=50" alt="Visa" width={50} height={30} />
                              <Image
                                src="/placeholder.svg?height=30&width=50"
                                alt="Mastercard"
                                width={50}
                                height={30}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Pay with your credit or debit card</p>

                          {paymentMethod === "card" && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiry">Expiry Date</Label>
                                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input id="cvv" placeholder="123" className="mt-1" />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="nameOnCard">Name on Card</Label>
                                <Input id="nameOnCard" className="mt-1" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-800">KES {item.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

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

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea id="notes" placeholder="Special instructions for delivery" className="mt-1" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-green-600 mr-2" />
                      <span>Fast delivery across Kenya</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
