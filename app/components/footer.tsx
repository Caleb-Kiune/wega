"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Facebook, Instagram, MapPin, Phone, Mail, ArrowUp, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

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

  return (
    <footer className="bg-gray-800 text-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=special-offers"
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase tracking-wide">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] inline-flex items-center"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase tracking-wide">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300">
                  Roasters Akai Plaza, next to Mountain Mall, Thika Road, Nairobi
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300">0769899432</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300">info@wegakitchenware.co.ke</span>
              </li>
            </ul>
          </div>

          {/* Social & Accepted Payments */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase tracking-wide">Social & Accepted Payments</h3>
            
            {/* Social Media */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-300">Follow Us</h4>
              <div className="flex space-x-3">
                <Link 
                  href="https://facebook.com" 
                  className="text-gray-300 hover:text-blue-500 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://instagram.com" 
                  className="text-gray-300 hover:text-pink-500 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://twitter.com" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://youtube.com" 
                  className="text-gray-300 hover:text-red-500 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                  aria-label="Follow us on YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-medium mb-3 text-gray-300">We Accept</h4>
              <div className="flex space-x-3">
                <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image 
                    src="/images/mpesa-logo.png" 
                    alt="M-Pesa" 
                    width={40} 
                    height={25} 
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image 
                    src="/images/visa-logo.png" 
                    alt="Visa" 
                    width={40} 
                    height={25} 
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image 
                    src="/images/mastercard-logo.png" 
                    alt="Mastercard" 
                    width={40} 
                    height={25} 
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">© {new Date().getFullYear()} WEGA Kitchenware. All rights reserved.</p>
        </div>
      </div>

      {/* Back to Top Button - Mobile Optimized */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  )
} 