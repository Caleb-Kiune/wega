"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Trash2, X, ArrowRight, ShoppingBag, Plus, Minus, Loader2, ExternalLink, Lightbulb, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/lib/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { CartQuantitySelector } from "@/components/ui/cart-quantity-selector"

interface CartModalProps {
  children: React.ReactNode
  className?: string
}

export default function CartModal({ children, className }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  
  const items = cart?.items || []

  // Calculate totals
  const subtotal = items?.reduce((total, item) => 
    total + ((item.product?.price || 0) * item.quantity), 0) || 0

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('Cart modal opened with items:', items.length)
      console.log('Cart modal structure:', {
        hasItems: items.length > 0,
        itemCount: items.length,
        subtotal,
        cartCount
      })
    }
  }, [isOpen, items.length, subtotal, cartCount])

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(productId)
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: number, productName: string) => {
    try {
      await removeFromCart(productId)
      toast({
        title: "Item removed",
        description: `${productName} has been removed from your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClearCart = async () => {
    setIsClearing(true)
    try {
      await clearCart()
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleViewFullCart = () => {
    setIsOpen(false)
    // The Link component will handle navigation automatically
  }

  const handleCheckout = () => {
    setIsOpen(false)
  }

  // Close modal when cart becomes empty
  useEffect(() => {
    if (items.length === 0 && isOpen) {
      // Don't auto-close, let user see the empty state
    }
  }, [items.length, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[500px] p-0 border-l border-gray-200 bg-white flex flex-col cart-modal"
      >
        <SheetHeader className="cart-modal-header flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1">
            <SheetTitle className="text-lg sm:text-xl font-semibold text-gray-900 font-display flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              Cart
              {cartCount > 0 && (
                <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="cart-modal-body">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div 
                key="empty-cart"
                className="flex flex-col items-center justify-center flex-1 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 font-display">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm text-sm sm:text-base">
                  Add some products to your cart to get started.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleViewFullCart}
                    className="border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 font-medium"
                    asChild
                  >
                    <Link href="/cart">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View Full Cart
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="cart-items"
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
                    onClick={handleClearCart}
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

                {/* Cart Items - Scrollable - Maximized Space */}
                <div className="cart-modal-items">
                  <div className="p-2 space-y-2">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="cart-item"
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
                                src={item.product?.image || "/placeholder.svg"}
                                alt={item.product?.name || "Product image"}
                                fill
                                className="object-cover"
                                sizes="56px"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 truncate text-sm leading-tight">
                                  {item.product?.name}
                                </h4>
                                <p className="text-sm font-semibold text-green-600 mt-0.5">
                                  KES {item.product?.price?.toLocaleString()}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(item.product?.id, item.product?.name)}
                                className="h-5 w-5 p-0 text-red-600 rounded-md flex-shrink-0 ml-1.5 hover:bg-red-50"
                                title="Remove from cart"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                            
                            {/* Quantity Selector and Total */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Qty:</span>
                                {isUpdating === item.product?.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                ) : (
                                  <CartQuantitySelector
                                    value={item.quantity}
                                    onChange={(newQuantity) => handleQuantityChange(item.product?.id, newQuantity)}
                                    min={1}
                                    size="micro"
                                    className="flex-shrink-0"
                                  />
                                )}
                              </div>
                              
                              {/* Item Total */}
                              <div className="text-right">
                                <span className="text-xs text-gray-500 block">Total:</span>
                                <span className="font-semibold text-gray-900 text-sm">
                                  KES {((item.product?.price || 0) * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Summary - Compact Footer */}
                <div className="cart-modal-footer p-3">
                  {/* Compact Total Display */}
                  <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">KES {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {/* Action Buttons - Side by Side for Space Efficiency */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {/* Primary Action - Checkout */}
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
                      asChild
                    >
                      <Link href="/checkout" className="flex items-center justify-center">
                        <span className="flex items-center">
                          Checkout
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </Link>
                    </Button>
                    
                    {/* Secondary Action - View Cart */}
                    <Button
                      variant="outline"
                      onClick={handleViewFullCart}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium group transition-all duration-200"
                      asChild
                    >
                      <Link href="/cart" className="flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-200" />
                        View Cart
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
