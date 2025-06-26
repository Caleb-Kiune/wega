import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductShowcaseProps {
  title: string
  variant?: "green" | "orange"
}

export default function ProductShowcase({ title, variant = "green" }: ProductShowcaseProps) {
  // Mock product data
  const products = [
    {
      id: 1,
      name: "Premium Non-Stick Frying Pan",
      price: 2499,
      rating: 4.8,
      reviewCount: 124,
      image: "/placeholder.svg?height=400&width=400",
      isNew: true,
      isSale: false,
    },
    {
      id: 2,
      name: "Stainless Steel Cooking Pot Set",
      price: 5999,
      originalPrice: 7499,
      rating: 4.9,
      reviewCount: 86,
      image: "/placeholder.svg?height=400&width=400",
      isNew: false,
      isSale: true,
    },
    {
      id: 3,
      name: "Electric Coffee Maker",
      price: 3499,
      rating: 4.7,
      reviewCount: 52,
      image: "/placeholder.svg?height=400&width=400",
      isNew: false,
      isSale: false,
    },
    {
      id: 4,
      name: "Kitchen Utensil Set",
      price: 1899,
      originalPrice: 2499,
      rating: 4.6,
      reviewCount: 38,
      image: "/placeholder.svg?height=400&width=400",
      isNew: true,
      isSale: true,
    },
  ]

  const badgeColor = variant === "green" ? "bg-green-600" : "bg-orange-500"
  const buttonColor = variant === "green" ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <Link
            href="/products"
            className={`text-${variant === "green" ? "green" : "orange"}-600 font-medium hover:underline`}
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-64 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                </Link>

                {/* Product badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isNew && <Badge className={badgeColor}>New</Badge>}
                  {product.isSale && <Badge className="bg-red-500">Sale</Badge>}
                </div>

                {/* Wishlist button */}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center mb-3">
                  <span className="text-lg font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      KES {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to cart button */}
                <Button className={`w-full ${buttonColor} text-white flex items-center justify-center gap-2`}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
