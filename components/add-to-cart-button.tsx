"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"

interface AddToCartButtonProps {
  product: {
    id: string | number
    name: string
    price: number
    image?: string
  }
  quantity?: number
  className?: string
}

export default function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: Number(product.id),
      quantity,
      image: product.image || "/placeholder.svg?height=400&width=400",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className={`bg-green-600 hover:bg-green-700 text-white ${className}`}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  )
}
