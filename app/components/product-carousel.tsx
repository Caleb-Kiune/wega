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
  const [isHovered, setIsHovered] = useState(false);

  // Use shared carousel scroll handler
  const { isScrolling } = useCarouselScroll(carouselRef);

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
      const slideWidth = 320 + 16 // card width + gap
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
      const slideWidth = 320 + 16 // card width + gap
      const scrollPosition = slideIndex * slideWidth
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  // Calculate total slides based on visible cards
  const getTotalSlides = () => {
    try {
      // Ensure products is a valid array
      if (!Array.isArray(products) || products.length === 0) {
        return 1
      }

      if (carouselRef.current) {
        const { clientWidth } = carouselRef.current
        const cardWidth = 320 + 16 // card width + gap
        const cardsPerView = Math.max(1, Math.floor(clientWidth / cardWidth))
        const calculatedSlides = Math.ceil(products.length / cardsPerView)
        return Math.max(1, Math.min(calculatedSlides, 10)) // Ensure it's between 1 and 10
      }
      // Fallback calculation
      const fallbackSlides = Math.ceil(products.length / 3)
      return Math.max(1, Math.min(fallbackSlides, 10)) // Ensure it's between 1 and 10
    } catch (error) {
      console.error('Error calculating total slides:', error)
      return 1 // Safe fallback
    }
  }

  // Autoplay: scroll right-to-left every 3 seconds, pause on hover
  useEffect(() => {
    if (!carouselRef.current) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const cardWidth = 320 + 16; // card width + gap
      // If at end, scroll back to start
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [isHovered, products]);

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

  // Calculate total slides with additional safety checks
  let totalSlides = 1 // Default safe value
  try {
    totalSlides = getTotalSlides()
    // Ensure totalSlides is a valid positive integer
    totalSlides = Math.max(1, Math.min(Math.floor(totalSlides), 10))
    console.log('Total slides calculated:', totalSlides, 'Products count:', products.length)
  } catch (error) {
    console.error('Error in totalSlides calculation:', error)
    totalSlides = 1 // Safe fallback
  }

  const categoryLabel = category && typeof category === 'string' ? category.replace('-', ' ') : 'related'

  return (
    <div className="relative" role="region" aria-label={`${categoryLabel} products carousel`}>
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px] bg-transparent"
          aria-label={`Scroll ${categoryLabel} left`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px] bg-transparent"
          aria-label={`Scroll ${categoryLabel} right`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Responsive Carousel: visible on all screen sizes */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar max-w-[1280px] mx-auto"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          pointerEvents: 'auto'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-none w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px]"
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
    </div>
  )
}
