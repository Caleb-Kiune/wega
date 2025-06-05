"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    await addToCart({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      quantity,
    })
  }

  return (
    <Button onClick={handleAddToCart} className={`bg-green-600 hover:bg-green-700 text-white ${className}`}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  )
}
