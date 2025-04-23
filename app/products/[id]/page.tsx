import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Star, Truck, ShieldCheck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCarousel from "@/components/product-carousel"
import AddToCartButton from "@/components/add-to-cart-button"

// Update the products array to use the real images
const products = [
  {
    id: "1",
    name: "Premium Non-Stick Frying Pan",
    price: 2499,
    rating: 4.8,
    reviewCount: 124,
    description:
      "This premium non-stick frying pan is perfect for everyday cooking. Made with high-quality materials, it ensures even heat distribution and long-lasting performance. The non-stick coating makes cooking and cleaning a breeze.",
    features: [
      "Premium non-stick coating",
      "Even heat distribution",
      "Ergonomic handle for comfortable grip",
      "Suitable for all stovetops including induction",
      "Dishwasher safe",
      "Heat resistant up to 240°C",
    ],
    specifications: {
      Material: "Aluminum with non-stick coating",
      Diameter: "28 cm",
      Weight: "1.2 kg",
      "Handle Material": "Bakelite",
      "Dishwasher Safe": "Yes",
      "Induction Compatible": "Yes",
      Warranty: "2 years",
    },
    images: [
      "/images/kitchenware1.jpeg",
      "/images/kitchenware1.jpeg",
      "/images/kitchenware1.jpeg",
      "/images/kitchenware1.jpeg",
    ],
    stock: 15,
    category: "Cookware",
    brand: "WEGA",
    sku: "WG-FP-28-BLK",
  },
  {
    id: "2",
    name: "Stainless Steel Cooking Pot Set",
    price: 5999,
    originalPrice: 7499,
    rating: 4.9,
    reviewCount: 86,
    description:
      "This premium stainless steel cooking pot set includes everything you need for your kitchen. The set features durable construction, even heat distribution, and elegant design that will last for years.",
    features: [
      "Premium stainless steel construction",
      "Set includes 3 pots with lids (2L, 4L, 6L)",
      "Even heat distribution",
      "Suitable for all stovetops including induction",
      "Dishwasher safe",
      "Oven safe up to 260°C",
    ],
    specifications: {
      Material: "18/10 Stainless Steel",
      "Set Includes": "2L, 4L, and 6L pots with lids",
      Weight: "4.5 kg (total)",
      "Handle Material": "Stainless Steel",
      "Dishwasher Safe": "Yes",
      "Induction Compatible": "Yes",
      Warranty: "5 years",
    },
    images: [
      "/images/appliances1.jpeg",
      "/images/appliances1.jpeg",
      "/images/appliances1.jpeg",
      "/images/appliances1.jpeg",
    ],
    stock: 8,
    category: "Cookware",
    brand: "KitchenAid",
    sku: "KA-SS-POT-SET",
  },
]

// Mock reviews
const reviews = [
  {
    id: 1,
    user: "Jane Doe",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    date: "2023-10-15",
    title: "Excellent quality pan",
    comment:
      "I love this frying pan! The non-stick coating works perfectly, and it heats up evenly. Cleaning is super easy, and the handle stays cool while cooking. Highly recommend!",
  },
  {
    id: 2,
    user: "John Smith",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    date: "2023-09-28",
    title: "Good value for money",
    comment:
      "Great pan for the price. The non-stick surface works well, and it feels sturdy. The only reason I'm giving 4 stars instead of 5 is that the handle gets a bit warm during extended cooking sessions.",
  },
  {
    id: 3,
    user: "Mary Johnson",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    date: "2023-09-10",
    title: "Perfect size and quality",
    comment:
      "This pan is the perfect size for my family's needs. The quality is excellent, and food doesn't stick at all. I've been using it daily for a month now, and it still looks brand new. Very happy with my purchase!",
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id) || products[0]

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
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-green-600">
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
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-md overflow-hidden border cursor-pointer hover:border-green-600"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
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
                  href={`/products?brand=${product.brand.toLowerCase()}`}
                  className="text-sm text-green-600 hover:underline"
                >
                  {product.brand}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    KES {product.originalPrice.toLocaleString()}
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
                    <button className="px-3 py-2 text-gray-600 hover:text-gray-800">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-x">1</span>
                    <button className="px-3 py-2 text-gray-600 hover:text-gray-800">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <AddToCartButton product={product} />
                </div>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
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
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="specifications" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-2">
                      <span className="font-medium text-gray-800 w-1/2">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
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
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
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
