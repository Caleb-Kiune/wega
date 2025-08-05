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
      <SheetContent className="w-full sm:w-[400px] md:w-[500px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-slate-900">
              My Wishlist
            </SheetTitle>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Badge className="bg-red-500 text-white">
                  {items.length}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 py-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-slate-600 mb-6">
                  Add items to your wishlist to save them for later.
                </p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Clear All Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearWishlist}
                    disabled={isClearing}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                {/* Wishlist Items */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-lg border border-slate-200 p-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                            <Image
                              src={getImageUrl(item.product.image) || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            KES {item.product.price?.toLocaleString()}
                          </p>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveItem(item.product_id, item.product.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800"
                    >
                      Continue Shopping
                    </Button>
                    <Link href="/wishlist" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        View Full Wishlist
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
} 