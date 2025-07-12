"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye, Star, Sparkles, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/lib/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Product } from "@/lib/types"
import { getImageUrl } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get primary and secondary images for hover effect
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
  const secondaryImage = product.images?.find(img => !img.is_primary)?.image_url || product.images?.[1]?.image_url || primaryImage

  const handleAddToCart = useCallback(() => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(primaryImage) || "/placeholder.svg",
      quantity: 1
    }
    
    try {
      addToCart(cartItem)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }, [product, primaryImage, addToCart, toast])

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
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
        image: getImageUrl(primaryImage) || "/placeholder.svg",
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }, [isWishlisted, product, primaryImage, addItem, removeItem, toast])

  const handleImageError = useCallback((imageUrl: string) => {
    setImageError(true)
  }, [])

  return (
    <article 
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 hover:border-gray-200 relative min-h-[200px]" 
      role="article" 
      aria-labelledby={`product-${product.id}`}
    >
      <div className="relative overflow-hidden">
        <Link 
          href={`/products/${product.id}`} 
          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-t-xl"
          aria-labelledby={`product-${product.id}`}
        >
          <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
            {/* Primary Image */}
            <Image 
              src={getImageUrl(primaryImage) || "/placeholder.svg"} 
              alt={`${product.name} product image`}
              fill 
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoad={() => setImageLoaded(true)}
              onError={() => handleImageError(primaryImage || '')}
            />
            
            {/* Secondary Image (shown on hover) - desktop only */}
            {secondaryImage && secondaryImage !== primaryImage && (
              <Image 
                src={getImageUrl(secondaryImage) || "/placeholder.svg"} 
                alt={`${product.name} alternate view`}
                fill 
                className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:block" 
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onError={() => handleImageError(secondaryImage || '')}
              />
            )}
            
            {/* Loading state */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400 text-xs text-center px-2">
                  <div className="w-6 h-6 mx-auto mb-1 animate-pulse">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Loading...</span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_featured && (
            <Badge className="bg-purple-600 text-white border-0 shadow-sm text-xs px-2 py-1">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              Featured
            </Badge>
          )}
          {product.is_new && (
            <Badge className="bg-green-600 text-white border-0 shadow-sm text-xs px-2 py-1">
              <Star className="w-2.5 h-2.5 mr-1" />
              New
            </Badge>
          )}
          {product.is_sale && (
            <Badge className="bg-red-500 text-white border-0 shadow-sm text-xs px-2 py-1">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              Sale
            </Badge>
          )}
        </div>

        {/* Quick View Button - desktop only */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm min-h-[32px] min-w-[32px]"
            asChild
          >
            <Link href={`/products/${product.id}`} aria-label={`Quick view ${product.name}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Quick actions overlay - desktop only */}
        <div className="absolute inset-0 bg-black/10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hidden md:flex">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm min-h-[40px] min-w-[40px]"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm min-h-[40px] min-w-[40px]"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {/* Category and Brand - hidden on mobile */}
        <div className="items-center justify-between mb-2 hidden sm:flex">
          <div className="text-xs text-gray-500 font-medium">{product.category}</div>
          <div className="text-xs font-semibold text-green-600">{product.brand}</div>
        </div>
        
        <Link 
          href={`/products/${product.id}`} 
          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
        >
          <h3 
            id={`product-${product.id}`} 
            className="text-sm sm:text-base font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2 leading-tight"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center mb-2">
          <span className="text-base sm:text-lg font-bold text-gray-800">
            KES {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">
              KES {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                    i < Math.floor(product.rating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs sm:text-sm text-gray-600">
              ({product.review_count})
            </span>
          </div>
        )}

        {/* Desktop Add to Cart Button */}
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 min-h-[44px] text-sm font-semibold rounded-lg shadow-sm hover:shadow-md"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden flex gap-2 p-3 pt-0">
        <Button
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-sm font-semibold rounded-lg shadow-sm hover:shadow-md"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="min-h-[44px] min-w-[44px] p-2 rounded-lg border-gray-300 hover:bg-gray-50"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
        </Button>
      </div>
    </article>
  )
} 