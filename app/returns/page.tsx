import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Refunds - Wega Kitchenware',
  description: 'Learn about our returns and refund policy for kitchenware products.',
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Returns Policy</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">30-Day Return Window</h3>
            <p className="text-gray-600 mb-4">
              We offer a 30-day return window for all our kitchenware products. If you're not completely satisfied 
              with your purchase, you can return it within 30 days of delivery for a full refund or exchange.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Return Conditions</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Product must be in original condition</li>
              <li>All original packaging and accessories included</li>
              <li>No signs of use or damage</li>
              <li>Proof of purchase required</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Return</h3>
            <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
              <li>Contact our customer service team</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping label</li>
              <li>Package the item securely and ship it back</li>
              <li>Refund will be processed within 5-7 business days</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Excluded Items</h3>
            <p className="text-blue-700">
              For hygiene reasons, we cannot accept returns on:
            </p>
            <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
              <li>Used cooking utensils</li>
              <li>Opened food storage containers</li>
              <li>Personal care items</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Warranty Information</h3>
            <p className="text-green-700 mb-3">
              All our products come with a minimum 1-year warranty against manufacturing defects.
            </p>
            <p className="text-green-700">
              For warranty claims, please contact our customer service team with your order details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 