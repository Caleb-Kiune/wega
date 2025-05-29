"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import ProductCard from "@/components/product-card"
import { productsApi } from "../app/lib/api/products"
import ProductsLoading from "@/components/products-loading"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to the server. Please make sure the backend is running.'
    }
    if (err.response.status === 404) {
      return 'The requested resource was not found.'
    }
    if (err.response.status >= 500) {
      return 'Server error. Please try again later.'
    }
    return err.message || 'Failed to load products. Please try again later.'
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productsApi.getAll({
        limit: 4,
        sort: 'featured'
      })
      setProducts(response.products)
    } catch (err) {
      console.error('Error fetching featured products:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <ProductsLoading />
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={fetchProducts} 
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Retry
      </button>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
