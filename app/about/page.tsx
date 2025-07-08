import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestimonialSection from "@/components/testimonial-section"
import { Shield, RefreshCw, CreditCard } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white py-6 sm:py-8 border-b">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">About Us</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Learn more about WEGA Kitchenware and our mission to provide quality kitchen products.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Our Story</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                WEGA Kitchenware was founded in 2015 with a simple mission: to provide high-quality, affordable
                kitchenware to Kenyan homes. What started as a small shop in Nairobi has grown into one of Kenya's most
                trusted kitchenware brands.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Our founder, a passionate home cook, was frustrated with the lack of quality kitchen products available
                locally. This led to the creation of WEGA Kitchenware, where we carefully select and design products
                that make cooking easier, more efficient, and more enjoyable.
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Today, we continue to expand our product range while maintaining our commitment to quality,
                affordability, and excellent customer service.
              </p>
            </div>
            <div className="relative h-[250px] sm:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=800&width=800"
                alt="WEGA Kitchenware Store"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
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
                  className="text-green-600 sm:w-6 sm:h-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">Quality</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                We are committed to providing products that meet the highest standards of quality and durability. Every
                item in our collection is carefully selected and tested.
              </p>
            </div>
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm">
              <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
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
                  className="text-orange-600 sm:w-6 sm:h-6"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">Customer Focus</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Our customers are at the heart of everything we do. We strive to provide exceptional service, from
                product selection to after-sales support.
              </p>
            </div>
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm">
              <div className="bg-gray-200 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
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
                  className="text-gray-700 sm:w-6 sm:h-6"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m7 10 3 3 7-7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">Integrity</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                We conduct our business with honesty, transparency, and ethical practices. We stand behind our products
                and take responsibility for our actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-gray-50" aria-labelledby="trust-signals-heading">
        <div className="container mx-auto max-w-7xl">
          <h2 id="trust-signals-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">Secure Payment & Trust</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              role="article"
              aria-labelledby="trust-item-1"
            >
              <div className="mb-4 p-3 bg-green-50 rounded-full flex items-center justify-center w-16 h-16" aria-hidden="true">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 id="trust-item-1" className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">SSL encrypted transactions</p>
            </div>
            <div 
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              role="article"
              aria-labelledby="trust-item-2"
            >
              <div className="mb-4 p-3 bg-green-50 rounded-full flex items-center justify-center w-16 h-16" aria-hidden="true">
                <RefreshCw className="h-8 w-8 text-green-600" />
              </div>
              <h3 id="trust-item-2" className="font-semibold text-gray-800 mb-2">Money-back Guarantee</h3>
              <p className="text-sm text-gray-600">14-day return policy</p>
            </div>
            <div 
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              role="article"
              aria-labelledby="trust-item-3"
            >
              <div className="mb-4 p-3 bg-green-50 rounded-full flex items-center justify-center w-16 h-16" aria-hidden="true">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 id="trust-item-3" className="font-semibold text-gray-800 mb-2">Multiple Payment Options</h3>
              <p className="text-sm text-gray-600">Cards, M-Pesa & more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-48 sm:h-64 w-full">
                  <Image
                    src={`/placeholder.svg?height=400&width=400`}
                    alt={`Team Member ${member}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Team Member {member}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Position Title</p>
                  <div className="flex justify-center space-x-3">
                    <a href="#" className="text-gray-400 hover:text-blue-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
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
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
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
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <TestimonialSection />

      {/* Call to Action */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-green-600 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Enhance Your Kitchen?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Explore our wide range of high-quality kitchenware products and transform your cooking experience today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button asChild className="bg-white text-green-600 hover:bg-gray-100 min-h-[44px] px-6">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white hover:bg-green-700 min-h-[44px] px-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
