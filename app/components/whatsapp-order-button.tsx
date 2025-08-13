"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WHATSAPP_CONFIG, generateWhatsAppUrl } from "@/lib/whatsapp-config"

interface WhatsAppOrderButtonProps {
  product: {
    name: string
    price: number
  }
  quantity?: number
  className?: string
}

export default function WhatsAppOrderButton({ product, quantity = 1, className }: WhatsAppOrderButtonProps) {
  const message = `Hello, I would like to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: KES ${product.price.toLocaleString()}\n\nTotal: KES ${(product.price * quantity).toLocaleString()}`

  const handleWhatsAppClick = () => {
    const whatsappUrl = generateWhatsAppUrl(message)
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