"use client"

import { useWishlist } from "@/lib/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useState } from "react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleQuantityChange = (productId: string, increment: boolean) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1
      const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1
      return {
        ...prev,
        [productId]: Math.max(1, newQuantity),
      }
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeFromWishlist(product.id)}
              >
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-primary font-semibold">
                KES {product.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(product.id, false)}
                  disabled={quantities[product.id] <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">
                  {quantities[product.id] || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(product.id, true)}
                >
                  +
                </Button>
              </div>
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: [product.image],
                  category: product.category,
                  brand: product.brand,
                  stock: 100, // Default value since we don't have stock info in wishlist
                  sku: "",
                  description: "",
                  features: [],
                  specifications: {},
                }}
                quantity={quantities[product.id] || 1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 