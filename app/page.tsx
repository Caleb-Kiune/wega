import Link from "next/link"
import { ArrowRight, Sparkles, Star, TrendingUp, Truck, Shield, DollarSign, Heart, Award, Clock, Users } from "lucide-react"
import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">Featured Products</h2>
                <p className="text-responsive-sm text-gray-600">Discover our most popular kitchenware items</p>
              </div>
            </div>
            <Link
              href="/products?is_featured=true"
              className="inline-flex items-center text-green-600 font-semibold mt-4 md:mt-0 hover:text-green-700 p-3 -m-3 rounded-2xl min-h-[44px] min-w-[44px] transition-all duration-200 hover:bg-green-50 group"
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <ProductGrid category="featured" limit={4} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-gray-50">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">New Arrivals</h2>
                <p className="text-responsive-sm text-gray-600">Fresh additions to our collection</p>
              </div>
            </div>
            <Link
              href="/products?is_new=true"
              className="inline-flex items-center text-green-600 font-semibold mt-4 md:mt-0 hover:text-green-700 p-3 -m-3 rounded-2xl min-h-[44px] min-w-[44px] transition-all duration-200 hover:bg-green-50 group"
            >
              View all new arrivals
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <ProductGrid category="new" limit={4} />
        </div>
      </section>

      {/* Special Offers */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">Special Offers</h2>
                <p className="text-responsive-sm text-gray-600">Limited time deals and discounts</p>
              </div>
            </div>
            <Link
              href="/products?is_sale=true"
              className="inline-flex items-center text-green-600 font-semibold mt-4 md:mt-0 hover:text-green-700 p-3 -m-3 rounded-2xl min-h-[44px] min-w-[44px] transition-all duration-200 hover:bg-green-50 group"
            >
              View all offers
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          <ProductGrid category="sale" limit={4} />
        </div>
      </section>

      {/* Why Choose WEGA Kitchenware */}
      <section className="section-padding-lg bg-gradient-to-br from-gray-50 to-white">
        <div className="container-responsive">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-responsive-3xl font-bold text-gray-800 mb-4">
              Why Choose WEGA Kitchenware
            </h2>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best kitchenware experience with quality products, 
              excellent service, and unbeatable value for Kenyan households.
            </p>
          </div>

          {/* Benefit Cards Grid */}
          <div className="grid-responsive">
            {/* Fast Delivery */}
            <div className="card-interactive p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors duration-300">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Delivery</h3>
              <p className="text-gray-600 text-responsive-sm">
                Quick and reliable delivery across Kenya with real-time tracking
              </p>
            </div>

            {/* Premium Quality */}
            <div className="card-interactive p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600 text-responsive-sm">
                High-quality materials and craftsmanship for lasting performance
              </p>
            </div>

            {/* Affordable Prices */}
            <div className="card-interactive p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition-colors duration-300">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Affordable Prices</h3>
              <p className="text-gray-600 text-responsive-sm">
                Competitive pricing without compromising on quality or service
              </p>
            </div>

            {/* Locally Trusted */}
            <div className="card-interactive p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors duration-300">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Locally Trusted</h3>
              <p className="text-gray-600 text-responsive-sm">
                Trusted by thousands of Kenyan families for their kitchen needs
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center text-responsive-base"
            >
              Explore Our Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
