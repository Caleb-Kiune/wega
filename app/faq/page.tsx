import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Wega Kitchenware',
  description: 'Find answers to common questions about our kitchenware products and services.',
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ordering & Payment</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept M-Pesa, bank transfers, and cash on delivery. All online payments are processed securely.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">How long does shipping take?</h4>
                <p className="text-gray-600">
                  Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Do you offer free shipping?</h4>
                <p className="text-gray-600">
                  Yes, we offer free standard shipping on orders over $50.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Returns & Refunds</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">What is your return policy?</h4>
                <p className="text-gray-600">
                  We offer a 30-day return window for all products in original condition with proof of purchase.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">How do I return an item?</h4>
                <p className="text-gray-600">
                  Contact our customer service team with your order number and reason for return. We'll provide a return label.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">When will I receive my refund?</h4>
                <p className="text-gray-600">
                  Refunds are processed within 5-7 business days after we receive your return.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Are your products dishwasher safe?</h4>
                <p className="text-gray-600">
                  Most of our products are dishwasher safe. Check the product description for specific care instructions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Do you offer warranties?</h4>
                <p className="text-gray-600">
                  Yes, all our products come with a minimum 1-year warranty against manufacturing defects.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Are your products BPA-free?</h4>
                <p className="text-gray-600">
                  Yes, all our plastic products are BPA-free and food-safe.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer Service</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">How can I contact customer service?</h4>
                <p className="text-gray-600">
                  You can reach us via email at support@wega-kitchenware.com or call us at +254-XXX-XXX-XXX.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">What are your business hours?</h4>
                <p className="text-gray-600">
                  Our customer service team is available Monday to Friday, 8 AM to 6 PM EAT.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Do you have a physical store?</h4>
                <p className="text-gray-600">
                  We are currently online-only, but we're working on opening physical stores soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 