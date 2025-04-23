import { Truck, Clock, Shield, CreditCard } from "lucide-react"

export default function DeliveryInfo() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Nationwide Delivery",
      description: "We deliver to all counties across Kenya. Free delivery on orders above KES 5,000.",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Fast Shipping",
      description: "Nairobi: 1-2 days. Other counties: 2-5 business days.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Quality Guarantee",
      description: "All our products come with a quality guarantee and warranty.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Secure Payment",
      description: "Pay securely with M-Pesa or credit/debit cards.",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
