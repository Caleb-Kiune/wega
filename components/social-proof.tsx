import Image from "next/image"

export default function SocialProof() {
  const socialPlatforms = [
    {
      name: "Instagram",
      handle: "@wegakitchenware",
      image: "/images/homeessentials1.jpeg",
      likes: 245,
    },
    {
      name: "TikTok",
      handle: "@wegakitchenware",
      image: "/images/homeessentials3.jpeg",
      likes: 1024,
    },
    {
      name: "Facebook",
      handle: "WEGA Kitchenware",
      image: "/images/homeessentials4.jpeg",
      likes: 532,
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Follow Us on Social Media</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community and stay updated with our latest products, promotions, and kitchen inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialPlatforms.map((platform, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={platform.image || "/placeholder.svg"}
                  alt={`${platform.name} post`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{platform.handle}</span>
                  <span className="text-sm text-gray-600">{platform.likes} likes</span>
                </div>
                <a
                  href="#"
                  className="block text-center py-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                >
                  Follow on {platform.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
