import Link from "next/link"
import { ArrowRight, Sparkles, Star, TrendingUp, Truck, Shield, DollarSign, Heart, Award, Clock, Users, Package, ChefHat, Utensils, Zap, ShoppingBag, Gift, Crown, Star as StarIcon, Percent, Clock as ClockIcon, CheckCircle, Zap as ZapIcon, Users as UsersIcon, Star as StarIcon2 } from "lucide-react"
import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import CategorySection from "@/components/category-section"
import FeaturedProducts from "@/components/featured-products"
import NewArrivalsCarousel from "@/components/new-arrivals-carousel"
import SpecialOffersCarousel from "@/components/special-offers-carousel"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Shop by Category */}
      <CategorySection />

      {/* Featured Products */}
      <section className="section-padding" style={{background: 'linear-gradient(135deg, #bbf7d0, #86efac, #4ade80)'}}>
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border-2 border-green-300/60 relative overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-green-400/5 rounded-2xl"></div>
                {/* Icon with enhanced styling */}
                <div className="relative z-10">
                  <StarIcon className="h-8 w-8 text-green-800 drop-shadow-md" />
                </div>
              </div>
            <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">Featured Products</h2>
                <p className="text-responsive-sm text-gray-600">Discover our most popular kitchenware items</p>
              </div>
            </div>
            <Link
              href="/products?is_featured=true"
              className="inline-flex items-center bg-white/90 backdrop-blur-sm border-2 border-green-300/60 text-green-800 font-bold hover:bg-white hover:text-green-900 px-6 py-3 rounded-2xl min-h-[52px] transition-all duration-300 hover:shadow-lg hover:scale-105 group shadow-md view-all-button"
            >
              View all products
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding" style={{background: 'linear-gradient(135deg, #c7d2fe, #a5b4fc, #818cf8)'}}>
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-300/60 relative overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-indigo-400/5 rounded-2xl"></div>
                {/* Icon with enhanced styling */}
                <div className="relative z-10">
                  <ClockIcon className="h-8 w-8 text-indigo-800 drop-shadow-md" />
                </div>
              </div>
            <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">New Arrivals</h2>
                <p className="text-responsive-sm text-gray-600">Fresh additions to our collection</p>
              </div>
            </div>
            <Link
              href="/products?is_new=true"
              className="inline-flex items-center bg-white/90 backdrop-blur-sm border-2 border-indigo-300/60 text-indigo-800 font-bold hover:bg-white hover:text-indigo-900 px-6 py-3 rounded-2xl min-h-[52px] transition-all duration-300 hover:shadow-lg hover:scale-105 group shadow-md view-all-button"
            >
              View all new arrivals
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <NewArrivalsCarousel />
        </div>
      </section>

      {/* Special Offers */}
      <section className="section-padding" style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'}}>
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border-2 border-amber-300/60 relative overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-amber-400/5 rounded-2xl"></div>
                {/* Icon with enhanced styling */}
                <div className="relative z-10">
                  <Percent className="h-8 w-8 text-amber-800 drop-shadow-md" />
                </div>
              </div>
            <div>
                <h2 className="text-responsive-2xl font-bold text-gray-800 mb-2">Special Offers</h2>
                <p className="text-responsive-sm text-gray-600">Limited time deals and discounts</p>
              </div>
            </div>
            <Link
              href="/products?is_sale=true"
              className="inline-flex items-center bg-white/90 backdrop-blur-sm border-2 border-amber-300/60 text-amber-800 font-bold hover:bg-white hover:text-amber-900 px-6 py-3 rounded-2xl min-h-[52px] transition-all duration-300 hover:shadow-lg hover:scale-105 group shadow-md view-all-button"
            >
              View all offers
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <SpecialOffersCarousel />
        </div>
      </section>

      {/* Why Choose WEGA Kitchenware */}
      <section className="section-padding-lg" style={{background: 'linear-gradient(135deg, #10b981, #059669, #047857)'}}>
        <div className="container-responsive">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/80 relative overflow-hidden section-header-icon">
                {/* Background gradient overlay for extra emphasis */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-90"></div>
                {/* Icon with enhanced styling */}
                <div className="relative z-10">
                  <Award className="h-12 w-12 text-green-900 drop-shadow-lg" />
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-green-400/15 rounded-3xl blur-xl"></div>
              </div>
            </div>
            <h2 className="text-responsive-3xl font-bold text-white mb-4">
              Why Choose WEGA Kitchenware
            </h2>
            <p className="text-responsive-lg text-green-100 max-w-3xl mx-auto">
              We're committed to providing the best kitchenware experience with quality products, 
              excellent service, and unbeatable value for Kenyan households.
            </p>
          </div>

          {/* Benefit Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Fast Delivery */}
            <div className="card-interactive text-center group bg-white/95 backdrop-blur-sm border-2 border-green-300/60 shadow-xl benefit-card h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl group-hover:bg-gradient-to-br group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300 shadow-xl border-2 border-green-300/60 relative overflow-hidden benefit-card-icon">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-green-400/8 rounded-2xl sm:rounded-3xl blur-md"></div>
                  {/* Icon with enhanced styling */}
                  <div className="relative z-10 flex items-center justify-center">
                    <Truck className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-green-900 drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Fast Delivery</h3>
              <p className="text-gray-600 text-xs sm:text-responsive-sm">
                Quick and reliable delivery across Kenya with real-time tracking
              </p>
              </div>
            </div>

            {/* Premium Quality */}
            <div className="card-interactive text-center group bg-white/95 backdrop-blur-sm border-2 border-blue-300/60 shadow-xl benefit-card h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 shadow-xl border-2 border-blue-300/60 relative overflow-hidden benefit-card-icon">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-blue-400/8 rounded-2xl sm:rounded-3xl blur-md"></div>
                  {/* Icon with enhanced styling */}
                  <div className="relative z-10 flex items-center justify-center">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-900 drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Premium Quality</h3>
              <p className="text-gray-600 text-xs sm:text-responsive-sm">
                High-quality materials and craftsmanship for lasting performance
              </p>
              </div>
            </div>

            {/* Affordable Prices */}
            <div className="card-interactive text-center group bg-white/95 backdrop-blur-sm border-2 border-orange-300/60 shadow-xl benefit-card h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl group-hover:bg-gradient-to-br group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300 shadow-xl border-2 border-orange-300/60 relative overflow-hidden benefit-card-icon">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-orange-400/8 rounded-2xl sm:rounded-3xl blur-md"></div>
                  {/* Icon with enhanced styling */}
                  <div className="relative z-10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-orange-900 drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Affordable Prices</h3>
              <p className="text-gray-600 text-xs sm:text-responsive-sm">
                Competitive pricing without compromising on quality or service
              </p>
              </div>
            </div>

            {/* Locally Trusted */}
            <div className="card-interactive text-center group bg-white/95 backdrop-blur-sm border-2 border-purple-300/60 shadow-xl benefit-card h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl group-hover:bg-gradient-to-br group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300 shadow-xl border-2 border-purple-300/60 relative overflow-hidden benefit-card-icon">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-purple-400/8 rounded-2xl sm:rounded-3xl blur-md"></div>
                  {/* Icon with enhanced styling */}
                  <div className="relative z-10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-purple-900 drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Locally Trusted</h3>
              <p className="text-gray-600 text-xs sm:text-responsive-sm">
                Trusted by thousands of Kenyan families for their kitchen needs
              </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center text-responsive-base px-10 py-5 shadow-lg hover:shadow-xl"
            >
              Explore Our Collection
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
