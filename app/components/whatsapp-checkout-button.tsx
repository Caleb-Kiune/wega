"use client"

import { useState } from "react"
import { MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { openWhatsAppOrder, WhatsAppOrderData } from "@/lib/whatsapp-utils"
import { useToast } from "@/lib/hooks/use-toast"

interface WhatsAppCheckoutButtonProps {
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
  }
  cartItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  deliveryLocation?: string
  subtotal: number
  shipping: number
  total: number
  notes?: string
  disabled?: boolean
  className?: string
}

export default function WhatsAppCheckoutButton({
  customerInfo,
  cartItems,
  deliveryLocation,
  subtotal,
  shipping,
  total,
  notes,
  disabled = false,
  className = ""
}: WhatsAppCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleWhatsAppOrder = async () => {
    if (disabled || isProcessing) return

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof typeof customerInfo])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const orderData: WhatsAppOrderData = {
        customerInfo,
        cartItems,
        deliveryLocation,
        subtotal,
        shipping,
        total,
        notes
      }

      // Show success toast before opening WhatsApp
      toast({
        title: "Opening WhatsApp",
        description: "Your order details will be sent to our WhatsApp support team.",
      })

      // Small delay to show the toast
      setTimeout(() => {
        openWhatsAppOrder(orderData)
        setIsProcessing(false)
      }, 500)

    } catch (error) {
      console.error('Error opening WhatsApp order:', error)
      toast({
        title: "Error",
        description: "Failed to open WhatsApp. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handleWhatsAppOrder}
      disabled={disabled || isProcessing}
      className={`bg-[#25D366] hover:bg-[#128C7E] text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md min-h-[44px] text-base ${className}`}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      <span>
        {isProcessing ? "Opening WhatsApp..." : "Order via WhatsApp"}
      </span>
    </Button>
  )
}
