"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi, Product, ProductsParams } from "@/lib/products"
import { useCarouselScroll } from "@/lib/hooks/use-carousel-scroll"

interface ProductCarouselProps {
  category?: string;
  excludeProductId?: number;
}

export default function ProductCarousel({ category, excludeProductId }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [cardWidth, setCardWidth] = useState(280)
  const [cardsPerView, setCardsPerView] = useState(4)

  // Use shared carousel scroll handler
  const { isScrolling } = useCarouselScroll(carouselRef);

  // Calculate card width based on screen size and container width
  const calculateCardWidth = () => {
    if (typeof window === 'undefined') return 280

    const width = window.innerWidth
    // Get responsive breakpoints to match New Arrivals grid exactly
    const columns = width < 640 ? 2 : width < 1024 ? 2 : width < 1280 ? 3 : 4 // grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
    
    // Calculate container width exactly like New Arrivals
    const containerPadding = width < 640 ? 16 : width < 1024 ? 24 : 32 // px-4 sm:px-6 lg:px-8
    const maxContainerWidth = 1280 // max-w-7xl = 80rem = 1280px
    const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
    
    // Account for navigation buttons space (they take up space on the sides)
    const navButtonWidth = width < 768 ? 40 : 48 // min-h-[40px] md:min-h-[48px]
    const navButtonSpace = navButtonWidth + 16 // button width + margin
    
    // Calculate card width to match New Arrivals grid exactly
    const gap = 16 // gap-4 = 16px
    const totalGaps = columns - 1
    const totalNavSpace = navButtonSpace * 2 // left and right buttons
    const cardWidth = (availableWidth - (totalGaps * gap) - totalNavSpace) / columns
    
    setCardsPerView(columns)
    setCardWidth(cardWidth)
    
    return cardWidth
  }

  useEffect(() => {
    const updateCardWidth = () => {
      calculateCardWidth()
    }

    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching products for category:', category)
        
        // Set filter parameters based on category
        const filterParams: ProductsParams = {
          limit: 10 // Limit to 10 products for the carousel
        }

        // Add category-specific filters if category is provided and valid
        if (category && typeof category === 'string' && category.trim() !== '') {
          if (category === 'new-arrivals') {
            filterParams.is_new = true;
          } else if (category === 'special-offers') {
            filterParams.is_sale = true;
          } else {
            // For other categories, filter by category name
            filterParams.categories = [category];
          }
        }
        
        const response = await productsApi.getAll(filterParams)
        
        // Filter out the excluded product if specified
        let filteredProducts = response.products;
        if (excludeProductId && typeof excludeProductId === 'number' && excludeProductId > 0) {
          filteredProducts = response.products.filter((product: Product) => product.id !== excludeProductId);
        }
        
        // Log the full response
        console.log('API Response:', {
          total: response.total,
          products: filteredProducts.map((p: Product) => ({
            id: p.id,
            name: p.name,
            is_new: p.is_new,
            is_sale: p.is_sale
          }))
        })
        
        setProducts(filteredProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, excludeProductId])

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

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = cardWidth + 16 // card width + gap
      const scrollAmount2 = direction === "left" ? -scrollAmount : scrollAmount
      carouselRef.current.scrollBy({ left: scrollAmount2, behavior: "smooth" })
    }
  }

  const goToSlide = (slideIndex: number) => {
    if (carouselRef.current) {
      const scrollAmount = cardWidth + 16 // card width + gap
      const scrollPosition = slideIndex * scrollAmount
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  // REMOVED - No longer needed since we removed slide indicators

  // Enhanced autoplay with dynamic card width
  useEffect(() => {
    if (!carouselRef.current) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      
      const scrollAmount = cardWidth + 16 // card width + gap
      
      // If at end, scroll back to start
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [isHovered, products, cardWidth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading products">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600" role="alert" aria-live="polite">
        Error: {error}
      </div>
    )
  }

  // Ensure products is a valid array
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center text-gray-600" role="status">
        No products found
      </div>
    )
  }

  const categoryLabel = category && typeof category === 'string' ? category.replace('-', ' ') : 'related'

  return (
    <div className="relative" role="region" aria-label={`${categoryLabel} products carousel`}>
      {/* Enhanced Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px] bg-white/95 backdrop-blur-sm border border-gray-200/50"
          aria-label={`Scroll ${categoryLabel} left`}
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px] bg-white/95 backdrop-blur-sm border border-gray-200/50"
          aria-label={`Scroll ${categoryLabel} right`}
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Enhanced Responsive Carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar"
        style={{
          gap: '16px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          pointerEvents: 'auto',
          scrollPadding: '0px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-none"
            style={{ 
              width: `${cardWidth}px`,
              minWidth: `${cardWidth}px`,
              maxWidth: `${cardWidth}px`,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              flexShrink: 0,
              flexGrow: 0
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* REMOVED SLIDER DOTS - No more dots at the bottom */}
    </div>
  )
}
