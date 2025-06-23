"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export default function TestimonialSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const testimonials = [
    {
      id: 1,
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The quality of WEGA kitchenware is exceptional. I purchased a set of pots and pans, and they have transformed my cooking experience. Highly recommend!",
      date: "2 months ago",
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "Great products and fast delivery. The customer service was also very helpful when I had questions about my order. Will definitely shop here again.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Mary Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I love my new kitchen appliances from WEGA! The quality is outstanding and they look beautiful in my kitchen. The prices are also very reasonable for the quality.",
      date: "3 weeks ago",
    },
  ]

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto max-w-7xl">
        <div 
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our products.
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-1000 ease-out ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                willChange: "transform, opacity"
              }}
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}`}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={`${testimonial.name}'s avatar`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 id={`testimonial-${testimonial.id}`} className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>

              <div className="flex mb-3" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 italic">"{testimonial.text}"</blockquote>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative" role="region" aria-label="Customer testimonials carousel">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-110 min-h-[44px] min-w-[44px]"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 will-change-transform px-12"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              overscrollBehavior: 'contain'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`flex-none w-[280px] transition-all duration-1000 ease-out ${
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  transitionDelay: `${index * 200}ms`,
                  willChange: "transform, opacity"
                }}
                role="article"
                aria-labelledby={`mobile-testimonial-${testimonial.id}`}
              >
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={`${testimonial.name}'s avatar`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="48px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                    <div>
                      <h3 id={`mobile-testimonial-${testimonial.id}`} className="font-semibold text-gray-800">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>

                  <div className="flex mb-3" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 italic">"{testimonial.text}"</blockquote>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  index === currentSlide 
                    ? 'bg-green-600 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1} of ${testimonials.length}`}
                aria-current={index === currentSlide ? "true" : "false"}
                style={{ willChange: 'transform, background-color' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
