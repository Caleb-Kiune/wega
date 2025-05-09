"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"

// Mock product data
const newArrivals = [
  {
    id: 5,
    name: "Glass Food Storage Containers (Set of 5)",
    price: 1299,
    image: "/images/homeessentials1.jpeg",
    isNew: true,
    category: "Storage Solutions",
  },
  {
    id: 6,
    name: "Ceramic Dinner Plates (Set of 4)",
    price: 1899,
    image: "/images/homeessentials2.jpeg",
    isNew: true,
    category: "Home Essentials",
  },
  {
    id: 7,
    name: "Professional Chef Knife",
    price: 2999,
    image: "/images/kitchenware1.jpeg",
    isNew: true,
    category: "Utensils",
  },
  {
    id: 8,
    name: "Electric Hand Mixer",
    price: 2499,
    originalPrice: 2999,
    image: "/images/appliances2.jpeg",
    isNew: true,
    category: "Appliances",
  },
  {
    id: 9,
    name: "Bamboo Cutting Board",
    price: 1199,
    image: "/images/homeessentials3.jpeg",
    isNew: true,
    category: "Utensils",
  },
  {
    id: 10,
    name: "Silicone Baking Mat Set",
    price: 899,
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
    image: "/images/kitchenware1.jpeg",
    isSale: true,
    category: "Utensils",
  },
  {
    id: 12,
    name: "Cast Iron Dutch Oven",
    price: 3499,
    originalPrice: 4999,
    image: "/images/appliances1.jpeg",
    isSale: true,
    category: "Cookware",
  },
  {
    id: 13,
    name: "Electric Kettle",
    price: 1799,
    originalPrice: 2499,
    image: "/images/appliances2.jpeg",
    isSale: true,
    category: "Appliances",
  },
  {
    id: 14,
    name: "Stainless Steel Mixing Bowls (Set of 3)",
    price: 1499,
    originalPrice: 1999,
    image: "/images/tableware1.jpeg",
    isSale: true,
    category: "Cookware",
  },
  {
    id: 15,
    name: "Non-Stick Baking Tray Set",
    price: 1299,
    originalPrice: 1799,
    image: "/images/homeessentials4.jpeg",
    isSale: true,
    category: "Cookware",
  },
]

interface ProductCarouselProps {
  category: "new-arrivals" | "special-offers"
}

export default function ProductCarousel({ category }: ProductCarouselProps) {
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
          <div key={product.id} className="flex-none w-[280px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
