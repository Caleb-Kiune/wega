"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Award, ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  id: number
  image: string
  alt: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  badge?: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/homeessentials1.jpeg",
    alt: "Premium kitchenware collection",
    title: "Transform Your Kitchen with",
    subtitle: "Premium Kitchenware",
    description: "Discover our curated collection of high-quality cookware, utensils, and appliances that elevate every cooking experience.",
    ctaText: "Shop Premium Collection",
    ctaLink: "/products",
    badge: "Kenya's #1 Kitchenware Brand"
  },
  {
    id: 2,
    image: "/images/homeessentials2.jpeg",
    alt: "Modern kitchen appliances",
    title: "Modern Appliances for",
    subtitle: "Contemporary Kitchens",
    description: "Upgrade your cooking experience with our selection of modern, efficient kitchen appliances designed for today's lifestyle.",
    ctaText: "Explore Appliances",
    ctaLink: "/products?categories[]=appliances",
    badge: "Free Delivery Nationwide"
  },
  {
    id: 3,
    image: "/images/homeessentials3.jpeg",
    alt: "Essential kitchen tools",
    title: "Essential Tools for",
    subtitle: "Every Chef",
    description: "From professional chefs to home cooks, our essential kitchen tools and utensils make cooking effortless and enjoyable.",
    ctaText: "Shop Essentials",
    ctaLink: "/products?categories[]=utensils",
    badge: "Quality Guaranteed"
  },
  {
    id: 4,
    image: "/images/homeessentials4.jpeg",
    alt: "Kitchen storage solutions",
    title: "Organize with Style",
    subtitle: "Storage Solutions",
    description: "Keep your kitchen organized and beautiful with our premium storage containers and organizational solutions.",
    ctaText: "Organize Now",
    ctaLink: "/products?categories[]=storage",
    badge: "Premium Brands"
  }
]

const TrustIndicator = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
    <Icon className="h-4 w-4 text-green-400" />
    <span className="font-medium">{text}</span>
  </div>
)

const NavigationArrow = ({ direction, onClick }: { direction: 'prev' | 'next', onClick: () => void }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const position = direction === 'prev' ? 'left-2 md:left-8' : 'right-2 md:right-8'
  return (
    <button
      onClick={onClick}
      className={`absolute ${position} top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 group shadow-none`}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
    >
      <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
    </button>
  )
}

const SlideIndicator = ({ index, isActive, onClick }: { index: number, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/40 ${
      isActive 
        ? 'bg-green-400 scale-125 border-green-400' 
        : 'bg-white/30 hover:bg-white/60'
    }`}
    aria-label={`Go to slide ${index + 1}`}
  />
)

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), [])
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), [])

  const currentSlideData = useMemo(() => slides[currentSlide], [currentSlide])

  return (
    <section 
      className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[850px] overflow-hidden"
      aria-label="Hero carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Only render the active slide */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.alt}
          fill
          className="object-cover blur-[1.5px]"
          priority
          sizes="100vw"
        />
        {/* Slightly lighter, premium dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container - No Card, Just Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
        <div className="max-w-2xl lg:max-w-3xl text-center mx-auto flex flex-col items-center">
          {/* Small, subtle badge above headline */}
          <div className="inline-flex items-center gap-2 bg-black/40 border border-white/20 rounded-full px-4 py-2 mt-2 mb-6 text-white text-xs font-semibold animate-fade-in text-shadow-lg shadow-md">
            <Award className="h-5 w-5 text-green-400 drop-shadow-sm" />
            <span>{currentSlideData.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-responsive-4xl font-bold text-white mb-5 sm:mb-7 md:mb-9 leading-tight animate-fade-in text-shadow-xl">
            {currentSlideData.title}
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-2 sm:mt-3 text-shadow-xl">
              {currentSlideData.subtitle}
            </span>
          </h1>

          {/* Description */}
          <p className="text-responsive-lg text-white font-semibold mb-10 sm:mb-12 md:mb-14 leading-relaxed max-w-xl mx-auto animate-fade-in text-shadow-xl">
            {currentSlideData.description}
            <span className="block mt-2 text-green-200 font-bold text-shadow-xl">Free delivery across Kenya</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center animate-fade-in">
            <Button 
              asChild 
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[52px] sm:min-h-[60px] text-responsive-base font-semibold border-0 focus:ring-4 focus:ring-green-500/30 text-shadow"
            >
              <Link href={currentSlideData.ctaLink} className="flex items-center">
                {currentSlideData.ctaText}
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="ghost"
              className="group bg-white text-green-700 font-bold hover:bg-green-50 py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[52px] sm:min-h-[60px] text-responsive-base border-0 focus:ring-4 focus:ring-green-500/30 text-shadow"
            >
              <Link href="/about" className="flex items-center">
                Learn Our Story
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Minimalist trust indicators below CTAs, spaced out, no card */}
          <div className="flex gap-6 sm:gap-10 mt-4 sm:mt-6 mb-10 pb-6 animate-fade-in text-shadow">
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-4 py-2 text-white text-xs font-semibold shadow">
              <Truck className="h-5 w-5 text-green-400 drop-shadow-sm" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-4 py-2 text-white text-xs font-semibold shadow">
              <Shield className="h-5 w-5 text-green-400 drop-shadow-sm" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-4 py-2 text-white text-xs font-semibold shadow">
              <Award className="h-5 w-5 text-green-400 drop-shadow-sm" />
              <span>Premium Brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Arrows - outside main content, vertically centered */}
      <NavigationArrow direction="prev" onClick={prevSlide} />
      <NavigationArrow direction="next" onClick={nextSlide} />

      {/* Minimalist Slide Indicators - always at the very bottom, with extra margin above */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 mt-8">
        {slides.map((_, index) => (
          <SlideIndicator 
            key={`indicator-${index}`}
            index={index}
            isActive={index === currentSlide}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        button:hover { box-shadow: 0 20px 40px rgba(34, 197, 94, 0.2); }
        .gradient-text {
          background: linear-gradient(135deg, #22c55e, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .text-shadow, .text-shadow-lg, .text-shadow-xl {
          text-shadow: 0 2px 8px rgba(0,0,0,0.32), 0 1.5px 4px rgba(0,0,0,0.18);
        }
      `}</style>
    </section>
  )
}
