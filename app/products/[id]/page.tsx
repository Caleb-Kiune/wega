"use client"

import { useState, useEffect, use } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Truck, ShieldCheck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RelatedProductsCarousel from "@/components/related-products-carousel"
import AddToCartButton from "@/components/add-to-cart-button"
import WhatsAppOrderButton from "@/components/whatsapp-order-button"
import { useToast } from "@/lib/hooks/use-toast"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { productsApi, getImageUrl } from "@/lib/products"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { toast } = useToast()
  const resolvedParams = use(params)
  const { addItem, removeItem, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsApi.getById(Number(resolvedParams.id))
        setProduct(data)
        
        // Find primary image index
        if (data.images && data.images.length > 0) {
          const primaryIndex = data.images.findIndex((img: any) => img.is_primary)
          setSelectedImageIndex(primaryIndex >= 0 ? primaryIndex : 0)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.id, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            Return to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1
      return Math.max(1, Math.min(newQuantity, product.stock))
    })
  }

  const handleWishlistClick = () => {
    if (isInWishlist(product.id.toString())) {
      removeItem(product.id.toString())
    } else {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.image_url || '',
        category: product.category,
      })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-3 sm:py-4 border-b">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-green-600">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category?.toLowerCase()}`} className="hover:text-green-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
            {/* Product Images */}
            <div className="flex flex-col items-center h-full w-full">
              {/* Main Large Image - Reduced height for better proportions */}
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-4 border border-gray-200">
                <Image
                  src={getImageUrl(product.images?.[selectedImageIndex]?.image_url)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-row gap-2 w-full max-w-lg justify-center">
                  {product.images.map((image: any, index: number) => (
                    <button
                      key={`thumbnail-${index}`}
                      type="button"
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all duration-200 focus:outline-none ${
                        selectedImageIndex === index
                          ? 'border-green-600 ring-2 ring-green-600/20' 
                          : 'border-gray-200 hover:border-green-600'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <Image
                        src={getImageUrl(image.image_url)}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info - Restructured for better alignment */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="mb-2">
                  <Link
                    href={`/products?brand=${product.brand?.toLowerCase()}`}
                    className="text-xs sm:text-sm text-green-600 hover:underline"
                  >
                    {product.brand}
                  </Link>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{product.name}</h1>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-800">KES {product.price?.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-base sm:text-lg text-gray-500 line-through">
                      KES {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>

                {/* Short Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-4 sm:mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                  </span>
                </div>

                {/* Add to Cart */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center border rounded-md mr-4">
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        onClick={() => handleQuantityChange(false)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-x min-w-[60px] text-center">{quantity}</span>
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        onClick={() => handleQuantityChange(true)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleWishlistClick}
                      className={`p-2 rounded-full border min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isInWishlist(product.id.toString())
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      }`}
                    >
                      <Heart className="h-5 w-5" fill={isInWishlist(product.id.toString()) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <AddToCartButton
                      product={product}
                      quantity={quantity}
                      className="flex-1 min-h-[44px]"
                    />
                    <WhatsAppOrderButton
                      product={product}
                      quantity={quantity}
                      className="flex-1 min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* Features - Now positioned to align with image bottom */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <Truck className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                  <span>Free delivery on orders above KES 5,000</span>
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <ShieldCheck className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                  <span>1 year warranty on all products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="p-4 sm:p-6 border-t">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="flex w-full mb-4 sm:mb-6">
                <TabsTrigger value="description" className="text-xs sm:text-sm flex-1">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="text-xs sm:text-sm flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="features" className="text-xs sm:text-sm flex-1">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <p className="text-sm sm:text-base text-gray-600">{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec: any, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span className="font-medium text-sm sm:text-base">{spec.name}</span>
                        <span className="text-gray-600 text-sm sm:text-base">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500">No specifications available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                {product.features && product.features.length > 0 ? (
                  <div className="space-y-3">
                    {product.features.map((feature: any, index: number) => (
                      <div key={index} className="flex items-start py-2 border-b">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-sm sm:text-base text-gray-600">{feature.feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500">No features available.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Related Products</h2>
          <RelatedProductsCarousel category={product.category} excludeProductId={product.id} />
        </div>
      </div>
    </div>
  )
}
