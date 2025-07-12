"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Facebook, Instagram, MapPin, Phone, Mail, ArrowUp, Twitter, ChevronDown } from "lucide-react"

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
    <footer className="bg-gray-800 text-white !bg-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Main Content - Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand & Contact - Compact */}
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold mb-2">WEGA Kitchenware</h3>
            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              Premium kitchen essentials delivered across Kenya.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                <span>Roasters Akai Plaza, Nairobi</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                <span>0769899432</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                <span>info@wegakitchenware.co.ke</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <button
              onClick={() => toggleSection('quickLinks')}
              className="flex items-center justify-between w-full md:hidden text-left text-sm font-medium mb-2"
            >
              Quick Links
              <ChevronDown className={`h-3 w-3 transition-transform ${expandedSections.quickLinks ? 'rotate-180' : ''}`} />
            </button>
            <h4 className="hidden md:block text-sm font-medium mb-2">Quick Links</h4>
            <ul className={`space-y-1 ${expandedSections.quickLinks ? 'block' : 'hidden md:block'}`}>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-xs">About Us</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors text-xs">Shop All</Link></li>
              <li><Link href="/products?category=special-offers" className="text-gray-300 hover:text-white transition-colors text-xs">Special Offers</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-xs">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service - Compact */}
          <div>
            <button
              onClick={() => toggleSection('customerService')}
              className="flex items-center justify-between w-full md:hidden text-left text-sm font-medium mb-2"
            >
              Support
              <ChevronDown className={`h-3 w-3 transition-transform ${expandedSections.customerService ? 'rotate-180' : ''}`} />
            </button>
            <h4 className="hidden md:block text-sm font-medium mb-2">Support</h4>
            <ul className={`space-y-1 ${expandedSections.customerService ? 'block' : 'hidden md:block'}`}>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-xs">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors text-xs">Returns</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-xs">FAQs</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-xs">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Social, Payments & Copyright */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Social Media */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-300">Follow:</span>
              <div className="flex space-x-1">
                <Link href="https://facebook.com" className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-gray-700" aria-label="Facebook">
                  <Facebook className="h-3 w-3" />
                </Link>
                <Link href="https://instagram.com" className="text-gray-400 hover:text-pink-500 transition-colors p-1.5 rounded hover:bg-gray-700" aria-label="Instagram">
                  <Instagram className="h-3 w-3" />
                </Link>
                <Link href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 rounded hover:bg-gray-700" aria-label="Twitter">
                  <Twitter className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-300">We accept:</span>
              <div className="flex space-x-1">
                <div className="bg-white p-1 rounded shadow-sm">
                  <Image src="/images/mpesa-logo.png" alt="M-Pesa" width={24} height={15} className="h-3 w-auto" />
                </div>
                <div className="bg-white p-1 rounded shadow-sm">
                  <Image src="/images/visa-logo.png" alt="Visa" width={24} height={15} className="h-3 w-auto" />
                </div>
                <div className="bg-white p-1 rounded shadow-sm">
                  <Image src="/images/mastercard-logo.png" alt="Mastercard" width={24} height={15} className="h-3 w-auto" />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} WEGA Kitchenware
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      )}
    </footer>
  )
} 