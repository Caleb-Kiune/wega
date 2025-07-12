"use client"

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

  // Add debug logging
  console.log('Product Card Data:', {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    is_new: product.is_new,
    is_sale: product.is_sale,
    is_featured: product.is_featured,
    images: product.images,
    primaryImage: product.images?.find(img => img.is_primary)?.image_url,
    firstImage: product.images?.[0]?.image_url
  });

  const handleAddToCart = () => {
    console.log('handleAddToCart called with product:', product)
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url) || "/placeholder.svg",
      quantity: 1
    }
    
    console.log('Cart item to add:', cartItem)
    
    try {
      addToCart(cartItem)
      console.log('addToCart function called successfully')
      
      // Test: Log the current cart state after adding
      setTimeout(() => {
        console.log('Current cart items from localStorage:', localStorage.getItem('cart'))
      }, 100)
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
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
        image: getImageUrl(product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url) || "/placeholder.svg",
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  // Get primary and secondary images for hover effect
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
  const secondaryImage = product.images?.find(img => !img.is_primary)?.image_url || product.images?.[1]?.image_url || primaryImage

  return (
    <article 
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100 hover:border-gray-200" 
      role="article" 
      aria-labelledby={`product-${product.id}`}
      style={{ willChange: 'transform, box-shadow' }}
    >
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`} aria-labelledby={`product-${product.id}`}>
          <div className="relative h-44 sm:h-48 lg:h-52 w-full bg-gray-100">
            {/* Primary Image */}
            <Image 
              src={getImageUrl(primaryImage) || "/placeholder.svg"} 
              alt={`${product.name} product image`}
              fill 
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0" 
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            
            {/* Secondary Image (shown on hover) */}
            {secondaryImage && secondaryImage !== primaryImage && (
              <Image 
                src={getImageUrl(secondaryImage) || "/placeholder.svg"} 
                alt={`${product.name} alternate view`}
                fill 
                className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110" 
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            )}
          </div>
        </Link>

        {/* Enhanced Product badges with animations */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_featured && (
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-lg animate-pulse text-xs px-2 py-1">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              Featured
            </Badge>
          )}
          {product.is_new && (
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg animate-bounce text-xs px-2 py-1">
              <Star className="w-2.5 h-2.5 mr-1" />
              New
            </Badge>
          )}
          {product.is_sale && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse text-xs px-2 py-1">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              Sale
            </Badge>
          )}
        </div>

        {/* Quick View Button - Appears on hover */}
        <div 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          style={{ willChange: 'opacity, transform' }}
        >
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[32px] min-w-[32px] transition-all duration-200 hover:scale-110"
            asChild
          >
            <Link href={`/products/${product.id}`} aria-label={`Quick view ${product.name}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Enhanced Quick actions overlay with animated icons */}
        <div 
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          style={{ willChange: 'opacity' }}
        >
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 group/btn"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              style={{ willChange: 'transform' }}
            >
              <ShoppingCart className="h-4 w-4 group-hover/btn:animate-bounce" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 group/btn"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              style={{ willChange: 'transform' }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""} group-hover/btn:animate-pulse`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs sm:text-sm text-gray-500 font-medium">{product.category}</div>
          <div className="text-xs sm:text-sm font-semibold text-green-600">{product.brand}</div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block">
          <h3 id={`product-${product.id}`} className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price with enhanced styling */}
        <div className="flex items-center mb-3">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
            KES {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">
              KES {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating display */}
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

        {/* Enhanced Add to Cart Button with animated icon */}
        <div 
          className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          style={{ willChange: 'opacity, transform' }}
        >
          <Button 
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[44px] transition-all duration-200 hover:scale-105 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl group/btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            style={{ willChange: 'transform' }}
          >
            <Plus className="h-4 w-4 group-hover/btn:animate-spin" />
            Add to Cart
          </Button>
        </div>
      </div>

      <style jsx>{`
        /* Enhanced hover effects */
        .group:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Smooth transitions for all elements */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Badge animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        /* Icon animations */
        .group-hover\\/btn\\:animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }
        
        .group-hover\\/btn\\:animate-pulse {
          animation: pulse 1s ease-in-out;
        }
        
        .group-hover\\/btn\\:animate-spin {
          animation: spin 0.6s linear;
        }
      `}</style>
    </article>
  )
} 