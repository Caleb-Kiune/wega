"use client"

import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-500">Add items to your wishlist to save them for later.</p>
          <Link href="/products">
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2">{item.name}</h3>
                <p className="text-green-600 font-semibold mb-4">
                  KES {item.price.toLocaleString()}
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/products/${item.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
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