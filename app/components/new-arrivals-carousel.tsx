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

export default function NewArrivalsCarousel() {
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

  // Enhanced card width calculation - match Featured Products sizing
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 280

    const width = window.innerWidth
    
    // PC view (lg and above) - exactly 4 cards - match Featured Products grid sizing
    if (width >= 1024) {
      // Use the same sizing logic as Featured Products grid
      const containerPadding = 32 // lg:px-8 = 32px
      const maxContainerWidth = 1280 // max-w-7xl = 80rem = 1280px
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      
      // Calculate card width to match Featured Products grid (xl:grid-cols-4)
      const gap = 16 // gap-4 = 16px
      const totalGaps = 3 // 4 cards = 3 gaps
      const cardWidth = (availableWidth - (totalGaps * gap)) / 4
      
      return Math.max(cardWidth, 250) // Increased minimum for better sizing
    }
    
    // Tablet view (md to lg) - 3 cards - match Featured Products grid sizing
    if (width >= 768) {
      const containerPadding = 24 // md:px-6 = 24px
      const maxContainerWidth = 1280
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      
      const gap = 16
      const totalGaps = 2 // 3 cards = 2 gaps
      const cardWidth = (availableWidth - (totalGaps * gap)) / 3
      
      return Math.max(cardWidth, 220) // Increased minimum for better sizing
    }
    
    // Mobile view (below md) - 2 cards - match Featured Products grid sizing
    const containerPadding = 16 // px-4 = 16px
    const maxContainerWidth = 1280
    const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
    
    const gap = 16
    const totalGaps = 1 // 2 cards = 1 gap
    const cardWidth = (availableWidth - (totalGaps * gap)) / 2
    
    return Math.max(cardWidth, 180) // Increased minimum for better sizing
  }

  // Calculate container width to match Featured Products sizing
  const getContainerWidth = () => {
    if (typeof window === 'undefined') return '100%'

    const width = window.innerWidth
    
    // PC view (lg and above) - exactly 4 cards - match Featured Products grid
    if (width >= 1024) {
      const cardWidth = getCardWidth()
      const gap = 16
      const totalGaps = 3 // 4 cards = 3 gaps
      const containerWidth = (cardWidth * 4) + (totalGaps * gap)
      // Use full available width like Featured Products grid
      const maxAvailableWidth = width - 64 // Account for container padding
      return `${Math.min(containerWidth, maxAvailableWidth)}px`
    }
    
    // Tablet view (md to lg) - 3 cards - match Featured Products grid
    if (width >= 768) {
      const cardWidth = getCardWidth()
      const gap = 16
      const totalGaps = 2 // 3 cards = 2 gaps
      const containerWidth = (cardWidth * 3) + (totalGaps * gap)
      // Use full available width like Featured Products grid
      const maxAvailableWidth = width - 48 // Account for container padding
      return `${Math.min(containerWidth, maxAvailableWidth)}px`
    }
    
    // Mobile view (below md) - 2 cards - match Featured Products grid
    const cardWidth = getCardWidth()
    const gap = 16
    const totalGaps = 1 // 2 cards = 1 gap
    const containerWidth = (cardWidth * 2) + (totalGaps * gap)
    // Use full available width like Featured Products grid
    const maxAvailableWidth = width - 32 // Account for container padding
    return `${Math.min(containerWidth, maxAvailableWidth)}px`
  }

  const [cardWidth, setCardWidth] = useState(getCardWidth())
  const [containerWidth, setContainerWidth] = useState(getContainerWidth())

  useEffect(() => {
    const updateDimensions = () => {
      const newCardWidth = getCardWidth()
      const newContainerWidth = getContainerWidth()
      
      setCardWidth(newCardWidth)
      setContainerWidth(newContainerWidth)
      
      // Debug logging
      console.log('New Arrivals Carousel Dimensions:', {
        windowWidth: window.innerWidth,
        cardWidth: newCardWidth,
        containerWidth: newContainerWidth,
        screenSize: window.innerWidth >= 1024 ? 'PC' : window.innerWidth >= 768 ? 'Tablet' : 'Mobile'
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
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
      console.log('Fetching new arrivals products...')
      const response = await productsApi.getAll({ is_new: true })
      
      // Log the full response
      console.log('API Response:', {
        total: response.total,
        products: response.products.map((p: Product) => ({
          id: p.id,
          name: p.name,
          is_new: p.is_new
        }))
      })
      
      // Validate that all products are new arrivals
      const nonNewProducts = response.products.filter((product: Product) => !product.is_new)
      if (nonNewProducts.length > 0) {
        console.error('Non-new products found:', nonNewProducts.map((p: Product) => ({
          id: p.id,
          name: p.name,
          is_new: p.is_new
        })))
        setError('Error: Non-new products found in response')
        return
      }
      
      setProducts(response.products)
    } catch (err) {
      console.error('Error fetching new arrivals products:', err)
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
      
      // Ensure we scroll to complete card positions
      const adjustedTargetScrollLeft = Math.round(targetScrollLeft / scrollAmount) * scrollAmount
      
      smoothScroll(adjustedTargetScrollLeft)
      
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
      
      // Ensure we scroll to complete card positions
      const adjustedTargetScrollLeft = Math.round(targetScrollLeft / scrollAmount) * scrollAmount
      
      smoothScroll(adjustedTargetScrollLeft)
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, products, isTransitioning, cardWidth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading new arrivals products">
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
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 min-h-[44px] min-w-[44px]"
            aria-label="Retry loading new arrivals products"
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
        <p className="text-gray-500">No new arrivals available</p>
      </div>
    )
  }

  return (
    <div 
      className="relative" 
      role="region" 
      aria-label="New arrivals carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Minimalistic Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ease-out ${
          canScrollLeft ? 'pointer-events-auto opacity-60 hover:opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll new arrivals left"
        disabled={!canScrollLeft || isTransitioning}
      >
        {/* Gradient Background */}
        <div className="new-arrivals-nav-gradient left" />
        
        {/* Button Container */}
        <div className="new-arrivals-nav-button ml-2">
          <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
        </div>
      </button>
      
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ease-out ${
          canScrollRight ? 'pointer-events-auto opacity-60 hover:opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Scroll new arrivals right"
        disabled={!canScrollRight || isTransitioning}
      >
        {/* Gradient Background */}
        <div className="new-arrivals-nav-gradient right" />
        
        {/* Button Container */}
        <div className="new-arrivals-nav-button mr-2">
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
        </div>
      </button>

      {/* Carousel Container - Ensure only complete cards are visible */}
      <div className="relative overflow-hidden mx-auto" style={{ width: containerWidth }}>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar new-arrivals-carousel"
          style={{
            scrollSnapType: 'x mandatory',
            scrollPadding: '0px',
            scrollBehavior: 'smooth',
            width: '100%'
          }}
        >
          {infiniteProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-none new-arrivals-item"
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