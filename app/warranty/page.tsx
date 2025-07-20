import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Warranty Information - Wega Kitchenware',
  description: 'Learn about our warranty coverage for kitchenware products.',
}

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Warranty Information</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Standard Warranty</h2>
            <p className="text-gray-600 mb-4">
              All Wega Kitchenware products come with a minimum 1-year warranty against manufacturing defects. 
              This warranty covers defects in materials and workmanship under normal household use.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">What's Covered</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Manufacturing defects in materials</li>
              <li>Workmanship issues</li>
              <li>Structural problems</li>
              <li>Coating defects (for non-stick products)</li>
              <li>Handle attachment issues</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">What's Not Covered</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Normal wear and tear</li>
              <li>Damage from misuse or abuse</li>
              <li>Cosmetic damage</li>
              <li>Damage from improper cleaning</li>
              <li>Damage from extreme temperatures</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Extended Warranties</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Products</h3>
                <p className="text-gray-600 mb-2">
                  Our premium line comes with a 3-year warranty covering:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Extended durability</li>
                  <li>Enhanced non-stick coating</li>
                  <li>Stainless steel construction</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Professional Series</h3>
                <p className="text-gray-600 mb-2">
                  Professional-grade products come with a 5-year warranty covering:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Commercial use</li>
                  <li>Heavy-duty construction</li>
                  <li>Professional-grade materials</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Make a Warranty Claim</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 1: Contact Us</h3>
                <p className="text-gray-600">
                  Contact our customer service team with your order number and description of the issue.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 2: Provide Information</h3>
                <p className="text-gray-600">
                  We'll need photos of the defect and proof of purchase to process your claim.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 3: Evaluation</h3>
                <p className="text-gray-600">
                  Our team will evaluate your claim and determine if it's covered under warranty.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 4: Resolution</h3>
                <p className="text-gray-600">
                  If approved, we'll provide a replacement or refund as appropriate.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Customer Support</h2>
            <p className="text-blue-700 mb-3">
              For warranty claims or questions, please contact us:
            </p>
            <ul className="text-blue-700 space-y-1">
              <li>Email: warranty@wega-kitchenware.com</li>
              <li>Phone: +254-XXX-XXX-XXX</li>
              <li>Hours: Monday to Friday, 8 AM to 6 PM EAT</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 