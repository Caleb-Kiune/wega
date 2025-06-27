"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppOrderButtonProps {
  product: {
    name: string
    price: number
  }
  quantity?: number
  className?: string
}

export default function WhatsAppOrderButton({ product, quantity = 1, className }: WhatsAppOrderButtonProps) {
  const phoneNumber = "254769899432" // The phone number with country code
  const message = `Hello, I would like to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: KES ${product.price.toLocaleString()}\n\nTotal: KES ${(product.price * quantity).toLocaleString()}`

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      <span>Order via WhatsApp</span>
    </Button>
  )
} 