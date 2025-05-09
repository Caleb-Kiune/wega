"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew?: boolean
  isSale?: boolean
  category: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md product-card-hover">
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
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={toggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
