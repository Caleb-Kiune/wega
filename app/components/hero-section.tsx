"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

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
  {
    id: 4,
    title: "Quality Tableware Collection",
    description: "Beautiful and durable tableware to enhance your dining experience.",
    image: "/images/tableware1.jpeg",
    cta: "Explore Tableware",
    link: "/products?category=tableware",
    color: "from-blue-500/20 to-transparent",
  },
  {
    id: 5,
    title: "Home Essentials for Every Kitchen",
    description: "Complete your kitchen with our essential tools and accessories.",
    image: "/images/homeessentials1.jpeg",
    cta: "Shop Essentials",
    link: "/products?category=essentials",
    color: "from-purple-500/20 to-transparent",
  },
]

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(1)

  const togglePlayPause = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop()
      } else {
        swiperInstance.autoplay.start()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.realIndex + 1)
  }

  // Reset animations on slide change
  useEffect(() => {
    if (swiperInstance) {
      const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]
      if (activeSlide) {
        const animatedElements = activeSlide.querySelectorAll('.animate-fade-in, .animate-fade-in-delay, .animate-fade-in-delay-2')
        animatedElements.forEach((el: Element) => {
          el.classList.remove('animate-fade-in', 'animate-fade-in-delay', 'animate-fade-in-delay-2')
          void el.offsetWidth // Trigger reflow
          el.classList.add('animate-fade-in', 'animate-fade-in-delay', 'animate-fade-in-delay-2')
        })
      }
    }
  }, [currentSlide, swiperInstance])



  return (
    <section 
      className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      aria-live="polite"
      aria-label="Hero slideshow"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop={true}
        speed={1000}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        className="h-full w-full"
      >
      {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
          <div className="relative h-full w-full">
              <img
                src={slide.image}
              alt={slide.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
              
              {/* Semi-transparent gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
              
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight animate-fade-in">
                    {slide.title}
                  </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 leading-relaxed animate-fade-in-delay">
                    {slide.description}
                  </p>
                  <Button 
                    asChild 
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2 min-h-[44px] text-base"
                  >
                    <Link href={slide.link}>{slide.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </SwiperSlide>
      ))}

        {/* Custom Navigation Arrows - Mobile Optimized */}
      <button
          className="swiper-button-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:bg-white transition-all duration-300 z-10 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous slide"
      >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
      </button>
      <button
          className="swiper-button-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:bg-white transition-all duration-300 z-10 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next slide"
      >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
      </button>

        {/* Custom Pagination */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10" />
      </Swiper>

      {/* Play/Pause Button - Mobile Optimized */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full p-1 sm:p-3 shadow-lg transition-all duration-300 z-10 hover:scale-110 min-h-[32px] min-w-[32px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center bg-transparent"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        aria-live="polite"
      >
        {isPlaying ? (
          <Pause className="h-3 w-3 sm:h-5 sm:w-5 text-gray-800" />
        ) : (
          <Play className="h-3 w-3 sm:h-5 sm:w-5 text-gray-800" />
        )}
      </button>

      {/* Slide Counter - Mobile Optimized */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 text-white text-xs sm:text-sm font-medium z-10">
        {currentSlide} / {slides.length}
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }
        
        .swiper-pagination-bullet-active {
          background: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transform: scale(1.1);
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: none !important;
          backdrop-filter: none !important;
          box-shadow: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: none !important;
          transform: translateY(-50%) scale(1.1);
        }
        
        .swiper-button-prev {
          left: 16px;
        }
        
        .swiper-button-next {
          right: 16px;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 44px;
            height: 44px;
            left: 8px;
            right: 8px;
          }
          
          .swiper-button-prev {
            left: 8px;
          }
          
          .swiper-button-next {
            right: 8px;
          }
          
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
          
          .swiper-pagination {
            bottom: 16px !important;
          }
        }
        
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }
        
        /* Ensure images display properly */
        .swiper-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      `}</style>
    </section>
  )
}
