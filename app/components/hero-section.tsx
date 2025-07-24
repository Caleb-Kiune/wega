"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
    ctaText: "View all featured products",
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
    ctaText: "View all new arrivals",
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
    ctaText: "View all special offers",
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
      className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-6"
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
        {/* Stronger Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 rounded-2xl" />
      </div>

      {/* Content Container with Smooth Transitions (no panel/card) */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 py-6 sm:py-10 lg:py-12">
        <div className={`flex flex-col items-center gap-6 transition-all duration-800 ease-in-out ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          {/* Badge - white text, theme green star */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-xs font-semibold shadow text-white mb-2">
            <Star className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentSlideData.badge}</span>
          </div>

          {/* Headline - slightly smaller on mobile */}
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight leading-tight text-white text-shadow-strong text-center">
            {currentSlideData.title}
            <span className="block bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent mt-2 text-2xl sm:text-4xl font-bold text-shadow-strong">
              {currentSlideData.subtitle}
            </span>
          </h1>

          {/* Description - improved spacing and shadow */}
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 text-shadow-strong text-center mb-4">
            {currentSlideData.description}
          </p>

          {/* CTA Button - brighter, larger, rounded, with icon */}
          <Link
            href={currentSlideData.ctaLink}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full px-6 sm:px-10 py-3 sm:py-4 shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-base sm:text-lg mt-4 mb-2 min-w-0"
          >
            {currentSlideData.ctaText}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
      {/* Remove SlideIndicator dots */}

      {/* Navigation Arrows */}
      <NavigationArrow direction="prev" onClick={prevSlide} />
      <NavigationArrow direction="next" onClick={nextSlide} />

      {/* Remove Slide Indicators (progress dots) */}
      {/*
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
      */}

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
