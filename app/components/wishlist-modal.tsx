"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2, ShoppingCart, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/lib/hooks/use-toast"
import { getImageUrl } from '@/lib/products'
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface WishlistModalProps {
  children: React.ReactNode
  className?: string
}

export default function WishlistModal({ children, className }: WishlistModalProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  
  const items = wishlist?.items || []

  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your wishlist.`,
    })
  }

  const handleClearWishlist = async () => {
    setIsClearing(true)
    try {
      clearWishlist()
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleAddToCart = async (item: any) => {
    try {
      const cartItem = {
        id: item.product_id,
        name: item.product.name,
        price: item.product.price,
        image: getImageUrl(item.product.image) || "/placeholder.svg",
        quantity: 1
      }
      
      await addToCart(cartItem)
      toast({
        title: "Added to cart",
        description: `${item.product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[450px] md:w-[500px] p-0 border-l border-gray-200 bg-white"
      >
        <SheetHeader className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <SheetTitle className="text-xl font-semibold text-gray-900 font-display">
            My Wishlist
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Heart className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-display">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    Add items to your wishlist to save them for later.
                  </p>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </motion.div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Clear All Button */}
                  <div className="p-4 border-b border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearWishlist}
                      disabled={isClearing}
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  {/* Wishlist Items */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="bg-white border-t border-b border-gray-200 p-3 transition-all duration-200"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex gap-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                  src={getImageUrl(item.product.image) || "/placeholder.svg"}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                  loading="lazy"
                                />
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center h-20">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900 truncate text-sm leading-tight flex-1">
                                      {item.product.name}
                                    </h4>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveItem(item.product_id, item.product.name)}
                                      className="h-6 w-6 p-0 text-red-600 rounded-md flex-shrink-0 ml-2"
                                      title="Remove from wishlist"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-emerald-600">
                                      KES {item.product.price?.toLocaleString()}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAddToCart(item)}
                                      className="h-6 w-6 p-0 text-emerald-600 rounded-md flex-shrink-0 ml-2"
                                      title="Add to cart"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* View Full Wishlist Button */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <Link href="/wishlist" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        View Full Wishlist
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 