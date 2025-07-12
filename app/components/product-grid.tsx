"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useInView } from "react-intersection-observer"
import ProductCard from "@/components/product-card"
import { productsApi } from "@/lib/products"
import { Product, ProductsParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface ProductGridProps {
  category: "featured" | "new-arrivals" | "special-offers"
  limit?: number
  mobileLimit?: number
  showPagination?: boolean
  enableInfiniteScroll?: boolean
}

// Skeleton component for loading states
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-xl h-48 sm:h-52 lg:h-56 mb-3"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
)

export default function ProductGrid({ 
  category, 
  limit = 4, 
  mobileLimit = 2,
  showPagination = false,
  enableInfiniteScroll = false
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  const fetchProducts = useCallback(async (page: number = 1, append: boolean = false) => {
      try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
        setError(null)
      
      console.log('Fetching products for category:', category, 'page:', page)
        
        // Set filter parameters based on category
        const filterParams: ProductsParams = {
          is_featured: category === 'featured',
          is_new: category === 'new-arrivals',
          is_sale: category === 'special-offers',
        limit: limit,
        page: page
        }
        
        const response = await productsApi.getAll(filterParams)
        
        console.log('API Response:', {
          total: response.total,
        currentPage: response.current_page,
        totalPages: response.pages,
        products: response.products.length
      })
      
      if (append) {
        setProducts(prev => [...prev, ...response.products])
      } else {
        setProducts(response.products)
      }
      
      setCurrentPage(response.current_page)
      setTotalPages(response.pages)
      setHasMore(response.current_page < response.pages)
      
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
      } finally {
        setLoading(false)
      setLoadingMore(false)
    }
  }, [category, limit])

  // Initial load
  useEffect(() => {
    fetchProducts(1, false)
  }, [fetchProducts])

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !loadingMore && enableInfiniteScroll) {
      fetchProducts(currentPage + 1, true)
    }
  }, [inView, hasMore, loadingMore, enableInfiniteScroll, currentPage, fetchProducts])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(page, false)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className={`${index >= mobileLimit ? 'hidden sm:block' : ''}`}>
            <ProductSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert" aria-live="polite">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <Button 
            onClick={() => fetchProducts(1, false)} 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 min-h-[44px] font-medium shadow-lg hover:shadow-xl"
          aria-label="Retry loading products"
        >
          Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12" role="status">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-gray-500 font-medium">No products available in this category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.slice(0, limit).map((product, index) => (
          <div 
            key={product.id} 
            className={`${index >= mobileLimit ? 'hidden sm:block' : ''} transition-all duration-300 hover:transform hover:scale-105`}
          >
          <ProductCard product={product} />
        </div>
      ))}
      </div>

      {/* Loading more indicator for infinite scroll */}
      {enableInfiniteScroll && loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {enableInfiniteScroll && hasMore && !loadingMore && (
        <div ref={loadMoreRef} className="h-10" />
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="min-h-[40px] min-w-[40px] p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              const isActive = page === currentPage
              
              return (
                <Button
                  key={page}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`min-h-[40px] min-w-[40px] p-2 ${
                    isActive 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="min-h-[40px] min-w-[40px] p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Page info */}
      {showPagination && totalPages > 1 && (
        <div className="text-center text-sm text-gray-600 py-2">
          Page {currentPage} of {totalPages} • {products.length} products
        </div>
      )}
    </div>
  )
} 