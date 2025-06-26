"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Truck, ShieldCheck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCarousel from "@/components/product-carousel"
import AddToCartButton from "@/components/add-to-cart-button"
import WhatsAppOrderButton from "@/components/whatsapp-order-button"
import { useToast } from "@/lib/hooks/use-toast"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { productsApi, getImageUrl } from "@/app/lib/api/products"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const resolvedParams = use(params)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsApi.getById(Number(resolvedParams.id))
        setProduct(data)
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
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
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        brand: product.brand,
      })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center text-sm text-gray-500">
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
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="relative h-[400px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(product.images?.[0]?.image_url)}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images?.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-md overflow-hidden border cursor-pointer hover:border-green-600"
                  >
                    <Image
                      src={getImageUrl(image.image_url)}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <Link
                  href={`/products?brand=${product.brand?.toLowerCase()}`}
                  className="text-sm text-green-600 hover:underline"
                >
                  {product.brand}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">KES {product.price?.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    KES {product.originalPrice?.toLocaleString()}
                  </span>
                )}
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center border rounded-md mr-4">
                    <button 
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button 
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    className={`w-full flex items-center justify-center gap-2 ${isInWishlist(product.id) ? "text-red-500" : ""}`}
                    onClick={handleWishlistClick}
                  >
                    <Heart className="h-4 w-4" />
                    {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <AddToCartButton product={product} quantity={quantity} />
                  <WhatsAppOrderButton product={product} quantity={quantity} />
                </div>
              </div>

              {/* SKU and Category */}
              <div className="text-sm text-gray-600 mb-6">
                <p>
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
                <p>
                  <span className="font-medium">Category:</span> {product.category}
                </p>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Free Delivery</p>
                    <p className="text-sm text-gray-600">For orders above KES 5,000</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">2-Year Warranty</p>
                    <p className="text-sm text-gray-600">Manufacturer warranty</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <p className="font-medium text-gray-800 mb-2">We Accept</p>
                <div className="flex space-x-3">
                  <div className="bg-gray-100 p-1 rounded">
                    <Image src="/placeholder.svg?height=30&width=50" alt="M-Pesa" width={50} height={30} />
                  </div>
                  <div className="bg-gray-100 p-1 rounded">
                    <Image src="/placeholder.svg?height=30&width=50" alt="Visa" width={50} height={30} />
                  </div>
                  <div className="bg-gray-100 p-1 rounded">
                    <Image src="/placeholder.svg?height=30&width=50" alt="Mastercard" width={50} height={30} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="p-6 border-t">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviewCount || 0})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {product.features?.map((feature: any, index: number) => (
                    <li key={index}>{feature.feature}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="specifications" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications?.map((spec: any) => (
                    <div key={spec.id} className="flex border-b pb-2">
                      <span className="font-medium text-gray-800 w-1/2">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {product.reviews?.map((review: any) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center mb-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{review.user}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">{review.title}</h4>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">Write a Review</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
            <Link
              href="/products"
              className="inline-flex items-center text-green-600 font-medium mt-2 md:mt-0 hover:text-green-700"
            >
              View more products
            </Link>
          </div>
          <ProductCarousel category="new-arrivals" />
        </div>
      </div>
    </div>
  )
}
