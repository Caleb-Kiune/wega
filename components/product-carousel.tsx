"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"

// Mock product data
const newArrivals = [
  {
    id: 5,
    name: "Glass Food Storage Containers (Set of 5)",
    price: 1299,
    rating: 4.5,
    reviewCount: 42,
    image: "/images/homeessentials1.jpeg",
    isNew: true,
    category: "Storage Solutions",
  },
  {
    id: 6,
    name: "Ceramic Dinner Plates (Set of 4)",
    price: 1899,
    rating: 4.7,
    reviewCount: 29,
    image: "/images/homeessentials2.jpeg",
    isNew: true,
    category: "Home Essentials",
  },
  {
    id: 7,
    name: "Professional Chef Knife",
    price: 2999,
    rating: 4.9,
    reviewCount: 67,
    image: "/images/kitchenware1.jpeg",
    isNew: true,
    category: "Utensils",
  },
  {
    id: 8,
    name: "Electric Hand Mixer",
    price: 2499,
    originalPrice: 2999,
    rating: 4.6,
    reviewCount: 31,
    image: "/images/appliances2.jpeg",
    isNew: true,
    category: "Appliances",
  },
  {
    id: 9,
    name: "Bamboo Cutting Board",
    price: 1199,
    rating: 4.4,
    reviewCount: 23,
    image: "/images/homeessentials3.jpeg",
    isNew: true,
    category: "Utensils",
  },
  {
    id: 10,
    name: "Silicone Baking Mat Set",
    price: 899,
    rating: 4.3,
    reviewCount: 19,
    image: "/images/homeessentials4.jpeg",
    isNew: true,
    category: "Cookware",
  },
]

const specialOffers = [
  {
    id: 11,
    name: "Premium Knife Set with Block",
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviewCount: 56,
    image: "/images/kitchenware1.jpeg",
    isSale: true,
    category: "Utensils",
  },
  {
    id: 12,
    name: "Cast Iron Dutch Oven",
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 78,
    image: "/images/appliances1.jpeg",
    isSale: true,
    category: "Cookware",
  },
  {
    id: 13,
    name: "Electric Kettle",
    price: 1799,
    originalPrice: 2499,
    rating: 4.7,
    reviewCount: 45,
    image: "/images/appliances2.jpeg",
    isSale: true,
    category: "Appliances",
  },
  {
    id: 14,
    name: "Stainless Steel Mixing Bowls (Set of 3)",
    price: 1499,
    originalPrice: 1999,
    rating: 4.6,
    reviewCount: 34,
    image: "/images/tableware1.jpeg",
    isSale: true,
    category: "Cookware",
  },
  {
    id: 15,
    name: "Non-Stick Baking Tray Set",
    price: 1299,
    originalPrice: 1799,
    rating: 4.5,
    reviewCount: 28,
    image: "/images/homeessentials4.jpeg",
    isSale: true,
    category: "Cookware",
  },
]

interface ProductCarouselProps {
  category: "new-arrivals" | "special-offers"
}

export default function ProductCarousel({ category }: ProductCarouselProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const products = category === "new-arrivals" ? newArrivals : specialOffers

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
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="carousel-container">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="carousel-button carousel-button-prev"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="carousel-button carousel-button-next"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Product Carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-[280px] snap-start bg-white rounded-lg overflow-hidden shadow-md product-card-hover"
          >
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-64 w-full">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </Link>

              {/* Product badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-green-600">New</Badge>}
                {product.isSale && <Badge className="bg-orange-500">Sale</Badge>}
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{product.category}</div>
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-center mb-3">
                <span className="text-xl font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    KES {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>

              {/* Add to cart button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
