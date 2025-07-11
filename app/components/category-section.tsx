"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChefHat, Utensils, Zap, Package, CookingPot, Container } from "lucide-react"

interface CategoryCard {
  name: string
  description: string
  image: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
  gradientFrom: string
  gradientTo: string
}

const categories: CategoryCard[] = [
  {
    name: "Cookware",
    description: "Pots, pans, and cooking essentials",
    image: "/images/kitchenware1.jpeg",
    href: "/products?categories[]=cookware",
    icon: CookingPot,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-700",
    gradientFrom: "from-amber-100",
    gradientTo: "to-orange-100"
  },
  {
    name: "Utensils",
    description: "Essential kitchen tools and utensils",
    image: "/images/homeessentials1.jpeg",
    href: "/products?categories[]=utensils",
    icon: Utensils,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-700",
    gradientFrom: "from-indigo-100",
    gradientTo: "to-purple-100"
  },
  {
    name: "Appliances",
    description: "Modern kitchen appliances and gadgets",
    image: "/images/appliances1.jpeg",
    href: "/products?categories[]=appliances",
    icon: Zap,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-700",
    gradientFrom: "from-emerald-100",
    gradientTo: "to-green-100"
  },
  {
    name: "Storage",
    description: "Food storage containers and organizers",
    image: "/images/homeessentials2.jpeg",
    href: "/products?categories[]=storage",
    icon: Container,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-700",
    gradientFrom: "from-purple-100",
    gradientTo: "to-pink-100"
  }
]

export default function CategorySection() {
  return (
    <section className="section-padding" style={{background: 'linear-gradient(135deg, #94a3b8, #64748b, #475569)'}}>
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl shadow-lg border border-slate-200/50">
              <Package className="h-8 w-8 text-slate-600 drop-shadow-sm" />
            </div>
          </div>
          <h2 className="text-responsive-3xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-responsive-lg text-slate-200 max-w-2xl mx-auto">
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
                <div className="card-interactive h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl">
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
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20`}>
                        <Icon className={`h-6 w-6 ${category.iconColor} drop-shadow-sm`} />
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
            className="btn-outline inline-flex items-center text-responsive-base px-10 py-5 shadow-lg hover:shadow-xl"
          >
            View All Categories
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
} 