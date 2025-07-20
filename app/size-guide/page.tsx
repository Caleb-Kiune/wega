import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide - Wega Kitchenware',
  description: 'Find the right size for your kitchenware products.',
}

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Size Guide</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Use this guide to find the perfect size for your kitchenware needs.
          </p>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pots & Pans</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Small (8-10 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Single servings</li>
                    <li>Side dishes</li>
                    <li>Small families (1-2 people)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Medium (10-12 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Family meals</li>
                    <li>Stir-frying</li>
                    <li>Medium families (3-4 people)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Large (12-14 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Large gatherings</li>
                    <li>Batch cooking</li>
                    <li>Large families (5+ people)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Extra Large (14+ inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Commercial use</li>
                    <li>Large events</li>
                    <li>Professional kitchens</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bakeware</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Small (8x8 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Brownies</li>
                    <li>Small cakes</li>
                    <li>Casseroles for 2-3 people</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Medium (9x13 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Sheet cakes</li>
                    <li>Lasagna</li>
                    <li>Family-sized casseroles</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Large (11x15 inches)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Large gatherings</li>
                    <li>Party food</li>
                    <li>Commercial baking</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Muffin Pans</h3>
                  <p className="text-gray-600 mb-2">Available sizes:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>6-cup (small batches)</li>
                    <li>12-cup (standard)</li>
                    <li>24-cup (large batches)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Storage Containers</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Small (1-2 cups)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Leftovers</li>
                    <li>Snacks</li>
                    <li>Individual portions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Medium (4-6 cups)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Family meals</li>
                    <li>Bulk storage</li>
                    <li>Meal prep</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Large (8+ cups)</h3>
                  <p className="text-gray-600 mb-2">Perfect for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Large batches</li>
                    <li>Party leftovers</li>
                    <li>Commercial storage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Specialty Sizes</h3>
                  <p className="text-gray-600 mb-2">Available for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Freezer storage</li>
                    <li>Microwave safe</li>
                    <li>Stackable sets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 