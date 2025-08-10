"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2, X, ArrowRight, ShoppingBag, ExternalLink, Loader2, Check } from "lucide-react"
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
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null)
  const [addedToCartItems, setAddedToCartItems] = useState<Set<number>>(new Set())
  
  const items = wishlist?.items || []
  
  // Sync added items with current cart state
  useEffect(() => {
    if (isOpen) {
      // Reset added items state when modal opens
      setAddedToCartItems(new Set())
    }
  }, [isOpen])
  
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
      setIsAddingToCart(item.product_id)
      
      // Create product object for cart
      const product = {
        id: item.product_id,
        name: item.product.name,
        price: item.product.price,
        image: getImageUrl(item.product.image) || "/placeholder.svg",
        quantity: 1
      }
      
      await addToCart(product)
      
      // Mark item as added to cart
      setAddedToCartItems(prev => new Set(prev).add(item.product_id))
      
      toast({
        title: "Added to Cart",
        description: `${item.product.name} has been added to your cart.`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(null)
    }
  }

  const handleViewFullWishlist = () => {
    setIsOpen(false)
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
        className="w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[500px] p-0 border-l border-gray-200 bg-white flex flex-col wishlist-modal"
      >
        <SheetHeader className="wishlist-modal-header flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1">
            <SheetTitle className="text-lg sm:text-xl font-semibold text-gray-900 font-display flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wishlist
              {items.length > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {items.length}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="wishlist-modal-body">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div 
                key="empty-wishlist"
                className="flex flex-col items-center justify-center flex-1 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 font-display">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm text-sm sm:text-base">
                  Add items to your wishlist to save them for later.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleViewFullWishlist}
                    className="border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 font-medium"
                    asChild
                  >
                    <Link href="/wishlist">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View Full Wishlist
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="wishlist-items"
                className="flex flex-col flex-1 min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Clear All Button - Compact */}
                <div className="flex-shrink-0 p-3 border-b border-gray-100 bg-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearWishlist}
                    disabled={isClearing}
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium text-sm"
                  >
                    {isClearing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </>
                    )}
                  </Button>
                </div>

                {/* Wishlist Items - Scrollable - Maximized Space */}
                <div className="wishlist-modal-items">
                  <div className="p-2 space-y-2">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="wishlist-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <div className="flex gap-2.5">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={getImageUrl(item.product.image) || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* Product Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {item.product.category}
                                </p>
                                <p className="text-sm font-semibold text-red-600 mt-0.5">
                                  KES {item.product.price.toLocaleString()}
                                </p>
                              </div>
                              
                              {/* Action Buttons - Aligned with Product Details */}
                              <div className="wishlist-action-buttons flex flex-col items-end gap-2 ml-3">
                                {/* Delete Button - Primary Action */}
                                <button
                                  onClick={() => handleRemoveItem(item.product_id, item.product.name)}
                                  className="h-7 w-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center justify-center group"
                                  title="Remove from Wishlist"
                                >
                                  <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                                
                                {/* Add to Cart Button - Secondary Action */}
                                {isAddingToCart === item.product_id ? (
                                  <div className="wishlist-loading-button h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                                  </div>
                                ) : addedToCartItems.has(item.product_id) ? (
                                  <button
                                    className="h-7 w-7 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-200 flex items-center justify-center group cursor-default"
                                    title="Item added to cart"
                                    disabled
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="h-7 w-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 flex items-center justify-center group"
                                    title="Add to Cart"
                                  >
                                    <span className="text-xs font-medium group-hover:scale-110 transition-transform duration-200">
                                      Add
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Additional Product Details (if any) */}
                            {item.product.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {item.product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Side by Side for Space Efficiency */}
                <div className="wishlist-modal-footer p-3">
                  {/* Action Buttons - Side by Side for Space Efficiency */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {/* Primary Action - Continue Shopping */}
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                      <span className="flex items-center">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </Button>
                    
                    {/* Secondary Action - View Full Wishlist */}
                    <Button
                      variant="outline"
                      onClick={handleViewFullWishlist}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium group transition-all duration-200"
                      asChild
                    >
                      <Link href="/wishlist" className="flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-200" />
                        View Wishlist
                        <ExternalLink className="w-3 h-3 ml-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
} 