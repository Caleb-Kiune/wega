"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi } from "@/lib/products"
import { Product } from "@/shared/types"
import { useCarouselScroll } from "@/lib/hooks/use-carousel-scroll"
import { useToast } from "@/lib/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import Link from 'next/link'
import Image from 'next/image'

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export default function FeaturedProducts() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use shared carousel scroll handler
  const { isScrolling } = useCarouselScroll(carouselRef);

  const getErrorMessage = (err: unknown): string => {
    if (!(err instanceof Error)) {
      return 'An unknown error occurred'
    }

    const apiError = err as ApiError
    if (!apiError.response) {
      return 'Unable to connect to the server. Please make sure the backend is running.'
    }
    if (apiError.response.status === 404) {
      return 'The requested resource was not found.'
    }
    if (apiError.response.status >= 500) {
      return 'Server error. Please try again later.'
    }
    return err.message || 'Failed to load products. Please try again later.'
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching featured products...')
      const response = await productsApi.getAll({ is_featured: true })
      
      // Log the full response
      console.log('API Response:', {
        total: response.total,
        products: response.products.map((p: Product) => ({
          id: p.id,
          name: p.name,
          is_featured: p.is_featured
        }))
      })
      
      // Validate that all products are featured
      const nonFeaturedProducts = response.products.filter((product: Product) => !product.is_featured)
      if (nonFeaturedProducts.length > 0) {
        console.error('Non-featured products found:', nonFeaturedProducts.map((p: Product) => ({
          id: p.id,
          name: p.name,
          is_featured: p.is_featured
        })))
        setError('Error: Non-featured products found in response')
        return
      }
      
      setProducts(response.products)
    } catch (err) {
      console.error('Error fetching featured products:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
      
      // Calculate current slide based on scroll position
      const slideWidth = 280 + 24 // card width + gap
      const newCurrentSlide = Math.round(scrollLeft / slideWidth)
      setCurrentSlide(newCurrentSlide)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons)
      // Initial check
      checkScrollButtons()
      return () => carousel.removeEventListener("scroll", checkScrollButtons)
    }
  }, [products]) // Re-check when products change

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const goToSlide = (slideIndex: number) => {
    if (carouselRef.current) {
      const slideWidth = 280 + 24 // card width + gap
      const scrollPosition = slideIndex * slideWidth
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  // Calculate total slides based on visible cards
  const getTotalSlides = () => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current
      const cardWidth = 280 + 24 // card width + gap
      return Math.ceil(products.length / Math.floor(clientWidth / cardWidth))
    }
    return Math.ceil(products.length / 3) // fallback
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading featured products">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="space-y-2">
          <button 
            onClick={fetchProducts} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 min-h-[44px] min-w-[44px]"
            aria-label="Retry loading featured products"
          >
            Retry
          </button>
          {error.includes('Unable to connect to the API') && (
            <p className="text-sm text-gray-600 mt-2">
              Make sure your backend server is running at {process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com/api'}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-gray-500">No featured products available</p>
      </div>
    )
  }

  const totalSlides = getTotalSlides()

  return (
    <div className="relative" role="region" aria-label="Featured products carousel">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px]"
          aria-label="Scroll featured products left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px]"
          aria-label="Scroll featured products right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Desktop Carousel */}
      <div
        ref={carouselRef}
        className="hidden md:flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 will-change-transform"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x',
          pointerEvents: 'auto'
        }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-none w-[280px]"
            style={{ 
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              touchAction: 'manipulation',
              pointerEvents: 'auto'
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile Stackable Grid */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.slice(0, 4).map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Dot Indicators - Only show on desktop */}
      {totalSlides > 1 && (
        <div className="hidden md:flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                index === currentSlide 
                  ? 'bg-green-600 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1} of ${totalSlides}`}
              aria-current={index === currentSlide ? "true" : "false"}
              style={{ willChange: 'transform, background-color' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
