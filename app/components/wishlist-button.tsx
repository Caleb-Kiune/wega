"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    slug?: string
  }
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  product, 
  size = "icon",
  className,
  showText = false 
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)
  
  const inWishlist = isInWishlist(product.id)
  
  const handleToggleWishlist = () => {
    if (loading) return
    
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }
  
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] hover:bg-red-50 hover:shadow-md",
        size === "icon" ? "h-12 w-12 rounded-2xl" : "h-10 rounded-xl px-4 py-2",
        inWishlist 
          ? "text-red-500 hover:text-red-700" 
          : "text-gray-500 hover:text-red-600",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleToggleWishlist}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-2">
          {inWishlist ? "Remove" : "Add to Wishlist"}
        </span>
      )}
    </button>
  )
}

// Compact wishlist button for product cards
export function CompactWishlistButton({ product }: { product: any }) {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist()
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }
  
  const inWishlist = isInWishlist(product.id)
  
  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={cn(
        "absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 z-10",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500",
        inWishlist 
          ? "text-red-500 hover:text-red-700" 
          : "text-gray-500 hover:text-red-600",
        loading && "opacity-50 cursor-not-allowed"
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
    </button>
  )
} 