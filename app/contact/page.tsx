import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white py-6 sm:py-8 border-b">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Contact Us</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send Us a Message</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Your Name</Label>
                  <Input id="name" className="mt-1 min-h-[44px]" required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                  <Input id="email" type="email" className="mt-1 min-h-[44px]" required />
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <Label htmlFor="subject" className="text-sm sm:text-base">Subject</Label>
                <Input id="subject" className="mt-1 min-h-[44px]" required />
              </div>
              <div className="mb-4 sm:mb-6">
                <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                <Textarea id="message" rows={5} className="mt-1 min-h-[120px]" required />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] px-6">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Information</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Our Location</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Roasters Akai Plaza, next to Mountain Mall, Thika Road, Nairobi, Kenya
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Phone Number</h3>
                    <p className="text-sm sm:text-base text-gray-600">0769899432</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Email Address</h3>
                    <p className="text-sm sm:text-base text-gray-600">info@wegakitchenware.co.ke</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Business Hours</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 5:00 PM
                      <br />
                      Sunday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Follow Us</h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[80px] sm:min-h-[100px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600 mb-2"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[80px] sm:min-h-[100px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-600 mb-2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[80px] sm:min-h-[100px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black mb-2"
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M15 8h.01" />
                    <path d="M11 16.01V8a5 5 0 0 1 5-5h3" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Our Location</h2>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-[300px] sm:h-[400px]">
            {/* This would be replaced with an actual map component in a real implementation */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-sm sm:text-base text-gray-600">Interactive Map Would Be Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
