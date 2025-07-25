"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Sparkles, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/types"
import { getImageUrl } from "@/lib/products"
import { motion } from "framer-motion"

interface AdminProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
  isSelected?: boolean
  onSelectionChange?: (productId: number, checked: boolean) => void
}

export default function AdminProductCard({ product, viewMode = 'grid', isSelected, onSelectionChange }: AdminProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get primary image
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url

  const handleImageError = () => {
    setImageError(true)
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
      
      {/* Selection checkbox - positioned at bottom right of image */}
      {onSelectionChange && (
        <div className="absolute bottom-2 right-2 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange(product.id, e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white/95 backdrop-blur-sm shadow-lg"
          />
        </div>
      )}
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
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="product-feature">Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="product-feature">Handcrafted</span>
                    </div>
                  </div>
                </div>
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
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-grow w-full">
          {/* Category, Name, Price - Compact Vertical Spacing (Mobile & Desktop) */}
          <div className="text-xs font-medium text-gray-400 mb-1 truncate">{product.category}</div>
          <h3 
            id={`product-${product.id}`} 
            className="text-base font-semibold text-gray-800 mb-1 leading-tight truncate product-card-title product-name"
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-green-600 truncate price-current">
                KES {product.price.toLocaleString()}
              </span>
              {product.original_price ? (
                <span className="text-xs text-gray-400 line-through mt-0.5 price-original">
                  KES {product.original_price.toLocaleString()}
                </span>
              ) : (
                <div className="h-4 mt-0.5"></div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
} 