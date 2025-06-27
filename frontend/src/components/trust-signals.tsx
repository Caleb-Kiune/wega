import { Shield, RefreshCw, CreditCard } from "lucide-react"
import Image from "next/image"

export default function TrustSignals() {
  const trustItems = [
    {
      id: 1,
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure Payment",
      description: "SSL encrypted transactions"
    },
    {
      id: 2,
      icon: <RefreshCw className="h-8 w-8 text-green-600" />,
      title: "Money-back Guarantee",
      description: "14-day return policy"
    },
    {
      id: 3,
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Multiple Payment Options",
      description: "Cards, M-Pesa & more"
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      name: "Visa",
      logo: "/images/visa-logo.png",
      alt: "Visa payment method"
    },
    {
      id: 2,
      name: "MasterCard",
      logo: "/images/mastercard-logo.png",
      alt: "MasterCard payment method"
    },
    {
      id: 3,
      name: "M-Pesa",
      logo: "/images/mpesa-logo.png",
      alt: "M-Pesa mobile money"
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100" aria-labelledby="trust-signals-heading">
      <div className="container mx-auto max-w-7xl">
        <h2 id="trust-signals-heading" className="sr-only">Trust Signals and Payment Methods</h2>
        
        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {trustItems.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              role="article"
              aria-labelledby={`trust-item-${item.id}`}
              style={{ willChange: 'background-color' }}
            >
              <div className="mb-4 p-3 bg-green-50 rounded-full flex items-center justify-center w-16 h-16" aria-hidden="true">
                {item.icon}
              </div>
              <h3 id={`trust-item-${item.id}`} className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Accepted Payment Methods</h3>
            <p className="text-gray-600">Secure and convenient payment options</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 min-h-[44px] min-w-[44px]"
                role="img"
                aria-label={method.alt}
                style={{ willChange: 'background-color' }}
              >
                <div className="relative h-12 w-16">
                  <Image
                    src={method.logo}
                    alt={method.alt}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
            ))}
            
            {/* Additional security badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full min-h-[44px] transition-colors duration-300 hover:bg-green-100" style={{ willChange: 'background-color' }}>
                <Shield className="h-4 w-4 text-green-600" aria-hidden="true" />
                <span className="text-sm font-medium text-green-700">SSL Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full min-h-[44px] transition-colors duration-300 hover:bg-blue-100" style={{ willChange: 'background-color' }}>
                <RefreshCw className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-700">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 