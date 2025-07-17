"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye, Star, Sparkles, TrendingUp, ExternalLink, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Product } from "@/lib/types"
import { getImageUrl } from "@/lib/products"

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
  }, [product, primaryImage, addToCart, removeFromCart, isInCart])

  const handleAddToCartWithUndo = useCallback(async () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(primaryImage) || "/placeholder.svg",
      quantity: 1
    }
    
    try {
      await addToCart(cartItem)
      
      toast("Added to cart", {
        description: `${product.name} has been added to your cart.`,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
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
  }, [isWishlisted, product, primaryImage, addItem, removeItem])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  // Common image component
  const ProductImage = () => (
    <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
      <Image 
        src={getImageUrl(primaryImage) || "/placeholder.svg"} 
        alt={`${product.name} product image`}
        fill 
        className="object-cover transition-all duration-500 group-hover:scale-110"
        loading="lazy"
        sizes={viewMode === 'list' 
          ? "(max-width: 768px) 100vw, 224px"
          : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        }
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
      />
      
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
      
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
    </div>
  )

  // Common badges component
  const ProductBadges = () => (
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
  )

  // Common wishlist button component
  const WishlistButton = ({ className = "" }: { className?: string }) => (
    <Button
      size="sm"
      variant="secondary"
      className={`rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg min-h-[32px] min-w-[32px] ${className}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(e)
      }}
      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
    </Button>
  )

  // Common hover actions component
  const HoverActions = () => (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 hidden md:flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100">
      <Button
        size="sm"
        variant="secondary"
                          className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 border-0"
        aria-label={`Quick view ${product.name}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Eye className="h-4 w-4 text-gray-700" />
      </Button>

      <Button
        size="sm"
        className={`rounded-full shadow-lg min-h-[40px] min-w-[40px] transition-all duration-200 hover:scale-110 border-0 ${
          isInCart
            ? '!bg-green-500 !text-white'
            : 'bg-white/95 hover:bg-white text-gray-700'
        }`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleToggleCart()
        }}
        aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
      >
        <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
      </Button>

      <WishlistButton />
    </div>
  )

  if (viewMode === 'list') {
    return (
      <article 
        className="group card-interactive h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl relative cursor-pointer rounded-xl"
        role="article" 
        aria-labelledby={`product-${product.id}`}
      >
        <Link 
          href={`/products/${product.id}`} 
          className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-labelledby={`product-${product.id}`}
        >
          <div className="flex flex-col sm:flex-row lg:flex-row xl:flex-row">
            {/* Enhanced Image Section */}
            <div className="relative sm:w-48 lg:w-56 xl:w-64 flex-shrink-0">
              <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
                <Image 
                  src={getImageUrl(primaryImage) || "/placeholder.svg"} 
                  alt={`${product.name} product image`}
                  fill 
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, (max-width: 1024px) 224px, 256px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
                
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
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
              
              <ProductBadges />
              
              {/* Enhanced Hover Actions for Desktop */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 hidden lg:flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl min-h-[40px] min-w-[40px] transition-all duration-200 border-0"
                  aria-label={`Quick view ${product.name}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </Button>

                <Button
                  size="sm"
                  className={`rounded-full shadow-lg min-h-[40px] min-w-[40px] transition-all duration-200 border-0 ${
                    isInCart
                      ? '!bg-green-500 !text-white'
                      : 'bg-white/95 hover:bg-white text-gray-700'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleCart()
                  }}
                  aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                >
                  <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
                </Button>

                <WishlistButton />
              </div>
              
              {/* Mobile Wishlist Button */}
              <div className="absolute top-2 right-2 z-20 lg:hidden">
                <WishlistButton />
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

            {/* Enhanced Content Section */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Category and Brand - Enhanced Layout */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {product.brand}
                    </div>
                  </div>
                  
                  {/* Rating - Moved to top right on larger screens */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 sm:ml-auto">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < Math.floor(product.rating) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        ({product.review_count})
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Product Title - Enhanced Typography */}
                <h3 
                  id={`product-${product.id}`} 
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-200 line-clamp-1 leading-tight product-card-title"
                >
                  {product.name}
                </h3>

                {/* Enhanced Price Display */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.original_price && (
                      <span className="text-sm sm:text-lg text-gray-500 line-through">
                        KES {product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Discount Badge */}
                  {product.original_price && (
                    <div className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Product Features/Highlights - New Section */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Handcrafted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  size="lg"
                  className={`flex-1 min-h-[48px] sm:min-h-[52px] text-sm sm:text-base font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                    isInCart
                      ? '!bg-green-500 !text-white shadow-lg'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleCart()
                  }}
                  aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
                >
                  <ShoppingCart className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${isInCart ? 'fill-current' : ''}`} />
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] sm:min-h-[52px] px-4 border-gray-300 hover:border-green-600 hover:text-green-600 transition-all duration-200"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Grid View
  return (
    <article 
      className="group card-interactive h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl flex flex-col relative min-h-[200px] cursor-pointer rounded-xl w-full" 
      role="article" 
      aria-labelledby={`product-${product.id}`}
    >
      <Link 
        href={`/products/${product.id}`} 
        className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-t-xl flex-1 flex flex-col w-full"
        aria-labelledby={`product-${product.id}`}
      >
        <div className="relative overflow-hidden w-full">
          <ProductImage />
          <ProductBadges />
          <HoverActions />
          
          {/* Mobile Wishlist Button */}
          <div className="absolute top-2 right-2 z-20 md:hidden">
            <WishlistButton />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow w-full">
          {/* Category and Brand - hidden on mobile */}
          <div className="items-center justify-between mb-2 hidden sm:flex w-full">
            <div className="text-xs text-gray-500 font-medium truncate">{product.category}</div>
            <div className="text-xs font-semibold text-green-600 truncate">{product.brand}</div>
          </div>
          
          <h3 
            id={`product-${product.id}`} 
            className="text-sm sm:text-base font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200 line-clamp-1 leading-tight product-card-title w-full"
          >
            {product.name}
          </h3>

          {/* Price and Cart Icon */}
          <div className="flex items-center justify-between mb-2 w-full">
            <div className="flex items-center min-w-0 flex-1">
              <span className="text-base sm:text-lg font-bold text-gray-800 truncate">
                KES {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through flex-shrink-0">
                  KES {product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Cart Icon Button - Mobile Only */}
            <Button
              size="sm"
              className={`md:hidden rounded-full shadow-lg min-h-[36px] min-w-[36px] transition-all duration-200 hover:scale-110 border-0 flex-shrink-0 ${
                isInCart
                  ? '!bg-green-500 !text-white shadow-lg'
                  : 'bg-white/95 hover:bg-white text-gray-700 shadow-md'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isInCart) {
                  handleToggleCart()
                } else {
                  handleAddToCartWithUndo()
                }
              }}
              aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
            >
              <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center mb-3 w-full">
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
              <span className="ml-2 text-xs sm:text-sm text-gray-600 truncate">
                ({product.review_count})
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  )
} 