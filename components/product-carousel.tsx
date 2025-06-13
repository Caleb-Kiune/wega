"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { productsApi, Product, ProductsParams } from "@/app/lib/api/products"

interface ProductCarouselProps {
  category: "new-arrivals" | "special-offers"
}

export default function ProductCarousel({ category }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching products for category:', category)
        
        // Set filter parameters based on category
        const filterParams: ProductsParams = {
          is_new: category === 'new-arrivals',
          is_sale: category === 'special-offers',
          limit: 10 // Limit to 10 products for the carousel
        }
        
        const response = await productsApi.getAll(filterParams)
        
        // Log the full response
        console.log('API Response:', {
          total: response.total,
          products: response.products.map(p => ({
            id: p.id,
            name: p.name,
            is_new: p.is_new,
            is_sale: p.is_sale
          }))
        })
        
        // Validate that products match the category
        const invalidProducts = response.products.filter(product => {
          if (category === 'new-arrivals' && !product.is_new) return true
          if (category === 'special-offers' && !product.is_sale) return true
          return false
        })
        
        if (invalidProducts.length > 0) {
          console.error('Invalid products found:', invalidProducts.map(p => ({
            id: p.id,
            name: p.name,
            is_new: p.is_new,
            is_sale: p.is_sale
          })))
          setError('Error: Invalid products found in response')
          return
        }
        
        setProducts(response.products)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

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
      <div className="text-center text-red-600">
        Error: {error}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No products found
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
