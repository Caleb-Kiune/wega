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

  // Simplified card width calculation - enforce 4 cards on PC
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 280

    const width = window.innerWidth
    
    // PC view (lg and above) - exactly 4 cards
    if (width >= 1024) {
      // Calculate container width
      const containerPadding = 32 // lg:px-8 = 32px
      const maxContainerWidth = 1280 // max-w-7xl = 80rem = 1280px
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      
      // Account for navigation buttons space
      const navButtonWidth = 48 // min-h-[48px]
      const navButtonSpace = navButtonWidth + 16 // button width + margin
      const totalNavSpace = navButtonSpace * 2 // left and right buttons
      
      // Calculate card width for exactly 4 cards
      const gap = 16 // gap-4 = 16px
      const totalGaps = 3 // 4 cards = 3 gaps
      const cardWidth = (availableWidth - (totalGaps * gap) - totalNavSpace) / 4
      
      return Math.max(cardWidth, 200) // Minimum card width
    }
    
    // Tablet view (md to lg) - 3 cards
    if (width >= 768) {
      const containerPadding = 24 // md:px-6 = 24px
      const maxContainerWidth = 1280
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      
      const navButtonWidth = 48
      const navButtonSpace = navButtonWidth + 16
      const totalNavSpace = navButtonSpace * 2
      
      const gap = 16
      const totalGaps = 2 // 3 cards = 2 gaps
      const cardWidth = (availableWidth - (totalGaps * gap) - totalNavSpace) / 3
      
      return Math.max(cardWidth, 200)
    }
    
    // Mobile view (below md) - 2 cards
    const containerPadding = 16 // px-4 = 16px
    const maxContainerWidth = 1280
    const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
    
    const navButtonWidth = 40 // min-h-[40px]
    const navButtonSpace = navButtonWidth + 16
    const totalNavSpace = navButtonSpace * 2
    
    const gap = 16
    const totalGaps = 1 // 2 cards = 1 gap
    const cardWidth = (availableWidth - (totalGaps * gap) - totalNavSpace) / 2
    
    return Math.max(cardWidth, 150) // Minimum card width for mobile
  }

  const [cardWidth, setCardWidth] = useState(getCardWidth())

  useEffect(() => {
    const updateCardWidth = () => {
      setCardWidth(getCardWidth())
    }

    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [])

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
      const scrollAmount = cardWidth + 16 // card width + gap
      const newCurrentSlide = Math.round(scrollLeft / scrollAmount)
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
  }, [products, cardWidth]) // Re-check when products or card width change

  // Enhanced smooth scroll function
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
    const scrollAmount = cardWidth + 16 // card width + gap
    const originalSetWidth = products.length * scrollAmount
    
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
  }, [products, isTransitioning, cardWidth])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current && !isTransitioning) {
      const scrollAmount = cardWidth + 16 // card width + gap
      const currentScrollLeft = carouselRef.current.scrollLeft
      const targetScrollLeft = direction === "left" 
        ? currentScrollLeft - scrollAmount 
        : currentScrollLeft + scrollAmount
      
      smoothScroll(targetScrollLeft)
      
      // Pause autoplay when manually scrolling
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 5000) // Resume after 5 seconds
    }
  }

  // Enhanced autoplay
  useEffect(() => {
    if (!carouselRef.current || !isAutoPlaying || isHovered || isTransitioning) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      
      const scrollAmount = cardWidth + 16; // card width + gap
      const currentScrollLeft = carousel.scrollLeft
      const targetScrollLeft = currentScrollLeft + scrollAmount
      
      smoothScroll(targetScrollLeft)
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, products, isTransitioning, cardWidth]);

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
        className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 md:p-3 shadow-xl hover:shadow-2xl focus:outline-none min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] opacity-30 hover:opacity-100 transition-all duration-300 ${
          canScrollLeft ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll featured products left"
        disabled={!canScrollLeft || isTransitioning}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </button>
      
      <button
        onClick={() => scroll("right")}
        className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 md:p-3 shadow-xl hover:shadow-2xl focus:outline-none min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] opacity-30 hover:opacity-100 transition-all duration-300 ${
          canScrollRight ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll featured products right"
        disabled={!canScrollRight || isTransitioning}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </button>

      {/* Carousel Container - Enforce 4 cards on PC */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar featured-products-carousel"
          style={{
            scrollSnapType: 'x mandatory',
            scrollPadding: '0px',
            scrollBehavior: 'smooth'
          }}
        >
          {infiniteProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-none featured-products-item"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                width: `${cardWidth}px`,
                minWidth: `${cardWidth}px`,
                maxWidth: `${cardWidth}px`
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
