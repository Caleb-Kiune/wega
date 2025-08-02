"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, ShieldCheck, Copy, Check, AlertCircle, Lock, CreditCard, Eye, EyeOff, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/lib/hooks/use-toast"
import { useDeliveryLocations } from "@/lib/hooks/use-delivery-locations"
import { ordersApi, CreateOrderRequest } from "@/lib/orders"
import { getSessionId } from "@/lib/session"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const items = cart?.items || []
  const { toast } = useToast()
  const router = useRouter()
  const { deliveryLocations, loading: locationsLoading } = useDeliveryLocations()
  
  // Add debugging
  console.log('Checkout page - Cart items:', items)
  console.log('Checkout page - Items length:', items?.length)
  
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  })
  const [showCvv, setShowCvv] = useState(false)
  const [cardType, setCardType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Load selected location from localStorage on mount
  useEffect(() => {
    const savedLocationSlug = localStorage.getItem('selectedDeliveryLocation')
    if (savedLocationSlug) {
      setSelectedLocation(savedLocationSlug)
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
  const subtotal = items?.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0) || 0
  
  // Get shipping cost based on selected location
  const selectedDeliveryLocation = deliveryLocations.find(location => location.slug === selectedLocation)
  const shipping = selectedLocation && selectedLocation !== "none" && selectedDeliveryLocation ? selectedDeliveryLocation.shippingPrice : 0
  const total = subtotal + shipping

  console.log('Checkout page - Subtotal:', subtotal)
  console.log('Checkout page - Shipping:', shipping)
  console.log('Checkout page - Total:', total)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    })
    setTimeout(() => setCopiedField(null), 2000)
  }

  const validatePhoneNumber = (phone: string) => {
    // Kenyan phone number format: 07XXXXXXXX or 254XXXXXXXXX
    const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3]))[0-9]{6})$/
    return phoneRegex.test(phone)
  }

  const validateCardNumber = (number: string) => {
    // Remove spaces and dashes
    const cleanNumber = number.replace(/[\s-]/g, "")
    // Basic validation for card number length and format
    return /^[0-9]{13,19}$/.test(cleanNumber)
  }

  const validateExpiry = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
    const [month, year] = expiry.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    const expMonth = parseInt(month)
    const expYear = parseInt(year)
    
    if (expMonth < 1 || expMonth > 12) return false
    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false
    return true
  }

  const validateCvv = (cvv: string) => {
    return /^[0-9]{3,4}$/.test(cvv)
  }

  const formatCardNumber = (number: string) => {
    const cleanNumber = number.replace(/[\s-]/g, "")
    const groups = cleanNumber.match(/.{1,4}/g) || []
    return groups.join(" ")
  }

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/[\s-]/g, "")
    if (/^4/.test(cleanNumber)) return "visa"
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
    if (/^3[47]/.test(cleanNumber)) return "amex"
    return null
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9\s-]/g, "")
    const formatted = formatCardNumber(value)
    setCardDetails(prev => ({ ...prev, number: formatted }))
    setCardType(detectCardType(value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setCardDetails(prev => ({ ...prev, expiry: value }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // Enhanced validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'county']
    const missingFields = requiredFields.filter(field => !formData.get(field) || (formData.get(field) as string).trim() === '')
    
    if (missingFields.length > 0) {
      const fieldNames = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        address: 'Address',
        county: 'County'
      }
      
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.map(field => fieldNames[field as keyof typeof fieldNames]).join(', ')}`,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate email format
    const email = formData.get('email') as string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate phone number
    const phone = formData.get('phone') as string
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (at least 10 digits)",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate payment method selection
    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Get session ID for cart
      const sessionId = getSessionId()
      console.log('Using session ID:', sessionId)

      // Get delivery location ID from the selected location
      const selectedDeliveryLocation = deliveryLocations.find(location => location.slug === selectedLocation)
      const deliveryLocationId = selectedLocation && selectedLocation !== "none" && selectedDeliveryLocation ? selectedDeliveryLocation.id : null

      // Validate cart items
      const validCartItems = items.filter(item => item.product?.id && item.quantity > 0)
      if (validCartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty or contains invalid items. Please refresh the page and try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const orderData: CreateOrderRequest = {
        session_id: sessionId,
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('county') as string, // Use county as city since city field is removed
        state: formData.get('county') as string,
        postal_code: "N/A", // Default value since postal code field is removed from UI
        delivery_location_id: deliveryLocationId,
        payment_method: paymentMethod,
        notes: formData.get('notes') as string || undefined,
        cart_items: validCartItems.map(item => ({
          product_id: item.product!.id,
          quantity: item.quantity,
          price: item.product!.price || 0
        }))
      }

      console.log('Submitting order to backend:', orderData)

      // Submit order to backend
      const order = await ordersApi.create(orderData)
      
      console.log('Order created successfully:', order)

      toast({
        title: "Order Submitted!",
        description: `Order #${order.order_number} has been submitted successfully. We'll contact you shortly.`,
      })

      // Set redirecting state to prevent showing empty cart message
      setIsRedirecting(true)
      
      // Clear cart after successful order
      clearCart()
      
      // Small delay to ensure smooth transition
      setTimeout(() => {
        router.push(`/order-success?orderId=${order.id}`)
      }, 100)
      
      // Fallback redirect after 2 seconds in case the first one fails
      setTimeout(() => {
        if (isRedirecting) {
          window.location.href = `/order-success?orderId=${order.id}`
        }
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting order:', error)
      
      // Reset redirecting state since there was an error
      setIsRedirecting(false)
      
      let errorMessage = 'Failed to submit order'
      
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('Missing required fields')) {
          errorMessage = 'Please fill in all required fields'
        } else if (error.message.includes('Invalid email format')) {
          errorMessage = 'Please enter a valid email address'
        } else if (error.message.includes('Phone number must be at least 10 digits')) {
          errorMessage = 'Please enter a valid phone number (at least 10 digits)'
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again in a few moments.'
        } else if (error.message.includes('Product not found')) {
          errorMessage = 'Some items in your cart are no longer available. Please refresh and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Order Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if ((!items || items.length === 0) && !isRedirecting) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before proceeding to checkout.</p>
            <Link href="/products">
              <Button className="bg-green-700 hover:bg-green-800 text-white">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state during redirect
  if (isRedirecting) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Your Order</h2>
            <p className="text-gray-600">Please wait while we redirect you to your order confirmation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 sm:mb-8">
          <Link href="/cart" className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Checkout</h1>

        <form onSubmit={handleSubmitOrder} suppressHydrationWarning>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 sm:mb-6">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" className="mt-1 min-h-[44px] text-base" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" className="mt-1 min-h-[44px] text-base" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" className="mt-1 min-h-[44px] text-base" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" className="mt-1 min-h-[44px] text-base" required />
                    </div>
                    <div>
                      <Label htmlFor="county">County</Label>
                      <Select name="county" required>
                        <SelectTrigger id="county" className="mt-1 min-h-[44px] text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                      <Label htmlFor="deliveryLocation">Delivery Location</Label>
                      <Select value={selectedLocation} onValueChange={handleLocationChange}>
                        <SelectTrigger id="deliveryLocation" className="mt-1 min-h-[44px] text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" disabled={locationsLoading}>
                          <SelectValue placeholder={locationsLoading ? "Loading locations..." : "Select location"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-gray-500">
                            <div className="flex items-center gap-2">
                              <span>Pickup at store</span>
                              <span className="text-xs text-gray-400">(Self pickup or other arrangements)</span>
                            </div>
                          </SelectItem>
                          {deliveryLocations.map((location) => (
                            <SelectItem key={location.id} value={location.slug}>
                              {location.name} - KES {location.shippingPrice.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" className="mt-1 min-h-[44px] text-base" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea id="notes" name="notes" placeholder="Special instructions for delivery" className="mt-1 min-h-[44px] text-base" />
                    </div>
                  </div>
                </div>
              </div>



              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Payment Method</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Label htmlFor="cod" className="font-medium text-gray-800 mr-2 text-sm sm:text-base">
                              Cash on Delivery
                            </Label>
                            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                              <span className="text-green-600 text-xs font-bold">K</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Pay with cash when your order is delivered</p>

                          {paymentMethod === "cod" && (
                            <div className="mt-4 space-y-4">
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="font-medium text-gray-800 mb-2">Payment Amount:</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">KES {total.toLocaleString()}</p>
                              </div>

                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
                                <p className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>You'll pay the full amount of KES {total.toLocaleString()} in cash when your order is delivered. Please have the exact amount ready.</span>
                                </p>
                              </div>

                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
                                <p className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span>Cash on delivery is available for orders within Kenya. Delivery fees may apply.</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Label htmlFor="mpesa" className="font-medium text-gray-800 mr-2 text-sm sm:text-base">
                              M-Pesa
                            </Label>
                            <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={50} height={30} className="h-6 w-auto" />
                          </div>
                          <p className="text-sm text-gray-600">Pay via M-Pesa mobile money</p>
                          {paymentMethod === "mpesa" && (
                            <div className="mt-4 space-y-4 text-sm">
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="font-medium text-gray-800 mb-2">Payment Amount:</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">KES {total.toLocaleString()}</p>
                              </div>

                              <div>
                                <p className="font-medium text-gray-800 mb-2">M-Pesa Payment Details:</p>
                                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p><span className="font-medium">Paybill Number:</span> 400200</p>
                                    <button
                                      onClick={() => copyToClipboard("400200", "Paybill")}
                                      className="text-green-600 hover:text-green-700 min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
                                    >
                                      {copiedField === "Paybill" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p><span className="font-medium">Account Number:</span> 40069258</p>
                                    <button
                                      onClick={() => copyToClipboard("40069258", "Account")}
                                      className="text-green-600 hover:text-green-700 min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
                                    >
                                      {copiedField === "Account" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="font-medium text-gray-800">Payment Instructions:</p>
                                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                                  <li>Go to your M-Pesa menu</li>
                                  <li>Select "Pay Bill"</li>
                                  <li>Enter Business Number: 400200</li>
                                  <li>Enter Account Number: 40069258</li>
                                  <li>Enter Amount: KES {total.toLocaleString()}</li>
                                  <li>Enter your M-Pesa PIN</li>
                                  <li>Confirm payment</li>
                                </ol>
                              </div>

                              <div className="mt-4">
                                <Label htmlFor="mpesaPhone" className="font-medium text-gray-800">Your M-Pesa Phone Number</Label>
                                <div className="mt-1">
                                  <Input
                                    id="mpesaPhone"
                                    type="tel"
                                    placeholder="e.g., 07XXXXXXXX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`min-h-[44px] text-base ${phoneNumber && !validatePhoneNumber(phoneNumber) ? "border-red-500" : ""}`}
                                  />
                                  {phoneNumber && !validatePhoneNumber(phoneNumber) && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      Please enter a valid Kenyan phone number
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
                                <p className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Please keep your M-Pesa confirmation message as proof of payment. We'll process your order once payment is confirmed.</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 flex items-start space-x-3">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Label htmlFor="card" className="font-medium text-gray-800 mr-2 text-sm sm:text-base">
                              Credit/Debit Card
                            </Label>
                            <div className="flex space-x-2">
                              <Image src="/images/visa-logo.png" alt="Visa" width={50} height={30} className="h-6 w-auto" />
                              <Image
                                src="/images/mastercard-logo.png"
                                alt="Mastercard"
                                width={50}
                                height={30}
                                className="h-6 w-auto"
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Pay with your credit or debit card</p>

                          {paymentMethod === "card" && (
                            <div className="mt-4 space-y-4">
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="font-medium text-gray-800 mb-2">Payment Amount:</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">KES {total.toLocaleString()}</p>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="cardNumber" className="flex items-center gap-2">
                                    <span>Card Number</span>
                                    {cardType && (
                                      <Image
                                        src={`/card-logos/${cardType}.svg`}
                                        alt={cardType}
                                        width={40}
                                        height={25}
                                        className="h-6 w-auto"
                                      />
                                    )}
                                  </Label>
                                  <div className="relative mt-1">
                                    <Input
                                      id="cardNumber"
                                      placeholder="1234 5678 9012 3456"
                                      value={cardDetails.number}
                                      onChange={handleCardNumberChange}
                                      maxLength={19}
                                      className={`min-h-[44px] text-base ${cardDetails.number && !validateCardNumber(cardDetails.number) ? "border-red-500" : ""}`}
                                    />
                                    {cardDetails.number && !validateCardNumber(cardDetails.number) && (
                                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Please enter a valid card number
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                      id="expiry"
                                      placeholder="MM/YY"
                                      value={cardDetails.expiry}
                                      onChange={handleExpiryChange}
                                      maxLength={5}
                                      className={`min-h-[44px] text-base ${cardDetails.expiry && !validateExpiry(cardDetails.expiry) ? "border-red-500" : ""}`}
                                    />
                                    {cardDetails.expiry && !validateExpiry(cardDetails.expiry) && (
                                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Invalid expiry date
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv" className="flex items-center gap-2">
                                      <span>CVV</span>
                                      <button
                                        type="button"
                                        onClick={() => setShowCvv(!showCvv)}
                                        className="text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
                                      >
                                        {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </button>
                                    </Label>
                                    <Input
                                      id="cvv"
                                      type={showCvv ? "text" : "password"}
                                      placeholder="123"
                                      value={cardDetails.cvv}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, "")
                                        setCardDetails(prev => ({ ...prev, cvv: value }))
                                      }}
                                      maxLength={4}
                                      className={`min-h-[44px] text-base ${cardDetails.cvv && !validateCvv(cardDetails.cvv) ? "border-red-500" : ""}`}
                                    />
                                    {cardDetails.cvv && !validateCvv(cardDetails.cvv) && (
                                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Invalid CVV
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="nameOnCard">Name on Card</Label>
                                  <Input
                                    id="nameOnCard"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 min-h-[44px] text-base"
                                    placeholder="As shown on card"
                                  />
                                </div>
                              </div>

                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
                                <p className="flex items-start gap-2">
                                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Your payment information is encrypted and secure. We never store your full card details.</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <span>Secure payment powered by Stripe</span>
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
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-4 sm:mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden mr-3 sm:mr-4">
                          <Image src={item.product?.image || "/placeholder.svg"} alt={item.product?.name || "Product"} fill className="object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-800">KES {(item.product?.price || 0) * item.quantity}</div>
                      </div>
                    ))}
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
                        ) : selectedLocation === "none" ? (
                          <span className="text-gray-400">Pickup at store</span>
                        ) : selectedLocation ? (
                          `KES ${shipping.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">Select location</span>
                        )}
                      </span>
                    </div>
                    {selectedLocation && selectedLocation !== "none" && (
                      <div className="text-sm text-gray-600">
                        Delivery to: {selectedLocation}
                      </div>
                    )}
                    {selectedLocation === "none" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Pickup at store selected</p>
                            <p>We'll contact you after placing your order to arrange pickup details.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="border-t pt-3 sm:pt-4 flex justify-between">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">Total</span>
                      <span className="font-bold text-lg sm:text-xl text-gray-800">KES {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-3">
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
