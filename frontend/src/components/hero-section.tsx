"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Premium Kitchenware for Your Home",
    description: "Discover our collection of high-quality cookware, utensils, and appliances that make cooking a joy.",
    image: "/images/kitchenware1.jpeg",
    cta: "Shop Now",
    link: "/products",
    color: "from-green-500/20 to-transparent",
  },
  {
    id: 2,
    title: "Special Offers on Cookware Sets",
    description: "Limited time deals on our premium cookware collections. Save up to 30% on selected items.",
    image: "/images/appliances1.jpeg",
    cta: "View Offers",
    link: "/products?category=special-offers",
    color: "from-orange-500/20 to-transparent",
  },
  {
    id: 3,
    title: "New Arrivals for Your Kitchen",
    description: "Explore our latest kitchen essentials and elevate your cooking experience.",
    image: "/images/homeessentials4.jpeg",
    cta: "Discover Now",
    link: "/products?category=new-arrivals",
    color: "from-gray-500/20 to-transparent",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Auto-advance slides with pause/play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  return (
    <section 
      className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      aria-live="polite"
      aria-label="Hero slideshow"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={index !== currentSlide}
          style={{ willChange: 'opacity' }}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {/* Enhanced dark gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <Button 
                    asChild 
                    className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
                    style={{ willChange: 'transform' }}
                  >
                    <Link href={slide.link}>{slide.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 z-10 hover:scale-110"
        aria-label="Previous slide"
        style={{ willChange: 'transform' }}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 z-10 hover:scale-110"
        aria-label="Next slide"
        style={{ willChange: 'transform' }}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 z-10 hover:scale-110"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        aria-live="polite"
        style={{ willChange: 'transform' }}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-gray-800" />
        ) : (
          <Play className="h-5 w-5 text-gray-800" />
        )}
      </button>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative transition-all duration-300 ${
              index === currentSlide 
                ? "scale-110" 
                : "hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1} of ${slides.length}`}
            aria-current={index === currentSlide ? "true" : "false"}
            style={{ willChange: 'transform' }}
          >
            <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white shadow-lg" 
                : "bg-white/60 hover:bg-white/80"
            }`} />
            {/* Progress indicator for current slide */}
            {index === currentSlide && (
              <div className="absolute inset-0 w-4 h-4 rounded-full border-2 border-white/30 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium z-10">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  )
}
