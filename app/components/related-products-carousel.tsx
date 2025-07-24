"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi } from "@/lib/products"
import { Product } from "@/shared/types"
import { useCarouselScroll } from "@/lib/hooks/use-carousel-scroll"

interface RelatedProductsCarouselProps {
  category?: string;
  excludeProductId?: number;
}

export default function RelatedProductsCarousel({ category, excludeProductId }: RelatedProductsCarouselProps) {
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

  const { isScrolling } = useCarouselScroll(carouselRef);

  // Responsive card width logic (same as special offers)
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 280
    const width = window.innerWidth
    if (width >= 1024) {
      const containerPadding = 32
      const maxContainerWidth = 1280
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      const gap = 16
      const totalGaps = 3
      const cardWidth = (availableWidth - (totalGaps * gap)) / 4
      return Math.max(cardWidth, 250)
    }
    if (width >= 768) {
      const containerPadding = 24
      const maxContainerWidth = 1280
      const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
      const gap = 16
      const totalGaps = 2
      const cardWidth = (availableWidth - (totalGaps * gap)) / 3
      return Math.max(cardWidth, 220)
    }
    const containerPadding = 16
    const maxContainerWidth = 1280
    const availableWidth = Math.min(width - (containerPadding * 2), maxContainerWidth - (containerPadding * 2))
    const gap = 16
    const totalGaps = 1
    const cardWidth = (availableWidth - (totalGaps * gap)) / 2
    return Math.max(cardWidth, 180)
  }

  const getContainerWidth = () => {
    if (typeof window === 'undefined') return '100%'
    const width = window.innerWidth
    if (width >= 1024) {
      const cardWidth = getCardWidth()
      const gap = 16
      const totalGaps = 3
      const containerWidth = (cardWidth * 4) + (totalGaps * gap)
      const maxAvailableWidth = width - 64
      return `${Math.min(containerWidth, maxAvailableWidth)}px`
    }
    if (width >= 768) {
      const cardWidth = getCardWidth()
      const gap = 16
      const totalGaps = 2
      const containerWidth = (cardWidth * 3) + (totalGaps * gap)
      const maxAvailableWidth = width - 48
      return `${Math.min(containerWidth, maxAvailableWidth)}px`
    }
    const cardWidth = getCardWidth()
    const gap = 16
    const totalGaps = 1
    const containerWidth = (cardWidth * 2) + (totalGaps * gap)
    const maxAvailableWidth = width - 32
    return `${Math.min(containerWidth, maxAvailableWidth)}px`
  }

  const [cardWidth, setCardWidth] = useState(getCardWidth())
  const [containerWidth, setContainerWidth] = useState(getContainerWidth())

  useEffect(() => {
    const updateDimensions = () => {
      setCardWidth(getCardWidth())
      setContainerWidth(getContainerWidth())
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = { limit: 10 }
      if (category) params.categories = [category]
      const response = await productsApi.getAll(params)
      let filtered = response.products
      if (excludeProductId) {
        filtered = filtered.filter((p: Product) => p.id !== excludeProductId)
      }
      setProducts(filtered)
    } catch (err) {
      setError('Failed to load related products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [category, excludeProductId])

  // Infinite scroll logic
  const getInfiniteProducts = () => {
    if (products.length === 0) return []
    return [...products, ...products, ...products]
  }
  const infiniteProducts = getInfiniteProducts()

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      const scrollAmount = cardWidth + 16
      const newCurrentSlide = Math.round(scrollLeft / scrollAmount)
      setCurrentSlide(newCurrentSlide)
    }
  }
  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons)
      checkScrollButtons()
      return () => carousel.removeEventListener("scroll", checkScrollButtons)
    }
  }, [products, cardWidth])

  const smoothScroll = (targetScrollLeft: number) => {
    if (!carouselRef.current || isTransitioning) return
    setIsTransitioning(true)
    carouselRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const handleScrollReset = () => {
    if (!carouselRef.current || isTransitioning) return
    const carousel = carouselRef.current
    const { scrollLeft } = carousel
    const scrollAmount = cardWidth + 16
    const originalSetWidth = products.length * scrollAmount
    if (scrollLeft >= originalSetWidth) {
      setIsTransitioning(true)
      const newScrollLeft = scrollLeft - originalSetWidth
      carousel.scrollTo({ left: newScrollLeft, behavior: "auto" })
      setTimeout(() => setIsTransitioning(false), 100)
    } else if (scrollLeft < 0) {
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
      const scrollAmount = cardWidth + 16
      const currentScrollLeft = carouselRef.current.scrollLeft
      const targetScrollLeft = direction === "left"
        ? currentScrollLeft - scrollAmount
        : currentScrollLeft + scrollAmount
      const adjustedTargetScrollLeft = Math.round(targetScrollLeft / scrollAmount) * scrollAmount
      smoothScroll(adjustedTargetScrollLeft)
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 5000)
    }
  }

  useEffect(() => {
    if (!carouselRef.current || !isAutoPlaying || isHovered || isTransitioning) return;
    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const scrollAmount = cardWidth + 16;
      const currentScrollLeft = carousel.scrollLeft
      const targetScrollLeft = currentScrollLeft + scrollAmount
      const adjustedTargetScrollLeft = Math.round(targetScrollLeft / scrollAmount) * scrollAmount
      smoothScroll(adjustedTargetScrollLeft)
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, products, isTransitioning, cardWidth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading related products">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchProducts} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 min-h-[44px] min-w-[44px]" aria-label="Retry loading related products">Retry</button>
      </div>
    )
  }
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-gray-500">No related products found</p>
      </div>
    )
  }
  return (
    <div className="relative" role="region" aria-label="Related products carousel" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ease-out ${canScrollLeft ? 'pointer-events-auto opacity-60 hover:opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label="Scroll related products left"
        disabled={!canScrollLeft || isTransitioning}
      >
        <div className="special-offers-nav-gradient left" />
        <div className="special-offers-nav-button ml-2">
          <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
        </div>
      </button>
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ease-out ${canScrollRight ? 'pointer-events-auto opacity-60 hover:opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label="Scroll related products right"
        disabled={!canScrollRight || isTransitioning}
      >
        <div className="special-offers-nav-gradient right" />
        <div className="special-offers-nav-button mr-2">
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
        </div>
      </button>
      <div className="relative overflow-hidden mx-auto" style={{ width: containerWidth }}>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 will-change-transform hide-scrollbar special-offers-carousel"
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
              className="flex-none special-offers-item"
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