"use client"

import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Wishlist</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto min-h-[44px] text-base"
          >
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Heart className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <h2 className="mt-4 text-base sm:text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">Add items to your wishlist to save them for later.</p>
          <Link href="/products">
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-base">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative h-40 sm:h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">{item.name}</h3>
                <p className="text-green-600 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  KES {item.price.toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <Link href={`/products/${item.id}`} className="w-full sm:w-auto">
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] min-w-[44px] p-2"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 