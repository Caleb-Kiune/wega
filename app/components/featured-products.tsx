"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi } from "@/lib/products"
import { Product } from "@/shared/types"
import { useCarouselScroll } from "@/lib/hooks/use-carousel-scroll"

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
  const [isHovered, setIsHovered] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  // Create infinite scroll products by duplicating the array
  const getInfiniteProducts = () => {
    if (products.length === 0) return []
    // Duplicate products 3 times to ensure smooth infinite scrolling
    return [...products, ...products, ...products]
  }

  const infiniteProducts = getInfiniteProducts()

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
      
      // Calculate current slide based on scroll position
      const slideWidth = 280 + 24 // card width + gap (adjusted for 4 cards)
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

  // Simplified smooth scroll function
  const smoothScroll = (targetScrollLeft: number) => {
    if (!carouselRef.current || isTransitioning) return
    
    setIsTransitioning(true)
    
    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    })
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800)
  }

  // Handle infinite scroll reset
  const handleScrollReset = () => {
    if (!carouselRef.current || isTransitioning) return
    
    const carousel = carouselRef.current
    const { scrollLeft } = carousel
    const cardWidth = 280 + 24 // card width + gap
    const originalSetWidth = products.length * cardWidth
    
    // If we've scrolled past the first set, reset to the middle set
    if (scrollLeft >= originalSetWidth) {
      setIsTransitioning(true)
      const newScrollLeft = scrollLeft - originalSetWidth
      carousel.scrollTo({ left: newScrollLeft, behavior: "auto" })
      setTimeout(() => setIsTransitioning(false), 100)
    }
    // If we've scrolled before the first set, reset to the middle set
    else if (scrollLeft < 0) {
      setIsTransitioning(true)
      const newScrollLeft = scrollLeft + originalSetWidth
      carousel.scrollTo({ left: newScrollLeft, behavior: "auto" })
      setTimeout(() => setIsTransitioning(false), 100)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", handleScrollReset)
      return () => carousel.removeEventListener("scroll", handleScrollReset)
    }
  }, [products, isTransitioning])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current && !isTransitioning) {
      const cardWidth = 280 + 24 // card width + gap (adjusted for 4 cards)
      const currentScrollLeft = carouselRef.current.scrollLeft
      const targetScrollLeft = direction === "left" 
        ? currentScrollLeft - cardWidth 
        : currentScrollLeft + cardWidth
      
      smoothScroll(targetScrollLeft)
      
      // Pause autoplay when manually scrolling
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 5000) // Resume after 5 seconds
    }
  }

  // Calculate total slides based on visible cards (4 cards per view)
  const getTotalSlides = () => {
    if (!products || products.length === 0) return 1
    return Math.ceil(products.length / 4) // 4 cards per slide
  }

  // Simplified autoplay
  useEffect(() => {
    if (!carouselRef.current || !isAutoPlaying || isHovered || isTransitioning) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      
      const cardWidth = 280 + 24; // card width + gap (adjusted for 4 cards)
      const currentScrollLeft = carousel.scrollLeft
      const targetScrollLeft = currentScrollLeft + cardWidth
      
      smoothScroll(targetScrollLeft)
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, products, isTransitioning]);

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
    <div 
      className="relative" 
      role="region" 
      aria-label="Featured products carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 md:p-3 shadow-xl hover:shadow-2xl focus:outline-none min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] opacity-30 hover:opacity-100 slider-nav-button slider-transition ${
          canScrollLeft ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll featured products left"
        disabled={!canScrollLeft || isTransitioning}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </button>
      
      <button
        onClick={() => scroll("right")}
        className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 md:p-3 shadow-xl hover:shadow-2xl focus:outline-none min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] opacity-30 hover:opacity-100 slider-nav-button slider-transition ${
          canScrollRight ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll featured products right"
        disabled={!canScrollRight || isTransitioning}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </button>

      {/* Enhanced Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-3 md:gap-6 overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar featured-slider"
        >
          {infiniteProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-none w-[calc(50%-6px)] md:w-[280px] featured-slider-item"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Enhanced Gradient Overlays for Smooth Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-white via-white/80 to-transparent slider-gradient-overlay pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-white via-white/80 to-transparent slider-gradient-overlay pointer-events-none" />
      </div>
    </div>
  )
}
