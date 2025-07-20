"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye, Star, Sparkles, TrendingUp, ExternalLink, ShieldCheck, Truck, X } from "lucide-react"
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

// Quick View Modal Component
const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose, 
  selectedImageIndex, 
  setSelectedImageIndex,
  isInCart,
  isWishlisted,
  onToggleCart,
  onToggleWishlist,
  quantity,
  setQuantity
}: {
  product: Product
  isOpen: boolean
  onClose: () => void
  selectedImageIndex: number
  setSelectedImageIndex: (index: number) => void
  isInCart: boolean
  isWishlisted: boolean
  onToggleCart: () => void
  onToggleWishlist: () => void
  quantity: number
  setQuantity: (quantity: number) => void
}) => {
  if (!isOpen) return null

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1
      return Math.max(1, Math.min(newQuantity, product.stock))
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Made smaller */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Quick View</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(85vh-80px)] overflow-hidden">
          {/* Image Section */}
          <div className="lg:w-1/2 p-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
              <Image
                src={getImageUrl(product.images?.[selectedImageIndex]?.image_url || product.images?.[0]?.image_url)}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-green-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image.image_url)}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-4 flex flex-col">
            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs product-category">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs product-brand">
                  {product.brand}
                </Badge>
              </div>
              
              <h3 className="text-xl font-medium text-gray-900 mb-2 product-name">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-3 line-clamp-2 text-sm product-feature leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-green-600 product-price">
                  KES {product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-base text-gray-500 line-through product-price-original">
                    KES {product.original_price.toLocaleString()}
                  </span>
                )}
                {product.original_price && (
                  <Badge className="bg-red-100 text-red-700 text-xs badge-premium">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium product-feature ${
                  product.stock > 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 product-feature">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 p-0 btn-product"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-sm font-medium product-feature">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 p-0 btn-product"
                    >
                      +
                    </Button>
                    <span className="text-xs text-gray-500 ml-2 product-feature">
                      Max: {product.stock}
                    </span>
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 product-feature">Features</h4>
                  <ul className="space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 product-feature">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        {feature.feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t">
              <Button
                size="md"
                className={`${isInCart 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                } btn-product`}
                onClick={onToggleCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outline"
                size="md"
                onClick={onToggleWishlist}
                className="btn-product"
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* View Full Details Link */}
            <div className="mt-3 text-center">
              <Link
                href={`/products/${product.id}`}
                className="text-green-600 hover:text-green-700 font-medium text-xs product-feature"
                onClick={onClose}
              >
                View Full Product Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, removeFromCart, cart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

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
      quantity: quantity
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
  }, [product, primaryImage, addToCart, removeFromCart, isInCart, quantity])

  const handleCloseQuickView = () => {
    setShowQuickView(false)
    setSelectedImageIndex(0)
    setQuantity(1)
  }

  const handleToggleWishlist = () => {
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
  }

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
      toast.success(`${product.name} has been added to your cart.`)
    } catch (error) {
      console.error('Cart operation failed:', error)
      toast.error("Failed to add item to cart. Please try again.")
    }
  }, [product, primaryImage, addToCart])

  const handleImageError = () => {
    setImageError(true)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

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
          : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
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
        handleToggleWishlist()
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
        onClick={handleQuickView}
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
      <>
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
                    onClick={handleQuickView}
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
                      <div className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full product-category">
                        {product.category}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full product-brand">
                        {product.brand}
                      </div>
                    </div>
                    
                    {/* Rating - Moved to top right on larger screens */}
                    {/* {product.rating > 0 && (
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
                    )} */}
                  </div>
                  
                  {/* Product Title - Enhanced Typography */}
                  <h3 
                    id={`product-${product.id}`} 
                    className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-800 transition-colors duration-200 leading-tight product-card-title truncate product-name"
                  >
                    {product.name}
                  </h3>

                  {/* Enhanced Price Display */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 product-price">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-sm sm:text-lg text-gray-500 line-through product-price-original">
                          KES {product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Discount Badge */}
                    {product.original_price && (
                      <div className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full badge-premium">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Features/Highlights - New Section */}
                  <div className="hidden lg:block">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span className="product-feature">Premium Quality</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4 text-blue-500" />
                        <span className="product-feature">Free Shipping</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="product-feature">Handcrafted</span>
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
        
        {/* Quick View Modal */}
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={handleCloseQuickView}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          isInCart={isInCart}
          isWishlisted={isWishlisted}
          onToggleCart={handleToggleCart}
          onToggleWishlist={handleToggleWishlist}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </>
    )
  }

  // Grid View
  return (
    <>
      <article 
        className="group card-interactive h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-2xl flex flex-col relative min-h-[180px] cursor-pointer rounded-xl w-full transition-all duration-300 hover:scale-[1.02]" 
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

          <div className="p-3 sm:p-4 flex flex-col flex-grow w-full">
            {/* Category and Brand - hidden on mobile */}
            <div className="items-center justify-between mb-2 hidden sm:flex w-full">
              <div className="text-xs text-gray-500 font-medium truncate product-category">{product.category}</div>
              <div className="text-xs font-semibold text-green-600 truncate product-brand">{product.brand}</div>
            </div>
            
            <h3 
              id={`product-${product.id}`} 
              className="text-sm sm:text-base font-medium text-gray-800 mb-2 transition-colors duration-200 leading-tight product-card-title w-full truncate product-name"
            >
              {product.name}
            </h3>

            {/* Price and Cart Icon */}
            <div className="flex items-center justify-between mb-2 w-full">
              <div className="flex items-center min-w-0 flex-1 gap-1 sm:gap-2">
                <span className="text-base sm:text-lg font-bold text-green-600 truncate price-current">
                  KES {product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="hidden sm:inline text-sm text-gray-500 line-through flex-shrink-0 price-original">
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
            {/* {product.rating > 0 && (
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
            )} */}
          </div>
        </Link>
      </article>
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={handleCloseQuickView}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        isInCart={isInCart}
        isWishlisted={isWishlisted}
        onToggleCart={handleToggleCart}
        onToggleWishlist={handleToggleWishlist}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </>
  )
} 