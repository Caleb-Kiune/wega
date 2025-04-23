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
    <section className="py-8 bg-white border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
