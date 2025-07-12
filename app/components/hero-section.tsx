"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section 
      className="relative h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px] xl:h-[800px] overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/homeessentials1.jpeg"
          alt="Modern kitchen with premium cookware and lifestyle scene"
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.jpg"
          }}
        />
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container-responsive">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Main Headline */}
            <h1 className="text-responsive-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              Premium Kitchenware for
              <span className="block text-green-400 mt-1 sm:mt-2">Your Dream Kitchen</span>
            </h1>
            
            {/* Description */}
            <p className="text-responsive-lg text-gray-100 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl">
              Discover our collection of high-quality cookware, utensils, and appliances that transform cooking into a joyful experience.
            </p>
            
            {/* CTA Button */}
            <Button 
              asChild 
              className="group bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] sm:min-h-[56px] text-responsive-base font-semibold border-0 focus:ring-4 focus:ring-green-500/30"
            >
              <Link href="/products" className="flex items-center">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            
            {/* Secondary CTA */}
            <div className="mt-6 sm:mt-8">
              <Link
                href="/about"
                className="inline-flex items-center text-white/90 hover:text-white font-medium text-responsive-sm transition-colors duration-200 group"
              >
                Learn more about us
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0">
        <div className="container-responsive">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white/80 text-responsive-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom animations for enhanced UX */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        h1 {
          animation: fadeInUp 0.8s ease-out;
        }
        
        p {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        button {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        
        /* Enhanced button hover effects */
        button:hover {
          box-shadow: 0 20px 40px rgba(34, 197, 94, 0.3);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .trust-indicators {
            flex-direction: column;
            space-y-2;
          }
        }
        
        /* Ensure smooth transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  )
}
