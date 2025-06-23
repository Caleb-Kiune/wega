import Link from "next/link"
import { ArrowRight } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import TestimonialSection from "@/components/testimonial-section"
import ProductCarousel from "@/components/product-carousel"
import HeroSection from "@/components/hero-section"
import TrustSignals from "@/components/trust-signals"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Signals & Payment Methods */}
      <TrustSignals />

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular kitchenware items</p>
            </div>
            <Link
              href="/products?is_featured=true"
              className="inline-flex items-center text-green-600 font-medium mt-4 md:mt-0 hover:text-green-700"
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">New Arrivals</h2>
              <p className="text-gray-600">Check out our latest kitchenware additions</p>
            </div>
            <Link
              href="/products?is_new=true"
              className="inline-flex items-center text-green-600 font-medium mt-4 md:mt-0 hover:text-green-700"
            >
              View all new arrivals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <ProductCarousel category="new-arrivals" />
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Special Offers</h2>
              <p className="text-gray-600">Limited time deals on premium kitchenware</p>
            </div>
            <Link
              href="/products?is_sale=true"
              className="inline-flex items-center text-green-600 font-medium mt-4 md:mt-0 hover:text-green-700"
            >
              View all offers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <ProductCarousel category="special-offers" />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />
    </main>
  )
}
