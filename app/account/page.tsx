import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account - Wega Kitchenware',
  description: 'Manage your account, orders, and preferences.',
}

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Account Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Menu</h2>
              <nav className="space-y-2">
                <a href="#profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Profile Information
                </a>
                <a href="#orders" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Order History
                </a>
                <a href="#addresses" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Shipping Addresses
                </a>
                <a href="#wishlist" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Wishlist
                </a>
                <a href="#settings" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Account Settings
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <div id="profile" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
            
            {/* Order History */}
            <div id="orders" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500">Start shopping to see your order history here</p>
              </div>
            </div>
            
            {/* Shipping Addresses */}
            <div id="addresses" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Addresses</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">Default Address</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    123 Main Street<br />
                    Nairobi, Kenya<br />
                    Phone: +254-XXX-XXX-XXX
                  </p>
                  <div className="mt-3 space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  + Add New Address
                </button>
              </div>
            </div>
            
            {/* Wishlist */}
            <div id="wishlist" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Wishlist</h2>
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">Your wishlist is empty</p>
                <p className="text-sm text-gray-500">Save items you love for later</p>
              </div>
            </div>
            
            {/* Account Settings */}
            <div id="settings" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive order updates and promotions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                    <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 