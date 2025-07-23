"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { 
  Facebook, 
  Instagram, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp, 
  Twitter, 
  ChevronDown,
  Truck,
  Shield,
  Clock,
  Star,
  Heart,
  ShoppingBag,
  Utensils,
  ChefHat,
  Gift,
  Award,
  CheckCircle,
  ArrowRight,
  Mail as MailIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Signals */}
      <div className="bg-gray-800 py-3 sm:py-6 border-b border-gray-700">
        <div className="container mx-auto max-w-7xl px-2 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="flex flex-col items-center group">
              <div className="bg-green-600 p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 group-hover:bg-green-500 transition-all duration-300">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-white">Free Delivery</h4>
              <p className="text-xs text-gray-300 leading-tight">Orders above KES 5,000</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-green-600 p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 group-hover:bg-green-500 transition-all duration-300">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-white">Quality Guaranteed</h4>
              <p className="text-xs text-gray-300 leading-tight">1 year warranty</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-green-600 p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 group-hover:bg-green-500 transition-all duration-300">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-white">Fast Shipping</h4>
              <p className="text-xs text-gray-300 leading-tight">Same day dispatch</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-green-600 p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 group-hover:bg-green-500 transition-all duration-300">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-white">Customer Support</h4>
              <p className="text-xs text-gray-300 leading-tight">24/7 assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-5 sm:py-12 bg-gray-800">
        <div className="container mx-auto max-w-7xl px-2 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {/* Brand & Contact */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-6">
                <div className="bg-green-600 p-2 sm:p-3 rounded-xl mr-2 sm:mr-4 shadow-lg">
                  <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">WEGA Kitchenware</h3>
              </div>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-8">
                Premium kitchen essentials that transform your cooking experience. Quality guaranteed, delivered across Kenya.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-8">
                <div className="flex items-center text-xs sm:text-sm text-gray-200 group">
                  <div className="bg-green-600 p-2 rounded-lg mr-2 sm:mr-4 group-hover:bg-green-500 transition-all duration-300 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors text-xs sm:text-sm">Roasters Akai Plaza, Nairobi</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-200 group">
                  <div className="bg-green-600 p-2 rounded-lg mr-2 sm:mr-4 group-hover:bg-green-500 transition-all duration-300 flex-shrink-0">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <a href="tel:0769899432" className="group-hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] min-w-[44px] flex items-center">0769899432</a>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-200 group">
                  <div className="bg-green-600 p-2 rounded-lg mr-2 sm:mr-4 group-hover:bg-green-500 transition-all duration-300 flex-shrink-0">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <a href="mailto:info@wegakitchenware.co.ke" className="group-hover:text-white transition-colors text-xs sm:text-sm break-all min-h-[44px] min-w-[44px] flex items-center">info@wegakitchenware.co.ke</a>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-2 sm:space-x-3">
                <Link 
                  href="https://facebook.com" 
                  className="bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://instagram.com" 
                  className="bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://twitter.com" 
                  className="bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <button
                onClick={() => toggleSection('quickLinks')}
                className="flex items-center justify-between w-full md:hidden text-left text-base sm:text-lg font-semibold mb-3 sm:mb-6 text-white py-2 px-0 border-b border-gray-600 md:border-none"
              >
                Quick Links
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSections.quickLinks ? 'rotate-180' : ''}`} />
              </button>
              <h4 className="hidden md:block text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Quick Links</h4>
              <ul className={`space-y-2 sm:space-y-4 ${expandedSections.quickLinks ? 'block' : 'hidden md:block'}`}>
                <li>
                  <Link href="/about" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=special-offers" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=new-arrivals" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <button
                onClick={() => toggleSection('customerService')}
                className="flex items-center justify-between w-full md:hidden text-left text-base sm:text-lg font-semibold mb-3 sm:mb-6 text-white py-2 px-0 border-b border-gray-600 md:border-none"
              >
                Customer Service
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSections.customerService ? 'rotate-180' : ''}`} />
              </button>
              <h4 className="hidden md:block text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Customer Service</h4>
              <ul className={`space-y-2 sm:space-y-4 ${expandedSections.customerService ? 'block' : 'hidden md:block'}`}>
                <li>
                  <Link href="/shipping" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ArrowRight className="h-3 w-3 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    Warranty Information
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full md:hidden text-left text-base sm:text-lg font-semibold mb-3 sm:mb-6 text-white py-2 px-0 border-b border-gray-600 md:border-none"
              >
                Shop by Category
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedSections.categories ? 'rotate-180' : ''}`} />
              </button>
              <h4 className="hidden md:block text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Shop by Category</h4>
              <ul className={`space-y-2 sm:space-y-4 ${expandedSections.categories ? 'block' : 'hidden md:block'}`}>
                <li>
                  <Link href="/products?category=cookware" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ChefHat className="h-3 w-3 mr-3 text-green-400 flex-shrink-0" />
                    Cookware
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=utensils" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <Utensils className="h-3 w-3 mr-3 text-green-400 flex-shrink-0" />
                    Kitchen Utensils
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=appliances" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <ShoppingBag className="h-3 w-3 mr-3 text-green-400 flex-shrink-0" />
                    Appliances
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=bakeware" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <Gift className="h-3 w-3 mr-3 text-green-400 flex-shrink-0" />
                    Bakeware
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=storage" className="text-gray-200 hover:text-white transition-colors text-xs sm:text-sm flex items-center group py-2 min-h-[44px]">
                    <Award className="h-3 w-3 mr-3 text-green-400 flex-shrink-0" />
                    Storage Solutions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-800 border-t border-gray-700 py-3 sm:py-8">
        <div className="container mx-auto max-w-7xl px-2 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-8">
            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <span className="text-xs sm:text-sm text-white font-medium text-center sm:text-left">Secure Payment Methods:</span>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 sm:p-2 rounded-lg">
                  <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={32} height={20} className="h-4 sm:h-5 w-auto" />
                </div>
                <div className="p-1 sm:p-2 rounded-lg">
                  <Image src="/images/visa-logo.png" alt="Visa" width={32} height={20} className="h-4 sm:h-5 w-auto" />
                </div>
                <div className="p-1 sm:p-2 rounded-lg">
                  <Image src="/images/mastercard-logo.png" alt="Mastercard" width={32} height={20} className="h-4 sm:h-5 w-auto" />
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-white">
              <Link href="/privacy" className="hover:text-green-400 transition-colors hover:underline py-1 min-h-[44px]">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/terms" className="hover:text-green-400 transition-colors hover:underline py-1 min-h-[44px]">Terms of Service</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/cookies" className="hover:text-green-400 transition-colors hover:underline py-1 min-h-[44px]">Cookie Policy</Link>
            </div>

            {/* Copyright */}
            <div className="text-xs sm:text-sm text-white text-center lg:text-right">
              © {new Date().getFullYear()} WEGA Kitchenware. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}
    </footer>
  )
} 