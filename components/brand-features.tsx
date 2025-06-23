"use client"

import { Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react"

export default function BrandFeatures() {
  const features = [
    {
      icon: <Truck className="h-6 w-6 text-green-600" />,
      title: "Free Delivery",
      description: "On orders above KES 5,000",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Quality Guarantee",
      description: "100% original products",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      title: "Secure Payment",
      description: "M-Pesa and card options",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-green-600" />,
      title: "Easy Returns",
      description: "14-day return policy",
    },
  ]

  return (
    <section className="py-8 bg-white border-y" aria-labelledby="brand-features-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="brand-features-heading" className="sr-only">Brand Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card flex flex-col items-center text-center p-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer min-h-[44px] min-w-[44px]"
              role="button"
              tabIndex={0}
              aria-label={`${feature.title}: ${feature.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Add any click functionality here if needed
                }
              }}
            >
              <div className="mb-3 flex items-center justify-center w-12 h-12" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
