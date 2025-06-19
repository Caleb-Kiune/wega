import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
              alt="WEGA Kitchenware Logo"
              width={150}
              height={75}
              className="h-16 w-auto mb-4 bg-white p-2 rounded"
            />
            <p className="text-gray-300 mb-4">
              Premium kitchenware for your home. Quality products that make cooking a joy.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://tiktok.com" className="text-gray-300 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  <path d="M15 8h.01" />
                  <path d="M11 16.01V8a5 5 0 0 1 5-5h3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=special-offers"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                <span className="text-gray-300">Roasters Akai Plaza, next to Mountain Mall, Thika Road, Nairobi</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-gray-300">0769899432</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-gray-300">info@wegakitchenware.co.ke</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2">We Accept</h4>
              <div className="flex space-x-3">
                <div className="bg-white p-1 rounded">
                  <Image src="/placeholder.svg" alt="M-Pesa" width={50} height={30} />
                </div>
                <div className="bg-white p-1 rounded">
                  <Image src="/placeholder.svg" alt="Visa" width={50} height={30} />
                </div>
                <div className="bg-white p-1 rounded">
                  <Image src="/placeholder.svg" alt="Mastercard" width={50} height={30} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} WEGA Kitchenware. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
