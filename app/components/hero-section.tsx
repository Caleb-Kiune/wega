"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Award, ChevronLeft, ChevronRight, Star } from "lucide-react"

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
    image: "/images/hero1.jpg",
    alt: "Modern pans and pots on white tile",
    title: "Cook with Confidence",
    subtitle: "Premium Non-Stick Cookware",
    description: "Upgrade your kitchen with our best-selling non-stick pans and pots.",
    ctaText: "Shop Now",
    ctaLink: "/products",
    badge: "Best Seller"
  },
  {
    id: 2,
    image: "/images/hero2.jpg",
    alt: "Rustic kitchen counter with jars and utensils",
    title: "Timeless Kitchen Essentials",
    subtitle: "Classic & Rustic",
    description: "Discover kitchenware that brings warmth and tradition to your home.",
    ctaText: "Featured products",
    ctaLink: "/products?is_featured=true",
    badge: "Featured"
  },
  {
    id: 3,
    image: "/images/hero3.jpg",
    alt: "Top view of utensils on wooden board",
    title: "Crafted for Every Chef",
    subtitle: "Tools of the Trade",
    description: "Find the perfect utensils for every recipe and every cook.",
    ctaText: "New arrivals",
    ctaLink: "/products?is_new=true",
    badge: "New Arrivals"
  },
  {
    id: 4,
    image: "/images/hero4.jpg",
    alt: "Modern kitchen with blue cookware",
    title: "Inspire Your Cooking",
    subtitle: "Modern Kitchenware",
    description: "Brighten your kitchen with our colorful, modern cookware sets.",
    ctaText: "Special offers",
    ctaLink: "/products?is_sale=true",
    badge: "Special Offers"
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
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  const [contentVisible, setContentVisible] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = useRef(false)

  // Check for reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Preload images
  const preloadImage = useCallback((imageUrl: string) => {
    if (preloadedImages.has(imageUrl)) return
    
    const img = new window.Image()
    img.onload = () => {
      setPreloadedImages(prev => new Set(prev).add(imageUrl))
    }
    img.src = imageUrl
  }, [preloadedImages])

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length
    preloadImage(slides[nextIndex].image)
  }, [currentSlide, preloadImage])

  // Handle content visibility with synchronized timing
  useEffect(() => {
    if (isTransitioning) {
      setContentVisible(false)
    } else {
      // Content appears immediately when image transition completes
      setContentVisible(true)
    }
  }, [isTransitioning, currentSlide])

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('right')
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    
    const transitionDuration = prefersReducedMotion.current ? 0 : (window.innerWidth <= 768 ? 500 : 800)
    setTimeout(() => setIsTransitioning(false), transitionDuration)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('left')
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    
    const transitionDuration = prefersReducedMotion.current ? 0 : (window.innerWidth <= 768 ? 500 : 800)
    setTimeout(() => setIsTransitioning(false), transitionDuration)
  }, [isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setSlideDirection(index > currentSlide ? 'right' : 'left')
    setCurrentSlide(index)
    
    const transitionDuration = prefersReducedMotion.current ? 0 : (window.innerWidth <= 768 ? 500 : 800)
    setTimeout(() => setIsTransitioning(false), transitionDuration)
  }, [isTransitioning, currentSlide])

  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return
    
    // Increased interval from 5s to 8s for better UX
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 8000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, isTransitioning, nextSlide])

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), [])
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), [])

  const currentSlideData = useMemo(() => slides[currentSlide], [currentSlide])

  return (
    <section 
      className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-6"
      aria-label="Hero carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hero Slider Layer - Behind Content */}
      <div className="hero-slider absolute inset-0 z-0 overflow-hidden rounded-2xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide absolute inset-0 w-full h-full ${
              index === currentSlide ? 'active' : ''
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover rounded-2xl"
              priority={index === currentSlide}
              sizes="100vw"
              unoptimized
            />
          </div>
        ))}
        {/* Stronger Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 rounded-2xl" />
      </div>

      {/* Content Container - Matching Products Page Structure */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-800 ease-out ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Badge - matching products page style */}
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-4 transition-all duration-600 ease-out delay-100 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Star className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs font-medium">{currentSlideData.badge}</span>
          </div>

          {/* Headline - matching products page size */}
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight leading-tight transition-all duration-600 ease-out delay-200 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              {currentSlideData.title}
            </span>
            <br />
            <span className="text-green-400">{currentSlideData.subtitle}</span>
          </h1>

          {/* Description - matching products page style */}
          <p className={`text-sm sm:text-base text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-600 ease-out delay-300 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            {currentSlideData.description}
          </p>

          {/* CTA Button - Professional styling with consistent padding */}
          <div className={`flex justify-center transition-all duration-600 ease-out delay-400 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <Link
              href={currentSlideData.ctaLink}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap min-w-[100px] sm:min-w-[120px]"
            >
              {currentSlideData.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrow direction="prev" onClick={prevSlide} />
      <NavigationArrow direction="next" onClick={nextSlide} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 1.2s ease-out; }
        button:hover { box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3); }
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hero Slider Styles */
        .hero-slider {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        
        .hero-slide {
          opacity: 0;
          transition: opacity 800ms ease-in-out;
          will-change: opacity;
          backface-visibility: hidden;
          pointer-events: none;
        }
        
        .hero-slide.active {
          opacity: 1;
          pointer-events: auto;
        }
        
        /* Mobile optimization */
        @media (max-width: 768px) {
          .hero-slide {
            transition: opacity 500ms ease-in-out;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .hero-slide {
            transition: none;
          }
          .content-visible {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}
