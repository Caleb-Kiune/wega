import Link from "next/link"
import Image from "next/image"

export default function CategoryShowcase() {
  const categories = [
    {
      id: 1,
      name: "Cookware",
      image: "/placeholder.svg?height=400&width=400",
      href: "/products?category=cookware",
      description: "Pots, pans, and cooking essentials",
    },
    {
      id: 2,
      name: "Utensils",
      image: "/placeholder.svg?height=400&width=400",
      href: "/products?category=utensils",
      description: "Kitchen tools and gadgets",
    },
    {
      id: 3,
      name: "Appliances",
      image: "/placeholder.svg?height=400&width=400",
      href: "/products?category=appliances",
      description: "Modern kitchen appliances",
    },
    {
      id: 4,
      name: "Home Essentials",
      image: "/placeholder.svg?height=400&width=400",
      href: "/products?category=home-essentials",
      description: "Everyday home necessities",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of premium kitchenware products designed to make your cooking experience better.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md category-card-hover">
                <div className="relative h-64 w-full">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
