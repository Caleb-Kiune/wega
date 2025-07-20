import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Information - Wega Kitchenware',
  description: 'Learn about our shipping options, delivery times, and shipping costs.',
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Options</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Standard Shipping</h3>
              <p className="text-gray-600 mb-3">
                <strong>Delivery Time:</strong> 3-5 business days
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Cost:</strong> $5.99
              </p>
              <p className="text-gray-600">
                Free shipping on orders over $50
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Express Shipping</h3>
              <p className="text-gray-600 mb-3">
                <strong>Delivery Time:</strong> 1-2 business days
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Cost:</strong> $12.99
              </p>
              <p className="text-gray-600">
                Available for most locations
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Areas</h3>
            <p className="text-gray-600 mb-4">
              We currently ship to all major cities and towns across the country. 
              Delivery times may vary based on your location.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Major Cities (1-2 days)</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Nairobi</li>
              <li>Mombasa</li>
              <li>Kisumu</li>
              <li>Nakuru</li>
              <li>Eldoret</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Other Areas (3-5 days)</h4>
            <p className="text-gray-600">
              All other locations within our service area
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">Order Tracking</h3>
            <p className="text-yellow-700 mb-3">
              Once your order ships, you'll receive a tracking number via email. 
              You can also track your order through our website.
            </p>
            <p className="text-yellow-700">
              For any shipping inquiries, please contact our customer service team.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">International Shipping</h3>
            <p className="text-blue-700 mb-3">
              We currently offer international shipping to select countries. 
              Please contact us for availability and pricing.
            </p>
            <p className="text-blue-700">
              International orders may be subject to customs duties and taxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 