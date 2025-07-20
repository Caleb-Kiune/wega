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
    title: "Transform Your Kitchen",
    subtitle: "Premium Kitchenware",
    description: "Discover our curated collection of high-quality cookware, utensils, and appliances.",
    ctaText: "Shop Now",
    ctaLink: "/products",
    badge: "Kenya's #1 Kitchenware"
  },
  {
    id: 2,
    image: "/images/homeessentials2.jpeg",
    alt: "Modern kitchen appliances",
    title: "Modern Appliances",
    subtitle: "Contemporary Kitchens",
    description: "Upgrade your cooking experience with modern, efficient kitchen appliances.",
    ctaText: "Explore Appliances",
    ctaLink: "/products?categories[]=appliances",
    badge: "Free Delivery"
  },
  {
    id: 3,
    image: "/images/homeessentials3.jpeg",
    alt: "Essential kitchen tools",
    title: "Essential Tools",
    subtitle: "Every Chef",
    description: "Professional tools and utensils that make cooking effortless and enjoyable.",
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
    description: "Keep your kitchen organized with premium storage containers and solutions.",
    ctaText: "Organize Now",
    ctaLink: "/products?categories[]=storage",
    badge: "Premium Brands"
  }
]

const TrustIndicator = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5 bg-white/25 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg border border-white/30">
    <Icon className="h-3.5 w-3.5 text-green-300" />
    <span className="text-white font-semibold">{text}</span>
  </div>
)

const NavigationArrow = ({ direction, onClick }: { direction: 'prev' | 'next', onClick: () => void }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const position = direction === 'prev' ? 'left-2' : 'right-2'
  return (
    <button
      onClick={onClick}
      className={`absolute ${position} top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 group shadow-lg backdrop-blur-sm`}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
    >
      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
    </button>
  )
}

const SlideIndicator = ({ index, isActive, onClick }: { index: number, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-2 h-2 rounded-full transition-all duration-500 border border-white/40 ${
      isActive 
        ? 'bg-green-400 scale-125 border-green-400 shadow-lg' 
        : 'bg-white/30 hover:bg-white/60 hover:scale-110'
    }`}
    aria-label={`Go to slide ${index + 1}`}
  />
)

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('right')
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('left')
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setSlideDirection(index > currentSlide ? 'right' : 'left')
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, currentSlide])

  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isTransitioning, nextSlide])

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), [])
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), [])

  const currentSlideData = useMemo(() => slides[currentSlide], [currentSlide])

  return (
    <section 
      className="relative h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] overflow-hidden rounded-2xl mx-4 mt-4 mb-6"
      aria-label="Hero carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-transform duration-800 ease-in-out ${
              index === currentSlide
                ? 'translate-x-0'
                : index < currentSlide
                ? '-translate-x-full'
                : 'translate-x-full'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover rounded-2xl"
              priority={index === currentSlide}
              sizes="100vw"
            />
          </div>
        ))}
        {/* Lighter overlay for better visibility */}
        <div className="absolute inset-0 bg-black/40 rounded-2xl" />
      </div>

      {/* Content Container with Smooth Transitions */}
      <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
        <div className="max-w-4xl w-full text-center">
          <div className={`flex flex-col items-center gap-3 transition-all duration-800 ease-in-out ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-white text-xs font-semibold shadow-lg">
              <Award className="h-3.5 w-3.5 text-green-300" />
              <span className="text-white font-semibold">{currentSlideData.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-2xl hero-title">
              {currentSlideData.title}
              <span className="block bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mt-1 drop-shadow-lg hero-subtitle">
                {currentSlideData.subtitle}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-white font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg text-readable">
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <div className="mt-4">
              <Button 
                asChild 
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm font-semibold border-0"
              >
                <Link href={currentSlideData.ctaLink} className="flex items-center">
                  {currentSlideData.ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex gap-3 mt-3">
              <TrustIndicator icon={Truck} text="Free Delivery" />
              <TrustIndicator icon={Shield} text="Quality Guaranteed" />
              <TrustIndicator icon={Award} text="Premium Brands" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrow direction="prev" onClick={prevSlide} />
      <NavigationArrow direction="next" onClick={nextSlide} />

      {/* Slide Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        button:hover { box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3); }
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  )
}
