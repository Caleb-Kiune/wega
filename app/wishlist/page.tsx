"use client"

import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import ProductCard from "@/components/product-card"
import { Product } from "@/lib/types"
import Link from "next/link"
import { useState, useEffect } from "react"
import { productsApi } from "@/lib/products"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch full product data for wishlist items
  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Get product IDs from wishlist items
        const productIds = items.map(item => parseInt(item.id))
        
        // Fetch full product data for each wishlist item
        const productPromises = productIds.map(async (id) => {
          try {
            return await productsApi.getById(id)
          } catch (err) {
            console.error(`Failed to fetch product ${id}:`, err)
            return null
          }
        })

        const fetchedProducts = await Promise.all(productPromises)
        const validProducts = fetchedProducts.filter((product): product is Product => product !== null)
        
        setProducts(validProducts)
      } catch (err) {
        console.error('Error fetching wishlist products:', err)
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [items])

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Wishlist</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto min-h-[44px] text-base"
          >
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Heart className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <h2 className="mt-4 text-base sm:text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">Add items to your wishlist to save them for later.</p>
          <Link href="/products">
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-base">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {[...Array(items.length)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
              <div className="relative aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 min-h-[44px] font-medium shadow-lg hover:shadow-xl"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} onDelete={() => removeItem(String(product.id))} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 