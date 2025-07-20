import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Wega Kitchenware',
  description: 'Read our terms of service and conditions of use.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using the Wega Kitchenware website, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) 
                on Wega Kitchenware's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-600 mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Information</h2>
              <p className="text-gray-600 mb-4">
                We strive to provide accurate product information, but we do not warrant that product descriptions 
                or other content is accurate, complete, reliable, current, or error-free.
              </p>
              <p className="text-gray-600 mb-4">
                Product images are for illustrative purposes only. Actual products may vary in appearance.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pricing and Payment</h2>
              <p className="text-gray-600 mb-4">
                All prices are subject to change without notice. We reserve the right to modify or discontinue 
                any product at any time.
              </p>
              <p className="text-gray-600 mb-4">
                Payment must be made at the time of order. We accept various payment methods as indicated 
                during checkout.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping and Delivery</h2>
              <p className="text-gray-600 mb-4">
                Delivery times are estimates only. We are not responsible for delays beyond our control, 
                including but not limited to weather, natural disasters, or carrier delays.
              </p>
              <p className="text-gray-600 mb-4">
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns and Refunds</h2>
              <p className="text-gray-600 mb-4">
                Returns are subject to our return policy. Items must be returned in original condition 
                with proof of purchase within the specified return period.
              </p>
              <p className="text-gray-600 mb-4">
                Refunds will be processed according to our refund policy and may take 5-7 business days.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                In no event shall Wega Kitchenware or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on our website.
              </p>
              <p className="text-gray-600 mb-4">
                Our total liability to you for any claims arising from the use of our services shall not 
                exceed the amount you paid for the specific product or service.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of Kenya, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>Email: legal@wega-kitchenware.com</li>
                <li>Phone: +254-XXX-XXX-XXX</li>
                <li>Address: [Your Business Address]</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 