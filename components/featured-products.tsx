"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi } from "@/app/lib/api/products"
import { Product } from "@/app/lib/api/products"

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export default function FeaturedProducts() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      const response = await productsApi.getAll({ sort_by: "featured" })
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="space-y-2">
          <button 
            onClick={fetchProducts} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
          {error.includes('Unable to connect to the API') && (
            <p className="text-sm text-gray-600 mt-2">
              Make sure your backend server is running at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No featured products available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Product Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
