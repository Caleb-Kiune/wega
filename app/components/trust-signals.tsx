import { Shield, RefreshCw, CreditCard } from "lucide-react"

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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100" aria-labelledby="trust-signals-heading">
      <div className="container mx-auto max-w-7xl">
        <h2 id="trust-signals-heading" className="sr-only">Trust Signals</h2>
        
        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </div>
    </section>
  )
} 