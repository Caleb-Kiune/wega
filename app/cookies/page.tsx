import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Wega Kitchenware',
  description: 'Learn about how we use cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience and allow certain features to work properly.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are necessary for the website to function properly. They enable basic functions 
                    like page navigation and access to secure areas of the website.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Session management</li>
                    <li>Shopping cart functionality</li>
                    <li>Security features</li>
                    <li>User authentication</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Page views and time spent</li>
                    <li>Traffic sources</li>
                    <li>User behavior patterns</li>
                    <li>Website performance metrics</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Marketing Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are used to track visitors across websites to display relevant advertisements.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Personalized advertising</li>
                    <li>Retargeting campaigns</li>
                    <li>Social media integration</li>
                    <li>Email marketing tracking</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Preference Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies allow the website to remember choices you make and provide enhanced, 
                    more personal features.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Language preferences</li>
                    <li>Currency settings</li>
                    <li>Display preferences</li>
                    <li>User interface customization</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We may use third-party services that place cookies on your device:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                <li><strong>Payment Processors:</strong> Secure payment processing</li>
                <li><strong>Social Media:</strong> Social media integration and sharing</li>
                <li><strong>Advertising Networks:</strong> Relevant advertising display</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Browser Settings</h3>
                  <p className="text-gray-600 mb-3">
                    You can control and manage cookies through your browser settings:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Delete existing cookies</li>
                    <li>Block cookies from specific sites</li>
                    <li>Set browser to warn before accepting cookies</li>
                    <li>Disable cookies entirely (may affect website functionality)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Cookie Consent</h3>
                  <p className="text-gray-600">
                    When you first visit our website, you'll see a cookie consent banner. You can choose 
                    which types of cookies to accept or decline.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookie Duration</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Session Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are temporary and are deleted when you close your browser.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Persistent Cookies</h3>
                  <p className="text-gray-600">
                    These cookies remain on your device for a set period or until manually deleted.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Contact Us</h2>
              <p className="text-blue-700 mb-3">
                If you have questions about our use of cookies, please contact us:
              </p>
              <ul className="text-blue-700 space-y-1">
                <li>Email: privacy@wega-kitchenware.com</li>
                <li>Phone: +254-XXX-XXX-XXX</li>
                <li>Hours: Monday to Friday, 8 AM to 6 PM EAT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 