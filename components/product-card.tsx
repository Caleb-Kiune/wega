"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Product } from "../app/lib/api/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.image_url || "/placeholder.svg",
      quantity: 1
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(String(product.id))
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.image_url || "/placeholder.svg",
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 product-card-hover group flex flex-col h-full">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-64 w-full">
            <Image 
              src={product.images?.[0]?.image_url || "/placeholder.svg"} 
              alt={product.name} 
              fill 
              className="object-cover" 
            />
          </div>
        </Link>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.is_featured && <Badge className="bg-purple-600">Featured</Badge>}
          {product.is_new && <Badge className="bg-green-600">New</Badge>}
          {product.is_sale && <Badge className="bg-orange-500">Sale</Badge>}
        </div>

        {/* Quick actions overlay (visible on hover) */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-gray-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-gray-100"
              onClick={toggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white hover:bg-gray-100" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-0.5">{product.category}</div>
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center mb-2">
          <span className="text-xl font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              KES {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Only visible on hover */}
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
