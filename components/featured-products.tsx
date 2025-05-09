"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import WhatsAppOrderButton from "@/components/whatsapp-order-button"

// Mock featured products data
const products = [
  {
    id: 1,
    name: "Premium Non-Stick Frying Pan",
    price: 2499,
    image: "/images/kitchenware1.jpeg",
    isNew: true,
    isSale: false,
    category: "Cookware",
  },
  {
    id: 2,
    name: "Stainless Steel Cooking Pot Set",
    price: 5999,
    originalPrice: 7499,
    image: "/images/appliances1.jpeg",
    isNew: false,
    isSale: true,
    category: "Cookware",
  },
  {
    id: 3,
    name: "Electric Coffee Maker",
    price: 3499,
    image: "/images/appliances2.jpeg",
    isNew: false,
    isSale: false,
    category: "Appliances",
  },
  {
    id: 4,
    name: "Kitchen Utensil Set",
    price: 1899,
    originalPrice: 2499,
    image: "/images/tableware1.jpeg",
    isNew: true,
    isSale: true,
    category: "Utensils",
  },
]

export default function FeaturedProducts() {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg overflow-hidden shadow-md product-card-hover"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-64 w-full">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
            </Link>

            {/* Product badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-green-600">New</Badge>}
              {product.isSale && <Badge className="bg-orange-500">Sale</Badge>}
            </div>

            {/* Quick actions overlay (visible on hover) */}
            {hoveredProduct === product.id && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => {
                      toast({
                        title: "Added to wishlist",
                        description: `${product.name} has been added to your wishlist.`,
                      })
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">{product.category}</div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex items-center mb-3">
              <span className="text-xl font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  KES {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <div className="space-y-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
              <WhatsAppOrderButton product={product} className="w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
