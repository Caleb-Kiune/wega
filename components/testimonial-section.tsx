import Image from "next/image"
import { Star } from "lucide-react"

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The quality of WEGA kitchenware is exceptional. I purchased a set of pots and pans, and they have transformed my cooking experience. Highly recommend!",
      date: "2 months ago",
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "Great products and fast delivery. The customer service was also very helpful when I had questions about my order. Will definitely shop here again.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Mary Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I love my new kitchen appliances from WEGA! The quality is outstanding and they look beautiful in my kitchen. The prices are also very reasonable for the quality.",
      date: "3 weeks ago",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
