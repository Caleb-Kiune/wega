"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { productsApi, Product, ProductsParams } from "@/app/lib/api/products"

interface ProductGridProps {
  category: "featured" | "new-arrivals" | "special-offers"
  limit?: number
}

export default function ProductGrid({ category, limit = 4 }: ProductGridProps) {
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
          is_featured: category === 'featured',
          is_new: category === 'new-arrivals',
          is_sale: category === 'special-offers',
          limit: limit
        }
        
        const response = await productsApi.getAll(filterParams)
        
        // Log the full response
        console.log('API Response:', {
          total: response.total,
          products: response.products.map((p: Product) => ({
            id: p.id,
            name: p.name,
            is_featured: p.is_featured,
            is_new: p.is_new,
            is_sale: p.is_sale
          }))
        })
        
        setProducts(response.products)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading products">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 min-h-[44px] min-w-[44px]"
          aria-label="Retry loading products"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-gray-500">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 