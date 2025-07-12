"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChefHat, Utensils, Zap, Package } from "lucide-react"

interface CategoryCard {
  name: string
  description: string
  image: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
}

const categories: CategoryCard[] = [
  {
    name: "Cookware",
    description: "Pots, pans, and cooking essentials",
    image: "/images/kitchenware1.jpeg",
    href: "/products?categories[]=cookware",
    icon: ChefHat,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    name: "Utensils",
    description: "Essential kitchen tools and utensils",
    image: "/images/homeessentials1.jpeg",
    href: "/products?categories[]=utensils",
    icon: Utensils,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    name: "Appliances",
    description: "Modern kitchen appliances and gadgets",
    image: "/images/appliances1.jpeg",
    href: "/products?categories[]=appliances",
    icon: Zap,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    name: "Storage",
    description: "Food storage containers and organizers",
    image: "/images/homeessentials2.jpeg",
    href: "/products?categories[]=storage",
    icon: Package,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  }
]

export default function CategorySection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-responsive-3xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive collection of kitchenware organized by category. 
            Find exactly what you need for your kitchen.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group block"
                aria-label={`Browse ${category.name} category`}
              >
                <div className="card-interactive h-full overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.name} category`}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`p-3 rounded-2xl ${category.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${category.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors duration-200">
                      <span>Shop {category.name}</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn-outline inline-flex items-center text-responsive-base"
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
} 