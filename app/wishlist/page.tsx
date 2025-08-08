"use client"

import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, ArrowLeft } from "lucide-react"
import ProductCard from "@/components/product-card"
import { Product } from "@/lib/types"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const items = wishlist?.items || []
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert wishlist items to product format
  useEffect(() => {
    const convertWishlistItemsToProducts = () => {
      if (items.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Convert wishlist items to product format using stored data
        const convertedProducts = items.map(item => ({
          id: item.product_id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          slug: item.product.slug,
          description: item.product.description || '',
          category: item.product.category || '',
          brand: item.product.brand || '',
          stock: item.product.stock || 0,
          originalPrice: item.product.originalPrice || null,
          images: item.product.images || [],
          specifications: item.product.specifications || [],
          features: item.product.features || []
        })) as Product[]
        
        setProducts(convertedProducts)
      } catch (err) {
        console.error('Error converting wishlist items:', err)
        setError('Failed to load wishlist items')
      } finally {
        setLoading(false)
      }
    }

    convertWishlistItemsToProducts()
  }, [items])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Shop</span>
              </Link>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display mb-2">
              My Wishlist
            </h1>
            {items.length > 0 && (
              <p className="text-gray-600 text-lg">
                {items.length} item{items.length !== 1 ? 's' : ''} saved for later
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-display">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Add items to your wishlist to save them for later and never miss out on your favorite products.
              </p>
              <Link href="/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 text-lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(items.length)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col h-full animate-pulse">
                <div className="relative aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-6 font-medium text-lg">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 