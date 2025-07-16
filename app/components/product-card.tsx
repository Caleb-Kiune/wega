"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye, Star, Sparkles, TrendingUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Product } from "@/lib/types"
import { getImageUrl } from "@/lib/products"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, removeFromCart, cart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Check if item is in cart
  const isInCart = cart?.items?.some(item => item.product_id === product.id) || false

  // Get primary image
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url

  const handleToggleCart = useCallback(async () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(primaryImage) || "/placeholder.svg",
      quantity: 1
    }
    
    try {
      if (isInCart) {
        await removeFromCart(product.id)
        toast.success(`${product.name} has been removed from your cart.`)
      } else {
        await addToCart(cartItem)
        toast.success(`${product.name} has been added to your cart.`)
      }
    } catch (error) {
      console.error('Cart operation failed:', error)
      toast.error(isInCart 
        ? "Failed to remove item from cart. Please try again."
        : "Failed to add item to cart. Please try again.")
    }
  }, [product, primaryImage, addToCart, removeFromCart, isInCart, cart])

  const handleAddToCartWithUndo = useCallback(async () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(primaryImage) || "/placeholder.svg",
      quantity: 1
    }
    
    try {
      // Add item to cart
      await addToCart(cartItem)
      
      // Show toast with undo option
      toast("Added to cart", {
        description: `${product.name} has been added to your cart.`,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              // Small delay to ensure cart state is updated
              await new Promise(resolve => setTimeout(resolve, 100))
              await removeFromCart(product.id)
              toast("Undo", {
                description: `${product.name} removed from cart.`
              })
            } catch (error) {
              console.error("Failed to undo add to cart:", error)
              toast("Error", {
                description: "Failed to remove item from cart. Please try again."
              })
            }
          },
        },
        duration: 2000,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast("Error", {
        description: "Failed to add item to cart. Please try again."
      })
    }
  }, [product, primaryImage, addToCart, removeFromCart])

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(String(product.id))
      toast.success(`${product.name} has been removed from your wishlist.`)
    } else {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: getImageUrl(primaryImage) || "/placeholder.svg",
        category: product.category,
      })
      toast.success(`${product.name} has been added to your wishlist.`)
    }
  }, [isWishlisted, product, primaryImage, addItem, removeItem, toast])

  const handleImageError = useCallback((imageUrl: string) => {
    setImageError(true)
  }, [])

  if (viewMode === 'list') {
    return (
      <motion.article 
        className="group card-interactive overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl relative cursor-pointer"
        role="article" 
        aria-labelledby={`product-${product.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-48 lg:w-56 flex-shrink-0">
            <Link 
              href={`/products/${product.id}`} 
              className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-labelledby={`product-${product.id}`}
            >
              <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                {/* Primary Image */}
                <Image 
                  src={getImageUrl(primaryImage) || "/placeholder.svg"} 
                  alt={`${product.name} product image`}
                  fill 
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 224px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onLoad={() => setImageLoaded(true)}
                  onError={() => handleImageError(primaryImage || '')}
                />
                
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
                
                {/* Overlay - Enhanced like category cards */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
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

            {/* Hover Action Icons - List View */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center gap-2 z-20">
              {/* Quick View Button */}
              <Link href={`/products/${product.id}`}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 border-0"
                  aria-label={`Quick view ${product.name}`}
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </Button>
              </Link>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                className={`rounded-full shadow-lg min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 border-0 ${
                  isInCart
                    ? '!bg-green-500 !text-white'
                    : 'bg-white/95 hover:bg-white text-gray-700'
                }`}
                onClick={handleToggleCart}
                aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
              >
                <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
              </Button>

              {/* Wishlist Button */}
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 border-0"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-700"}`} />
              </Button>
            </div>

            {/* Mobile Wishlist Button - Always Visible */}
            <div className="absolute top-2 right-2 z-20 md:hidden">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg min-h-[32px] min-w-[32px]"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
              </Button>
            </div>

            {/* Cart Indicator */}
            {isInCart && (
              <div className="absolute bottom-2 right-2 z-20">
                <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <ShoppingCart className="h-4 w-4 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Category and Brand */}
              <div className="flex items-center gap-4 mb-3">
                <div className="text-sm text-gray-500 font-medium">{product.category}</div>
                <div className="text-sm font-semibold text-green-600">{product.brand}</div>
              </div>
              
              {/* Product Title */}
              <Link 
                href={`/products/${product.id}`} 
                className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
              >
                <h3 
                  id={`product-${product.id}`} 
                  className="text-xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors line-clamp-2 leading-tight"
                >
                  {product.name}
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-gray-800">
                  KES {product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    KES {product.original_price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.review_count})
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <Button
                size="lg"
                className={`flex-1 min-h-[48px] text-base font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                  isInCart
                    ? '!bg-green-500 !text-white shadow-lg'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={handleToggleCart}
                aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
              >
                <ShoppingCart className={`h-5 w-5 mr-2 ${isInCart ? 'fill-current' : ''}`} />
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Button>
              
              <Link href={`/products/${product.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] px-4 border-gray-300 hover:border-green-600 hover:text-green-600"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  // Grid View (Enhanced with Category Card Hover Styles)
  return (
    <motion.article 
      className="group card-interactive h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl flex flex-col relative min-h-[200px] cursor-pointer" 
      role="article" 
      aria-labelledby={`product-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
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
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoad={() => setImageLoaded(true)}
              onError={() => handleImageError(primaryImage || '')}
            />
            
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

        {/* Hover Action Icons - Desktop Only (Grid View) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 hidden md:flex items-center justify-center gap-3 z-20">
          {/* Quick View Button */}
          <Link href={`/products/${product.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] transition-all duration-200 hover:scale-110 border-0"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            className={`rounded-full shadow-lg min-h-[44px] min-w-[44px] transition-all duration-200 hover:scale-110 border-0 ${
              isInCart
                ? '!bg-green-500 !text-white'
                : 'bg-white/95 hover:bg-white text-gray-700'
            }`}
            onClick={handleToggleCart}
            aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
          >
            <ShoppingCart className={`h-5 w-5 ${isInCart ? 'fill-current' : ''}`} />
          </Button>

          {/* Wishlist Button */}
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] transition-all duration-200 hover:scale-110 border-0"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-700"}`} />
          </Button>
        </div>

        {/* Mobile Wishlist Button - Always Visible */}
        <div className="absolute top-2 right-2 z-20 md:hidden">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg min-h-[32px] min-w-[32px]"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
          </Button>
        </div>

        
      </div>

      <div className="p-4 flex flex-col flex-grow">
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

        {/* Price and Cart Icon */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-base sm:text-lg font-bold text-gray-800">
              KES {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">
                KES {product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Cart Icon Button - Bottom Right */}
          <Button
            size="sm"
            className={`rounded-full shadow-lg min-h-[36px] min-w-[36px] transition-all duration-200 hover:scale-110 border-0 ${
              isInCart
                ? '!bg-green-500 !text-white shadow-lg'
                : 'bg-white/95 hover:bg-white text-gray-700 shadow-md'
            }`}
            onClick={isInCart ? handleToggleCart : handleAddToCartWithUndo}
            aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
          >
            <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
          </Button>
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
      </div>
    </motion.article>
  )
} 