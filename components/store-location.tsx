import { MapPin, Phone, Clock } from "lucide-react"

export default function StoreLocation() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Store</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Come visit our physical store to see our full range of kitchenware products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px]">
            {/* This would be replaced with an actual map component in a real implementation */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-600">Interactive Map Would Be Here</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Store Information</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Address</h4>
                  <p className="text-gray-600">
                    Roasters Akai Plaza, next to Mountain Mall, Thika Road, Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Contact</h4>
                  <p className="text-gray-600">
                    Phone: 0769899432
                    <br />
                    Email: info@wegakitchenware.co.ke
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Opening Hours</h4>
                  <p className="text-gray-600">
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
        </div>
      </div>
    </section>
  )
}
