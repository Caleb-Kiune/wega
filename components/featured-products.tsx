"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import ProductCard from "@/components/product-card"

// Mock featured products data
const products = [
  {
    id: 1,
    name: "Premium Non-Stick Frying Pan",
    price: 2499,
    image: "/images/kitchenware1.jpeg",
    isNew: true,
    isSale: false,
    category: "Cookware",
  },
  {
    id: 2,
    name: "Stainless Steel Cooking Pot Set",
    price: 5999,
    originalPrice: 7499,
    image: "/images/appliances1.jpeg",
    isNew: false,
    isSale: true,
    category: "Cookware",
  },
  {
    id: 3,
    name: "Electric Coffee Maker",
    price: 3499,
    image: "/images/appliances2.jpeg",
    isNew: false,
    isSale: false,
    category: "Appliances",
  },
  {
    id: 4,
    name: "Kitchen Utensil Set",
    price: 1899,
    originalPrice: 2499,
    image: "/images/tableware1.jpeg",
    isNew: true,
    isSale: true,
    category: "Utensils",
  },
]

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
